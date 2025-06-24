import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "../pages/LoginPage";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock useAuth
const mockLogin = vi.fn();
vi.mock("../auth/authContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  it("renderiza campos de usuário, senha e botão", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("Usuário")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("faz login com credenciais válidas", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/form");
    });
  });

  it("exibe erro com credenciais inválidas", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "errada" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("não permite login com campos vazios", async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("não permite login com usuário correto e senha errada", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "senhaerrada" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("não permite login com senha correta e usuário errado", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "errado" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("não faz login com espaços extras nos campos", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: " user1 " } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: " password1 " } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("é sensível a maiúsculas/minúsculas", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "USER1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "PASSWORD1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("exibe erro com caracteres especiais ou inputs longos", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "!@#$$%¨&*()" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "x".repeat(100) } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("mantém a mensagem de erro ao alterar input após erro e só some após login válido", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "errada" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Mensagem de erro aparece
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();

    // Alterar input NÃO remove a mensagem
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();

    // Agora faz login válido
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Navegação foi chamada, indicando login bem-sucedido
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/form");
    });
  });

  it("permite múltiplas tentativas de login", async () => {
    render(<LoginPage />);
    // 1ª tentativa inválida
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "errada" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    // 2ª tentativa válida
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/form");
    });
  });
});
