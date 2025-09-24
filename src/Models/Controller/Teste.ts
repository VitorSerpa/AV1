import TipoTeste from "../Entities/TipoTeste";
import ResultadoTeste from "../Entities/ResultadoTeste";

export default class Teste{
    public tipo: TipoTeste
    public resultado: ResultadoTeste

    constructor(tipo: TipoTeste, resultado: ResultadoTeste){
        this.tipo = tipo
        this.resultado = resultado
    }
}