"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { claimProduct, getProducts, unclaimProduct } from "@/lib/supabase/queries";

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
    mutationFn: ({ productId, userId }: { productId: string; userId: string }) =>
      claimProduct(productId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}

export function useUnclaimProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, userId }: { productId: string; userId: string }) =>
      unclaimProduct(productId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}
