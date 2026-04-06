"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { userAtom } from "@/store/auth";
import Image from "next/image";

export default function HomePage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();

  return (
    <div className='space-y-8'>
      <div className='text-center'>
        <h1 className='text-2xl font-semibold text-foreground text-white'>
          Bonjour {user?.first_name} 👋
        </h1>
        <p className='mt-1 text-muted-foreground text-white'>
          Que souhaitez-vous faire ?
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        {/* Liste de naissance */}
        <button
          onClick={() => router.push("/liste-naissance")}
          className='group flex flex-col items-center gap-4 rounded-xs border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-primary hover:shadow-md'
        >
          <span className='text-5xl transition-transform group-hover:scale-110'>
            🎁
          </span>
          <div>
            <h2 className='text-lg font-semibold text-foreground'>
              Liste de naissance
            </h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Consultez et réservez un cadeau pour le bébé
            </p>
          </div>
        </button>

        {/* Pronostics */}
        <button
          onClick={() => router.push("/pronostics")}
          className='group flex flex-col items-center gap-4 rounded-xs border border-border bg-card p-8 text-center shadow-sm transition-all hover:border-primary hover:shadow-md'
        >
          <span className='text-5xl transition-transform group-hover:scale-110'>
            🔮
          </span>
          <div>
            <h2 className='text-lg font-semibold text-foreground'>
              Pronostics
            </h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Tentez de deviner les caractéristiques du bébé
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
