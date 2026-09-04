package my.lajuq.merchant;

import android.app.Activity;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.android.billingclient.api.*;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class AndroidBillingBridge implements PurchasesUpdatedListener {
    private final Activity activity;
    private final WebView webView;
    private BillingClient billingClient;
    private boolean isReady = false;
    private final List<ProductDetails> productDetailsList = new ArrayList<>();

    public AndroidBillingBridge(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        initBillingClient();
    }

    private void initBillingClient() {
        billingClient = BillingClient.newBuilder(activity)
            .setListener(this)
            .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
            .build();

        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    isReady = true;
                    queryProducts();
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                isReady = false;
            }
        });
    }

    private void queryProducts() {
        if (billingClient == null) return;
        querySubsProducts();
        queryInAppProducts();
    }

    private void querySubsProducts() {
        List<QueryProductDetailsParams.Product> subsList = new ArrayList<>();
        subsList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId("lajus_pro_monthly")
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        );
        subsList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId("lajus_pro_yearly")
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        );

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(subsList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsResult) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && productDetailsResult != null) {
                synchronized (productDetailsList) {
                    productDetailsList.removeIf(p -> p.getProductType().equals(BillingClient.ProductType.SUBS));
                    productDetailsList.addAll(productDetailsResult);
                }
            }
        });
    }

    private void queryInAppProducts() {
        List<QueryProductDetailsParams.Product> inAppList = new ArrayList<>();
        inAppList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId("lajus_card_topup_35")
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        );
        inAppList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId("lajus_card_topup_50")
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        );
        inAppList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId("lajus_card_topup_100")
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        );
        inAppList.add(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId("lajus_card_topup_200")
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        );

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(inAppList)
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsResult) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && productDetailsResult != null) {
                synchronized (productDetailsList) {
                    productDetailsList.removeIf(p -> p.getProductType().equals(BillingClient.ProductType.INAPP));
                    productDetailsList.addAll(productDetailsResult);
                }
            }
        });
    }

    @JavascriptInterface
    public boolean isAvailable() {
        return true;
    }

    @JavascriptInterface
    public boolean isBillingReady() {
        return isReady;
    }

    @JavascriptInterface
    public void launchPurchase(String productId) {
        activity.runOnUiThread(() -> {
            if (!isReady || billingClient == null) {
                notifyWeb("error", "Google Play Billing belum bersedia. Sila buka aplikasi semula.");
                return;
            }

            ProductDetails targetProduct = null;
            synchronized (productDetailsList) {
                for (ProductDetails pd : productDetailsList) {
                    if (pd.getProductId().equals(productId)) {
                        targetProduct = pd;
                        break;
                    }
                }
            }

            if (targetProduct == null) {
                notifyWeb("error", "Produk (" + productId + ") sedang diselaraskan dengan Google Play Console.");
                return;
            }

            List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();

            if (targetProduct.getProductType().equals(BillingClient.ProductType.SUBS)) {
                List<ProductDetails.SubscriptionOfferDetails> offers = targetProduct.getSubscriptionOfferDetails();
                if (offers == null || offers.isEmpty()) {
                    notifyWeb("error", "Tiada pelan langganan aktif dijumpai untuk produk ini.");
                    return;
                }

                String offerToken = offers.get(0).getOfferToken();
                productDetailsParamsList.add(
                    BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(targetProduct)
                        .setOfferToken(offerToken)
                        .build()
                );
            } else {
                // One-time INAPP product (Card topup)
                productDetailsParamsList.add(
                    BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(targetProduct)
                        .build()
                );
            }

            BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(productDetailsParamsList)
                .build();

            billingClient.launchBillingFlow(activity, billingFlowParams);
        });
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, @Nullable List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                handlePurchase(purchase);
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            notifyWeb("cancelled", "Pembayaran dibatalkan oleh pengguna.");
        } else {
            notifyWeb("error", "Ralat pembayaran Google Play: " + billingResult.getDebugMessage());
        }
    }

    private void handlePurchase(Purchase purchase) {
        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            boolean isConsumable = false;
            String primaryProductId = "";
            for (String pId : purchase.getProducts()) {
                if (pId.startsWith("lajus_card_topup")) {
                    isConsumable = true;
                }
                primaryProductId = pId;
            }

            if (isConsumable) {
                // Consume card top-up so it can be purchased repeatedly
                ConsumeParams consumeParams = ConsumeParams.newBuilder()
                    .setPurchaseToken(purchase.getPurchaseToken())
                    .build();
                billingClient.consumeAsync(consumeParams, (billingResult, outToken) -> {});
            } else if (!purchase.isAcknowledged()) {
                // Acknowledge subscription
                AcknowledgePurchaseParams acknowledgePurchaseParams =
                    AcknowledgePurchaseParams.newBuilder()
                        .setPurchaseToken(purchase.getPurchaseToken())
                        .build();
                billingClient.acknowledgePurchase(acknowledgePurchaseParams, billingResult -> {});
            }

            try {
                JSONObject json = new JSONObject();
                json.put("orderId", purchase.getOrderId());
                json.put("purchaseToken", purchase.getPurchaseToken());
                json.put("productId", primaryProductId);
                json.put("products", new JSONArray(purchase.getProducts()));
                json.put("purchaseTime", purchase.getPurchaseTime());
                notifyWeb("success", json.toString());
            } catch (Exception e) {
                notifyWeb("error", "Ralat memproses pengesahan Google Play.");
            }
        }
    }

    private void notifyWeb(String status, String data) {
        activity.runOnUiThread(() -> {
            if (webView != null) {
                String safeData = JSONObject.quote(data);
                String script = "if (typeof window.onGooglePlayPurchaseResult === 'function') { window.onGooglePlayPurchaseResult('" + status + "', " + safeData + "); }";
                webView.evaluateJavascript(script, null);
            }
        });
    }
}
