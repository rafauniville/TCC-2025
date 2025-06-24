import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';

describe('FormPage', () => {
  const fillRequiredFields = (overrides = {}) => {
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: overrides.name ?? 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: overrides.email ?? 'joao@email.com' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: overrides.phone ?? '11999999999' } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: overrides.birthDate ?? '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: overrides.gender ?? 'male' } });
    if (overrides.termsAccepted !== false) {
      fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    }
  };

  const setup = () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
  };

  it('renderiza todos os campos do formulário', () => {
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

  it('submete com sucesso quando todos os campos obrigatórios são preenchidos', () => {
    setup();
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/você deve aceitar/i)).not.toBeInTheDocument();
    // Campos devem ser limpos
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/telefone/i)).toHaveValue('');
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('');
    expect(screen.getByLabelText(/sexo/i)).toHaveValue('');
    expect(screen.getByLabelText(/aceito os termos/i)).not.toBeChecked();
  });

  it('mostra erro se campos obrigatórios não forem preenchidos', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('mostra erro se o email for inválido', () => {
    setup();
    fillRequiredFields({ email: 'invalido' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });

  it('mostra erro se os termos não forem aceitos', () => {
    setup();
    fillRequiredFields({ termsAccepted: false });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/você deve aceitar os termos/i)).toBeInTheDocument();
  });

  it('permite preencher campos de endereço e observações', () => {
    setup();
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua A' } });
    fireEvent.change(screen.getByLabelText(/número/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: 'Centro' } });
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'São Paulo' } });
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'SP' } });
    fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: 'Teste de observação' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('valida limites: campos com valores mínimos e máximos', () => {
    setup();
    fillRequiredFields({ name: 'A', email: 'a@a.a', phone: '1' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
    // Teste de valores longos
    fillRequiredFields({ name: 'A'.repeat(100), email: 'a'.repeat(50) + '@a.com', phone: '9'.repeat(50) });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('não permite submissão apenas com campos não obrigatórios', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua A' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('permite submeter várias vezes seguidas', () => {
    setup();
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('aceita caracteres especiais em todos os campos', () => {
    setup();
    fillRequiredFields({ name: 'Éçãõ!@#$', email: 'teste@exemplo.com', phone: '+55(11)99999-9999' });
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua !@#$%' } });
    fireEvent.change(screen.getByLabelText(/número/i), { target: { value: '*&^%' } });
    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: 'Bairro #$%' } });
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'Cidade !@#' } });
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'SP' } });
    fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: 'Obs: @@@@' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });
});
