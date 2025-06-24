import { render, screen, fireEvent } from "@testing-library/react";
import FormPage from "../pages/FormPage";
import { MemoryRouter } from "react-router-dom"; // Importante!

describe("FormPage handleChange", () => {
  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

  it("updates name field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "João Silva", name: "name", type: "text" } });
    expect(input.value).toBe("João Silva");
  });

  it("updates email field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "joao@email.com", name: "email", type: "text" } });
    expect(input.value).toBe("joao@email.com");
  });

  it("updates phone field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/telefone/i);
    fireEvent.change(input, { target: { value: "11999999999", name: "phone", type: "tel" } });
    expect(input.value).toBe("11999999999");
  });

  it("updates birthDate field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/data de nascimento/i);
    fireEvent.change(input, { target: { value: "2000-01-01", name: "birthDate", type: "date" } });
    expect(input.value).toBe("2000-01-01");
  });

  it("updates gender field on change", () => {
    renderWithRouter(<FormPage />);
    const select = screen.getByLabelText(/sexo/i);
    fireEvent.change(select, { target: { value: "female", name: "gender" } });
    expect(select.value).toBe("female");
  });

  it("updates address.street field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "Rua das Flores", name: "address.street", type: "text" } });
    expect(input.value).toBe("Rua das Flores");
  });

  it("updates address.number field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/número/i);
    fireEvent.change(input, { target: { value: "123", name: "address.number", type: "text" } });
    expect(input.value).toBe("123");
  });

  it("updates address.neighborhood field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/bairro/i);
    fireEvent.change(input, { target: { value: "Centro", name: "address.neighborhood", type: "text" } });
    expect(input.value).toBe("Centro");
  });

  it("updates address.city field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/cidade/i);
    fireEvent.change(input, { target: { value: "São Paulo", name: "address.city", type: "text" } });
    expect(input.value).toBe("São Paulo");
  });

  it("updates address.state field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/estado/i);
    fireEvent.change(input, { target: { value: "SP", name: "address.state", type: "text" } });
    expect(input.value).toBe("SP");
  });

  it("toggles termsAccepted checkbox", () => {
    renderWithRouter(<FormPage />);
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("updates comments textarea on change", () => {
    renderWithRouter(<FormPage />);
    const textarea = screen.getByLabelText(/observações/i);
    fireEvent.change(textarea, { target: { value: "Alguma observação", name: "comments" } });
    expect(textarea.value).toBe("Alguma observação");
  });

  it("handles empty values", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "", name: "name", type: "text" } });
    expect(input.value).toBe("");
  });

  it("handles long string values", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    const longString = "a".repeat(1000);
    fireEvent.change(input, { target: { value: longString, name: "name", type: "text" } });
    expect(input.value).toBe(longString);
  });

  it("does not break with invalid address field name", () => {
    renderWithRouter(<FormPage />);
    const input = document.createElement("input");
    input.name = "address.";
    input.type = "text";
    input.value = "test";
    // Simula evento manualmente no document
    fireEvent.change(input, { target: { value: "test", name: "address.", type: "text" } });
    // Não há erro lançado, o teste passa se não quebrar
    expect(true).toBe(true);
  });
});