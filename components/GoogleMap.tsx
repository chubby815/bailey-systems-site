"use client";

export function GoogleMap() {
  // Machesney Park, Illinois coordinates
  const location = "Machesney Park, IL";
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47388.19876543281!2d-89.04036844863282!3d42.34702907366098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8808909f8df8c0a9%3A0x7c5c7c7c7c7c7c7c!2sMachesney%20Park%2C%20IL!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;

  return (
    <section className="w-full max-w-6xl mb-32">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black tracking-tight relative inline-block mb-6" style={{ fontFamily: 'Inter, Arial Black, sans-serif' }}>
          📍 Our Location
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4C430]"></span>
        </h2>
        <p className="text-xl text-black/70">
          Based in Machesney Park, Illinois
        </p>
      </div>

      <div className="border-8 border-black shadow-[12px_12px_0_#0a0a0a] overflow-hidden relative group">
        {/* Dark overlay for dark mode effect */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-10 group-hover:bg-black/10 transition-all"></div>
        
        <iframe
          src={mapUrl}
          width="100%"
          height="450"
          style={{ 
            border: 0,
            filter: 'grayscale(20%) contrast(110%) brightness(90%)'
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Machesney Park, Illinois Location"
          className="w-full"
        ></iframe>

        {/* Location Badge */}
        <div className="absolute bottom-8 left-8 bg-white border-4 border-black px-6 py-3 shadow-[6px_6px_0_rgba(0,0,0,1)] z-20">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📍</span>
            <div>
              <p className="font-black text-black text-sm uppercase tracking-wide">BaileyAgents</p>
              <p className="text-xs text-black/70 font-bold">{location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-2xl mb-2">🏢</p>
            <p className="font-bold text-black text-sm">Local Business</p>
            <p className="text-xs text-black/60">Serving Illinois & Beyond</p>
          </div>
        </div>
        
        <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-2xl mb-2">🌐</p>
            <p className="font-bold text-black text-sm">Remote Work</p>
            <p className="text-xs text-black/60">Available Nationwide</p>
          </div>
        </div>
        
        <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
          <div className="text-center">
            <p className="text-2xl mb-2">☕</p>
            <p className="font-bold text-black text-sm">Meet In Person</p>
            <p className="text-xs text-black/60">Schedule a Consultation</p>
          </div>
        </div>
      </div>
    </section>
  );
}
