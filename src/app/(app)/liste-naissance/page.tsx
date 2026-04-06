"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import Image from "next/image";
import {
  useClaimProduct,
  useProducts,
  useUnclaimProduct,
} from "@/hooks/use-products";
import { userAtom } from "@/store/auth";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export default function ListeNaissancePage() {
  const user = useAtomValue(userAtom);
  const { data: products, isLoading, isError } = useProducts();
  const claim = useClaimProduct();
  const unclaim = useUnclaimProduct();

  if (isLoading) {
    return (
      <main className='relative min-h-screen overflow-hidden'>
        <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
          <div className='rounded-2xl bg-background/80 px-6 py-4 shadow-xl backdrop-blur-md'>
            <p className='text-sm text-muted-foreground'>
              Chargement de la liste…
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className='relative min-h-screen overflow-hidden'>
        <WallpaperBackground />
        <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
          <p className='rounded-2xl bg-background/80 px-6 py-4 text-center text-destructive shadow-xl backdrop-blur-md'>
            Impossible de charger la liste. Veuillez réessayer.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className='relative min-h-screen overflow-hidden'>
      {/* <WallpaperBackground /> */}

      <div className='relative z-10 px-4 py-10'>
        <div className='mx-auto max-w-7xl space-y-6'>
          <div className='rounded-2xl bg-background/80 p-6 shadow-xl backdrop-blur-md'>
            <h1 className='text-2xl font-semibold text-foreground'>
              Liste de naissance 🎁
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Cliquez sur &laquo;&nbsp;Réserver&nbsp;&raquo; pour prendre en
              charge un cadeau. Un cadeau barré est déjà réservé.
            </p>
          </div>

          {(claim.isError || unclaim.isError) && (
            <p className='rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-md backdrop-blur-md'>
              Une erreur s&apos;est produite. Vérifiez que la base de données
              est bien configurée.
            </p>
          )}

          <div className='grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currentUserId={user!.id}
                isClaiming={
                  claim.isPending && claim.variables?.productId === product.id
                }
                isUnclaiming={
                  unclaim.isPending &&
                  unclaim.variables?.productId === product.id
                }
                onClaim={() =>
                  claim.mutate({ productId: product.id, userId: user!.id })
                }
                onUnclaim={() =>
                  unclaim.mutate({ productId: product.id, userId: user!.id })
                }
              />
            ))}
          </div>

          {products?.length === 0 && (
            <p className='rounded-2xl bg-background/80 px-6 py-4 text-center text-muted-foreground shadow-xl backdrop-blur-md'>
              Aucun produit dans la liste pour l&apos;instant.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function WallpaperBackground() {
  return (
    <div className='absolute inset-0'>
      <Image
        src='/assets/images/wallpaper.jpg'
        alt='wallpaper'
        fill
        priority
        className='object-cover'
      />

      <div className='absolute inset-0'>
        <Image
          src='/assets/images/wallpaper.jpg'
          alt='wallpaper duplicate'
          fill
          priority
          className='object-cover scale-110 blur-sm'
        />
      </div>

      <div className='absolute inset-0 bg-black/45' />
    </div>
  );
}

function ProductCard({
  product,
  currentUserId,
  isClaiming,
  isUnclaiming,
  onClaim,
  onUnclaim,
}: {
  product: Product;
  currentUserId: string;
  isClaiming: boolean;
  isUnclaiming: boolean;
  onClaim: () => void;
  onUnclaim: () => void;
}) {
  const isClaimed = product.claimed_by_user_id !== null;
  const isClaimedByMe = product.claimed_by_user_id === currentUserId;
  const claimer = product.claimer;

  return (
    <div
      className={cn(
        "flex h-full min-h-[460px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-background/80 shadow-xl backdrop-blur-md transition-all",
        isClaimed && !isClaimedByMe ? "opacity-70" : "hover:shadow-2xl",
      )}
    >
      <div className='relative flex h-56 w-full shrink-0 items-center justify-center bg-secondary'>
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className={cn(
              "h-full w-full object-cover",
              isClaimed && "opacity-60",
            )}
          />
        ) : (
          <span className='text-4xl opacity-40'>🎀</span>
        )}

        {isClaimed && (
          <div
            className={cn(
              "absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-medium",
              isClaimedByMe
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/80 text-background",
            )}
          >
            {isClaimedByMe ? "Réservé par vous" : "Réservé"}
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col p-4'>
        <div className='min-h-[48px]'>
          <h3
            className={cn(
              "line-clamp-2 font-medium leading-snug text-foreground",
              isClaimed &&
                !isClaimedByMe &&
                "line-through text-muted-foreground",
            )}
          >
            {product.title}
          </h3>
        </div>

        <div className='mt-1 min-h-[20px]'>
          {isClaimed && claimer && !isClaimedByMe && (
            <p className='text-xs text-muted-foreground'>
              Réservé par {claimer.first_name} {claimer.last_name}
            </p>
          )}
        </div>

        <div className='flex-1' />

        <div className='flex items-center gap-2'>
          {product.link && (
            <Link
              href={product.link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex-1 rounded-lg border border-border px-3 py-2 text-center text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground'
            >
              Voir le produit ↗
            </Link>
          )}

          {!isClaimed && (
            <button
              onClick={onClaim}
              disabled={isClaiming}
              className='flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50'
            >
              {isClaiming ? "…" : "Réserver"}
            </button>
          )}

          {isClaimedByMe && (
            <button
              onClick={onUnclaim}
              disabled={isUnclaiming}
              className='flex-1 rounded-lg border border-destructive px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50'
            >
              {isUnclaiming ? "…" : "Annuler"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
