export default function ServiceCard({ title, description }) {
  return (
    <article className="flex h-full flex-col border-4 border-black bg-white p-8 text-black transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0_#0a0a0a] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-[#F4C430] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
      <h3 className="text-2xl font-bold tracking-tight relative">
        {title}
        <span className="absolute -bottom-1 left-0 w-0 h-1 bg-[#F4C430] group-hover:w-12 transition-all duration-300"></span>
      </h3>
      <p className="mt-6 text-base text-black/70 leading-relaxed">{description}</p>
    </article>
  );
}
