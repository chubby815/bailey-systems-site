"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { orderSchema } from "@/utils/validations";

const SERVICE_OPTIONS = [
  "Revenue desk",
  "Fulfillment pod",
  "Lifecycle copilot",
  "Compliance concierge",
];

const defaultForm = {
  company: "",
  email: "",
  teamSize: "under-10",
  timeline: "now",
  services: [] as string[],
  goals: "",
};

export default function OrderPage() {
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setForm((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((item) => item !== service)
          : [...prev.services, service],
      };
    });
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = orderSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sign in to submit an order.");
        }
        throw new Error("Unable to submit order.");
      }
      const result = await response.json();
      setTrackingId(result.trackingId);
      setStatus("success");
      setForm(defaultForm);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="section-label">Order</p>
        <h1 className="text-4xl font-semibold text-white">
          Spin up a Bailey copilot.
        </h1>
        <p className="text-white/70">
          Submit your workflow and we'll confirm timelines, pricing, and
          knowledge gathering within 24 hours.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6"
      >
        <Input
          label="Company"
          placeholder="Northwind Clinics"
          value={form.company}
          onChange={(event) => updateField("company", event.target.value)}
        />
        <Input
          label="Work email"
          placeholder="ops@northwind.com"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-white/80">
            Team size
            <select
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white"
              value={form.teamSize}
              onChange={(event) => updateField("teamSize", event.target.value)}
            >
              <option value="under-10">Under 10</option>
              <option value="10-50">10-50</option>
              <option value="50-200">50-200</option>
              <option value="200+">200+</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            Timeline
            <select
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white"
              value={form.timeline}
              onChange={(event) => updateField("timeline", event.target.value)}
            >
              <option value="now">Ready now</option>
              <option value="this-quarter">This quarter</option>
              <option value="six-months">6+ months</option>
            </select>
          </label>
        </div>

        <div>
          <p className="text-sm font-medium text-white/80">Services</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {SERVICE_OPTIONS.map((option) => {
              const active = form.services.includes(option);
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => toggleService(option)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    active
                      ? "border-brand-primary bg-brand-primary/30"
                      : "border-white/15 text-white/70"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="What outcomes matter?"
          multiline
          placeholder="Share your KPIs, SLAs, and existing tooling..."
          value={form.goals}
          onChange={(event) => updateField("goals", event.target.value)}
        />

        {trackingId && (
          <p className="text-sm text-emerald-300">
            Tracking ID: {trackingId}. We just sent a confirmation email.
          </p>
        )}
        {error && <p className="text-sm text-rose-300">{error}</p>}

        <Button type="submit" size="lg" loading={status === "loading"}>
          {status === "success" ? "Request captured" : "Submit build brief"}
        </Button>
      </form>
    </div>
  );
}

