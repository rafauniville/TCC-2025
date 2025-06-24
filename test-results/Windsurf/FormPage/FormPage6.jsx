import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormPage from '../pages/FormPage';

describe('FormPage', () => {
  const fillAndSubmit = ({
    name = 'João',
    email = 'joao@email.com',
    phone = '123456789',
    birthDate = '2000-01-01',
    gender = 'male',
    street = 'Rua A',
    number = '123',
    neighborhood = 'Centro',
    city = 'Cidade',
    state = 'SP',
    termsAccepted = true,
    comments = 'Teste',
    fillAddress = true,
    fillComments = true,
    acceptTerms = true,
  } = {}) => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    if (name) fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: name } });
    if (email) fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
    if (phone) fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: phone } });
    if (birthDate) fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: birthDate } });
    if (gender) fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: gender } });
    if (fillAddress) {
      fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: street } });
      fireEvent.change(screen.getByLabelText(/número/i), { target: { value: number } });
      fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: neighborhood } });
      fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: city } });
      fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: state } });
    }
    if (fillComments) {
      fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: comments } });
    }
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    if (acceptTerms && !checkbox.checked) fireEvent.click(checkbox);
    if (!acceptTerms && checkbox.checked) fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
  };

  it('envia com sucesso quando todos os campos obrigatórios estão preenchidos', () => {
    fillAndSubmit();
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/você deve aceitar/i)).not.toBeInTheDocument();
    // Campos devem ser resetados
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
  });

  it('exibe erro se campos obrigatórios não são preenchidos', () => {
    render(<MemoryRouter><FormPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('exibe erro se email é inválido', () => {
    fillAndSubmit({ email: 'emailinvalido' });
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });

  it('exibe erro se termos não são aceitos', () => {
    fillAndSubmit({ acceptTerms: false });
    expect(screen.getByText(/você deve aceitar/i)).toBeInTheDocument();
  });

  it('permite preencher endereço parcialmente sem erro', () => {
    fillAndSubmit({ street: 'Rua B', fillAddress: true });
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('permite preencher apenas campos obrigatórios', () => {
    fillAndSubmit({ fillAddress: false, fillComments: false });
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('exibe erro se apenas campos não obrigatórios são preenchidos', () => {
    render(<MemoryRouter><FormPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: 'Rua C' } });
    fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: 'Obs' } });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
  });

  it('aceita valores mínimos nos campos', () => {
    fillAndSubmit({ name: 'A', phone: '1', email: 'a@a.com' });
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('aceita texto longo em observações', () => {
    const longText = 'a'.repeat(1000);
    fillAndSubmit({ comments: longText });
    expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
  });

  it('permite marcar e desmarcar o checkbox de termos', () => {
    render(<MemoryRouter><FormPage /></MemoryRouter>);
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('mantém os campos de endereço com valores independentes', () => {
    render(<MemoryRouter><FormPage /></MemoryRouter>);
    const rua = screen.getByLabelText(/rua/i);
    const numero = screen.getByLabelText(/número/i);
    fireEvent.change(rua, { target: { value: 'Rua XPTO' } });
    fireEvent.change(numero, { target: { value: '999' } });
    expect(rua).toHaveValue('Rua XPTO');
    expect(numero).toHaveValue('999');
  });
});
