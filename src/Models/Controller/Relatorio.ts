import Aeronave from "./Aeronave";
import { TipoAeronave } from "../Entities/TipoAeronave";
import { TipoTeste } from "../Entities/TipoTeste";
import { ResultadoTeste } from "../Entities/ResultadoTeste";
import * as fs from 'fs';

export default class Relatorio {

    public static registersPath = "./Relatorios/";

    public static gerarRelatorio(aeronave: Aeronave) {
        console.log("========= RELATÓRIO DA AERONAVE =========");
        console.log(`Código: ${aeronave.codigo}`);
        console.log(`Modelo: ${aeronave.modelo}`);
        console.log(`Tipo: ${TipoAeronave[aeronave.tipo]}`);
        console.log(`Capacidade: ${aeronave.capacidade}`);
        console.log(`Alcance: ${aeronave.alcance} km`);

        console.log("\n--- Peças Associadas ---");
        if (aeronave.arrayPecas.length === 0) {
            console.log("Nenhuma peça associada.");
        } else {
            aeronave.arrayPecas.forEach((peca, index) => {
                console.log(`${index + 1}. ${peca.nome}`);
            });
        }

        console.log("\n--- Etapas Associadas ---");
        if (aeronave.arrayEtapas.length === 0) {
            console.log("Nenhuma etapa associada.");
        } else {
            aeronave.arrayEtapas.forEach((etapa, index) => {
                console.log(`${index + 1}. ${etapa.nome}`);
            });
        }

        console.log("\n--- Testes Associados ---");
        if (aeronave.arrayTestes.length === 0) {
            console.log("Nenhum teste associado.");
        } else {
            aeronave.arrayTestes.forEach((teste, index) => {
                const tipo = TipoTeste[teste.tipo];
                const resultado = ResultadoTeste[teste.resultado];
                console.log(`${index + 1}. Tipo: ${tipo} | Resultado: ${resultado}`);
            });
        }

        console.log("==========================================");
    }

    public static salvarEmArquivo(aeronave: Aeronave): void {
        let relatorio = "========= RELATÓRIO DA AERONAVE =========\n";
        relatorio += `Código: ${aeronave.codigo}\n`;
        relatorio += `Modelo: ${aeronave.modelo}\n`;
        relatorio += `Tipo: ${TipoAeronave[aeronave.tipo]}\n`;
        relatorio += `Capacidade: ${aeronave.capacidade}\n`;
        relatorio += `Alcance: ${aeronave.alcance} km\n`;

        relatorio += "\n--- Peças Associadas ---\n";
        if (aeronave.arrayPecas.length === 0) {
            relatorio += "Nenhuma peça associada.\n";
        } else {
            aeronave.arrayPecas.forEach((peca, index) => {
                relatorio += `${index + 1}. ${peca.nome}\n`;
            });
        }

        relatorio += "\n--- Etapas Associadas ---\n";
        if (aeronave.arrayEtapas.length === 0) {
            relatorio += "Nenhuma etapa associada.\n";
        } else {
            aeronave.arrayEtapas.forEach((etapa, index) => {
                relatorio += `${index + 1}. ${etapa.nome}\n`;
            });
        }

        relatorio += "\n--- Testes Associados ---\n";
        if (aeronave.arrayTestes.length === 0) {
            relatorio += "Nenhum teste associado.\n";
        } else {
            aeronave.arrayTestes.forEach((teste, index) => {
                const tipo = TipoTeste[teste.tipo];
                const resultado = ResultadoTeste[teste.resultado];
                relatorio += `${index + 1}. Tipo: ${tipo} | Resultado: ${resultado}\n`;
            });
        }

        relatorio += "==========================================\n";

        const nomeArquivo = `${this.registersPath}relatorio_${aeronave.codigo}.txt`;

        fs.writeFileSync(nomeArquivo, relatorio, 'utf8')

        console.log(`📁 Relatório salvo em: ${nomeArquivo}`);
    }
}
