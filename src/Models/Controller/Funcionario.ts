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

    public carregar(){
        const objectFuncionario = FileManagement.readFile("funcionario.txt")
        this.id = objectFuncionario["id"]
        this.nome = objectFuncionario["nome"]
        this.telefone = objectFuncionario["telefone"]
        this.endereco = objectFuncionario["endereco"]
        this.usuario = objectFuncionario["usuario"]
        this.senha = objectFuncionario["senha"]
        this.nivelPermissao = new NivelPermissao(objectFuncionario["nivelPermissao"])
    }

    public autenticar(usuario: string, senha: string){
        if(usuario === this.usuario && senha === this.senha) return true;
        return false
    }

    get getSenha(){
        return this.senha
    }
}