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

export default function PronosticsPage() {
  const user = useAtomValue(userAtom);
  const { data: questions, isLoading: loadingQ } = usePronosticQuestions();
  const { data: existingAnswers, isLoading: loadingA } = useUserAnswers(
    user!.id,
  );
  const upsert = useUpsertAnswers(user!.id);
  const [submitted, setSubmitted] = useState(false);

  const isLoading = loadingQ || loadingA;

  // Build answers map from existing data
  const answersMap: Record<string, string> = {};
  existingAnswers?.forEach((a) => {
    answersMap[a.question_id] = a.answer;
  });

  const form = useForm({
    defaultValues: answersMap,
    onSubmit: async ({ value }) => {
      await upsert.mutateAsync(value as Record<string, string>);
      setSubmitted(true);
    },
  });

  // Re-initialize form when answers load
  useEffect(() => {
    if (existingAnswers && questions) {
      const defaults: Record<string, string> = {};
      questions.forEach((q) => {
        const ans = existingAnswers.find((a) => a.question_id === q.id);
        defaults[q.id] = ans?.answer ?? "";
      });
      form.reset(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingAnswers, questions]);

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
      <div>
        <h1 className='text-4xl text-white font-semibold text-center text-foreground'>
          Ton pronostic 🔮
        </h1>
        <p className='mt-10 text-base text-justify md:text-center text-white whitespace-pre-line'>
          {hasExistingAnswers
            ? "Vous avez déjà soumis vos pronostics. Vous pouvez les modifier ci-dessous."
            : "Tente de deviner les caractéristiques du bébé !\n\n Chaque participant peut proposer ses prédictions (poids, taille, date de naissance, etc.).\n \n  Les réponses seront soigneusement comparées à la naissance du bébé afin d’attribuer les points.\n  Une bonne réponse rapporte 1 point, tandis qu’une mauvaise réponse n’en rapporte aucun.\n \n  La personne ayant obtenu le plus grand nombre de points remportera un restaurant ! 🥘​"}
        </p>
      </div>

      {submitted && (
        <div className='rounded-xl bg-secondary border border-border px-4 py-3 text-sm text-foreground'>
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
              <div className='rounded-2xl border border-border bg-card p-5 space-y-3'>
                <p className='text-sm font-medium text-foreground'>
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
                    className='w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
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
          <p className='text-sm text-destructive text-center'>
            Une erreur s&apos;est produite. Veuillez réessayer.
          </p>
        )}

        <button
          type='submit'
          disabled={upsert.isPending}
          className='w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity'
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
