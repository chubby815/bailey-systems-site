"use client";

import ElectricBorder from "./ElectricBorder";

export default function TemplatePreviews() {
  return (
    <div className="grid md:grid-cols-5 gap-4">

      <ElectricBorder color="#ffffff" speed={0.4} chaos={0.06} borderRadius={16}>
        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-[#00e5a0]/30 transition-colors group cursor-pointer flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
          </div>
          <div className="mx-3 my-3 rounded-xl overflow-hidden">
            <img
              src="/templates/dark-premium.png"
              alt="Dark Premium Template"
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div className="px-3 pb-3">
            <p className="text-xs font-bold text-[#f0f0f0]">Dark Premium</p>
            <p className="text-[10px] text-[#4b5563]">Tesla meets Stripe</p>
            <span className="text-[10px] text-[#4b5563] group-hover:text-[#00e5a0] transition-colors">View →</span>
          </div>
        </div>
      </ElectricBorder>

      <ElectricBorder color="#ffffff" speed={0.4} chaos={0.06} borderRadius={16}>
        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-yellow-400/30 transition-colors group cursor-pointer flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
          </div>
          <div className="mx-3 my-3 rounded-xl overflow-hidden">
            <img
              src="/templates/neo-brutalism.png"
              alt="Neo Brutalism Template"
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div className="px-3 pb-3">
            <p className="text-xs font-bold text-[#f0f0f0]">Neo Brutalism</p>
            <p className="text-[10px] text-[#4b5563]">Bold &amp; poster-style</p>
            <span className="text-[10px] text-[#4b5563] group-hover:text-yellow-400 transition-colors">View →</span>
          </div>
        </div>
      </ElectricBorder>

      <ElectricBorder color="#ffffff" speed={0.4} chaos={0.06} borderRadius={16}>
        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-blue-400/30 transition-colors group cursor-pointer flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
          </div>
          <div className="mx-3 my-3 rounded-xl overflow-hidden">
            <img
              src="/templates/modern-minimal.png"
              alt="Modern Minimal Template"
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div className="px-3 pb-3">
            <p className="text-xs font-bold text-[#f0f0f0]">Modern Minimal</p>
            <p className="text-[10px] text-[#4b5563]">Apple meets Linear</p>
            <span className="text-[10px] text-[#4b5563] group-hover:text-blue-400 transition-colors">View →</span>
          </div>
        </div>
      </ElectricBorder>

      <ElectricBorder color="#ffffff" speed={0.4} chaos={0.06} borderRadius={16}>
        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-rose-400/30 transition-colors group cursor-pointer flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
          </div>
          <div className="mx-3 my-3 rounded-xl overflow-hidden">
            <img
              src="/templates/bold-magazine.png"
              alt="Bold Magazine Template"
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div className="px-3 pb-3">
            <p className="text-xs font-bold text-[#f0f0f0]">Bold Magazine</p>
            <p className="text-[10px] text-[#4b5563]">Vogue meets Wired</p>
            <span className="text-[10px] text-[#4b5563] group-hover:text-rose-400 transition-colors">View →</span>
          </div>
        </div>
      </ElectricBorder>

      <ElectricBorder color="#ffffff" speed={0.4} chaos={0.06} borderRadius={16}>
        <div className="bg-[#111214] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-yellow-600/30 transition-colors group cursor-pointer flex flex-col">
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/[0.07]">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
            <div className="flex-1 bg-white/[0.04] rounded h-3 ml-1.5" />
          </div>
          <div className="mx-3 my-3 rounded-xl overflow-hidden">
            <img
              src="/templates/classic-business.png"
              alt="Classic Business Template"
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
            />
          </div>
          <div className="px-3 pb-3">
            <p className="text-xs font-bold text-[#f0f0f0]">Classic Business</p>
            <p className="text-[10px] text-[#4b5563]">Navy &amp; gold, trusted</p>
            <span className="text-[10px] text-[#4b5563] group-hover:text-yellow-600 transition-colors">View →</span>
          </div>
        </div>
      </ElectricBorder>

    </div>
  );
}
