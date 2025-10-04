import { TipoPeca } from "../Entities/TipoPeca";
import { StatusPeca } from "../Entities/StatusPeca";
import { stringify } from "querystring";
import FileManagement from "./FileManagement";

export default class Peca {
    public nome: string;
    public tipo: TipoPeca;
    public fornecedor: string;
    public status: StatusPeca;
    public aeronaveAssociada: string;

    constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca, aeronaveAssociada: string) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = status;
        this.aeronaveAssociada = aeronaveAssociada;
    }

    public atualizarStatus(novoStatus: StatusPeca) {
        this.status = novoStatus;
    }

    public salvar(): void {
        const objectAeronave = {
            nome: this.nome,
            tipo: TipoPeca[this.tipo],
            fornecedor: this.fornecedor,
            status: StatusPeca[this.status],
            aeronaveAssociada: this.aeronaveAssociada,
        };
        FileManagement.saveFile(objectAeronave, "peca.txt");
    }

    public static carregar(): Array<Peca> {
        const dados: Array<object> = FileManagement.readFile("peca.txt");

        if (dados.length === 0) {
            console.log("Nenhuma aeronave carregada!");
            return [];
        }

        const pecas: Array<Peca> = [];
        dados.forEach((obj) => {
            pecas.push(
                new Peca(
                    obj["nome"],
                    TipoPeca[obj["tipo"] as keyof typeof TipoPeca],
                    obj["fornecedor"],
                    StatusPeca[obj["status"] as keyof typeof StatusPeca],
                    obj["aeronaveAssociada"]
                )
            );
        });
        console.log("===================");
        console.log(dados.length + " Peças carregadas com sucesso!");
        return pecas;
    }
}
