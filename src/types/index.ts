export type User = {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
};

export type Product = {
  id: string;
  title: string;
  image_url: string | null;
  link: string | null;
  created_at: string;
  product_claims: ProductClaim[];
};

export type ProductClaim = {
  id: string;
  product_id: string;
  user_id: string;
  claimed_at: string;
  users: User;
};

export type PronosticQuestion = {
  id: string;
  question: string;
  type: "open" | "multiple_choice";
  options: string[] | null;
  order_index: number;
};

export type PronosticAnswer = {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  created_at: string;
  updated_at: string;
};
