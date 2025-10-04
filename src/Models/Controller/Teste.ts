import { TipoTeste } from "../Entities/TipoTeste";
import { ResultadoTeste } from "../Entities/ResultadoTeste";
import FileManagement from "./FileManagement";

export default class Teste {
    public tipo: TipoTeste;
    public resultado: ResultadoTeste;
    public aeronaveAssociada: string;

    constructor(tipo: TipoTeste, resultado: ResultadoTeste, aeronaveAssociada) {
        this.tipo = tipo;
        this.resultado = resultado;
        this.aeronaveAssociada = aeronaveAssociada;
    }

    public salvar(): void {
        const objectTeste = {
            tipo: TipoTeste[this.tipo],
            resultado: ResultadoTeste[this.resultado],
            aeronaveAssociada: this.aeronaveAssociada,
        };
        FileManagement.saveFile(objectTeste, "teste.txt");
    }

    public static carregar(): Array<Teste> {
        const dados: Array<object> = FileManagement.readFile("teste.txt");

        if (dados.length === 0) {
            console.log("Nenhum teste carregado!");
            return [];
        }

        const testes: Array<Teste> = [];
        dados.forEach((obj) => {
            testes.push(
                new Teste(
                    TipoTeste[obj["tipo"] as keyof typeof TipoTeste],
                    ResultadoTeste[obj["resultado"] as keyof typeof ResultadoTeste],
                    obj["aeronaveAssociada"]
                )
            );
        });
        console.log("===================");
        console.log(dados.length + " Testes carregados com sucesso!");
        return testes;
    }
}
