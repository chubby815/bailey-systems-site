import { Check } from "lucide-react";
import { PricingPlan } from "@/utils/constants";
import { Button } from "./Button";

type PricingCardProps = {
  plan: PricingPlan;
};

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <div
      className={`flex h-full flex-col border-4 ${
        plan.popular
          ? "border-black bg-white shadow-[8px_8px_0_#0a0a0a] relative"
          : "border-black bg-white/80"
      } p-10 text-black transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#0a0a0a]`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 w-full h-2 bg-[#F4C430]"></div>
      )}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-black/50 font-bold">
            {plan.type}
          </p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight">{plan.title}</h3>
        </div>
        {plan.popular && (
          <span className="border-2 border-black bg-[#F4C430] text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Popular
          </span>
        )}
      </div>
      <p className="mt-4 text-base text-black/70 leading-relaxed">{plan.description}</p>
      <div className="mt-8 pb-6 border-b-4 border-[#F4C430]">
        <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
        <span className="ml-2 text-sm text-black/60 font-medium">{plan.frequency}</span>
      </div>
      <ul className="mt-6 space-y-3 text-base text-black/80 flex-grow">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 text-[#F4C430] flex-shrink-0 stroke-[3]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button
          className="w-full"
          variant={plan.popular ? "primary" : "secondary"}
          asChild
        >
          <a href={plan.cta.href}>{plan.cta.label}</a>
        </Button>
      </div>
    </div>
  );
}

