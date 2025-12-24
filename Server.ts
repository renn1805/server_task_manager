import { app } from "./app"
import * as z from "zod"
import Usuario, * as User from "./src/Usuario"


const porta = 3000
app.listen(porta, () => console.log("O servidor esta rodando"))


app.get("/usuarios", (req, res) => {
    res.send(User.listaUsuarios)
})


const usuarioEsquema = z.object(
    {
        nomeUsuario: z.string(),
        emailUsuario: z.email(),
        senhaUsuario: z.string().min(8),
        profissaoUsuario: z.string().optional()
    }
)


app.post("/usuarios/criarUsuario", (req, res) => {

    const resultadoRequisicao = usuarioEsquema.safeParse(req.body)

    if (!resultadoRequisicao.success) {
        return res.status(400).json({
            erro: "dados invalidos!",
            detalhes: resultadoRequisicao.error
        })
    }

    const { nomeUsuario, emailUsuario, senhaUsuario, profissaoUsuario } = resultadoRequisicao.data

    const novoUsuario = new Usuario(
        nomeUsuario,
        emailUsuario,
        senhaUsuario,
        profissaoUsuario
    )

    User.listaUsuarios.push(novoUsuario)

    res.send("Usuario adicionado com sucesso")

})


app.post("/usuarios/deletarUsuario", ( req, res) =>{

    const requisicaoEsquema = z.object({
        emailUsuarioProcurado: z.email(),
        senhaUsuarioProcurado: z.string()
    })

    const requisicao = requisicaoEsquema.safeParse(req.body)

    if (!requisicao.success){
        return res.status(400).json({
            erro: "dados invalidos!",
            descricao: requisicao.error
        })
    }

    const {emailUsuarioProcurado, senhaUsuarioProcurado} = requisicao.data

    const indexUsurioExcluido = User.listaUsuarios.findIndex(usuario => usuario.emailUsuario == emailUsuarioProcurado && usuario.compararSenha(senhaUsuarioProcurado))


    if (indexUsurioExcluido != -1){

        User.listaUsuarios.splice(indexUsurioExcluido, 1)
    
        res.status(200).send("Usuario removido com sucesso!")

    }else {
        res.status(400).send("Email não encontrado " + emailUsuarioProcurado)
    }

})