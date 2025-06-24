import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';
import { describe, it, expect, beforeEach } from 'vitest';

function renderForm() {
  render(
    <MemoryRouter>
      <FormPage />
    </MemoryRouter>
  );
}

describe('FormPage', () => {
  beforeEach(() => {
    renderForm();
  });

  it('deve renderizar todos os campos do formulário', () => {
    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sexo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rua/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Número/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bairro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Estado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aceito os termos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Observações/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it('deve exibir erro se campos obrigatórios não forem preenchidos', () => {
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('deve exibir erro se email for inválido', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'emailinvalido' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
  });

  it('deve exibir erro se termos não forem aceitos', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Você deve aceitar os termos/i)).toBeInTheDocument();
  });

  it('deve limpar o formulário após submissão válida', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Usuário Exemplo' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'usuario@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '1990-12-31' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'female' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.change(screen.getByLabelText(/Rua/i), { target: { value: 'Rua das Flores' } });
    fireEvent.change(screen.getByLabelText(/Número/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Bairro/i), { target: { value: 'Centro' } });
    fireEvent.change(screen.getByLabelText(/Cidade/i), { target: { value: 'São Paulo' } });
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'SP' } });
    fireEvent.change(screen.getByLabelText(/Observações/i), { target: { value: 'Sem observações' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    // Campos obrigatórios devem estar vazios
    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Telefone/i)).toHaveValue('');
    expect(screen.getByLabelText(/Data de nascimento/i)).toHaveValue('');
    expect(screen.getByLabelText(/Sexo/i)).toHaveValue('');
    expect(screen.getByLabelText(/Rua/i)).toHaveValue('');
    expect(screen.getByLabelText(/Número/i)).toHaveValue('');
    expect(screen.getByLabelText(/Bairro/i)).toHaveValue('');
    expect(screen.getByLabelText(/Cidade/i)).toHaveValue('');
    expect(screen.getByLabelText(/Estado/i)).toHaveValue('');
    expect(screen.getByLabelText(/Observações/i)).toHaveValue('');
    expect(screen.getByLabelText(/Aceito os termos/i)).not.toBeChecked();
    // Não deve exibir erro
    expect(screen.queryByText(/Todos os campos obrigatórios/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Email inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Você deve aceitar os termos/i)).not.toBeInTheDocument();
  });

  it('deve aceitar apenas campos obrigatórios preenchidos (endereços e observações vazios)', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Usuário' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@teste.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '1995-05-05' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Telefone/i)).toHaveValue('');
    expect(screen.getByLabelText(/Data de nascimento/i)).toHaveValue('');
    expect(screen.getByLabelText(/Sexo/i)).toHaveValue('');
    // Não deve exibir erro
    expect(screen.queryByText(/Todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('deve permitir valores mínimos e máximos razoáveis nos campos', () => {
    // Nome de 1 caractere
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@a.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2020-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'other' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue('');
    // Nome longo
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'A'.repeat(100) } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a'.repeat(50) + '@a.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '9'.repeat(20) } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '1980-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'female' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue('');
  });

  it('não deve bloquear envio se endereço estiver parcialmente preenchido', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Usuário' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@teste.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '1995-05-05' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.change(screen.getByLabelText(/Rua/i), { target: { value: 'Rua parcial' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue('');
    expect(screen.queryByText(/Todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });
});
