import { TipoAeronave } from "../Entities/TipoAeronave";
import FileManagement from "./FileManagement";
import Etapa from "./Etapa";
import Peca from "./Peca";
import Teste from "./Teste";
import { TipoTeste } from "../Entities/TipoTeste";
import { ResultadoTeste } from "../Entities/ResultadoTeste";

export default class Aeronave {
    public codigo: string;
    public modelo: string;
    public tipo: TipoAeronave;
    public capacidade: number;
    public alcance: number;
    public arrayPecas: Array<Peca> = [];
    public arrayEtapas: Array<Etapa> = [];
    public arrayTestes: Array<Teste> = [];

    constructor(
        codigo: string,
        modelo: string,
        tipo: TipoAeronave,
        capacidade: number,
        alcance: number,
    ) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
    }

    public associarTeste(teste: Teste) {
        this.arrayTestes.push(teste);
    }

    public associarEtapa(etapa: Etapa) {
        this.arrayEtapas.push(etapa);
    }

    public static carregar(): Array<Aeronave> {
        const dados: Array<object> = FileManagement.readFile("aeronave.txt");

        if (dados.length === 0) {
            console.log("Nenhuma aeronave carregada!");
            return [];
        }

        const aeronaves: Array<Aeronave> = [];
        dados.forEach((obj) => {
            aeronaves.push(
                new Aeronave(
                    obj["codigo"],
                    obj["modelo"],
                    TipoAeronave[obj["tipoAeronave"] as keyof typeof TipoAeronave],
                    parseInt(obj["capacidade"]),
                    parseInt(obj["alcance"])
                )
            );
        });
        console.log("===================");
        console.log(dados.length + " Aeronaves carregadas com sucesso!");
        return aeronaves;
    }

    public salvar(): void {
        const objectAeronave = {
            codigo: this.codigo,
            modelo: this.modelo,
            tipoAeronave: TipoAeronave[this.tipo],
            capacidade: this.capacidade,
            alcance: this.alcance,
        };

        FileManagement.saveFile(objectAeronave, "aeronave.txt");
    }

    public printAeronave(): void {
        console.log("===================");
        console.log("Cod: " + this.codigo);
        console.log("Modelo: " + this.modelo);
        console.log("Tipo: " + TipoAeronave[this.tipo]);
        console.log("Capacidade: " + this.capacidade);
        console.log("Alcance: " + this.alcance);
        console.log("Pecas associados: " + this.arrayPecas.map((f) => f.nome).join(", "));
        console.log("Etapas associados: " + this.arrayEtapas.map((f) => f.nome).join(", "));
        console.log(
            "Testes associados: " +
                "Tipo: " +
                this.arrayTestes.map((f) => TipoTeste[f.tipo]).join(", ") +
                " | Resultado: " +
                this.arrayTestes.map((f) => ResultadoTeste[f.resultado]).join(", ")
        );
    }
}
