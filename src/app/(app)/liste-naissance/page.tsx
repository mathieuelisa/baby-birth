"use client";

import { useAtomValue } from "jotai";
import Link from "next/link";
import { useClaimProduct, useProducts, useUnclaimProduct } from "@/hooks/use-products";
import { userAtom } from "@/store/auth";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export default function ListeNaissancePage() {
  const user = useAtomValue(userAtom);
  const { data: products, isLoading, isError } = useProducts();
  const claim = useClaimProduct();
  const unclaim = useUnclaimProduct();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-muted-foreground text-sm">Chargement de la liste…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive py-20">
        Impossible de charger la liste. Veuillez réessayer.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Liste de naissance 🎁</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cliquez sur &laquo;&nbsp;Réserver&nbsp;&raquo; pour prendre en charge un cadeau.
          Un cadeau barré est déjà réservé.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currentUserId={user!.id}
            isClaiming={claim.isPending && claim.variables?.productId === product.id}
            isUnclaiming={unclaim.isPending && unclaim.variables?.productId === product.id}
            onClaim={() => claim.mutate({ productId: product.id, userId: user!.id })}
            onUnclaim={() => unclaim.mutate({ productId: product.id, userId: user!.id })}
          />
        ))}
      </div>

      {products?.length === 0 && (
        <p className="text-center text-muted-foreground py-20">
          Aucun produit dans la liste pour l&apos;instant.
        </p>
      )}
    </div>
  );
}

function ProductCard({
  product,
  currentUserId,
  isClaiming,
  isUnclaiming,
  onClaim,
  onUnclaim,
}: {
  product: Product;
  currentUserId: string;
  isClaiming: boolean;
  isUnclaiming: boolean;
  onClaim: () => void;
  onUnclaim: () => void;
}) {
  const claim = product.product_claims?.[0];
  const isClaimed = Boolean(claim);
  const isClaimedByMe = claim?.user_id === currentUserId;
  const claimer = claim?.users;

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-card shadow-sm overflow-hidden transition-all",
        isClaimed && !isClaimedByMe ? "opacity-70" : "hover:shadow-md",
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-secondary flex items-center justify-center">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className={cn("h-full w-full object-cover", isClaimed && "opacity-60")}
          />
        ) : (
          <span className="text-4xl opacity-40">🎀</span>
        )}

        {/* Badge réservé */}
        {isClaimed && (
          <div
            className={cn(
              "absolute top-2 right-2 rounded-full px-2.5 py-1 text-xs font-medium",
              isClaimedByMe
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/80 text-background",
            )}
          >
            {isClaimedByMe ? "Réservé par vous" : "Réservé"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <h3
          className={cn(
            "font-medium text-foreground leading-snug",
            isClaimed && !isClaimedByMe && "line-through text-muted-foreground",
          )}
        >
          {product.title}
        </h3>

        {isClaimed && claimer && !isClaimedByMe && (
          <p className="text-xs text-muted-foreground">
            Réservé par {claimer.first_name} {claimer.last_name}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2">
          {product.link && (
            <Link
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              Voir le produit ↗
            </Link>
          )}

          {!isClaimed && (
            <button
              onClick={onClaim}
              disabled={isClaiming}
              className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isClaiming ? "…" : "Réserver"}
            </button>
          )}

          {isClaimedByMe && (
            <button
              onClick={onUnclaim}
              disabled={isUnclaiming}
              className="flex-1 rounded-lg border border-destructive px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 transition-colors"
            >
              {isUnclaiming ? "…" : "Annuler"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
