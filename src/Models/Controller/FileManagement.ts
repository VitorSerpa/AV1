import * as fs from "fs";
import path = require("path");

export default class FileManagement {
    public static registersPath = "./Registers/";

    public static readFile(nomeArquivo: string): Array<object> {
        try {
            const textFile = fs.readFileSync(this.registersPath + nomeArquivo, { encoding: "utf-8" });

            if (textFile == "") {
                return [];
            }

            const blocos = textFile.split("---");
            let arrayObjs: Array<object> = [];

            blocos.forEach((bloco) => {
                const textInfoArray = bloco.split("\n");

                let varObject: Record<string, string> = {};
                textInfoArray.forEach((value) => {
                    const keyValueArray: Array<string> = value.trim().replace("\r", "").split(":");
                    if (keyValueArray.length === 2) {
                        const key = keyValueArray[0]?.trim();
                        const val = keyValueArray[1]?.trim();

                        if (key && val) {
                            if (val.startsWith("[") && val.endsWith("]")) {
                                varObject[key] = JSON.parse(val);
                            } else {
                                varObject[key] = val;
                            }
                        }
                    }
                });
                arrayObjs.push(varObject);
            });
            return arrayObjs;
        } catch (err) {
            return [{ mensagem: "Não foi possivel ler o arquivo" }];
        }
    }

    public static saveFile(obj: object, nomeArquivo: string): void {
        try {
            let pathText = fs.readFileSync(this.registersPath + nomeArquivo, { encoding: "utf-8" });
            let text = "---\n";
            if (pathText == "") {
                text = "";
            }
            Object.entries(obj).forEach(([key, value]) => {
                text += `${key} : ${value}\n`;
            });
            fs.appendFileSync(this.registersPath + nomeArquivo, text);
            console.log("Arquivo salvo!");
        } catch (err) {
            console.log("Erro ao editar arquivo");
        }
    }

    public static addValueToArray(id: string, novoElemento: string, nomeArray: string, path: string) {
        let conteudo = fs.readFileSync(this.registersPath + path, "utf8");
        let blocos = conteudo.split("---").map((b) => b.trim());

        let blocosAtualizados = blocos.map((bloco) => {
            if (bloco.includes(`id : ${id}`)) {
                bloco = bloco
                    .split("\n")
                    .map((linha) => {
                        if (linha.trim().startsWith(nomeArray)) {
                            let partes: any = linha.split(":");
                            let etapasStr = partes[1].trim();
                            let etapas;

                            try {
                                etapas = JSON.parse(etapasStr);
                            } catch (e) {
                                etapas = [];
                            }

                            if (!etapas.includes(novoElemento)) {
                                etapas.push(novoElemento);
                            }

                            return `${partes[0]} : [${etapas.join(", ")}]`;
                        }
                        return linha;
                    })
                    .join("\n");
            }
            return bloco;
        });

        const novoConteudo = blocosAtualizados.join("\n---\n");
        fs.writeFileSync(this.registersPath + path, novoConteudo, "utf8");
    }

    public static changeValue(id: string, novoValor: string, nomeCampo: string, path: string) {
        const conteudo = fs.readFileSync(this.registersPath + path, "utf8");
        const blocos = conteudo.split("---").map((b) => b.trim());

        const blocosAtualizados = blocos.map((bloco) => {
            if (bloco.includes(`id : ${id}`)) {
                bloco = bloco
                    .split("\n")
                    .map((linha) => {
                        if (linha.trim().startsWith(nomeCampo)) {
                            return `${nomeCampo} : ${novoValor}`;
                        }
                        return linha;
                    })
                    .join("\n");
            }
            return bloco;
        });

        const novoConteudo = blocosAtualizados.join("\n---\n");
        fs.writeFileSync(this.registersPath + path, novoConteudo, "utf8");
    }
}
