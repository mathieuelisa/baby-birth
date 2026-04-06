"use client";

import { useForm } from "@tanstack/react-form";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLogin } from "@/hooks/use-user";
import { userAtom } from "@/store/auth";
import Image from "next/image";

export default function LoginPage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const login = useLogin();

  useEffect(() => {
    if (user) router.replace("/home");
  }, [user, router]);

  const form = useForm({
    defaultValues: { firstName: "", lastName: "" },
    onSubmit: async ({ value }) => {
      login.mutate({ firstName: value.firstName, lastName: value.lastName });
    },
  });

  return (
    <main className='relative min-h-screen overflow-hidden'>
      {/* Background image */}
      <div className='absolute inset-0'>
        <Image
          src='/assets/images/wallpaper.jpg'
          alt='wallpaper'
          fill
          priority
          className='object-cover'
        />

        {/* Dupliquer visuellement le wallpaper avec un blur léger */}
        <div className='absolute inset-0'>
          <Image
            src='/assets/images/wallpaper.jpg'
            alt='wallpaper duplicate'
            fill
            priority
            className='object-cover scale-110 blur-sm'
          />
        </div>

        {/* Overlay pour améliorer la lecture */}
        <div className='absolute inset-0 bg-black/45' />
      </div>

      {/* Contenu au-dessus */}
      <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
        <div className='w-full max-w-sm space-y-8 rounded-xs bg-background/80 p-6 shadow-xl backdrop-blur-md'>
          <div className='text-center'>
            <p className='mb-3 text-5xl'>🍼</p>
            <p className='mt-2 text-sm text-muted-foreground'>
              Entrez votre prénom et nom pour accéder au site
            </p>
          </div>

          <form
            className='space-y-4'
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field
              name='firstName'
              validators={{
                onChange: ({ value }) => (!value.trim() ? "Requis" : undefined),
              }}
            >
              {(field) => (
                <div className='space-y-1'>
                  <label
                    htmlFor='firstName'
                    className='text-sm font-medium text-foreground'
                  >
                    Prénom
                  </label>
                  <input
                    id='firstName'
                    type='text'
                    placeholder='ex: Marie'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className='w-full rounded-xs border border-input bg-card/90 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
                  />
                  {field.state.meta.errors[0] && (
                    <p className='text-xs text-destructive'>
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name='lastName'
              validators={{
                onChange: ({ value }) => (!value.trim() ? "Requis" : undefined),
              }}
            >
              {(field) => (
                <div className='space-y-1'>
                  <label
                    htmlFor='lastName'
                    className='text-sm font-medium text-foreground'
                  >
                    Nom
                  </label>
                  <input
                    id='lastName'
                    type='text'
                    placeholder='ex: Dupont'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className='w-full rounded-xs border border-input bg-card/90 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
                  />
                  {field.state.meta.errors[0] && (
                    <p className='text-xs text-destructive'>
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {login.isError && (
              <p className='text-center text-sm text-destructive'>
                Une erreur s&apos;est produite. Veuillez réessayer.
              </p>
            )}

            <button
              type='submit'
              disabled={login.isPending}
              className='w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50'
            >
              {login.isPending ? "Connexion…" : "Accéder au site"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
