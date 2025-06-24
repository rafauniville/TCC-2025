import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Objetos para manter referência aos spies
const mockRefs = {
  login: vi.fn(),
  navigate: vi.fn(),
};

// Mocks DEVEM ser definidos antes do import do componente!
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockRefs.navigate,
  };
});

vi.mock('../auth/authContext', () => ({
  useAuth: () => ({ login: mockRefs.login }),
}));

import LoginPage from '../pages/LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    mockRefs.login.mockClear();
    mockRefs.navigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const fillAndSubmit = async (username, password) => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: username } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: password } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
  };

  it('renderiza campos e botão', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('faz login com credenciais corretas', async () => {
    await fillAndSubmit('user1', 'password1');
    expect(mockRefs.login).toHaveBeenCalled();
    expect(mockRefs.navigate).toHaveBeenCalledWith('/form');
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it('mostra erro com usuário/senha inválidos', async () => {
    await fillAndSubmit('user1', 'errada');
    expect(mockRefs.login).not.toHaveBeenCalled();
    expect(mockRefs.navigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('mostra erro se campos vazios', async () => {
    await fillAndSubmit('', '');
    expect(mockRefs.login).not.toHaveBeenCalled();
    expect(mockRefs.navigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('mostra erro se usuário correto e senha errada', async () => {
    await fillAndSubmit('user1', 'wrong');
    expect(mockRefs.login).not.toHaveBeenCalled();
    expect(mockRefs.navigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('mostra erro se usuário errado e senha correta', async () => {
    await fillAndSubmit('wrong', 'password1');
    expect(mockRefs.login).not.toHaveBeenCalled();
    expect(mockRefs.navigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('faz login com outro usuário válido', async () => {
    await fillAndSubmit('admin', 'admin123');
    expect(mockRefs.login).toHaveBeenCalled();
    expect(mockRefs.navigate).toHaveBeenCalledWith('/form');
  });

  it('mantém mensagem de erro após sucesso, conforme comportamento atual', async () => {
    render(<LoginPage />);
    // Primeira tentativa errada
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    // Corrige e faz login
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(mockRefs.login).toHaveBeenCalled();
    expect(mockRefs.navigate).toHaveBeenCalledWith('/form');
    // Mensagem de erro permanece, pois o componente não a limpa
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('não faz trim em usuário/senha (edge case)', async () => {
    await fillAndSubmit(' user1 ', ' password1 ');
    expect(mockRefs.login).not.toHaveBeenCalled();
    expect(mockRefs.navigate).not.toHaveBeenCalled();
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('permite múltiplas tentativas: erro seguido de sucesso (mensagem permanece)', async () => {
    render(<LoginPage />);
    // Primeira tentativa errada
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    // Corrige e faz login
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(mockRefs.login).toHaveBeenCalled();
    expect(mockRefs.navigate).toHaveBeenCalledWith('/form');
    // Mensagem de erro permanece, pois o componente não a limpa
    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });
});
