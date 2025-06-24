import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "../pages/LoginPage";

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

  it("renders login form elements", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("allows user to type username and password", () => {
    render(<LoginPage />);
    const userInput = screen.getByPlaceholderText(/usuário/i);
    const passInput = screen.getByPlaceholderText(/senha/i);

    fireEvent.change(userInput, { target: { value: "user1" } });
    fireEvent.change(passInput, { target: { value: "password1" } });

    expect(userInput.value).toBe("user1");
    expect(passInput.value).toBe("password1");
  });

  it("logs in with valid credentials and navigates", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), {
      target: { value: "password1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/form");
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it("shows error with invalid credentials", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), {
      target: { value: "wronguser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(
      screen.getByText(/credenciais inválidas\. tente novamente\./i)
    ).toBeInTheDocument();
  });

  it("shows error if username is correct but password is wrong", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), {
      target: { value: "user1" },
    });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(
      screen.getByText(/credenciais inválidas\. tente novamente\./i)
    ).toBeInTheDocument();
  });

  it("shows error if fields are empty", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(
      screen.getByText(/credenciais inválidas\. tente novamente\./i)
    ).toBeInTheDocument();
  });

  it("trims whitespace and fails login if credentials are not exact", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), {
      target: { value: " user1 " },
    });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), {
      target: { value: " password1 " },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(
      screen.getByText(/credenciais inválidas\. tente novamente\./i)
    ).toBeInTheDocument();
  });

  it("logs in with admin credentials", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/form");
  });
});