import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
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
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  function setup() {
    return render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
  }

  it('renderiza campos e botão', () => {
    setup();
    expect(screen.getByPlaceholderText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('realiza login com credenciais corretas', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('mostra erro com credenciais inválidas', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'senhaerrada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('mostra erro se campos estão vazios', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('mostra erro se apenas usuário preenchido', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('mostra erro se apenas senha preenchida', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('mostra erro se usuário e senha são apenas espaços', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: '   ' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('permite tentar múltiplas vezes, mostrando erro sempre que falhar', async () => {
    setup();
    // Primeira tentativa inválida
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    // Segunda tentativa válida
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });
});
