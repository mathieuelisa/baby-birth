"use client";

import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { findOrCreateUser } from "@/lib/supabase/queries";
import { userAtom } from "@/store/auth";

export function useLogin() {
  const setUser = useSetAtom(userAtom);
  const router = useRouter();

  return useMutation({
    mutationFn: ({ firstName, lastName }: { firstName: string; lastName: string }) =>
      findOrCreateUser(firstName, lastName),
    onSuccess: (user) => {
      setUser(user);
      router.push("/home");
    },
  });
}
