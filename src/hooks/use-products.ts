"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  claimProduct,
  getProducts,
  unclaimProduct,
} from "@/lib/supabase/queries";
import type { Product } from "@/types";

export const productsQueryKey = ["products"];

export function useProducts() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: getProducts,
  });
}

export function useClaimProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      userId,
    }: {
      productId: string;
      userId: string;
    }) => claimProduct(productId, userId),

    onMutate: async ({ productId, userId }) => {
      await queryClient.cancelQueries({ queryKey: productsQueryKey });
      const previous = queryClient.getQueryData<Product[]>(productsQueryKey);

      queryClient.setQueryData<Product[]>(productsQueryKey, (old) =>
        old?.map((element) =>
          element.id === productId
            ? { ...element, claimed_by_user_id: userId, claimer: null }
            : element,
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(productsQueryKey, context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}

export function useUnclaimProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      userId,
    }: {
      productId: string;
      userId: string;
    }) => unclaimProduct(productId, userId),

    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: productsQueryKey });
      const previous = queryClient.getQueryData<Product[]>(productsQueryKey);

      queryClient.setQueryData<Product[]>(productsQueryKey, (old) =>
        old?.map((element) =>
          element.id === productId
            ? { ...element, claimed_by_user_id: null, claimer: null }
            : element,
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(productsQueryKey, context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}
