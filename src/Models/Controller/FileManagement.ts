import * as fs from 'fs';

export default class FileManagement{
    public static readFile(nomeArquivo: string): object{
        try{
            const textFile = fs.readFileSync('./Registers/' + nomeArquivo, { encoding: 'utf-8' });
            const textInfoArray = textFile.split("\n")

            let varObject: Record<string, string> = {}

            textInfoArray.forEach((value)=>{
                const keyValueArray: Array<string> = value.trim().replace("\r", "").split(":")
                if (keyValueArray.length === 2) {
                    const key = keyValueArray[0]?.trim();
                    const val = keyValueArray[1]?.trim();

                if (key && val) {
                    varObject[key] = val;
                }}
            })
            return varObject
        }catch(err){
            return {mensagem: "Não foi possivel ler o arquivo"}
        }
    }

}
