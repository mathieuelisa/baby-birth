"use client";

import { useForm } from "@tanstack/react-form";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLogin } from "@/hooks/use-user";
import { userAtom } from "@/store/auth";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / Titre */}
        <div className="text-center">
          <p className="text-5xl mb-3">🍼</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            babyBirth
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entrez votre prénom et nom pour accéder au site
          </p>
        </div>

        {/* Formulaire */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="firstName"
            validators={{ onChange: ({ value }) => (!value.trim() ? "Requis" : undefined) }}
          >
            {(field) => (
              <div className="space-y-1">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-foreground"
                >
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Marie"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {field.state.meta.errors[0] && (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="lastName"
            validators={{ onChange: ({ value }) => (!value.trim() ? "Requis" : undefined) }}
          >
            {(field) => (
              <div className="space-y-1">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-foreground"
                >
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Dupont"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {field.state.meta.errors[0] && (
                  <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          {login.isError && (
            <p className="text-sm text-destructive text-center">
              Une erreur s&apos;est produite. Veuillez réessayer.
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {login.isPending ? "Connexion…" : "Accéder au site"}
          </button>
        </form>
      </div>
    </main>
  );
}
