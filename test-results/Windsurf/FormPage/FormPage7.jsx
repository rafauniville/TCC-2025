import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';
import { describe, it, expect, beforeEach } from 'vitest';

// Função auxiliar para preencher o formulário
function fillForm({
  name = 'João Silva',
  email = 'joao@email.com',
  phone = '11999999999',
  birthDate = '2000-01-01',
  gender = 'male',
  termsAccepted = true,
  address = {},
  comments = ''
} = {}) {
  fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: phone } });
  fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: birthDate } });
  fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: gender } });
  fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: address.street || '' } });
  fireEvent.change(screen.getByLabelText(/número/i), { target: { value: address.number || '' } });
  fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: address.neighborhood || '' } });
  fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: address.city || '' } });
  fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: address.state || '' } });
  fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: comments } });
  const checkbox = screen.getByLabelText(/aceito os termos/i);
  if (checkbox.checked !== termsAccepted) {
    fireEvent.click(checkbox);
  }
}

describe('FormPage', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
  });

  it('renderiza todos os campos do formulário', () => {
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

  it('envia o formulário com dados válidos', () => {
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    // Após envio bem-sucedido, campos obrigatórios devem ser limpos
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/você deve aceitar/i)).not.toBeInTheDocument();
  });

  it('exibe erro se campos obrigatórios não forem preenchidos', () => {
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios devem ser preenchidos/i)).toBeInTheDocument();
  });

  it('exibe erro para email inválido', () => {
    fillForm({ email: 'emailinvalido', termsAccepted: true });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });

  it('exibe erro se os termos não forem aceitos', () => {
    fillForm({ termsAccepted: false });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/você deve aceitar os termos/i)).toBeInTheDocument();
  });

  it('permite preencher campos opcionais e enviar', () => {
    fillForm({
      address: {
        street: 'Rua A',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP'
      },
      comments: 'Alguma observação'
    });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByLabelText(/rua/i)).toHaveValue('');
    expect(screen.getByLabelText(/observações/i)).toHaveValue('');
  });

  it('testa limites: nome com 1 caractere', () => {
    fillForm({ name: 'A' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('testa telefone com poucos dígitos', () => {
    fillForm({ phone: '1' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('testa data de nascimento extrema', () => {
    fillForm({ birthDate: '1900-01-01' });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('preenche apenas campos opcionais e tenta enviar', () => {
    fillForm({
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '',
      termsAccepted: false,
      address: {
        street: 'Rua B',
        number: '456',
        neighborhood: 'Bairro',
        city: 'Cidade',
        state: 'UF'
      },
      comments: 'Só comentário'
    });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios devem ser preenchidos/i)).toBeInTheDocument();
  });

  it('preenche endereço parcialmente', () => {
    fillForm({
      address: {
        street: 'Rua C',
        number: '',
        neighborhood: '',
        city: '',
        state: ''
      }
    });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    // Não deve impedir envio se campos obrigatórios estão preenchidos
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('preenche observações com texto longo', () => {
    fillForm({ comments: 'a'.repeat(1000) });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByLabelText(/observações/i)).toHaveValue('');
  });

  it('navega para o login pelo link', () => {
    const link = screen.getByRole('link', { name: /voltar para o login/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/');
  });
});
