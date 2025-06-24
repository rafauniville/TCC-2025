import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';
import { describe, it, expect, beforeEach } from 'vitest';

function renderForm() {
  return render(
    <MemoryRouter>
      <FormPage />
    </MemoryRouter>
  );
}

describe('FormPage', () => {
  beforeEach(() => {
    renderForm();
  });

  it('renderiza todos os campos do formulário', () => {
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

  it('exibe erro se tentar enviar com campos obrigatórios vazios', () => {
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Todos os campos obrigatórios devem ser preenchidos/i)).toBeInTheDocument();
  });

  it('exibe erro se email for inválido', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'emailinvalido' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
  });

  it('exibe erro se não aceitar os termos', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    // Não clica no checkbox
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Você deve aceitar os termos/i)).toBeInTheDocument();
  });

  it('envia o formulário com sucesso e limpa os campos', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Maria Oliveira' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'maria@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '21988887777' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '1995-12-31' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'female' } });
    fireEvent.change(screen.getByLabelText(/Rua/i), { target: { value: 'Rua das Flores' } });
    fireEvent.change(screen.getByLabelText(/Número/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Bairro/i), { target: { value: 'Centro' } });
    fireEvent.change(screen.getByLabelText(/Cidade/i), { target: { value: 'Rio de Janeiro' } });
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'RJ' } });
    fireEvent.change(screen.getByLabelText(/Observações/i), { target: { value: 'Nenhuma' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    // Campos obrigatórios devem estar limpos
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
    expect(screen.queryByText(/Todos os campos obrigatórios devem ser preenchidos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Email inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Você deve aceitar os termos/i)).not.toBeInTheDocument();
  });

  it('permite preencher apenas endereço e observações sem erro, mas não envia', () => {
    fireEvent.change(screen.getByLabelText(/Rua/i), { target: { value: 'Rua das Palmeiras' } });
    fireEvent.change(screen.getByLabelText(/Observações/i), { target: { value: 'Teste' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Todos os campos obrigatórios devem ser preenchidos/i)).toBeInTheDocument();
  });

  it('exibe erro ao limpar um campo obrigatório antes de enviar', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    // Limpa o campo nome
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Todos os campos obrigatórios devem ser preenchidos/i)).toBeInTheDocument();
  });

  it('permite preencher endereço parcialmente sem erro de validação', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ana@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '21999999999' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '1990-10-10' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'female' } });
    fireEvent.change(screen.getByLabelText(/Rua/i), { target: { value: 'Rua A' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue(''); // formulário limpo
  });

  it('não envia se data de nascimento estiver vazia', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Carlos' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'carlos@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Todos os campos obrigatórios devem ser preenchidos/i)).toBeInTheDocument();
  });
});