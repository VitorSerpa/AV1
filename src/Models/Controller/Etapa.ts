import Funcionario from "./Funcionario";
import { StatusEtapa } from "../Entities/StatusEtapa";
import FileManagement from "./FileManagement";
import Aeronave from "./Aeronave";

export default class Etapa {
    public id: string;
    public nome: string;
    public prazo: string;
    public status: StatusEtapa;
    public arrayFuncionarios: Array<Funcionario> = [];
    public aeronaveAssociada: string;

    constructor(id: string, nome: string, prazo: string, arrayFunc: Array<Funcionario>, aeronaveAssociada: string) {
        this.id = id;
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa.PENDENTE;
        this.arrayFuncionarios = arrayFunc;
        this.aeronaveAssociada = aeronaveAssociada;
    }

    public associarFuncionario(func: Funcionario) {
        const etapaId = parseInt(this.id);

        if (!func.arrayEtapasAssociadas.includes(etapaId)) {
            func.arrayEtapasAssociadas.push(etapaId);
        }

        this.arrayFuncionarios.push(func);
    }

    public iniciar() {
        this.status = StatusEtapa.ANDAMENTO;
    }

    public finalizar() {
        this.status = StatusEtapa.CONCLUIDA;
    }

    public listarFuncionarios(): void {
        this.arrayFuncionarios.forEach((value) => {
            value.printFuncionario();
            console.log("Etapa: " + this.nome);
        });
    }

    public salvar() {
        const objectAeronave = {
            id: this.id,
            nome: this.nome,
            prazo: this.prazo,
            status: StatusEtapa[this.status],
            aeronaveAssociada: this.aeronaveAssociada,
        };

        FileManagement.saveFile(objectAeronave, "etapa.txt");
    }

    public static carregar(): Array<Etapa> {
        const dados: Array<object> = FileManagement.readFile("etapa.txt");

        if (dados.length === 0) {
            console.log("Nenhuma etapa carregado!");
            return [];
        }

        const etapas: Array<Etapa> = [];
        dados.forEach((obj) => {
            etapas.push(new Etapa(obj["id"], obj["nome"], obj["prazo"], [], obj["aeronaveAssociada"]));
        });
        console.log("===================");
        console.log(dados.length + " Etapas carregadas com sucesso!");
        return etapas;
    }

    public printEtapa(): void {
        console.log("===================");
        console.log("ID: " + this.id);
        console.log("Nome: " + this.nome);
        console.log("Prazo: " + this.prazo);
        console.log("Status: " + StatusEtapa[this.status]);
        console.log("Funcionários associados: " + this.arrayFuncionarios.map((f) => f.nome).join(", "));
        console.log("Aeronave associada: " + this.aeronaveAssociada);
    }
}
