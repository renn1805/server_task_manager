import Tarefa, { DificuldadeTarefa, StatusTarefa} from "./Tarefa";

export default class Usuario {
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
    set mudarProfissaoUsuario(novaProfissão: string){
        this.#profissaoUsuario = novaProfissão
    }

    #tarefasUsuario: Tarefa[] = [new Tarefa(
        "Funcionalidades das contagens",
        "Criar os eventos que vão ser disparados quando o usuario clicar no conteiner da contagem.",
        StatusTarefa.EmProgresso,
        DificuldadeTarefa.Medio
    )]
    get tarefasUsuario () {
        return this.#tarefasUsuario
    }


    constructor(nome: string, email: string, senha: string, profissao?: string) {
        this.#nomeUsuario = nome.toLowerCase();
        this.#emailUsuario = email.toLowerCase();
        this.#senhaUsuario = senha;
        this.#profissaoUsuario = profissao
    };

    compararSenha(senhaComparacao: string): Boolean {
        if (this.#senhaUsuario === senhaComparacao) { return true } else { return false }
    }


    toJSON(){
        return {
            nome: this.#nomeUsuario,
            email: this.#emailUsuario,
            profissao: this.profissaoUsuario != undefined? this.#profissaoUsuario : "Sem profissão registrada" ,
            tarefas: this.tarefasUsuario
        }
    }

}

export let listaUsuarios: Usuario[] = [
    new Usuario(
        "Renan Almieda de Araujo",
        "renan.almeida.arau@gmail.com",
        "Ren1805140114!",
        "Engenheiro de software",
    )
]