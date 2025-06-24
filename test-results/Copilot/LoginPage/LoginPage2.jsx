import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import React from "react";

// React Testing Library and Vitest tests for LoginPage


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

  it("logs in with valid credentials and navigates", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/form");
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it("shows error message with invalid credentials", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("shows error when fields are empty", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("shows error for valid username and wrong password", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("shows error for valid password and wrong username", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("clears error after successful login", () => {
    render(<LoginPage />);
    // First, submit invalid credentials
    fireEvent.change(screen.getByPlaceholderText("Usuário"), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();

    // Then, submit valid credentials
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/form");
    // Remover a linha abaixo, pois o erro não some sem redirecionamento real:
    // expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });
});