import { render, screen, fireEvent } from "@testing-library/react";
import FormPage from "../pages/FormPage";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("FormPage handleChange", () => {
  it("atualiza o campo name corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "João da Silva" } });
    expect(input.value).toBe("João da Silva");
  });

  it("atualiza o campo email corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "teste@email.com" } });
    expect(input.value).toBe("teste@email.com");
  });

  it("atualiza o campo phone corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/telefone/i);
    fireEvent.change(input, { target: { value: "11999999999" } });
    expect(input.value).toBe("11999999999");
  });

  it("atualiza o campo birthDate corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/data de nascimento/i);
    fireEvent.change(input, { target: { value: "2000-01-01" } });
    expect(input.value).toBe("2000-01-01");
  });

  it("atualiza o campo gender corretamente", () => {
    renderWithRouter(<FormPage />);
    const select = screen.getByLabelText(/sexo/i);
    fireEvent.change(select, { target: { value: "female" } });
    expect(select.value).toBe("female");
  });

  it("atualiza o campo comments corretamente", () => {
    renderWithRouter(<FormPage />);
    const textarea = screen.getByLabelText(/observações/i);
    fireEvent.change(textarea, { target: { value: "Algum comentário" } });
    expect(textarea.value).toBe("Algum comentário");
  });

  it("atualiza o campo address.street corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "Rua das Flores" } });
    expect(input.value).toBe("Rua das Flores");
  });

  it("atualiza o campo address.number corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/número/i);
    fireEvent.change(input, { target: { value: "123" } });
    expect(input.value).toBe("123");
  });

  it("atualiza o campo address.neighborhood corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/bairro/i);
    fireEvent.change(input, { target: { value: "Centro" } });
    expect(input.value).toBe("Centro");
  });

  it("atualiza o campo address.city corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/cidade/i);
    fireEvent.change(input, { target: { value: "São Paulo" } });
    expect(input.value).toBe("São Paulo");
  });

  it("atualiza o campo address.state corretamente", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/estado/i);
    fireEvent.change(input, { target: { value: "SP" } });
    expect(input.value).toBe("SP");
  });

  it("atualiza o campo termsAccepted corretamente (checkbox)", () => {
    renderWithRouter(<FormPage />);
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it("atualiza campos para string vazia", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "" } });
    expect(input.value).toBe("");
  });

  it("aceita valores longos/extremos", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    const longValue = "a".repeat(200);
    fireEvent.change(input, { target: { value: longValue } });
    expect(input.value).toBe(longValue);
  });

  it("aceita caracteres especiais", () => {
    renderWithRouter(<FormPage />);
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "!@#$%¨&*()" } });
    expect(input.value).toBe("!@#$%¨&*()");
  });
});