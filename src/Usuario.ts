
export default class Usuario {
    nomeUsuario: String;
    private _emailUsuario: String;
    get emailUsuario (){
        return this._emailUsuario
    }
    private senhaUsuario: String;
    profissaoUsuario?: String | undefined;

    constructor(nome: String, email: String, senha:String, profissao?: String){
        this.nomeUsuario = nome;
        this._emailUsuario = email;
        this.senhaUsuario = senha;
        this.profissaoUsuario = profissao
    };


    trocarSenhaUsuario (novaSenha: String, confirmarSenha: String): String{
        const senhasCorrespondem = novaSenha === confirmarSenha
        if (senhasCorrespondem){
            this.senhaUsuario = novaSenha
            return "Senha alterada com sucesso!"
        }else{
            return "Senhas não correspondem"
        }
    }

    trocarEmailUsuario (novoEmail: String, confirmarEmail: String): String{
        const emailsCorrespondem = novoEmail === confirmarEmail
        if (emailsCorrespondem){
            this._emailUsuario = novoEmail
            return "E-mail alterado com sucesso"
        }else{
            return "E-mails não correspondem"
        }
    }

    compararSenha(senhaComparacao:String):Boolean{
        if (this.senhaUsuario === senhaComparacao) {return true}else {return false}
    }

}

export let listaUsuarios: Usuario[] = [
    new Usuario(
        "Renan Almieda de Araujo",
        "renan.almeida.arau@gmail.com",
        "Ren1805140114!",
        "Engenheiro de software"
    )
]