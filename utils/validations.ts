import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid email."),
  company: z.string().optional(),
  topic: z.enum(["automation", "pricing", "partnership", "support"]),
  message: z.string().min(20, "Give us a bit more detail."),
});

export const orderSchema = z.object({
  company: z.string().min(2),
  email: z.string().email(),
  teamSize: z.enum(["under-10", "10-50", "50-200", "200+"]),
  timeline: z.enum(["now", "this-quarter", "six-months"]),
  services: z.array(z.string()).min(1, "Select at least one service."),
  goals: z.string().min(30, "Share the outcomes you want."),
});

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Use at least 8 characters."),
});

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export type ContactPayload = z.infer<typeof contactSchema>;
export type OrderPayload = z.infer<typeof orderSchema>;
export type AuthPayload = z.infer<typeof authSchema>;

