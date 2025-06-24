import { render, screen, fireEvent } from "@testing-library/react";
import FormPage from "../pages/FormPage";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("FormPage handleChange", () => {
  it("should update name field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "João Silva", name: "name", type: "text" } });
    expect(input.value).toBe("João Silva");
  });

  it("should update email field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "joao@email.com", name: "email", type: "text" } });
    expect(input.value).toBe("joao@email.com");
  });

  it("should update phone field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/telefone/i);
    fireEvent.change(input, { target: { value: "11999999999", name: "phone", type: "tel" } });
    expect(input.value).toBe("11999999999");
  });

  it("should update birthDate field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/data de nascimento/i);
    fireEvent.change(input, { target: { value: "2000-01-01", name: "birthDate", type: "date" } });
    expect(input.value).toBe("2000-01-01");
  });

  it("should update gender field on change", () => {
    renderWithRouter(<FormPage />);
    const select = screen.getByLabelText(/sexo/i);
    fireEvent.change(select, { target: { value: "female", name: "gender" } });
    expect(select.value).toBe("female");
  });

  it("should update address.street field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "Rua das Flores", name: "address.street", type: "text" } });
    expect(input.value).toBe("Rua das Flores");
  });

  it("should update address.number field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/número/i);
    fireEvent.change(input, { target: { value: "123", name: "address.number", type: "text" } });
    expect(input.value).toBe("123");
  });

  it("should update address.neighborhood field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/bairro/i);
    fireEvent.change(input, { target: { value: "Centro", name: "address.neighborhood", type: "text" } });
    expect(input.value).toBe("Centro");
  });

  it("should update address.city field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/cidade/i);
    fireEvent.change(input, { target: { value: "São Paulo", name: "address.city", type: "text" } });
    expect(input.value).toBe("São Paulo");
  });

  it("should update address.state field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/estado/i);
    fireEvent.change(input, { target: { value: "SP", name: "address.state", type: "text" } });
    expect(input.value).toBe("SP");
  });

  it("should update termsAccepted checkbox on change", () => {
    renderWithRouter(<FormPage />);
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("should update comments textarea on change", () => {
    renderWithRouter(<FormPage />);
    const textarea = screen.getByLabelText(/observações/i);
    fireEvent.change(textarea, { target: { value: "Alguma observação", name: "comments" } });
    expect(textarea.value).toBe("Alguma observação");
  });

  it("should update field to empty string when cleared", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "Teste", name: "name", type: "text" } });
    expect(input.value).toBe("Teste");
    fireEvent.change(input, { target: { value: "", name: "name", type: "text" } });
    expect(input.value).toBe("");
  });

  it("should update email field with invalid email (validation is on submit)", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "invalid-email", name: "email", type: "text" } });
    expect(input.value).toBe("invalid-email");
  });

  it("should not break if address field is empty string", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "", name: "address.street", type: "text" } });
    expect(input.value).toBe("");
  });
});