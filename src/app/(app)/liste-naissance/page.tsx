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
import { TiArrowLeft } from "react-icons/ti";
import Confetti from "react-confetti";

export default function ListeNaissancePage() {
  const user = useAtomValue(userAtom);
  const userId = user?.id;

  const { data: products, isLoading, isError } = useProducts();
  const claim = useClaimProduct();
  const unclaim = useUnclaimProduct();

  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <main className='relative min-h-screen'>
        <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
          <div className='rounded-2xl bg-white/80 px-6 py-4 shadow-xl backdrop-blur-md'>
            <p className='text-sm text-[#926744]'>Chargement de la liste…</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className='relative min-h-screen'>
        <WallpaperBackground />
        <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
          <p className='rounded-2xl bg-white/80 px-6 py-4 text-center text-[#926744] shadow-xl backdrop-blur-md'>
            Impossible de charger la liste. Veuillez réessayer.
          </p>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className='relative min-h-screen'>
        <WallpaperBackground />
        <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
          <p className='rounded-2xl bg-white/80 px-6 py-4 text-center text-[#926744] shadow-xl backdrop-blur-md'>
            Utilisateur introuvable.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className='relative min-h-screen'>
      <div className='relative z-10 px-4 py-10'>
        <div className='group relative z-100 flex items-center gap-1'>
          <TiArrowLeft className='text-white group-hover:text-[#926744]' />
          <Link
            href='/home'
            className='text-white transition-colors duration-400 ease-in-out group-hover:text-[#926744]'
          >
            Retour
          </Link>
        </div>

        <div className='mx-auto mt-6 max-w-7xl space-y-6'>
          {open && (
            <>
              <Confetti className='pointer-events-none z-40' />

              <section className='pointer-events-none relative text-xl z-50 flex min-h-16.25 w-full items-center justify-center rounded-xl bg-[#a1968a] px-4 py-3 text-center font-bold text-red-700 md:text-2xl'>
                🐣🐣 BRAVO A TOI TU AS TROUVE L&apos;EASTER EGG DU SITE
              </section>
            </>
          )}

          <div className='rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-md'>
            <h1 className='mb-10 text-center text-4xl font-semibold text-[#926744] font-girlregular'>
              Notre liste de naissance 🎁
            </h1>

            <p className='text-justify md:text-center'>
              Vous avez été nombreux à nous demander notre liste de naissance,
              la voici la voila 😜 <br />
              <br /> Chacun participe (ou non) comme il le souhaite et selon ses
              envies et moyens.
              <br /> Le plus important pour nous, c&apos;est que vous soyez
              présents avec nous pour cette nouvelle aventure. ❤️​
              <br />
              <br /> Nous avons sélectionné les articles avec attention, en
              privilégiant les meilleurs prix (pour pas que vous vous cassiez la
              tête à chercher et wallah on en prendra soin).
              <br />
              <br /> <span className='underline'>Tuto</span> : Pour accéder au
              site marchand vers lequel prendre l&apos;objet, il vous suffit de
              cliquer sur &laquo;&nbsp;
              <span className='font-bold'>Voir le produit</span>&nbsp;&raquo;.
              <br />
              Vous serez redirigé vers la page.
              <br /> Une fois que vous aurez fait votre choix, n&apos;hésitez
              pas à cliquer sur &laquo;&nbsp;
              <span className='font-bold'>Réserver</span>&nbsp;&raquo; pour le
              marquer comme pris. Ainsi, les autres sauront qu’il est déjà
              offert.
              <br />
              <br /> Merci à tous
            </p>

            <p className='text-end text-xs italic'>
              Vina{" "}
              <button
                type='button'
                onClick={() => {
                  setOpen(true);
                  window.scrollTo(0, 0);
                }}
                className='cursor-default'
              >
                &
              </button>{" "}
              Matt
            </p>
          </div>

          {(claim.isError || unclaim.isError) && (
            <p className='rounded-2xl border border-red-700/40 bg-red-700/10 px-4 py-3 text-sm text-red-700 shadow-md backdrop-blur-md'>
              Une erreur s&apos;est produite. Vérifiez que la base de données
              est bien configurée.
            </p>
          )}

          <div className='grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currentUserId={userId}
                isClaiming={
                  claim.isPending && claim.variables?.productId === product.id
                }
                isUnclaiming={
                  unclaim.isPending &&
                  unclaim.variables?.productId === product.id
                }
                onClaim={() => claim.mutate({ productId: product.id, userId })}
                onUnclaim={() =>
                  unclaim.mutate({ productId: product.id, userId })
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
          className='scale-110 object-cover blur-sm'
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

  console.log(product.title);

  const zeroToThirty = [
    "Thermomètre Vinabo",
    "Livre chanson antillais",
    "Thermomètre de bain",
    "Pots de conservation en verre",
    "Egouttoir Lifewit",
    "Ensemble tenue beige H&M",
    "Lot 3 bodies bébé croisés manches longues",
    "Abcédaire Porsche",
    "Jouets de bain BBluv",
    "Lot de 2 draps housse",
    "Peluche aubergine elephant",
    "Chausettes bébé Nike",
    "Sangle de jouet pour bébé",
    "Serviette papillon babytolove (blanc)",
    "Serviette papillon babytolove (vert)",
    "Lot de 7 bavoirs",
    "Boîte à sucette en silicone",
    "Jouet pour le bain",
    "Bavoir pour Bébé en Silicone",
  ].includes(product.title);

  const thirtyToSixty = [
    "Gigoteuse petit bateau 0–6 mois",
    "Ensemble tenue H&M",
    "Coffret cadeau nouveau-né",
    "Pyjama naruto",
    "Coffret repas",
  ].includes(product.title);

  const sixtyToHundred = [
    "Boite à rêves Cloud B",
    "Parc",
    "Veilleuse Cloub B (baleine)",
  ].includes(product.title);

  const hundredToTwoHundred = ["Baby phone avent de Philips"].includes(
    product.title,
  );

  const moreThanTwoHundred = [
    "Base T isofix cybex",
    "Chaise haute Cybex (noir)",
  ].includes(product.title);

  const moreThanOneHundredThousand = ["Audi RS3 👀​"].includes(product.title);

  return (
    <div
      className={cn(
        "flex h-full min-h-115 flex-col overflow-hidden rounded-2xl border border-white/20 bg-background/80 shadow-xl backdrop-blur-md transition-all",
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
                ? "bg-[#9a7c66] text-white"
                : "bg-[#6e645d] text-white",
            )}
          >
            {isClaimedByMe ? "Réservé par vous" : "Réservé"}
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col p-4 bg-[#ebe9e7]'>
        <div className='min-h-12'>
          <h3
            className={cn(
              "line-clamp-2 font-medium leading-snug text-foreground",
              isClaimed && !isClaimedByMe && "line-through text-[#926744]",
            )}
          >
            {product.title}
          </h3>
        </div>

        <div className='mt-1 min-h-5'>
          {isClaimed && claimer && !isClaimedByMe && (
            <p className='text-xs text-[#926744]'>
              Réservé par {claimer.first_name} {claimer.last_name}
            </p>
          )}
        </div>

        <div className='flex-1'>
          {zeroToThirty && (
            <div className='max-w-36 rounded-lg border border-[#926744] bg-white text-center text-xs text-[#926744]'>
              Entre 0 et 30€
            </div>
          )}

          {thirtyToSixty && (
            <div className='max-w-36 rounded-lg border border-[#926744] bg-white text-center text-xs text-[#926744]'>
              Entre 30 et 60€
            </div>
          )}

          {sixtyToHundred && (
            <div className='max-w-36 rounded-lg border border-[#926744] bg-white text-center text-xs text-[#926744]'>
              Entre 60 et 100€
            </div>
          )}

          {hundredToTwoHundred && (
            <div className='max-w-36 rounded-lg border border-[#926744] bg-white text-center text-xs text-[#926744]'>
              Entre 100 et 200€
            </div>
          )}

          {moreThanTwoHundred && (
            <div className='max-w-36 rounded-lg border border-[#926744] bg-white text-center text-xs text-[#926744]'>
              Plus de 200€
            </div>
          )}

          {moreThanOneHundredThousand && (
            <div className='max-w-36 rounded-lg border border-red-700 bg-white text-center text-xs text-red-700'>
              Plus de 130 000€ 🙈
            </div>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {product.link && (
            <a
              href={product.link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex-1 rounded-lg border border-[#9b7354]/30 px-3 py-2 text-center text-xs text-[#9b7354] transition-colors hover:border-black hover:text-black'
            >
              Voir le produit
            </a>
          )}

          {!isClaimed && (
            <button
              type='button'
              onClick={onClaim}
              disabled={isClaiming}
              className='flex-1 rounded-lg cursor-pointer bg-[#9b7354] px-3 py-2 text-xs font-medium text-[#ebe9e7] transition-opacity hover:opacity-90 disabled:opacity-50'
            >
              {isClaiming ? "…" : "Réserver"}
            </button>
          )}

          {isClaimedByMe && (
            <button
              type='button'
              onClick={onUnclaim}
              disabled={isUnclaiming}
              className='flex-1 rounded-lg cursor-pointer border border-red-700 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-700 hover:text-white disabled:opacity-50'
            >
              {isUnclaiming ? "…" : "Annuler"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
