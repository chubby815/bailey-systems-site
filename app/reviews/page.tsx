import ReviewCard from "@/components/ReviewCard";
import { REVIEWS } from "@/utils/constants";

export default function ReviewsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <p className="section-label">Reviews</p>
        <h1 className="text-4xl font-semibold text-white">
          Operators across healthcare, climate, and creative teams rely on Bailey.
        </h1>
        <p className="text-white/70">
          Every testimonial below is tied to a real deployment with measurable
          KPIs and documented safeguards.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {REVIEWS.map((review) => (
          <ReviewCard
            key={review.name}
            name={review.name}
            quote={review.quote}
          />
        ))}
      </div>
    </div>
  );
}

