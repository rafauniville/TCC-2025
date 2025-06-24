import { render, screen, fireEvent } from "@testing-library/react";
import FormPage from "../pages/FormPage";
import { MemoryRouter } from "react-router-dom"; // Importante!
import { vi } from "vitest";

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("FormPage handleChange", () => {
  it("updates name field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "João Silva" } });
    expect(input.value).toBe("João Silva");
  });

  it("updates email field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "joao@email.com" } });
    expect(input.value).toBe("joao@email.com");
  });

  it("updates phone field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/telefone/i);
    fireEvent.change(input, { target: { value: "11999999999" } });
    expect(input.value).toBe("11999999999");
  });

  it("updates gender field on change", () => {
    renderWithRouter(<FormPage />);
    const select = screen.getByLabelText(/sexo/i);
    fireEvent.change(select, { target: { value: "female" } });
    expect(select.value).toBe("female");
  });

  it("updates comments field on change", () => {
    renderWithRouter(<FormPage />);
    const textarea = screen.getByLabelText(/observações/i);
    fireEvent.change(textarea, { target: { value: "Alguma observação" } });
    expect(textarea.value).toBe("Alguma observação");
  });

  it("updates address.street field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "Rua das Flores" } });
    expect(input.value).toBe("Rua das Flores");
  });

  it("updates address.number field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/número/i);
    fireEvent.change(input, { target: { value: "123" } });
    expect(input.value).toBe("123");
  });

  it("updates address.neighborhood field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/bairro/i);
    fireEvent.change(input, { target: { value: "Centro" } });
    expect(input.value).toBe("Centro");
  });

  it("updates address.city field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/cidade/i);
    fireEvent.change(input, { target: { value: "São Paulo" } });
    expect(input.value).toBe("São Paulo");
  });

  it("updates address.state field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/estado/i);
    fireEvent.change(input, { target: { value: "SP" } });
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

  it("handles empty values", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "" } });
    expect(input.value).toBe("");
  });

  it("handles long values", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    const longValue = "a".repeat(1000);
    fireEvent.change(input, { target: { value: longValue } });
    expect(input.value).toBe(longValue);
  });

  it("handles invalid email format (no validation on change)", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "invalid-email" } });
    expect(input.value).toBe("invalid-email");
  });

  it("handles address fields with dot in name", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "Rua Teste" } });
    expect(input.value).toBe("Rua Teste");
  });
});