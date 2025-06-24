import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
const mockLogin = vi.fn();
vi.mock('../auth/authContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogin.mockReset();
  });

  function setup() {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  }

  it('realiza login com credenciais válidas', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('exibe erro com credenciais inválidas', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'senhaerrada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não permite login com campos vazios', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não permite login com usuário correto e senha incorreta', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não permite login com usuário incorreto e senha correta', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'invalido' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('ignora espaços extras nos campos', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: '  user2  ' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: '  password2  ' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    // O login não deve ser bem-sucedido, pois o componente não faz trim
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('remove mensagem de erro ao alterar campos após erro', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    // Corrige senha
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('não faz login ao submeter múltiplas vezes rapidamente com dados errados', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errada' } });
    const btn = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
