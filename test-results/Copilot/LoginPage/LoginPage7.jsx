import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import React from "react";

// React Testing Library + Vitest


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

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("logs in with valid credentials", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/form");
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it("shows error with invalid credentials", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "wrongpass" } });
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

  it("logs in with admin credentials", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/form");
  });

  it("clears error after correcting credentials", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/form");
  });
});