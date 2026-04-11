"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userAtom } from "@/store/auth";
import WallpaperBackground from "@/components/WallpaperBackground";

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
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <p className='text-sm text-muted-foreground'>Chargement…</p>
      </div>
    );
  }

  if (!user) return null;

  function handleLogout() {
    setUser(null);
    router.replace("/");
  }

  return (
    <div className='relative min-h-screen overflow-hidden'>
      <WallpaperBackground />

      {/* Header */}
      <header className='sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur'>
        <div className='mx-auto flex h-14 max-w-4xl items-center justify-between px-4'>
          <button
            type='button'
            onClick={() => router.push("/home")}
            className='text-xl font-semibold text-muted-foreground hover:text-foreground transition-colors'
          >
            🍼👶🏽 Mini nous
          </button>

          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              {user.first_name} {user.last_name}
            </span>
            <button
              type='button'
              onClick={handleLogout}
              className='rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground'
            >
              Changer d&apos;utilisateur
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className='relative z-10 mx-auto max-w-[1070px] px-6 py-16'>
        {children}
      </div>
    </div>
  );
}
