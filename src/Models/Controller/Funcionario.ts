import { NivelPermissao } from "../Entities/NivelPermissao"
import FileManagement from "./FileManagement"


export default class Funcionario{
    public id: string
    public nome: string
    public telefone: string
    public endereco: string
    public usuario: string
    private senha: string
    public nivelPermissao: NivelPermissao 
    public arrayEtapasAssociadas: Array<number> = []

    constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao, arrayEtapasAssociadas: Array<number>){
        this.id = id
        this.nome = nome
        this.telefone = telefone
        this.endereco = endereco
        this.usuario = usuario
        this.senha = senha
        this.nivelPermissao = nivelPermissao
        this.arrayEtapasAssociadas = arrayEtapasAssociadas
    }

    public printFuncionario():void{
        console.log("===================")
        console.log("ID: " + this.id)
        console.log("Nome: " + this.nome)
        console.log("Telefone: " + this.telefone)
        console.log("Endereço: " + this.endereco)
        console.log("Nome de Usuario: " + this.usuario)
        console.log("Nivel de Permissão: " + NivelPermissao[this.nivelPermissao])
    }

    public static carregar(): Array<Funcionario>{
        const dados: Array<object> = FileManagement.readFile("funcionario.txt")   
        
        if(dados.length === 0){
            console.log("Nenhum funcionario carregado!")
            return []
        }

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
                    NivelPermissao[obj["nivelPermissao"] as keyof typeof NivelPermissao],
                    obj["etapasAssociadas"],
                )
            )
        })
        console.log("===================");
        console.log(dados.length + " Funcionarios carregados com sucesso!")
        return funcionarios
    }

    public salvar():void{
        const objectFuncionario = {
            id : this.id,
            nome : this.nome,
            telefone : this.telefone,
            endereco : this.endereco,
            usuario : this.usuario,
            senha : this.senha,
            nivelPermissao : NivelPermissao[this.nivelPermissao],
            etapasAssociadas: "[]"
        }

        FileManagement.saveFile(objectFuncionario, "funcionario.txt")
    }

    public autenticar(usuario: string, senha: string):boolean{
        if(usuario === this.usuario && senha === this.senha) return true;
        return false
    }

    get getSenha(){
        return this.senha
    }
}