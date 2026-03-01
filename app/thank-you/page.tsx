import Script from "next/script";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-black text-black mb-4" style={{ letterSpacing: '-0.03em' }}>
          Thank You for Your Purchase!
        </h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          We received your order and will be in touch shortly to get started.
          Check your email for confirmation details.
        </p>
        <a
          href="/"
          className="inline-block bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-800 transition"
        >
          Back to Home
        </a>
        <Script id="google-purchase-conversion" strategy="afterInteractive">
          {`
            gtag('event', 'conversion', {
              'send_to': 'AW-17983960384/yTaHCMayhoEcEMDqtf9C',
              'transaction_id': ''
            });
          `}
        </Script>
      </div>
    </main>
  )
}
