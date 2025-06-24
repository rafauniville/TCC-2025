import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FormPage from "../pages/FormPage";

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("FormPage handleChange", () => {
  it("atualiza campo name corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "João Silva", name: "name", type: "text" } });
    expect(input.value).toBe("João Silva");
  });

  it("atualiza campo email corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "teste@email.com", name: "email", type: "text" } });
    expect(input.value).toBe("teste@email.com");
  });

  it("atualiza campo phone corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/telefone/i);
    fireEvent.change(input, { target: { value: "11999999999", name: "phone", type: "tel" } });
    expect(input.value).toBe("11999999999");
  });

  it("atualiza campo comments corretamente", () => {
    renderWithRouter(<FormPage />);
    const textarea = screen.getByLabelText(/observações/i);
    fireEvent.change(textarea, { target: { value: "Algum comentário", name: "comments" } });
    expect(textarea.value).toBe("Algum comentário");
  });

  it("atualiza campo address.street corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "Rua das Flores", name: "address.street", type: "text" } });
    expect(input.value).toBe("Rua das Flores");
  });

  it("atualiza campo address.number corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/número/i);
    fireEvent.change(input, { target: { value: "123", name: "address.number", type: "text" } });
    expect(input.value).toBe("123");
  });

  it("atualiza campo address.neighborhood corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/bairro/i);
    fireEvent.change(input, { target: { value: "Centro", name: "address.neighborhood", type: "text" } });
    expect(input.value).toBe("Centro");
  });

  it("atualiza campo address.city corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/cidade/i);
    fireEvent.change(input, { target: { value: "São Paulo", name: "address.city", type: "text" } });
    expect(input.value).toBe("São Paulo");
  });

  it("atualiza campo address.state corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/estado/i);
    fireEvent.change(input, { target: { value: "SP", name: "address.state", type: "text" } });
    expect(input.value).toBe("SP");
  });

  it("atualiza campo gender corretamente", () => {
    renderWithRouter(<FormPage />);
    const select = screen.getByLabelText(/sexo/i);
    fireEvent.change(select, { target: { value: "female", name: "gender" } });
    expect(select.value).toBe("female");
  });

  it("marca e desmarca checkbox termsAccepted corretamente", () => {
    renderWithRouter(<FormPage />);
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("atualiza campo para string vazia", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "", name: "name", type: "text" } });
    expect(input.value).toBe("");
  });

  it("atualiza campo com string longa", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    const longString = "a".repeat(1000);
    fireEvent.change(input, { target: { value: longString, name: "name", type: "text" } });
    expect(input.value).toBe(longString);
  });

  it("atualiza múltiplos campos rapidamente", () => {
    renderWithRouter(<FormPage />);
    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/telefone/i);
    fireEvent.change(nameInput, { target: { value: "Maria", name: "name", type: "text" } });
    fireEvent.change(emailInput, { target: { value: "maria@email.com", name: "email", type: "text" } });
    fireEvent.change(phoneInput, { target: { value: "123456", name: "phone", type: "tel" } });
    expect(nameInput.value).toBe("Maria");
    expect(emailInput.value).toBe("maria@email.com");
    expect(phoneInput.value).toBe("123456");
  });
});