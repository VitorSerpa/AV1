import Funcionario from "./Funcionario";
import StatusEtapa from "../Entities/StatusEtapa";

export default class Etapa{
    public nome: string
    public prazo: string
    public status: StatusEtapa
    public funcionarios: Array<Funcionario> 

    constructor(nome: string, prazo: string, status: string, funcionarios: Array<Funcionario>){
        this.nome = nome
        this.prazo = prazo
        this.status = status
        this.funcionarios = funcionarios
    }

    public associarFuncionario(func: Funcionario){
        this.funcionarios.push(func)
    }

    public listarFuncionarios(): Array<Funcionario>{
        return this.funcionarios
    }
}