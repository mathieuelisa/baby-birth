"use client";

import { useForm } from "@tanstack/react-form";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {
  usePronosticQuestions,
  useUpsertAnswers,
  useUserAnswers,
} from "@/hooks/use-pronostics";
import { userAtom } from "@/store/auth";
import { cn } from "@/lib/utils";
import { TiArrowLeft } from "react-icons/ti";
import Link from "next/link";

export default function PronosticsPage() {
  const user = useAtomValue(userAtom);
  const [submitted, setSubmitted] = useState(false);

  const { data: questions, isLoading: loadingQ } = usePronosticQuestions();

  if (!user?.id) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-muted-foreground text-sm'>
          Utilisateur introuvable.
        </p>
      </div>
    );
  }

  const { data: existingAnswers, isLoading: loadingA } = useUserAnswers(
    user.id,
  );
  const upsert = useUpsertAnswers(user.id);

  const isLoading = loadingQ || loadingA;

  const answersMap: Record<string, string> = {};

  for (const a of existingAnswers ?? []) {
    answersMap[a.question_id] = a.answer;
  }

  const form = useForm({
    defaultValues: answersMap,
    onSubmit: async ({ value }) => {
      await upsert.mutateAsync(value as Record<string, string>);
      setSubmitted(true);

      // 👉 scroll en haut
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  });

  useEffect(() => {
    if (existingAnswers && questions) {
      const defaults: Record<string, string> = {};

      for (const q of questions) {
        const ans = existingAnswers.find((a) => a.question_id === q.id);
        defaults[q.id] = ans?.answer ?? "";
      }

      form.reset(defaults);
    }
  }, [existingAnswers, questions, form]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <p className='text-muted-foreground text-sm'>
          Chargement des questions…
        </p>
      </div>
    );
  }

  const hasExistingAnswers = (existingAnswers?.length ?? 0) > 0;

  return (
    <div className='space-y-6'>
      <div className='pt-10'>
        <div className='group flex items-center gap-1'>
          <TiArrowLeft className='text-white group-hover:text-[#926744]' />
          <Link
            href='/home'
            className='text-white transition-colors duration-400 ease-in-out group-hover:text-[#926744]'
          >
            Retour
          </Link>
        </div>

        <h1 className='text-foreground text-center text-4xl font-semibold text-white mt-8'>
          Ton pronostic 🔮
        </h1>

        <p className='mt-10 whitespace-pre-line text-center text-base text-white md:text-center'>
          {hasExistingAnswers
            ? "Vous avez déjà soumis vos pronostics. Vous pouvez les modifier ci-dessous."
            : "Tente de deviner les caractéristiques du bébé !\n\nChaque participant peut proposer ses prédictions (poids, taille, date de naissance, etc.).\n\nLes réponses seront soigneusement comparées à la naissance du bébé afin d’attribuer les points.\nUne bonne réponse rapporte 1 point, tandis qu’une mauvaise réponse n’en rapporte aucun.\n\nLa personne ayant obtenu le plus grand nombre de points remportera un restaurant ! 🥘​"}
        </p>
      </div>

      {submitted && (
        <div className='border-border bg-secondary text-foreground rounded-xl border px-4 py-3 text-sm'>
          ✅ Vos pronostics ont été enregistrés avec succès !
        </div>
      )}

      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(false);
          form.handleSubmit();
        }}
      >
        {questions?.map((question, index) => (
          <form.Field key={question.id} name={question.id}>
            {(field) => (
              <div className='border-border bg-card space-y-3 rounded-2xl border p-5'>
                <p className='text-foreground text-sm font-medium'>
                  <span className='text-muted-foreground mr-2'>
                    {index + 1}.
                  </span>
                  {question.question}
                </p>

                {question.type === "open" ? (
                  <input
                    type='text'
                    placeholder='Votre réponse…'
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className='border-input bg-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2'
                  />
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {question.options?.map((option) => (
                      <button
                        key={option}
                        type='button'
                        onClick={() => field.handleChange(option)}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm transition-all",
                          field.state.value === option
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary",
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form.Field>
        ))}

        {upsert.isError && (
          <p className='text-destructive text-center text-sm'>
            Une erreur s&apos;est produite. Veuillez réessayer.
          </p>
        )}

        <button
          type='submit'
          disabled={upsert.isPending}
          className='bg-primary text-primary-foreground w-full rounded-lg px-4 py-3 text-sm font-medium shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50'
        >
          {upsert.isPending
            ? "Enregistrement…"
            : hasExistingAnswers
              ? "Mettre à jour mes pronostics"
              : "Soumettre mes pronostics"}
        </button>
      </form>
    </div>
  );
}
