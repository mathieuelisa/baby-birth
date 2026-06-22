import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, createStore } from "jotai";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "@/app/page";
import * as useUserModule from "@/hooks/use-user";

// --- Mocks ---

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ replace: vi.fn(), push: vi.fn() })),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string; fill?: boolean; priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock("@/hooks/use-user", () => ({
  useLogin: vi.fn(),
}));

// --- Helpers ---

const baseMutation = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  reset: vi.fn(),
  isPending: false,
  isError: false,
  isSuccess: false,
  isIdle: true,
  error: null,
  data: undefined,
  status: "idle" as const,
  variables: undefined,
  context: undefined,
  failureCount: 0,
  failureReason: null,
  submittedAt: 0,
};

const renderLoginPage = () => {
  const store = createStore();
  return render(
    <Provider store={store}>
      <LoginPage />
    </Provider>,
  );
};

// --- Tests ---

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(useUserModule.useLogin).mockReturnValue(baseMutation as any);
  });

  it("affiche le titre « Mini nous »", () => {
    renderLoginPage();
    expect(screen.getByText(/👶🏽 Mini nous 👶🏽/)).toBeInTheDocument();
  });

  it("affiche le champ Prénom avec son label", () => {
    renderLoginPage();
    expect(screen.getByLabelText("Prénom")).toBeInTheDocument();
  });

  it("affiche le champ Nom avec son label", () => {
    renderLoginPage();
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
  });

  it("affiche le bouton « Accéder à Mini nous »", () => {
    renderLoginPage();
    expect(
      screen.getByRole("button", { name: /Accéder à Mini nous/i }),
    ).toBeInTheDocument();
  });

  it("affiche « Connexion… » et désactive le bouton quand isPending est true", () => {
    vi.mocked(useUserModule.useLogin).mockReturnValue({
      ...baseMutation,
      isPending: true,
    } as any);
    renderLoginPage();
    const btn = screen.getByRole("button", { name: /Connexion…/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("affiche un message d'erreur quand isError est true", () => {
    vi.mocked(useUserModule.useLogin).mockReturnValue({
      ...baseMutation,
      isError: true,
    } as any);
    renderLoginPage();
    expect(
      screen.getByText(/Une erreur s'est produite/i),
    ).toBeInTheDocument();
  });

  it("appelle mutate avec prénom et nom lors de la soumission", async () => {
    const mutate = vi.fn();
    vi.mocked(useUserModule.useLogin).mockReturnValue({
      ...baseMutation,
      mutate,
    } as any);
    renderLoginPage();

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Prénom"), "Marie");
    await user.type(screen.getByLabelText("Nom"), "Dupont");
    await user.click(screen.getByRole("button", { name: /Accéder à Mini nous/i }));

    expect(mutate).toHaveBeenCalledWith({
      firstName: "Marie",
      lastName: "Dupont",
    });
  });

  it("affiche l'erreur de validation si le champ Prénom est vidé", async () => {
    renderLoginPage();
    const user = userEvent.setup();
    const firstNameInput = screen.getByLabelText("Prénom");

    await user.type(firstNameInput, "A");
    await user.clear(firstNameInput);

    expect(await screen.findByText("Requis")).toBeInTheDocument();
  });
});
