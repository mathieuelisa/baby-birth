import type { PronosticAnswer, Product, PronosticQuestion, User } from "@/types";
import { createClient } from "./client";

// ——————————————————————————————
// Utilisateurs
// ——————————————————————————————

export async function findOrCreateUser(
  firstName: string,
  lastName: string,
): Promise<User> {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("first_name", firstName.trim())
    .eq("last_name", lastName.trim())
    .single();

  if (existing) return existing as User;

  const { data: created, error } = await supabase
    .from("users")
    .insert({ first_name: firstName.trim(), last_name: lastName.trim() })
    .select()
    .single();

  if (error || !created) throw new Error("Impossible de créer l'utilisateur");

  return created as User;
}

// ——————————————————————————————
// Produits & réservations
// ——————————————————————————————

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_claims(*, users(*))")
    .order("created_at");

  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function claimProduct(productId: string, userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("product_claims")
    .insert({ product_id: productId, user_id: userId });

  if (error) throw error;
}

export async function unclaimProduct(productId: string, userId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("product_claims")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", userId);

  if (error) throw error;
}

// ——————————————————————————————
// Pronostics
// ——————————————————————————————

export async function getPronosticQuestions(): Promise<PronosticQuestion[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pronostic_questions")
    .select("*")
    .order("order_index");

  if (error) throw error;
  return (data ?? []) as PronosticQuestion[];
}

export async function getUserAnswers(userId: string): Promise<PronosticAnswer[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pronostic_answers")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []) as PronosticAnswer[];
}

export async function upsertAnswers(
  userId: string,
  answers: Record<string, string>,
): Promise<void> {
  const supabase = createClient();

  const rows = Object.entries(answers)
    .filter(([, answer]) => answer.trim() !== "")
    .map(([questionId, answer]) => ({
      user_id: userId,
      question_id: questionId,
      answer: answer.trim(),
      updated_at: new Date().toISOString(),
    }));

  if (rows.length === 0) return;

  const { error } = await supabase
    .from("pronostic_answers")
    .upsert(rows, { onConflict: "user_id,question_id" });

  if (error) throw error;
}
