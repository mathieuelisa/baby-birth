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
        <p className='text-white text-base'>Chargement des questions…</p>
      </div>
    );
  }

  const hasExistingAnswers = (existingAnswers?.length ?? 0) > 0;

  return (
    <div className='space-y-6'>
      <div className='pt-10'>
        <div className='group flex items-center gap-1'>
          <TiArrowLeft className='text-white transition-colors duration-300 group-hover:text-[#926744]' />
          <Link
            href='/home'
            className='text-white transition-colors duration-300 ease-in-out group-hover:text-[#926744]'
          >
            Retour
          </Link>
        </div>

        <h1 className='mt-8 text-center text-4xl text-[#926744] font-semibold font-girlregular'>
          Ton pronostic 🔮
        </h1>

        <p className='mt-10 whitespace-pre-line text-center text-base text-white'>
          {hasExistingAnswers
            ? "Vous avez déjà soumis vos pronostics. Vous pouvez les modifier ci-dessous."
            : "Tente de deviner les caractéristiques du bébé !\n\nChaque participant peut proposer ses prédictions (poids, taille, date de naissance, etc.).\n\nLes réponses seront soigneusement comparées à la naissance du bébé afin d’attribuer les points.\nUne bonne réponse rapporte 1 point, tandis qu’une mauvaise réponse n’en rapporte aucun.\n\nLa personne ayant obtenu le plus grand nombre de points remportera un restaurant ! 🥘​"}
        </p>
      </div>

      {submitted && (
        <div className='rounded-xl border border-[#d8c2af] bg-[#faf8f4] px-4 py-3 text-sm text-[#5c4432] shadow-sm'>
          ✅ Vos pronostics ont été enregistrés avec succès !
        </div>
      )}

      <form
        className='space-y-5'
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(false);
          form.handleSubmit();
        }}
      >
        {questions?.map((question, index) => (
          <form.Field key={question.id} name={question.id}>
            {(field) => (
              <div className='space-y-4 rounded-2xl border border-[#9b7354] bg-white p-5 shadow-sm'>
                <p className='text-sm font-medium text-[#3f3128]'>
                  <span className='mr-2 text-[#9b7354]'>{index + 1}.</span>
                  {question.question}
                </p>

                {question.type === "open" ? (
                  <input
                    type='text'
                    placeholder='Votre réponse…'
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className='w-full rounded-xl border border-[#d8c2af] bg-[#faf8f4] px-3 py-2.5 text-sm text-[#3f3128] placeholder:text-[#a08a78] focus:outline-none focus:ring-2 focus:ring-[#9b7354]/30'
                  />
                ) : (
                  <div className='flex flex-wrap gap-3'>
                    {question.options?.map((option) => {
                      const selected = field.state.value === option;

                      return (
                        <button
                          key={option}
                          type='button'
                          onClick={() => field.handleChange(option)}
                          className={cn(
                            "inline-flex cursor-pointer items-center rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-[#9b7354]/40 focus:ring-offset-2",
                            "shadow-sm hover:shadow-md",
                            selected
                              ? "scale-[1.01] border-[#9b7354] bg-[#9b7354] text-white"
                              : "border-[#d8c2af] bg-[#faf8f4] text-[#5c4432] hover:border-[#9b7354] hover:bg-[#f5ede6]",
                          )}
                        >
                          {option}
                          {selected && (
                            <span className='ml-2 text-white'>✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </form.Field>
        ))}

        {upsert.isError && (
          <p className='text-center text-sm text-red-500'>
            Une erreur s&apos;est produite. Veuillez réessayer.
          </p>
        )}

        <button
          type='submit'
          disabled={upsert.isPending}
          className='w-full rounded-xl cursor-pointer bg-[#9b7354] px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50'
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
