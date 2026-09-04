package my.lajuq.merchant;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.OutputStream;
import java.util.Set;
import java.util.UUID;

public class AndroidBluetoothBridge {
    // Standard SPP UUID for Bluetooth Thermal Printers
    private static final UUID SPP_UUID = UUID.fromString("00001101-0000-1000-8000-00805f9b34fb");
    private final Activity activity;
    private final BluetoothAdapter bluetoothAdapter;
    private BluetoothSocket socket;
    private OutputStream outputStream;
    private String connectedDeviceName = "";
    private String connectedDeviceAddress = "";

    public AndroidBluetoothBridge(Activity activity) {
        this.activity = activity;
        this.bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    @JavascriptInterface
    public boolean isNativeSupported() {
        return true;
    }

    @JavascriptInterface
    public boolean isBluetoothEnabled() {
        return bluetoothAdapter != null && bluetoothAdapter.isEnabled();
    }

    @JavascriptInterface
    public boolean hasPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            return ContextCompat.checkSelfPermission(activity, Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }

    @JavascriptInterface
    public void requestPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            ActivityCompat.requestPermissions(activity, new String[]{
                Manifest.permission.BLUETOOTH_CONNECT,
                Manifest.permission.BLUETOOTH_SCAN
            }, 101);
        }
    }

    @JavascriptInterface
    public String getPairedDevices() {
        JSONArray array = new JSONArray();
        if (bluetoothAdapter == null) return array.toString();
        try {
            Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
            if (pairedDevices != null) {
                for (BluetoothDevice device : pairedDevices) {
                    JSONObject obj = new JSONObject();
                    obj.put("name", device.getName() != null ? device.getName() : "Unknown Printer");
                    obj.put("address", device.getAddress());
                    array.put(obj);
                }
            }
        } catch (SecurityException se) {
            requestPermission();
        } catch (Exception ignored) {}
        return array.toString();
    }

    @JavascriptInterface
    public boolean connect(String address) {
        if (bluetoothAdapter == null) return false;
        try {
            disconnect();
            BluetoothDevice device = bluetoothAdapter.getRemoteDevice(address);
            socket = device.createRfcommSocketToServiceRecord(SPP_UUID);
            socket.connect();
            outputStream = socket.getOutputStream();
            connectedDeviceName = device.getName() != null ? device.getName() : address;
            connectedDeviceAddress = address;
            return true;
        } catch (Exception e) {
            disconnect();
            return false;
        }
    }

    @JavascriptInterface
    public boolean printBase64(String base64Data) {
        if (outputStream == null) return false;
        try {
            byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);
            outputStream.write(bytes);
            outputStream.flush();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @JavascriptInterface
    public void disconnect() {
        try {
            if (outputStream != null) {
                outputStream.close();
                outputStream = null;
            }
            if (socket != null) {
                socket.close();
                socket = null;
            }
        } catch (Exception ignored) {}
        connectedDeviceName = "";
        connectedDeviceAddress = "";
    }

    @JavascriptInterface
    public boolean isConnected() {
        return socket != null && socket.isConnected();
    }

    @JavascriptInterface
    public String getConnectedDeviceName() {
        return connectedDeviceName;
    }
}
