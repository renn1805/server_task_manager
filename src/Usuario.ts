import Tarefa from "./Tarefa";

export default class Usuario {

    static #contadorId = 1000

    #idUsuario: number
    get idUsuario() {
        return this.#idUsuario
    }


    #nomeUsuario: string;
    get nomeUsuario() {
        return this.#nomeUsuario
    }

    #emailUsuario: string;
    get emailUsuario() {
        return this.#emailUsuario
    }

    #senhaUsuario: string;

    #profissaoUsuario?: string | undefined;
    get profissaoUsuario() {
        return this.#profissaoUsuario
    }
    set mudarProfissaoUsuario(novaProfissão: string) {
        this.#profissaoUsuario = novaProfissão
    }

    #tarefasUsuario: Tarefa[] = []
    get tarefasUsuario() {
        return this.#tarefasUsuario
    }


    constructor(nome: string, email: string, senha: string, profissao?: string) {
        Usuario.#contadorId++

        this.#idUsuario = Usuario.#contadorId
        this.#nomeUsuario = nome.toLowerCase();
        this.#emailUsuario = email.toLowerCase();
        this.#senhaUsuario = senha;
        this.#profissaoUsuario = profissao
    };

    compararSenha(senhaComparacao: string): Boolean {
        if (this.#senhaUsuario === senhaComparacao) {
            return true
        } else {
            return false
        }
    }

    compararId(idComparacao: number): boolean {
        if (this.#idUsuario === idComparacao) {
            return true
        } else {
            return false
        }
    }


    toJSON() {
        return {
            id: this.#idUsuario,
            nome: this.#nomeUsuario,
            email: this.#emailUsuario,
            profissao: this.profissaoUsuario != undefined ? this.#profissaoUsuario : "Sem profissão registrada",
            tarefas: this.tarefasUsuario
        }
    }

}

export let listaUsuarios: Usuario[] = [
    new Usuario(
        "Renan Almeida de Araujo",
        "renan.almeida.arau@gmail.com",
        "12345678",
        "Engenheiro de software",
    )
]