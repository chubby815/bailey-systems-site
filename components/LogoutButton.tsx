"use client";

import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function LogoutButton({ className, children }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className={className}>
      {children ?? "Log Out"}
    </button>
  );
}
