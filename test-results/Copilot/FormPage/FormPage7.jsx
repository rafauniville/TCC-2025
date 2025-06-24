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
    fireEvent.change(input, { target: { value: "João da Silva" } });
    expect(input.value).toBe("João da Silva");
  });

  it("should update email field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "joao@email.com" } });
    expect(input.value).toBe("joao@email.com");
  });

  it("should update phone field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/telefone/i);
    fireEvent.change(input, { target: { value: "11999999999" } });
    expect(input.value).toBe("11999999999");
  });

  it("should update gender field on change", () => {
    renderWithRouter(<FormPage />);
    const select = screen.getByLabelText(/sexo/i);
    fireEvent.change(select, { target: { value: "female" } });
    expect(select.value).toBe("female");
  });

  it("should update comments field on change", () => {
    renderWithRouter(<FormPage />);
    const textarea = screen.getByLabelText(/observações/i);
    fireEvent.change(textarea, { target: { value: "Alguma observação" } });
    expect(textarea.value).toBe("Alguma observação");
  });

  it("should update address.street field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "Rua das Flores" } });
    expect(input.value).toBe("Rua das Flores");
  });

  it("should update address.number field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/número/i);
    fireEvent.change(input, { target: { value: "123" } });
    expect(input.value).toBe("123");
  });

  it("should update address.neighborhood field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/bairro/i);
    fireEvent.change(input, { target: { value: "Centro" } });
    expect(input.value).toBe("Centro");
  });

  it("should update address.city field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/cidade/i);
    fireEvent.change(input, { target: { value: "São Paulo" } });
    expect(input.value).toBe("São Paulo");
  });

  it("should update address.state field on change", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/estado/i);
    fireEvent.change(input, { target: { value: "SP" } });
    expect(input.value).toBe("SP");
  });

  it("should update termsAccepted checkbox on change", () => {
    renderWithRouter(<FormPage />);
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("should handle empty string in required fields", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "" } });
    expect(input.value).toBe("");
  });

  it("should handle long string in name field", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    const longName = "A".repeat(200);
    fireEvent.change(input, { target: { value: longName } });
    expect(input.value).toBe(longName);
  });

  it("should allow numbers in name field (no validation in handleChange)", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "12345" } });
    expect(input.value).toBe("12345");
  });

  it("should allow special characters in address fields", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "@!#%$" } });
    expect(input.value).toBe("@!#%$");
  });
});