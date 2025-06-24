import { render, screen, fireEvent } from "@testing-library/react";
import FormPage from "../pages/FormPage";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

describe("FormPage handleChange", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
  });

  it("should update name field on change", () => {
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "João da Silva" } });
    expect(input.value).toBe("João da Silva");
  });

  it("should update email field on change", () => {
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "joao@email.com" } });
    expect(input.value).toBe("joao@email.com");
  });

  it("should update phone field on change", () => {
    const input = screen.getByLabelText(/telefone/i);
    fireEvent.change(input, { target: { value: "11999999999" } });
    expect(input.value).toBe("11999999999");
  });

  it("should update birthDate field on change", () => {
    const input = screen.getByLabelText(/data de nascimento/i);
    fireEvent.change(input, { target: { value: "2000-01-01" } });
    expect(input.value).toBe("2000-01-01");
  });

  it("should update gender field on change", () => {
    const select = screen.getByLabelText(/sexo/i);
    fireEvent.change(select, { target: { value: "female" } });
    expect(select.value).toBe("female");
  });

  it("should update comments field on change", () => {
    const textarea = screen.getByLabelText(/observações/i);
    fireEvent.change(textarea, { target: { value: "Algum comentário" } });
    expect(textarea.value).toBe("Algum comentário");
  });

  it("should update address.street field on change", () => {
    const input = screen.getByLabelText(/^rua:/i);
    fireEvent.change(input, { target: { value: "Rua das Flores" } });
    expect(input.value).toBe("Rua das Flores");
  });

  it("should update address.number field on change", () => {
    const input = screen.getByLabelText(/^número:/i);
    fireEvent.change(input, { target: { value: "123" } });
    expect(input.value).toBe("123");
  });

  it("should update address.neighborhood field on change", () => {
    const input = screen.getByLabelText(/^bairro:/i);
    fireEvent.change(input, { target: { value: "Centro" } });
    expect(input.value).toBe("Centro");
  });

  it("should update address.city field on change", () => {
    const input = screen.getByLabelText(/^cidade:/i);
    fireEvent.change(input, { target: { value: "São Paulo" } });
    expect(input.value).toBe("São Paulo");
  });

  it("should update address.state field on change", () => {
    const input = screen.getByLabelText(/^estado:/i);
    fireEvent.change(input, { target: { value: "SP" } });
    expect(input.value).toBe("SP");
  });

  it("should toggle termsAccepted checkbox", () => {
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("should update name field to empty string", () => {
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "" } });
    expect(input.value).toBe("");
  });

  it("should update comments field with a long string", () => {
    const textarea = screen.getByLabelText(/observações/i);
    const longText = "a".repeat(1000);
    fireEvent.change(textarea, { target: { value: longText } });
    expect(textarea.value).toBe(longText);
  });

  it("should update address.number with non-numeric value", () => {
    const input = screen.getByLabelText(/^número:/i);
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input.value).toBe("abc");
  });
});