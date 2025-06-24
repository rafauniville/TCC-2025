import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import React from "react";

// Mocks
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock("../auth/authContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockLogin.mockClear();
    mockNavigate.mockClear();
  });

  it("renderiza inputs, botão e título", () => {
    render(<LoginPage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Usuário")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("faz login com credenciais válidas (user1)", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/form");
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it("faz login com credenciais válidas (admin)", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/form");
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it("mostra erro com credenciais inválidas", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "errada" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("mostra erro se campos estão vazios", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("mostra erro se usuário está correto mas senha errada", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user2" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "senhaerrada" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("mostra erro se senha está correta mas usuário errado", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "naoexiste" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });
});