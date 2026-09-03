import Link from 'next/link'

interface UnsubscribePageProps {
  searchParams: Promise<{
    email?: string
    store?: string
  }>
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { email, store } = await searchParams
  const decodedStore = store ? decodeURIComponent(store) : 'Kedai'
  const decodedEmail = email ? decodeURIComponent(email) : ''

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#0A1716] text-[#FAF2E2] font-jakarta">
      <div className="w-full max-w-md bg-white text-[#1A2422] rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 text-center anim-scale">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl mb-4">
          ✉️
        </div>

        <h1 className="font-fraunces font-bold text-xl sm:text-2xl text-[#0A1716] mb-2">
          Nyahlanggan Berjaya
        </h1>

        <p className="text-xs sm:text-sm text-[#5E6F68] leading-relaxed mb-6">
          {decodedEmail ? (
            <>
              Emel <strong className="text-[#0A1716]">{decodedEmail}</strong> telah dinyahlanggan daripada menerima pautan cop digital secara automatik dari{' '}
              <strong className="text-[#0A1716]">{decodedStore}</strong>.
            </>
          ) : (
            <>
              Anda telah berjaya dinyahlanggan daripada menerima emel cop digital dari{' '}
              <strong className="text-[#0A1716]">{decodedStore}</strong>.
            </>
          )}
        </p>

        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs text-[#5E6F68] space-y-1.5 mb-6">
          <div className="font-bold text-[#0A1716] flex items-center gap-1.5">
            <span>💡</span>
            <span>Anda Masih Boleh Kumpul Cop di Kaunter!</span>
          </div>
          <p className="text-[11.5px] leading-relaxed">
            Anda masih boleh mengimbas kod QR di kaunter menggunakan kamera telefon pintar biasa untuk mengumpul cop dan menebus hadiah tanpa memerlukan emel.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block w-full py-3 px-4 rounded-xl bg-[#1E5E53] hover:bg-[#2D786B] text-white font-bold text-xs sm:text-sm transition active:scale-95 shadow-md"
        >
          Kembali ke Laman Utama
        </Link>
      </div>

      <div className="mt-6 text-center text-xs text-[#FAF2E2]/50 font-space">
        LajuS • Kad Cop Kesetiaan Digital
      </div>
    </main>
  )
}
