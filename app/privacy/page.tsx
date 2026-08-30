import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dasar Privasi | LajuS — Sistem Cop Stamp Digital',
  description:
    'Dasar Privasi LajuS (Cop Stamp) menerangkan bagaimana kami mengumpul, menggunakan, menyimpan, dan melindungi data peribadi anda di bawah PDPA 2010.',
  alternates: {
    canonical: 'https://lajus.lajuq.my/privacy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-slate-800 font-sans">
      {/* Header Bar */}
      <header className="bg-[#0D1117] border-b border-white/10 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-[#E5A43B] flex items-center justify-center shadow-md p-1">
              <img src="/logo.svg" alt="LajuS" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-lg text-white">
              Laju<span className="text-[#E5A43B]">S</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#E5A43B] hover:text-[#C77B1B] transition flex items-center gap-1"
          >
            <span>← Kembali ke Laman Utama</span>
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-[#E8DFC8]">
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E5A43B]/10 border border-[#E5A43B]/25 rounded-full text-[#C77B1B] text-xs font-extrabold uppercase tracking-wider mb-3">
              Privasi &amp; Perlindungan Data
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Dasar Privasi — Cop Stamp
            </h1>
            <div className="text-xs sm:text-sm text-slate-500 space-y-1">
              <p>
                <strong>Tarikh Kuat Kuasa:</strong> 30 Ogos 2026
              </p>
              <p>
                <strong>Dikendalikan oleh:</strong> BOTZ GLOBAL SOLUTIONS (No. SSM: 202603077221 / TR0339427-P) (&quot;kami&quot;, &quot;syarikat&quot;)
              </p>
            </div>
          </div>

          {/* Important Notice Alert */}
          <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-[#FFF9EB] border border-[#E5A43B]/30 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">⚠️</span>
              <div>
                <strong className="text-slate-900 block mb-1">Nota Penting:</strong>
                Dasar privasi ini disediakan berdasarkan medan data sebenar dalam sistem Cop Stamp untuk menerangkan amalan perlindungan data kami. Dasar ini dirangka dengan mematuhi prinsip Akta Perlindungan Data Peribadi 2010 (PDPA) Malaysia.
              </div>
            </div>
          </div>

          {/* Article Sections */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-8">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. Pengenalan
              </h2>
              <p className="text-slate-600">
                Dasar Privasi ini menerangkan bagaimana <strong>Cop Stamp / LajuS</strong> (&quot;Perkhidmatan&quot;), sebuah sistem kad cop kesetiaan digital, mengumpul, menggunakan, menyimpan, dan melindungi data peribadi anda. Dasar ini terpakai kepada dua kategori pengguna:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  <strong className="text-slate-800">Pelanggan</strong> — individu yang mengumpul cop kesetiaan di kedai yang menggunakan Cop Stamp.
                </li>
                <li>
                  <strong className="text-slate-800">Pemilik Kedai &amp; Kakitangan (Staff / Kasir)</strong> — perniagaan yang mendaftar untuk menggunakan Perkhidmatan bagi mengurus program kesetiaan mereka.
                </li>
              </ul>
              <p className="text-slate-600">
                Dengan menggunakan Perkhidmatan ini, anda bersetuju dengan pengumpulan dan penggunaan data peribadi anda seperti yang diterangkan di sini.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                2. Data Yang Kami Kumpul
              </h2>

              <div className="space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  2.1 Untuk Pelanggan Program Loyalti
                </h3>
                <p className="text-slate-600">
                  Apabila anda mendaftar atau menuntut (<em>claim</em>) cop melalui pautan/kod QR, kami mengumpul:
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
                        <th className="p-3">Data</th>
                        <th className="p-3">Sumber</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Emel</td>
                        <td className="p-3">Daftar Google, atau dimasukkan sendiri semasa pendaftaran</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Nama penuh</td>
                        <td className="p-3">Diambil dari akaun Google, atau dimasukkan sendiri</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Gambar profil (avatar)</td>
                        <td className="p-3">Diambil dari akaun Google (jika mendaftar melalui Google)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Sejarah cop &amp; tebusan</td>
                        <td className="p-3">Bilangan cop diperoleh, tarikh, kedai terlibat, ganjaran yang ditebus</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 italic">
                  <strong>Nota:</strong> Dalam sesetengah kes, emel anda mungkin dimasukkan oleh kakitangan kedai (bukan oleh anda sendiri) bagi tujuan menghantar pautan cop melalui emel — contohnya apabila staf memilih mod penghantaran &quot;Emel&quot; semasa memberi cop kepada anda.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  2.2 Untuk Pemilik Kedai &amp; Kakitangan (Staff / Kasir)
                </h3>
                <p className="text-slate-600">
                  Apabila perniagaan anda mendaftar untuk menggunakan Cop Stamp, kami mengumpul:
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
                        <th className="p-3">Data</th>
                        <th className="p-3">Tujuan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Emel &amp; kata laluan akaun</td>
                        <td className="p-3">Log masuk ke papan pemuka staf/kaunter</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Peranan (pemilik / staf)</td>
                        <td className="p-3">Kawalan akses mengikut peranan dalam kedai</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Maklumat kedai (nama, logo, alamat jika disediakan)</td>
                        <td className="p-3">Paparan pada kad cop &amp; direktori kedai</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-800">Maklumat langganan &amp; bayaran</td>
                        <td className="p-3">
                          Diproses dan disimpan oleh <strong>Stripe</strong> (pemproses bayaran pihak ketiga) — kami tidak menyimpan butiran kad kredit/debit anda
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  2.3 Data Teknikal
                </h3>
                <p className="text-slate-600">
                  Kami juga menyimpan token sesi log masuk (<em>session token</em>) di peranti anda untuk membolehkan log masuk automatik — lihat Seksyen 5.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                3. Tujuan Pengumpulan dan Penggunaan Data
              </h2>
              <p className="text-slate-600">
                Kami menggunakan data yang dikumpul semata-mata untuk:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Mengoperasikan sistem kad cop kesetiaan digital (memberi, mengesan, dan menebus cop).</li>
                <li>Menghantar pautan tuntutan cop melalui emel (jika mod emel dipilih oleh kedai).</li>
                <li>Mengurus akaun log masuk dan akses papan pemuka staf mengikut peranan.</li>
                <li>Memproses langganan Pelan Pro melalui Stripe.</li>
                <li>Menyediakan sokongan teknikal dan membaiki isu operasi.</li>
                <li>Mematuhi kewajipan undang-undang yang berkenaan.</li>
              </ul>
              <p className="text-slate-600 font-semibold">
                Kami tidak menggunakan emel pelanggan untuk tujuan pemasaran am tanpa kebenaran berasingan.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                4. Perkongsian Data dengan Pihak Ketiga
              </h2>
              <p className="text-slate-600">
                Kami berkongsi data terhad dengan pembekal perkhidmatan berikut, semata-mata untuk mengendalikan Perkhidmatan:
              </p>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
                      <th className="p-3">Pihak Ketiga</th>
                      <th className="p-3">Tujuan</th>
                      <th className="p-3">Data Terlibat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Supabase</td>
                      <td className="p-3">Pangkalan data &amp; pengesahan (autentikasi) pengguna</td>
                      <td className="p-3">Semua data akaun, cop, dan kedai</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Stripe</td>
                      <td className="p-3">Pemprosesan bayaran &amp; langganan</td>
                      <td className="p-3">Emel, maklumat langganan (bukan butiran kad bayaran — Stripe kendalikan terus)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Resend</td>
                      <td className="p-3">Penghantaran emel pautan cop</td>
                      <td className="p-3">Emel penerima, nama kedai</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-800">Google</td>
                      <td className="p-3">Log masuk (OAuth) — pilihan</td>
                      <td className="p-3">Emel, nama, gambar profil (jika anda pilih log masuk Google)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-600 font-semibold">
                Kami tidak menjual data peribadi anda kepada mana-mana pihak ketiga untuk tujuan pengiklanan.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                5. Cookies dan Storan Tempatan (Log Masuk Automatik)
              </h2>
              <p className="text-slate-600">
                Perkhidmatan ini menyimpan token sesi log masuk di dalam penyimpanan tempatan pelayar (<em>browser local storage</em>) anda. Ini membolehkan anda kekal log masuk tanpa perlu memasukkan emel/kata laluan setiap kali melawat semula.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Storan ini bersifat <strong>fungsian semata-mata</strong> — bukan untuk penjejakan iklan atau pihak ketiga.</li>
                <li>Anda boleh log keluar bila-bila masa untuk memadam sesi ini daripada peranti anda.</li>
                <li>Jika anda memadam data pelayar (<em>clear browser data</em>), sesi log masuk ini turut terpadam.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                6. Tempoh Penyimpanan Data
              </h2>
              <p className="text-slate-600">
                Kami menyimpan data anda selagi akaun anda aktif, atau selagi diperlukan untuk tujuan yang dinyatakan dalam dasar ini. Anda boleh memohon pemadaman data pada bila-bila masa (lihat Seksyen 7).
              </p>
              <p className="text-slate-600">
                Token cop yang tidak dituntut akan luput secara automatik selepas <strong>30 minit</strong> dan ditanda sebagai &quot;expired&quot; dalam sistem.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                7. Hak Anda Di Bawah Akta Perlindungan Data Peribadi 2010 (PDPA)
              </h2>
              <p className="text-slate-600">
                Sebagai individu yang datanya kami proses, anda berhak untuk:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Mengakses</strong> data peribadi yang kami simpan tentang anda.</li>
                <li><strong>Membetulkan</strong> data yang tidak tepat.</li>
                <li><strong>Menarik balik kebenaran</strong> untuk pemprosesan data (tertakluk kepada had operasi, contohnya anda mungkin tidak lagi dapat mengumpul cop jika akaun dipadam).</li>
                <li><strong>Memohon pemadaman</strong> akaun dan data berkaitan.</li>
              </ul>
              <p className="text-slate-600">
                Untuk memohon pemadaman akaun anda, sila log masuk dan pergi ke <strong>Tetapan → Padam Akaun Saya</strong> (untuk pemilik/staf) atau di bahagian bawah halaman <strong>Kad Cop Pelanggan</strong>.
              </p>
              <p className="text-slate-600">
                Untuk permohonan lain berkaitan hak data peribadi anda, sila hubungi kami melalui butiran di Seksyen 9.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                8. Keselamatan Data
              </h2>
              <p className="text-slate-600">
                Kami mengambil langkah-langkah munasabah untuk melindungi data anda, termasuk:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Kawalan akses berasaskan peranan (<em>Row Level Security</em>) pada peringkat pangkalan data PostgreSQL Supabase.</li>
                <li>Kunci transaksi atomik untuk mengelakkan manipulasi data (contohnya had bilangan pelanggan, tuntutan cop berganda).</li>
                <li>Pengesahan tandatangan kriptografi untuk komunikasi bayaran (Stripe webhook).</li>
              </ul>
              <p className="text-slate-600">
                Walau bagaimanapun, tiada sistem yang 100% selamat sepenuhnya daripada risiko. Kami akan memaklumkan pengguna terjejas sekiranya berlaku kebocoran data yang ketara, mengikut keperluan undang-undang.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                9. Hubungi Kami
              </h2>
              <p className="text-slate-600">
                Sebarang pertanyaan mengenai Dasar Privasi ini atau permohonan berkaitan data peribadi anda, sila hubungi:
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm space-y-1">
                <p className="font-bold text-slate-900">BOTZ GLOBAL SOLUTIONS</p>
                <p className="font-mono text-slate-600">No. SSM: 202603077221 (TR0339427-P)</p>
                <p>
                  <strong>Emel:</strong>{' '}
                  <a href="mailto:akubotaman@gmail.com" className="text-[#1E5E53] hover:underline font-mono">
                    akubotaman@gmail.com
                  </a>
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                10. Perubahan Kepada Dasar Ini
              </h2>
              <p className="text-slate-600">
                Kami mungkin mengemas kini Dasar Privasi ini dari semasa ke semasa. Sebarang perubahan ketara akan dimaklumkan melalui Perkhidmatan atau emel yang berdaftar.
              </p>
              <p className="text-xs text-slate-500 pt-2 italic">
                Kemas kini terakhir: 30 Ogos 2026
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="py-8 px-6 text-center text-xs text-slate-500 border-t border-[#E8DFC8] bg-white">
        <p>© {new Date().getFullYear()} LajuS. Hak cipta terpelihara. Dibangunkan oleh BOTZ GLOBAL SOLUTIONS.</p>
      </footer>
    </div>
  )
}
