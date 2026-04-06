"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPronosticQuestions,
  getUserAnswers,
  upsertAnswers,
} from "@/lib/supabase/queries";

export const questionsQueryKey = ["pronostic-questions"];
export const answersQueryKey = (userId: string) => ["pronostic-answers", userId];

export function usePronosticQuestions() {
  return useQuery({
    queryKey: questionsQueryKey,
    queryFn: getPronosticQuestions,
  });
}

export function useUserAnswers(userId: string) {
  return useQuery({
    queryKey: answersQueryKey(userId),
    queryFn: () => getUserAnswers(userId),
    enabled: Boolean(userId),
  });
}

export function useUpsertAnswers(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answers: Record<string, string>) => upsertAnswers(userId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: answersQueryKey(userId) });
    },
  });
}
