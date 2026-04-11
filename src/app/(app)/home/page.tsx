"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { userAtom } from "@/store/auth";

export default function HomePage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();

  return (
    <div>
      <div className='space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl my-8 text-white fonot-grayson'>
            Coucou {user?.first_name}
          </h1>
          <p className='mt-3 mb-10 text-base md:text-center text-center text-muted-foreground text-white max-w-[1100px] mx-auto'>
            Il paraît que les plus belles histoires commencent souvent par une
            grande aventure… et quelques nuits blanches.
            <br /> La nôtre a pris un tournant magique le jour où nous avons
            appris qu’une toute petite personne allait venir bouleverser nos
            vies — en y mettant sans doute un peu de désordre, beaucoup d’amour,
            et une bonne dose de chaos organisé.
            <br />
            <div className='mx-auto my-6 h-px w-16 bg-white' />
            Ce site est notre cocon numérique, un endroit rien qu’à nous (et à
            vous, les privilégiés !).
            <br /> En attendant qu'il/qu'elle pointe le bout de son nez, on vous
            propose de vous faire patienter chacun avec un peu d'amusement...
            <br />
            <br /> A vos pronos pour les plus joueurs !<br /> (un resto est à
            gagner !)
            <br /> Et pour ceux qui nous l'ont demandé, la liste de naissance
            est aussi dispo.
            <br />
            <br />
            <br /> Merci de faire partie de cette histoire avec nous.
            <br /> Et préparez-vous… notre plus beau chapitre est sur le point
            de commencer.
          </p>

          <small className='text-white'>
            PS : Ah oui, avant que l'on oublie… un easter egg(*) se cache sur ce
            site 👀
            <br />
            Si vous le trouvez, vous gagnerez une surprise ! (Les devs ne sont
            pas autorisés à jouer 😄)
          </small>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          {/* Liste de naissance */}
          <button
            type='button'
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
                Consultez et réservez un cadeau pour le futur bébé
              </p>
            </div>
          </button>

          {/* Pronostics */}
          <button
            type='button'
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
                Deviner les caractéristiques du bébé pour tenter de gagner une
                soirée restaurant avec bébé et nous
              </p>
            </div>
          </button>
        </div>
      </div>

      <small className='text-white'>
        * Un easter egg dans un site web, c’est une fonctionnalité cachée,
        volontairement dissimulée par les développeurs.
        <br />
        Cet easter egg est un bouton invisible quelque part sur tout le site qui
        déclenchera une animation après un click dessus.
        <br /> Une fois trouvé envoies nous une capture d'écran et bonne chance
        à toi !
      </small>
    </div>
  );
}
