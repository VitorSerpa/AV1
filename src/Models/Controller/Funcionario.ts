import NivelPermissao from "../Entities/NivelPermissao"
import FileManagement from "./FileManagement"


export default class Funcionario{
    public id: string
    public nome: string
    public telefone: string
    public endereco: string
    public usuario: string
    private senha: string
    public nivelPermissao: NivelPermissao 
    constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: string){
        this.id = id
        this.nome = nome
        this.telefone = telefone
        this.endereco = endereco
        this.usuario = usuario
        this.senha = senha
        this.nivelPermissao = new NivelPermissao(nivelPermissao)
    }

    public static carregar(): Array<Funcionario>{
        const dados: Array<object> = FileManagement.readFile("funcionario.txt")   
        const funcionarios: Array<Funcionario> = [] 
        dados.forEach((obj) => {
            funcionarios.push(
                new Funcionario(
                    obj["id"],
                    obj["nome"],
                    obj["telefone"],
                    obj["endereco"],
                    obj["usuario"],
                    obj["senha"],
                    obj["nivelPermissao"]
                )
            )
        })
        return funcionarios
    }

    public salvar(){
        const objectFuncionario = {
            id : this.id,
            nome : this.nome,
            telefone : this.telefone,
            endereco : this.endereco,
            usuario : this.usuario,
            senha : this.senha,
            nivelPermissao : this.nivelPermissao.permissao
        }

        FileManagement.saveFile(objectFuncionario, "funcionario.txt")

    }

    public autenticar(usuario: string, senha: string){
        if(usuario === this.usuario && senha === this.senha) return true;
        return false
    }

    get getSenha(){
        return this.senha
    }
}