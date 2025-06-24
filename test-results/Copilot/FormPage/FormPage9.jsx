import { render, screen, fireEvent } from "@testing-library/react";
import FormPage from "../pages/FormPage";
import { MemoryRouter } from "react-router-dom"; // Importante!

describe("FormPage handleChange", () => {
  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

  it("atualiza o campo name corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "João Silva", name: "name", type: "text" } });
    expect(input.value).toBe("João Silva");
  });

  it("atualiza o campo email corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "joao@email.com", name: "email", type: "text" } });
    expect(input.value).toBe("joao@email.com");
  });

  it("atualiza o campo phone corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/telefone/i);
    fireEvent.change(input, { target: { value: "11999999999", name: "phone", type: "tel" } });
    expect(input.value).toBe("11999999999");
  });

  it("atualiza o campo birthDate corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/data de nascimento/i);
    fireEvent.change(input, { target: { value: "2000-01-01", name: "birthDate", type: "date" } });
    expect(input.value).toBe("2000-01-01");
  });

  it("atualiza o campo gender corretamente", () => {
    renderWithRouter(<FormPage />);
    const select = screen.getByLabelText(/sexo/i);
    fireEvent.change(select, { target: { value: "female", name: "gender" } }); // Remova type
    expect(select.value).toBe("female");
  });

  it("atualiza o campo comments corretamente", () => {
    renderWithRouter(<FormPage />);
    const textarea = screen.getByLabelText(/observações/i);
    fireEvent.change(textarea, { target: { value: "Alguma observação", name: "comments" } }); // Remova type
    expect(textarea.value).toBe("Alguma observação");
  });

  it("atualiza o campo address.street corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "Rua das Flores", name: "address.street", type: "text" } });
    expect(input.value).toBe("Rua das Flores");
  });

  it("atualiza o campo address.number corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/número/i);
    fireEvent.change(input, { target: { value: "123", name: "address.number", type: "text" } });
    expect(input.value).toBe("123");
  });

  it("atualiza o campo address.neighborhood corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/bairro/i);
    fireEvent.change(input, { target: { value: "Centro", name: "address.neighborhood", type: "text" } });
    expect(input.value).toBe("Centro");
  });

  it("atualiza o campo address.city corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/cidade/i);
    fireEvent.change(input, { target: { value: "São Paulo", name: "address.city", type: "text" } });
    expect(input.value).toBe("São Paulo");
  });

  it("atualiza o campo address.state corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/estado/i);
    fireEvent.change(input, { target: { value: "SP", name: "address.state", type: "text" } });
    expect(input.value).toBe("SP");
  });

  it("atualiza o campo termsAccepted (checkbox) corretamente", () => {
    renderWithRouter(<FormPage />);
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("atualiza campos obrigatórios para string vazia", () => {
    renderWithRouter(<FormPage />);
    const nameInput = screen.getByLabelText(/nome completo/i);
    fireEvent.change(nameInput, { target: { value: "", name: "name", type: "text" } });
    expect(nameInput.value).toBe("");
  });

  it("atualiza campo com string longa", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    const longString = "a".repeat(1000);
    fireEvent.change(input, { target: { value: longString, name: "name", type: "text" } });
    expect(input.value).toBe(longString);
  });

  it("atualiza campo de texto com número", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "12345", name: "name", type: "text" } });
    expect(input.value).toBe("12345");
  });

  it("atualiza campo de endereço com valor vazio", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "", name: "address.street", type: "text" } });
    expect(input.value).toBe("");
  });
});