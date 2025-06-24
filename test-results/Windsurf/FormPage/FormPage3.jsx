import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';
import { describe, it, expect, beforeEach } from 'vitest';

// Helper para renderizar com router
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

  function fillRequiredFields({
    name = 'João',
    email = 'joao@email.com',
    phone = '11999999999',
    birthDate = '2000-01-01',
    gender = 'male',
    terms = true,
  } = {}) {
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: name } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: phone } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: birthDate } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: gender } });
    if (terms) {
      fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    }
  }

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
  });

  it('deve permitir preencher e submeter o formulário corretamente', () => {
    fillRequiredFields();
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua A' } });
    fireEvent.change(screen.getByLabelText(/número/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: 'Centro' } });
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: 'SP' } });
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: 'SP' } });
    fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: 'Teste' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/telefone/i)).toHaveValue('');
    expect(screen.getByLabelText(/rua/i)).toHaveValue('');
    expect(screen.getByLabelText(/observações/i)).toHaveValue('');
  });

  it('deve exibir erro se submeter sem preencher campos obrigatórios', () => {
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('deve exibir erro se email for inválido', () => {
    fillRequiredFields({ email: 'emailinvalido', terms: true });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });

  it('deve exibir erro se não aceitar os termos', () => {
    fillRequiredFields({ terms: false });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/você deve aceitar os termos/i)).toBeInTheDocument();
  });

  it('deve aceitar valores mínimos nos campos obrigatórios', () => {
    fillRequiredFields({ name: 'A', email: 'a@a.com', phone: '1', birthDate: '1900-01-01', gender: 'female' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
  });

  it('deve permitir caracteres especiais nos campos', () => {
    fillRequiredFields({ name: 'João!@#', email: 'joao+test@email.com', phone: '(*&^%$#@!', gender: 'other' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });

  it('deve permitir submeter apenas com campos obrigatórios preenchidos', () => {
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });

  it('deve manter campos de endereço vazios se não preenchidos', () => {
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByLabelText(/rua/i)).toHaveValue('');
    expect(screen.getByLabelText(/número/i)).toHaveValue('');
    expect(screen.getByLabelText(/bairro/i)).toHaveValue('');
    expect(screen.getByLabelText(/cidade/i)).toHaveValue('');
    expect(screen.getByLabelText(/estado/i)).toHaveValue('');
  });

  it('deve exibir erro se campos obrigatórios tiverem apenas espaços', () => {
    fillRequiredFields({ name: '   ', email: '   ', phone: '   ', birthDate: '', gender: '' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('deve permitir datas extremas válidas', () => {
    fillRequiredFields({ birthDate: '2025-06-05' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });
});
