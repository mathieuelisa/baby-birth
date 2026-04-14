"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userAtom } from "@/store/auth";
import WallpaperBackground from "@/components/WallpaperBackground";

import { FaRegUser } from "react-icons/fa6";

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
      <header className='sticky top-0 z-20 border-b border-border bg-[#ffffff]/80 backdrop-blur'>
        <div className='mx-auto flex h-14 max-w-4xl items-center justify-between px-4'>
          <button
            type='button'
            onClick={() => router.push("/home")}
            className='text-2xl font-girlregular text-[#9a7c66] cursor-pointer hover:text-foreground transition-colors'
          >
            🍼👶🏽 Mini nous
          </button>

          <div className='flex items-center gap-4'>
            <span className='text-sm text-[#9a7c66]'>
              {user.first_name} {user.last_name}
            </span>
            <button
              type='button'
              onClick={handleLogout}
              className='rounded-md group cursor-pointer border border-[#9a7c66] px-3 py-1.5 text-xs hover:bg-[#cdb29f] text-[#9a7c66] transition-colors hover:border-white hover:text-[#9a7c66]'
            >
              <FaRegUser className='group-text-[#9a7c66] group-hover:text-white' />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className='relative z-10 mx-auto max-w-267.5 px-6 pb-16'>
        {children}
      </div>
    </div>
  );
}
