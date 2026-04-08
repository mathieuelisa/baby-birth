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
import { useState } from "react";

export default function ListeNaissancePage() {
  const user = useAtomValue(userAtom);
  const { data: products, isLoading, isError } = useProducts();
  const claim = useClaimProduct();
  const unclaim = useUnclaimProduct();

  const [open, setOpen] = useState(false);

  console.log("open", open);

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
            <h1 className='text-2xl text-[#926744] font-semibold  mb-10 text-center'>
              Notre liste de naissance 🎁
            </h1>

            <p className='md:text-center text-justify'>
              Vous avez été nombreux à nous demander notre liste de naissance,
              la voici la voila 😜 <br />
              <br /> Chacun participe (ou non) comme il le souhaite et selon ses
              envies et moyens.
              <br /> Le plus important pour nous, c'est que vous soyez présents
              avec nous pour cette nouvelle aventure. ❤️​
              <br />
              <br /> Nous avons sélectionné les articles avec attention, en
              privilégiant les meilleurs prix (pour pas que vous vous cassiez la
              tête à chercher et wallah on en prendra soin).
              <br />
              <br /> <span className='underline'>Tuto</span> : Pour accéder au
              site marchand vers lequel prendre l'objet, il vous suffit de
              cliquer sur &laquo;&nbsp;
              <span className='font-bold'>Voir le produit</span>&nbsp;&raquo;.
              <br />
              Vous serez rediriger vers la page.
              <br /> Une fois que vous aurez fait votre choix, n'hésitez pas à
              cliquer sur &laquo;&nbsp;
              <span className='font-bold'>Réserver</span>&nbsp;&raquo; pour le
              marquer comme pris. Comme ça les autres sauront qu'il est déjà
              offert.
              <br />
              <br /> Merci à tous
            </p>
            <p className='text-end italic text-xs'>
              Vina{" "}
              <button onClick={() => setOpen(!open)} className='cursor-default'>
                &
              </button>{" "}
              Matt
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

      {open && (
        <section className='absolute flex items-center justify-center rounded-xl font-bold z-50 h-[65px] bg-[#a1968a] text-red-700 text-center text-2xl w-full top-0'>
          🐣​🐣​ BRAVO A TOI TU AS TROUVE L'EASTER EGG DU SITE
        </section>
      )}
    </main>
  );
}

function WallpaperBackground() {
  return (
    <div className='absolute inset-0'>
      <Image
        src='/assets/images/wallpaper2.jpg'
        alt='wallpaper'
        fill
        priority
        className='object-cover'
      />

      <div className='absolute inset-0'>
        <Image
          src='/assets/images/wallpaper2.jpg'
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

  console.log("product", product);

  // O à 30euros
  const zeroToThirty = [
    "Thermomètre Vinabo",
    "Livre chanson antillais",
    "Thermomètre de bain",
    "Pots de conservation en verre",
    "Egouttoir Lifewit",
    "Ensemble tenue beige H&M",
    "Abcédaire Porsche",
    "Jouets de bain BBluv",
    "Peluche aubergine elephant",
    "Sangle de jouet pour bébé",
  ].includes(product.title);

  // 30 à 60euros
  const thirtyToSixty = [
    "Gigoteuse petit bateau 0–6 mois",
    "Ensemble tenue H&M",
    "Pyjama naruto",
    "Coffret repas",
  ].includes(product.title);

  // 60 à 100euros
  const sixtyToHundred = [
    "Boite à rêves Cloud B",
    "Parc",
    "Veilleuse Cloub B (baleine)",
  ].includes(product.title);

  // 100 à 200euros
  const hundredToTwoHundred = ["Baby phone avent de Philips"].includes(
    product.title,
  );

  // Plus de 200 euros
  const moreThanTwoHundred = [
    "Base T isofix cybex",
    "Chaise haute Cybex (noir)",
  ].includes(product.title);

  // Plus de 100 000 euros
  const moreThanOneHundredThousand = ["Audi RS3 👀​"].includes(product.title);

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

        <div className='flex-1 '>
          {zeroToThirty && (
            <div className='border text-xs border-[#926744] rounded-lg bg-white text-[#926744] text-center max-w-36'>
              Entre 0 et 30€{" "}
            </div>
          )}

          {thirtyToSixty && (
            <div className='border text-xs border-[#926744] rounded-lg bg-white text-[#926744] text-center max-w-36'>
              Entre 30 et 60€{" "}
            </div>
          )}

          {sixtyToHundred && (
            <div className='border text-xs border-[#926744] rounded-lg bg-white text-[#926744] text-center max-w-36'>
              Entre 60 et 100€{" "}
            </div>
          )}

          {hundredToTwoHundred && (
            <div className='border text-xs border-[#926744] rounded-lg bg-white text-[#926744] text-center max-w-36'>
              Entre 100 et 200€{" "}
            </div>
          )}

          {moreThanTwoHundred && (
            <div className='border text-xs border-[#926744] rounded-lg bg-white text-[#926744] text-center max-w-36'>
              Plus de 200€{" "}
            </div>
          )}

          {moreThanOneHundredThousand && (
            <div className='border text-xs border-red-700 rounded-lg bg-white text-red-700 text-center max-w-36'>
              Plus de 130 000€{" "}
            </div>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {product.link && (
            <a
              href={product.link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex-1 rounded-lg border border-border px-3 py-2 text-center text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground'
            >
              Voir le produit
            </a>
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
