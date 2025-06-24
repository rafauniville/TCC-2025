import { render, screen, fireEvent } from "@testing-library/react";
import FormPage from "../pages/FormPage";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";

describe("FormPage handleChange", () => {
  it("atualiza o campo name corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "João da Silva" } });
    expect(input).toHaveValue("João da Silva");
  });

  it("atualiza o campo email corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: "teste@email.com" } });
    expect(input).toHaveValue("teste@email.com");
  });

  it("atualiza o campo phone corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/telefone/i);
    fireEvent.change(input, { target: { value: "11999999999" } });
    expect(input).toHaveValue("11999999999");
  });

  it("atualiza o campo birthDate corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/data de nascimento/i);
    fireEvent.change(input, { target: { value: "2000-01-01" } });
    expect(input).toHaveValue("2000-01-01");
  });

  it("atualiza o campo gender corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const select = screen.getByLabelText(/sexo/i);
    fireEvent.change(select, { target: { value: "female" } });
    expect(select).toHaveValue("female");
  });

  it("atualiza o campo address.street corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/rua/i);
    fireEvent.change(input, { target: { value: "Rua das Flores" } });
    expect(input).toHaveValue("Rua das Flores");
  });

  it("atualiza o campo address.number corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/número/i);
    fireEvent.change(input, { target: { value: "123" } });
    expect(input).toHaveValue("123");
  });

  it("atualiza o campo address.neighborhood corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/bairro/i);
    fireEvent.change(input, { target: { value: "Centro" } });
    expect(input).toHaveValue("Centro");
  });

  it("atualiza o campo address.city corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/cidade/i);
    fireEvent.change(input, { target: { value: "São Paulo" } });
    expect(input).toHaveValue("São Paulo");
  });

  it("atualiza o campo address.state corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/estado/i);
    fireEvent.change(input, { target: { value: "SP" } });
    expect(input).toHaveValue("SP");
  });

  it("marca e desmarca o checkbox termsAccepted corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const checkbox = screen.getByLabelText(/aceito os termos/i);
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("atualiza o campo comments corretamente", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const textarea = screen.getByLabelText(/observações/i);
    fireEvent.change(textarea, { target: { value: "Alguma observação importante." } });
    expect(textarea).toHaveValue("Alguma observação importante.");
  });

  it("atualiza campos com valores vazios", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/nome completo/i);
    fireEvent.change(input, { target: { value: "Teste" } });
    expect(input).toHaveValue("Teste");
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue("");
  });

  it("atualiza campos com valores longos", () => {
    render(
      <MemoryRouter>
        <FormPage />
      </MemoryRouter>
    );
    const input = screen.getByLabelText(/nome completo/i);
    const longString = "a".repeat(200);
    fireEvent.change(input, { target: { value: longString } });
    expect(input).toHaveValue(longString);
  });
});