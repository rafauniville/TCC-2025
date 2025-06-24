/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';
import React from 'react';
import { vi } from 'vitest';

// Mock useNavigate e useAuth
const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
vi.mock('../auth/authContext', () => ({
  useAuth: () => ({ login: mockLogin })
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  it('renderiza campos de usuário, senha e botão', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('faz login com credenciais válidas (user1)', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('faz login com credenciais válidas (admin)', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('exibe erro para credenciais inválidas', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('exibe erro se campos estiverem vazios', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('exibe erro se apenas usuário for preenchido', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('exibe erro se apenas senha for preenchida', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('não aceita espaços extras (input com espaços)', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: ' user1 ' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: ' password1 ' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('mensagem de erro permanece ao digitar novamente (não há lógica para sumir)', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1x' } });
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('não faz login se usuário correto e senha errada', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user2' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não faz login se usuário errado e senha correta', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'errado' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password2' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não faz login com duplo clique rápido se inválido', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'errado' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errado' } });
    const btn = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
