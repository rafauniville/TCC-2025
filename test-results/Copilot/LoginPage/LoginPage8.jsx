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

  it("renderiza campos de usuário, senha e botão", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("Usuário")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("faz login com credenciais válidas", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/form");
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it("mostra erro com credenciais inválidas", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("mostra erro ao submeter campos vazios", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("mostra erro se usuário existir mas senha estiver errada", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("mostra erro se senha existir mas usuário estiver errado", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "wronguser" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("remove mensagem de erro ao corrigir credenciais e submeter novamente", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/form");
  });
});