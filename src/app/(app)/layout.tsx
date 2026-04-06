"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userAtom } from "@/store/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.replace("/");
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Chargement…</p>
      </div>
    );
  }

  if (!user) return null;

  function handleLogout() {
    setUser(null);
    router.replace("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <button
            onClick={() => router.push("/home")}
            className="text-base font-semibold text-foreground hover:text-primary transition-colors"
          >
            🍼 babyBirth
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {user.first_name} {user.last_name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md px-3 py-1.5 text-xs border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              Changer d&apos;utilisateur
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
