import { app } from "./app"
import * as z from "zod"

//? Importação das classes usadas
import Usuario, * as User from "./src/Usuario"
import Tarefa from "./src/Tarefa"

//? Iportação dos Enums usados
import { StatusTarefa } from "./src/enum/EnumStatusTarefa"
import { DificuldadeTarefa } from "./src/enum/EnumDificuldadeTarefa"


const porta = 3000
app.listen(porta, () => console.log("O servidor esta rodando"))

//? Método para pegar todas os usuarios
app.get("/usuarios", (req, res) => {
    res.send(User.listaUsuarios)
})

//? Método para criar usuario
app.post("/usuarios/criarUsuario", (req, res) => {

    const reqEsquema = z.object(
        {
            nomeUsuario: z.string(),
            emailUsuario: z.email(),
            senhaUsuario: z.string().min(8),
            profissaoUsuario: z.string().optional()
        }
    )

    const requisicao = reqEsquema.safeParse(req.body)

    if (!requisicao.success) {
        return res.status(400).json({
            erro: "dados invalidos!",
            detalhes: requisicao.error
        })
    }

    const { nomeUsuario, emailUsuario, senhaUsuario, profissaoUsuario } = requisicao.data

    const emailEmUso = User.listaUsuarios.find(usuarioJaCadastrado => usuarioJaCadastrado.emailUsuario === emailUsuario) instanceof Usuario

    if (emailEmUso) {
        return res.status(401).send("Email ja esta em uso!")
    }

    const novoUsuario = new Usuario(
        nomeUsuario,
        emailUsuario,
        senhaUsuario,
        profissaoUsuario
    )

    User.listaUsuarios.push(novoUsuario)

    res.send("Usuario adicionado com sucesso")

})

//? Método para deletar usuarios
app.post("/usuarios/deletarUsuario", (req, res) => {

    const reqEsquema = z.object({
        emailUsuarioProcurado: z.email(),
        senhaUsuarioProcurado: z.string()
    })

    const requisicao = reqEsquema.safeParse(req.body)

    if (!requisicao.success) {
        return res.status(400).json({
            erro: "dados invalidos!",
            descricao: requisicao.error
        })
    }

    const { emailUsuarioProcurado, senhaUsuarioProcurado } = requisicao.data

    const indexUsurioExcluido = User.listaUsuarios.findIndex(usuario => usuario.emailUsuario == emailUsuarioProcurado && usuario.compararSenha(senhaUsuarioProcurado))


    if (indexUsurioExcluido != -1) {

        User.listaUsuarios.splice(indexUsurioExcluido, 1)

        res.status(200).send("Usuario removido com sucesso!")

    } else {
        res.status(400).send("Email não encontrado " + emailUsuarioProcurado)
    }

})




//? Método para criar uma tarefa
app.post("/usuario/criarTarefa", (req, res) => {
    const reqEsquema = z.object({
        idUsuario: z.number().int(),
        nomeTarefa: z.string().max(50),
        descricaoTarefa: z.string(),
        statusTarefa: z.union([z.literal(0), z.literal(1), z.literal(2)]),
        dificuldadeTarefa: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
    })

    const requisicao = reqEsquema.safeParse(req.body)

    if (!requisicao.success) {
        return res.json({
            erro: "Dados invalido!",
            descricao: requisicao.error
        })
    }

    const { idUsuario, nomeTarefa, descricaoTarefa, statusTarefa, dificuldadeTarefa } = requisicao.data

    const mapaDificuldade = {
        0: DificuldadeTarefa.Indefinido,
        1: DificuldadeTarefa.Facil,
        2: DificuldadeTarefa.Medio,
        3: DificuldadeTarefa.Dificil
    }
    const dificuldadeTarefaConvertido = mapaDificuldade[dificuldadeTarefa as keyof typeof mapaDificuldade] ?? DificuldadeTarefa.Indefinido

    const mapaStatus = {
        0: StatusTarefa.Pendente,
        1: StatusTarefa.EmProgresso,
        2: StatusTarefa.Finalizado
    }
    const statusTarefaConvertido = mapaStatus[statusTarefa as keyof typeof mapaStatus] ?? StatusTarefa.Pendente


    const usuarioRequerido = User.listaUsuarios.find(usuario => usuario.compararId(idUsuario))

    if (usuarioRequerido !== undefined) {
        usuarioRequerido.tarefasUsuario.push(new Tarefa(
            usuarioRequerido.tarefasUsuario.length + 1,
            nomeTarefa,
            descricaoTarefa,
            statusTarefaConvertido,
            dificuldadeTarefaConvertido
        ))

        return res.send("tarefa adicionada com sucesso")

    } else {
        return res.send("Esse id não existe")
    }

})