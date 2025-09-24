type ResultadoType = "Aprovado" | "Reprovado"

export default class ResultadoTeste{
    private resultado: ResultadoType
    
    constructor(){
        this.resultado = "Reprovado"
    }

    public get getResultado(): ResultadoType{
        return this.resultado
    }

    public setAprovado(): void{
        this.resultado = "Aprovado"
    }

    public setReprovado(): void{
        this.resultado = "Reprovado"
    }
}