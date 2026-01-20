export default function ReviewCard({ name, quote }) {
  return (
    <article className="flex h-full flex-col border-4 border-black bg-white p-8 text-black">
      <p className="text-lg leading-relaxed text-black/80 flex-1">
        "{quote}"
      </p>
      <div className="mt-6 pt-6 border-t-2 border-black/20">
        <p className="font-bold text-base">{name}</p>
      </div>
    </article>
  );
}
