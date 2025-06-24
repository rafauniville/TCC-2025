import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';

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
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sexo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rua/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aceito os termos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/observações/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para o login/i })).toBeInTheDocument();
  });

  it('deve exibir erro se submeter com campos obrigatórios vazios', () => {
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('deve exibir erro se email for inválido', () => {
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'emailinvalido' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });

  it('deve exibir erro se termos não forem aceitos', () => {
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'male' } });
    // Não clica no checkbox
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/você deve aceitar os termos/i)).toBeInTheDocument();
  });

  it('deve limpar o formulário após submissão bem-sucedida', () => {
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Nome Completo' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '1990-12-12' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'female' } });
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua A' } });
    fireEvent.change(screen.getByLabelText(/número/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: 'Centro' } });
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'Cidade' } });
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'Estado' } });
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: 'Alguma observação' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/telefone/i)).toHaveValue('');
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('');
    expect(screen.getByLabelText(/sexo/i)).toHaveValue('');
    expect(screen.getByLabelText(/rua/i)).toHaveValue('');
    expect(screen.getByLabelText(/número/i)).toHaveValue('');
    expect(screen.getByLabelText(/bairro/i)).toHaveValue('');
    expect(screen.getByLabelText(/cidade/i)).toHaveValue('');
    expect(screen.getByLabelText(/estado/i)).toHaveValue('');
    expect(screen.getByLabelText(/aceito os termos/i)).not.toBeChecked();
    expect(screen.getByLabelText(/observações/i)).toHaveValue('');
    // Não deve mostrar erro
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });

  it('deve atualizar campos de endereço corretamente', () => {
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua Teste' } });
    fireEvent.change(screen.getByLabelText(/número/i), { target: { value: '999' } });
    expect(screen.getByLabelText(/rua/i)).toHaveValue('Rua Teste');
    expect(screen.getByLabelText(/número/i)).toHaveValue('999');
  });

  it('deve permitir textos longos nos campos', () => {
    const longText = 'a'.repeat(255);
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: longText } });
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue(longText);
  });

  it('deve exibir erro ao apagar campo obrigatório e submeter', () => {
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Nome' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '123456789' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '1990-12-12' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'female' } });
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    // Apaga o nome
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('deve exibir erro se preencher apenas endereço e tentar submeter', () => {
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua Teste' } });
    fireEvent.change(screen.getByLabelText(/número/i), { target: { value: '999' } });
    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: 'Bairro' } });
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'Cidade' } });
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'Estado' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('deve permitir datas extremas no campo de nascimento', () => {
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '1900-01-01' } });
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('1900-01-01');
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2100-12-31' } });
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('2100-12-31');
  });

  it('deve permitir telefones curtos e longos', () => {
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '1' } });
    expect(screen.getByLabelText(/telefone/i)).toHaveValue('1');
    const longPhone = '9'.repeat(20);
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: longPhone } });
    expect(screen.getByLabelText(/telefone/i)).toHaveValue(longPhone);
  });
});
