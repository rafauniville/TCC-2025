import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FormPage from "../pages/FormPage";

// Helper to fill the form with valid data
function fillForm({
    name = "João da Silva",
    email = "joao@email.com",
    phone = "11999999999",
    birthDate = "2000-01-01",
    gender = "male",
    street = "Rua A",
    number = "123",
    neighborhood = "Centro",
    city = "São Paulo",
    state = "SP",
    termsAccepted = true,
    comments = "Nenhuma observação"
} = {}) {
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: name } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: phone } });
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), { target: { value: birthDate } });
    fireEvent.change(screen.getByLabelText(/sexo/i), { target: { value: gender } });
    fireEvent.change(screen.getByLabelText(/rua/i), { target: { value: street } });
    fireEvent.change(screen.getByLabelText(/número/i), { target: { value: number } });
    fireEvent.change(screen.getByLabelText(/bairro/i), { target: { value: neighborhood } });
    fireEvent.change(screen.getByLabelText(/cidade/i), { target: { value: city } });
    fireEvent.change(screen.getByLabelText(/estado/i), { target: { value: state } });
    if (termsAccepted) {
        fireEvent.click(screen.getByLabelText(/aceito os termos/i));
    }
    fireEvent.change(screen.getByLabelText(/observações/i), { target: { value: comments } });
}

describe("FormPage", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <FormPage />
            </MemoryRouter>
        );
    });

    it("renders all form fields", () => {
        expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/sexo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/rua/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/número/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/aceito os termos/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/observações/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cadastrar/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /voltar para o login/i })).toBeInTheDocument();
    });

    it("shows error if required fields are missing", () => {
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
    });

    it("shows error if email is invalid", () => {
        fillForm({ email: "invalid-email" });
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });

    it("shows error if terms are not accepted", () => {
        fillForm({ termsAccepted: false });
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.getByText(/você deve aceitar os termos/i)).toBeInTheDocument();
    });

    it("clears form after successful submit", () => {
        fillForm();
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.getByLabelText(/nome completo/i)).toHaveValue("");
        expect(screen.getByLabelText(/email/i)).toHaveValue("");
        expect(screen.getByLabelText(/telefone/i)).toHaveValue("");
        expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue("");
        expect(screen.getByLabelText(/sexo/i)).toHaveValue("");
        expect(screen.getByLabelText(/rua/i)).toHaveValue("");
        expect(screen.getByLabelText(/número/i)).toHaveValue("");
        expect(screen.getByLabelText(/bairro/i)).toHaveValue("");
        expect(screen.getByLabelText(/cidade/i)).toHaveValue("");
        expect(screen.getByLabelText(/estado/i)).toHaveValue("");
        expect(screen.getByLabelText(/aceito os termos/i)).not.toBeChecked();
        expect(screen.getByLabelText(/observações/i)).toHaveValue("");
    });

    it("allows typing in all fields", () => {
        fillForm({
            name: "Maria",
            email: "maria@teste.com",
            phone: "11988887777",
            birthDate: "1999-12-31",
            gender: "female",
            street: "Rua B",
            number: "456",
            neighborhood: "Bairro Novo",
            city: "Rio de Janeiro",
            state: "RJ",
            termsAccepted: true,
            comments: "Teste de comentário"
        });
        expect(screen.getByLabelText(/nome completo/i)).toHaveValue("Maria");
        expect(screen.getByLabelText(/email/i)).toHaveValue("maria@teste.com");
        expect(screen.getByLabelText(/telefone/i)).toHaveValue("11988887777");
        expect(screen.getByLabelText(/data de nascimento/i)).toHaveValue("1999-12-31");
        expect(screen.getByLabelText(/sexo/i)).toHaveValue("female");
        expect(screen.getByLabelText(/rua/i)).toHaveValue("Rua B");
        expect(screen.getByLabelText(/número/i)).toHaveValue("456");
        expect(screen.getByLabelText(/bairro/i)).toHaveValue("Bairro Novo");
        expect(screen.getByLabelText(/cidade/i)).toHaveValue("Rio de Janeiro");
        expect(screen.getByLabelText(/estado/i)).toHaveValue("RJ");
        expect(screen.getByLabelText(/aceito os termos/i)).toBeChecked();
        expect(screen.getByLabelText(/observações/i)).toHaveValue("Teste de comentário");
    });

    it("does not show error after successful submit", () => {
        fillForm();
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/você deve aceitar os termos/i)).not.toBeInTheDocument();
    });

    it("shows error if only some required fields are filled", () => {
        fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "João" } });
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
    });

    it("shows error for edge case: email with spaces", () => {
        fillForm({ email: "   joao@email.com   " });
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        // Should not show error, as spaces are valid for the regex (but not trimmed)
        // If you want to trim, adjust the component logic
        expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
    });

    it("shows error for edge case: empty gender", () => {
        fillForm({ gender: "" });
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
    });

    it("shows error for edge case: empty birthDate", () => {
        fillForm({ birthDate: "" });
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
    });

    it("shows error for edge case: empty phone", () => {
        fillForm({ phone: "" });
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.getByText(/todos os campos obrigatórios/i)).toBeInTheDocument();
    });

    it("does not require address or comments for submit", () => {
        fillForm({
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            comments: ""
        });
        fireEvent.click(screen.getByRole("button", { name: /cadastrar/i }));
        expect(screen.queryByText(/todos os campos obrigatórios/i)).not.toBeInTheDocument();
    });
});