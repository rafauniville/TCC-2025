import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';

// Helper para renderizar com router
const renderWithRouter = (ui) => render(ui, { wrapper: MemoryRouter });

describe('FormPage', () => {
  const fillForm = (overrides = {}) => {
    const values = {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      birthDate: '2000-01-01',
      gender: 'male',
      street: 'Rua A',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      termsAccepted: true,
      comments: 'Nenhuma',
      ...overrides,
    };
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: values.name } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: values.email } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: values.phone } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: values.birthDate } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: values.gender } });
    fireEvent.change(screen.getByLabelText(/rua:/i), { target: { value: values.street } });
    fireEvent.change(screen.getByLabelText(/número:/i), { target: { value: values.number } });
    fireEvent.change(screen.getByLabelText(/bairro:/i), { target: { value: values.neighborhood } });
    fireEvent.change(screen.getByLabelText(/cidade:/i), { target: { value: values.city } });
    fireEvent.change(screen.getByLabelText(/estado:/i), { target: { value: values.state } });
    if (values.termsAccepted) fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: values.comments } });
    return values;
  };

  it('renderiza todos os campos do formulário', () => {
    renderWithRouter(<FormPage />);
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sexo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rua:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bairro:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cidade:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estado:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aceito os termos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/observações/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para o login/i })).toBeInTheDocument();
  });

  it('submete o formulário com sucesso e limpa os campos', () => {
    renderWithRouter(<FormPage />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/telefone/i)).toHaveValue('');
    expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue('');
    expect(screen.getByLabelText(/sexo/i)).toHaveValue('');
    expect(screen.getByLabelText(/rua:/i)).toHaveValue('');
    expect(screen.getByLabelText(/número:/i)).toHaveValue('');
    expect(screen.getByLabelText(/bairro:/i)).toHaveValue('');
    expect(screen.getByLabelText(/cidade:/i)).toHaveValue('');
    expect(screen.getByLabelText(/estado:/i)).toHaveValue('');
    expect(screen.getByLabelText(/aceito os termos/i)).not.toBeChecked();
    expect(screen.getByLabelText(/observações/i)).toHaveValue('');
  });

  it('exibe erro se campos obrigatórios não forem preenchidos', () => {
    renderWithRouter(<FormPage />);
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('exibe erro para email inválido', () => {
    renderWithRouter(<FormPage />);
    fillForm({ email: 'invalido' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });

  it('exibe erro se termos não forem aceitos', () => {
    renderWithRouter(<FormPage />);
    fillForm({ termsAccepted: false });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/você deve aceitar os termos/i)).toBeInTheDocument();
  });

  it('permite preencher apenas campos opcionais sem erro', () => {
    renderWithRouter(<FormPage />);
    fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: 'Teste' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('preenche endereço parcialmente e submete', () => {
    renderWithRouter(<FormPage />);
    fillForm({ street: 'Rua X', number: '', neighborhood: '', city: '', state: '' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    // Não deve mostrar erro, pois endereço não é obrigatório
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/você deve aceitar os termos/i)).not.toBeInTheDocument();
  });

  it('testa limites de valores nos campos', () => {
    renderWithRouter(<FormPage />);
    fillForm({ name: 'A', phone: '1', comments: 'x'.repeat(1000) });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });

  it('testa edge case: todos preenchidos menos um obrigatório', () => {
    renderWithRouter(<FormPage />);
    fillForm({ name: '' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });
});
