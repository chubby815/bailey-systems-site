import { cookies } from "next/headers";
import { createHash } from "crypto";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  plan: "Launch" | "Scale" | "Enterprise";
};

const AUTH_COOKIE = "auth-token";
const SECRET = process.env.AUTH_SECRET ?? "bailey-systems-demo";

const baseProfile = {
  name: "Jordan Bailey",
  plan: "Scale" as const,
};

const sign = (value: string) =>
  createHash("sha256").update(`${value}.${SECRET}`).digest("base64url");

export const createSessionToken = (email: string) => {
  const payload = {
    id: Buffer.from(email).toString("base64url").slice(0, 12),
    email,
    name: baseProfile.name,
    plan: baseProfile.plan,
    issued: Date.now(),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const digest = sign(encoded);
  return `${encoded}.${digest}`;
};

const decodeToken = (token: string) => {
  try {
    const [encoded, digest] = token.split(".");
    if (!encoded || !digest || digest !== sign(encoded)) {
      return null;
    }
    return JSON.parse(Buffer.from(encoded, "base64url").toString()) as SessionUser;
  } catch {
    return null;
  }
};

export const getUserSession = () => {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  return payload;
};

export const clearSession = () => {
  cookies().delete(AUTH_COOKIE);
};

export const setSessionCookie = (token: string) => {
  cookies().set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
};

