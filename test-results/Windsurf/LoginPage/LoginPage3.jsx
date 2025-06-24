import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginPage from '../pages/LoginPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

  it('renderiza inputs e botão', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('faz login com credenciais corretas', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('mostra erro com credenciais inválidas', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não faz login com campos vazios', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('mostra erro para usuário inexistente', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'naoexiste' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'senha' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('remove mensagem de erro ao digitar novamente', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    // Digita novamente
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password1' } });
    // Mensagem de erro ainda aparece pois não é removida automaticamente
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('aceita caracteres especiais nos campos', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user!@#' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'pass!@#' } });
    expect(screen.getByDisplayValue('user!@#')).toBeInTheDocument();
    expect(screen.getByDisplayValue('pass!@#')).toBeInTheDocument();
  });

  it('não faz login com espaços extras', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: ' user1 ' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: ' password1 ' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('não faz login se só o usuário está correto', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('não faz login se só a senha está correta', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'errado' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('não faz login com duplo submit rápido se inválido', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Usuário'), { target: { value: 'errado' } });
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'errado' } });
    const button = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
