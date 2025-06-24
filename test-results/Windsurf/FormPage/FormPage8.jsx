import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';
import { describe, it, expect, beforeEach } from 'vitest';

function setup() {
  render(
    <MemoryRouter>
      <FormPage />
    </MemoryRouter>
  );
}

describe('FormPage', () => {
  beforeEach(() => {
    setup();
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
    expect(screen.getByRole('link', { name: /Voltar para o Login/i })).toBeInTheDocument();
  });

  it('deve exibir erro se tentar enviar sem preencher campos obrigatórios', () => {
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('deve exibir erro para email inválido', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'email-invalido' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
  });

  it('deve exibir erro se os termos não forem aceitos', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'female' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Você deve aceitar os termos/i)).toBeInTheDocument();
  });

  it('deve limpar o formulário após envio bem-sucedido', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'other' } });
    fireEvent.change(screen.getByLabelText(/Rua/i), { target: { value: 'Rua 1' } });
    fireEvent.change(screen.getByLabelText(/Número/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Bairro/i), { target: { value: 'Centro' } });
    fireEvent.change(screen.getByLabelText(/Cidade/i), { target: { value: 'Cidade' } });
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'Estado' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.change(screen.getByLabelText(/Observações/i), { target: { value: 'Alguma observação' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
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
    expect(screen.getByLabelText(/Aceito os termos/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Observações/i)).toHaveValue('');
    expect(screen.queryByText(/Todos os campos obrigatórios/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Email inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Você deve aceitar os termos/i)).not.toBeInTheDocument();
  });

  it('deve permitir valores mínimos nos campos obrigatórios', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@b.c' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '1900-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByLabelText(/Nome completo/i)).toHaveValue('');
    expect(screen.queryByText(/Todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('deve aceitar textos grandes nos campos opcionais', () => {
    const longText = 'a'.repeat(500);
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'female' } });
    fireEvent.change(screen.getByLabelText(/Rua/i), { target: { value: longText } });
    fireEvent.change(screen.getByLabelText(/Observações/i), { target: { value: longText } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByLabelText(/Rua/i)).toHaveValue('');
    expect(screen.getByLabelText(/Observações/i)).toHaveValue('');
  });

  it('não deve enviar se apenas campos de endereço forem preenchidos', () => {
    fireEvent.change(screen.getByLabelText(/Rua/i), { target: { value: 'Rua 1' } });
    fireEvent.change(screen.getByLabelText(/Número/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Bairro/i), { target: { value: 'Centro' } });
    fireEvent.change(screen.getByLabelText(/Cidade/i), { target: { value: 'Cidade' } });
    fireEvent.change(screen.getByLabelText(/Estado/i), { target: { value: 'Estado' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('não deve enviar se faltar um campo obrigatório', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/Aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('não deve enviar se todos os campos estiverem preenchidos, mas os termos não estiverem marcados', () => {
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/Data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));
    expect(screen.getByText(/Você deve aceitar os termos/i)).toBeInTheDocument();
  });
});
