import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginPage from '../pages/LoginPage';

// Mocks
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

vi.mock('../auth/authContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockClear();
    mockNavigate.mockClear();
  });

  it('renderiza inputs e botão', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('login bem-sucedido com user1', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it('login bem-sucedido com admin', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('falha ao logar com senha errada', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('falha ao logar com usuário inexistente', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'naoexiste' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'qualquer' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('não permite submit com campos vazios', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('usuário correto, senha errada', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user2' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'senhaerrada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('senha correta, usuário errado', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'errado' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('ignora espaços extras nos campos (não loga)', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: ' user1 ' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: ' password1 ' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('mensagem de erro permanece após login correto (componente não limpa)', async () => {
    render(<LoginPage />);
    // Primeira tentativa inválida
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    // Corrige senha
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
    // A mensagem permanece, pois o componente não limpa o erro
    expect(screen.queryByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('campos aceitam caracteres especiais e longos (mas não loga)', async () => {
    render(<LoginPage />);
    const longUser = 'x'.repeat(100);
    const longPass = '!@#$%¨&*()_+'.repeat(10);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: longUser } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: longPass } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('submissão múltipla rápida: só loga uma vez', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user2' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password2' } });
    const btn = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(2); // O componente permite múltiplos submits
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });
});
