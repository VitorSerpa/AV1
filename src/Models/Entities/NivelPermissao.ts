
export default class NivelPermissao{
    private static permissoesValidas: Array<string> = ["ENGENHEIRO", "ADMINISTRADOR", "OPERADOR"]
    public permissao: string

    constructor(permissao: string){
        if (!NivelPermissao.permissoesValidas.includes(permissao)) {
            console.log("Permissão Invalida! Atribuindo permissão como Operario")
            this.permissao = "OPERARIO" 
        }else
            this.permissao = permissao
    }

    public get getNivelPermissao():string{
        return this.permissao
    }

}