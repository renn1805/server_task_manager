import { StatusTarefa } from "./enum/EnumStatusTarefa";
import { DificuldadeTarefa } from "./enum/EnumDificuldadeTarefa";
export default class Tarefa {

    #idTarefa: number

    #nomeTarefa: string;
    get nomeTarefa() {
        return this.#nomeTarefa
    }

    #descricaoTarefa: string;
    get descricaoTarefa() {
        return this.#descricaoTarefa
    }

    #statusAtualTarefa: StatusTarefa = StatusTarefa.Pendente
    get statusAtualTarefa() {
        return this.#statusAtualTarefa
    }
    set mudarStatusAtualTarefa(novoStatus: StatusTarefa) {
        this.#statusAtualTarefa = novoStatus
    }

    #dificuldadeTarefa: DificuldadeTarefa = DificuldadeTarefa.Indefinido
    get dificuldadeTarefa() {
        return this.#dificuldadeTarefa
    }
    set mudarDificuldadeTarefa(novaDificuldade: DificuldadeTarefa) {
        this.#dificuldadeTarefa = novaDificuldade
    }



    constructor(
        id: number,
        nome: string,
        descricao: string,
        status: StatusTarefa,
        dificuldade: DificuldadeTarefa
    ) {
        this.#idTarefa = id
        this.#nomeTarefa = nome
        this.#descricaoTarefa = descricao
        this.#dificuldadeTarefa = dificuldade
        this.#statusAtualTarefa = status
    }


    toJSON() {

        return {
            idTarefa: this.#idTarefa,
            nomeTarefa: this.#nomeTarefa,
            descricaoTarefa: this.#descricaoTarefa,
            status: this.#statusAtualTarefa,
            dificuldadeTarefa: this.#dificuldadeTarefa
        }
    }

}