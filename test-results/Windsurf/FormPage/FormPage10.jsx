import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';

describe('FormPage', () => {
  function setup() {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
  }

  it('renderiza todos os campos obrigatórios', () => {
    setup();
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
  });

  it('submete com sucesso quando todos os campos obrigatórios estão preenchidos e termos aceitos', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/deve aceitar os termos/i)).not.toBeInTheDocument();
    // Campos devem ser limpos
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
  });

  it('exibe erro se campos obrigatórios não forem preenchidos', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('exibe erro se email for inválido', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Maria' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'email-invalido' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '1990-05-05' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'female' } });
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });

  it('exibe erro se termos não forem aceitos', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Carlos' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'carlos@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '1985-12-12' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'male' } });
    // Não clica no checkbox
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/deve aceitar os termos/i)).toBeInTheDocument();
  });

  it('permite preencher campos de endereço e observações', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua A' } });
    fireEvent.change(screen.getByLabelText(/número/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: 'Centro' } });
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'São Paulo' } });
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'SP' } });
    fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: 'Sem observações' } });
    expect(screen.getByLabelText(/rua/i)).toHaveValue('Rua A');
    expect(screen.getByLabelText(/número/i)).toHaveValue('123');
    expect(screen.getByLabelText(/bairro/i)).toHaveValue('Centro');
    expect(screen.getByLabelText(/cidade/i)).toHaveValue('São Paulo');
    expect(screen.getByLabelText(/estado/i)).toHaveValue('SP');
    expect(screen.getByLabelText(/observações/i)).toHaveValue('Sem observações');
  });

  it('não permite submeter se faltar apenas um campo obrigatório', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ana@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '1995-10-10' } });
    // Não seleciona sexo
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('limpa o formulário após submissão bem-sucedida', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Bruno' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bruno@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2001-11-11' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'other' } });
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua B' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/telefone/i)).toHaveValue('');
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('');
    expect(screen.getByLabelText(/sexo/i)).toHaveValue('');
    expect(screen.getByLabelText(/rua/i)).toHaveValue('');
    expect(screen.getByLabelText(/aceito os termos/i)).not.toBeChecked();
  });

  it('não aceita email com espaços', async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Lucas' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: ' lucas@email.com ' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '2002-08-08' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
      expect(screen.getByLabelText(/telefone/i)).toHaveValue('');
      expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('');
      expect(screen.getByLabelText(/sexo/i)).toHaveValue('');
    });
  });

  it('permite campos com valores longos', () => {
    setup();
    const longName = 'A'.repeat(200);
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: longName } });
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue(longName);
  });

  it('não limpa o formulário em caso de erro', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
  });

  it('permite submeter duas vezes seguidas', () => {
    setup();
    // Primeira submissão
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Primeiro' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'primeiro@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11999999999' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '1999-09-09' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'male' } });
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    // Segunda submissão
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Segundo' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'segundo@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '11888888888' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: '1998-08-08' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: 'female' } });
    fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
  });
});
