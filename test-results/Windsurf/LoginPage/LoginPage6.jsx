import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock do useAuth
const mockLogin = vi.fn();
vi.mock('../auth/authContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  it('renderiza inputs e botão', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('login com credenciais corretas (user1/password1)', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('login com credenciais corretas (admin/admin123)', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('não faz login com usuário correto e senha errada', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it('não faz login com usuário errado e senha correta', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'errado' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it('não faz login com ambos errados', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'foo' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'bar' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it('não faz login com campos vazios', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it('realiza login com sucesso após erro anterior (mensagem de erro permanece)', async () => {
    render(<LoginPage />);
    // Primeiro, submit com erro
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'foo' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'bar' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
    // Corrige e faz login
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user2' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password2' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
      // A mensagem de erro permanece, pois o componente não limpa o erro após login
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });

  it('inputs aceitam caracteres especiais', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'admin!@#' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'senha$%¨&' } });
    expect(screen.getByPlaceholderText(/usuário/i)).toHaveValue('admin!@#');
    expect(screen.getByPlaceholderText(/senha/i)).toHaveValue('senha$%¨&');
  });

  it('mensagem de erro persiste em múltiplos submits inválidos', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'foo' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'bar' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
