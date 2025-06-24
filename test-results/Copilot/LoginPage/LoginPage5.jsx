import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import React from "react";

// Mocks
const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock("../auth/authContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  it("renderiza campos de login e botão", () => {
    render(<LoginPage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Usuário")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("realiza login com credenciais válidas", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/form");
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it("exibe erro ao tentar login com credenciais inválidas", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "userX" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("exibe erro ao tentar login com campos vazios", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("exibe erro ao tentar login com valores extremos", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "a".repeat(100) },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "b".repeat(100) },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });
});