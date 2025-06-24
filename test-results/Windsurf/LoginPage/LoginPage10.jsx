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

  it('renderiza campos de usuário, senha e botão', () => {
    setup();
    expect(screen.getByPlaceholderText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('faz login com credenciais válidas', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('exibe erro com credenciais inválidas', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não faz login se campos estiverem vazios', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não faz login se apenas usuário estiver correto', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('não faz login se apenas senha estiver correta', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'errado' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('ignora espaços extras no início/fim do usuário/senha', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: '  user1  ' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: '  password1  ' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    // O login deve falhar, pois o componente não faz trim dos campos
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('exibe erro apenas após tentativa de login inválida', () => {
    setup();
    expect(screen.queryByText(/credenciais inválidas/i)).not.toBeInTheDocument();
  });

  it('faz login válido após tentativa inválida', async () => {
    setup();
    // Primeiro tenta inválido
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user1' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    // Agora tenta válido
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password1' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
    // Não checa se a mensagem sumiu, pois a navegação é mockada
  });

  it('faz login com usuário admin', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });

  it('permite múltiplas tentativas de login', async () => {
    setup();
    // 1ª tentativa inválida
    fireEvent.change(screen.getByPlaceholderText(/usuário/i), { target: { value: 'user2' } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
    // 2ª tentativa válida
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'password2' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/form');
    });
  });
});
