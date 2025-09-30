import Funcionario from "./Funcionario";
import { StatusEtapa } from "../Entities/StatusEtapa";
import FileManagement from "./FileManagement";

export default class Etapa {
    public nome: string
    public prazo: string
    public status: StatusEtapa
    public funcionarios: Array<Funcionario> = []

    constructor(nome: string, prazo: string) {
        this.nome = nome
        this.prazo = prazo
        this.status = StatusEtapa.PENDENTE
    }

    public associarFuncionario(func: Funcionario) {
        this.funcionarios.push(func)
    }

    public iniciar() {
        this.status = StatusEtapa.ANDAMENTO
    }

    public finalizar() {
        this.status = StatusEtapa.CONCLUIDA
    }

    public static carregar() {
        const dados: Array<object> = FileManagement.readFile("etapa.txt")

        const etapas: Array<Etapa> = []
        dados.forEach((obj) => {
            etapas.push(
                new Etapa(
                    obj["nome"],
                    obj["prazo"],
                )
            )
        })
        console.log("===================")
        console.log(dados.length + " Etapas carregadas com sucesso!")
        return etapas
    }

    public listarFuncionarios(): void {
        this.funcionarios.forEach((value) => {
            value.printFuncionario()
            console.log("Etapa: " + this.nome)
        })
    }

    public printarEtapa(): void {
        let funcionariosText: string = "Nenhum funcionário associado"
        if(this.funcionarios.length !== 0){
            funcionariosText = ""
            this.funcionarios.forEach((value) => {
                funcionariosText += value.nome + "\n"
            })
        }
        
        
        console.log("===================")
        console.log("Nome: " + this.nome)
        console.log("Prazo: " + this.prazo)
        console.log("Status: " + this.status)
        console.log("Funcionarios associados:")
        console.log(funcionariosText)
    }
}