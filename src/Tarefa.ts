
export enum StatusTarefa {
    Pendente = 'Pendente',
    EmProgresso = 'Em Progresso',
    Finalizado = 'Finalizado'
}

export enum DificuldadeTarefa {
    Indefinido = 'Indefinido',
    Facil = 'Facil',
    Medio = 'Médio',
    Dificil = 'Dificil'
}


export default class Tarefa {

    static #contadorId = 0

    #idTarefa: number
    get idTarefa() {
        return this.#idTarefa
    }


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
        nome: string,
        descricao: string,
        status: StatusTarefa,
        dificuldade: DificuldadeTarefa
    ) {
        Tarefa.#contadorId++ 

        this.#idTarefa = Tarefa.#contadorId
        this.#nomeTarefa = nome
        this.#descricaoTarefa = descricao
        this.#dificuldadeTarefa = dificuldade
        this.#statusAtualTarefa = status
    }


    toJSON() {

        return {
            id: this.#idTarefa,
            nomeTarefa: this.#nomeTarefa,
            descricaoTarefa: this.#descricaoTarefa,
            status: this.#statusAtualTarefa,
            dificuldadeTarefa: this.#dificuldadeTarefa
        }
    }

}