import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import React from "react";

// Mock useNavigate and useAuth
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));
const mockLogin = vi.fn();
vi.mock("../auth/authContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockLogin.mockClear();
    navigateMock.mockClear();
  });

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Usuário")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("logs in with valid credentials", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/form");
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it("shows error with invalid credentials", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("shows error if fields are empty", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("shows error if username is valid but password is empty", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("shows error if password is valid but username is empty", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it("removes error after successful login", () => {
    render(<LoginPage />);
    // First, submit invalid credentials
    fireEvent.change(screen.getByPlaceholderText("Usuário"), { target: { value: "user1" } });
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "wrongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();

    // Then, submit valid credentials
    fireEvent.change(screen.getByPlaceholderText("Senha"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/form");
  });
});