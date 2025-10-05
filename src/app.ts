import Aeronave from "./Models/Controller/Aeronave";
import Etapa from "./Models/Controller/Etapa";
import Funcionario from "./Models/Controller/Funcionario";
import { NivelPermissao } from "./Models/Entities/NivelPermissao";
import * as readline from "readline";
import { TipoAeronave } from "./Models/Entities/TipoAeronave";
import { TipoTeste } from "./Models/Entities/TipoTeste";
import { ResultadoTeste } from "./Models/Entities/ResultadoTeste";
import Teste from "./Models/Controller/Teste";
import { TipoPeca } from "./Models/Entities/TipoPeca";
import { StatusPeca } from "./Models/Entities/StatusPeca";
import Peca from "./Models/Controller/Peca";
import FileManagement from "./Models/Controller/FileManagement";
import Relatorio from "./Models/Controller/Relatorio";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function selecionarOpcao<T>(mensagem: string, opcoes: Record<string, any>): Promise<T> {
    while (true) {
        const resposta = await askQuestion(mensagem);
        const valor = opcoes[resposta.trim()];
        if (valor !== undefined) return valor;
        console.log("Opção invalidada, tente novamente!");
    }
}

function askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}
async function menuAdministrador(
    arrayEtapas: Array<Etapa>,
    arrayFuncionarios: Array<Funcionario>,
    arrayAeronave: Array<Aeronave>,
    arrayPecas: Array<Peca>
) {
    let resultadoTeste;
    let tipoTeste;
    let aeronave;
    let newEtapa;

    while (true) {
        console.log("\n===================");
        console.log("O que deseja realizar?");
        console.log("✈️  1 - Criar Aeronave");
        console.log("📋 2 - Listar Aeronaves");
        console.log("👨 3 - Criar Funcionário");
        console.log("📄 4 - Listar Funcionários");
        console.log("📄 5 - Associar Funcionário à Etapa");
        console.log("🔧 6 - Criar Peça");
        console.log("♻️  7 - Atualizar Status de Peça");
        console.log("🛠️  8 - Criar Etapa");
        console.log("🗂️  9 - Listar Etapas");
        console.log("▶️  10 - Iniciar Etapa");
        console.log("⏹️  11 - Finalizar Etapa");
        console.log("🧪 12 - Realizar Teste");
        console.log("📊 13 - Gerar Relatório");
        console.log("💾 14 - Salvar Relatório");
        console.log("💾 15 - Logoff");

        const option = await askQuestion("Escolha uma opção: \n");
        let resp;
        let funcionario;

        switch (option) {
            case "1":
                let modelo: string = await askQuestion("Qual o modelo da Aeronave?\n");
                let tipo = await selecionarOpcao<TipoAeronave>(
                    "Qual o tipo da aeronave? \n1 - COMERCIAL\n2 - MILITAR\n",
                    {
                        "1": TipoAeronave.COMERCIAL,
                        "2": TipoAeronave.MILITAR,
                    }
                );
                let capacidade: number = parseInt(await askQuestion("Qual a capacidade da Aeronave?\n"));
                let alcance: number = parseInt(await askQuestion("Qual o alcance da Aeronave?\n"));
                let cod = (arrayAeronave.length + 1).toString();
                arrayAeronave.push(new Aeronave(cod, modelo, tipo, capacidade, alcance));
                arrayAeronave[arrayAeronave.length - 1]?.salvar();
                break;

            case "2":
                arrayAeronave.forEach((value) => {
                    value.printAeronave();
                });
                break;

            case "3":
                await criarFuncionario(arrayFuncionarios);
                break;

            case "4":
                arrayFuncionarios.forEach((value) => {
                    value.printFuncionario();
                });
                break;

            case "6":
                let nomePeca = await askQuestion("Digite o nome da peça");
                let tipoPeca = await selecionarOpcao<TipoPeca>("Qual o tipo da peça?\n1 - NACIONAL\n2 - IMPORTADA", {
                    "1": TipoPeca.NACIONAL,
                    "2": TipoPeca.IMPORTADA,
                });
                let fornecedorPeca = await askQuestion("Digite o nome do fornecedor");
                let statusPeca = await selecionarOpcao<StatusPeca>(
                    "Qual o status da peça?\n1 - EM PRODUÇÃO\n2 - EM TRANSPORTE\n3 - PRONTA",
                    {
                        "1": StatusPeca.EM_PRODUÇÃO,
                        "2": StatusPeca.EM_TRANSPORTE,
                        "3": StatusPeca.PRONTA,
                    }
                );
                resp = "1";
                while (resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o Codigo da aeronave para associar a Peça\n-1 - Listar aeronaves disponiveis\n-2 - Cancelar operação\n"
                    );
                    if (resp == -1) {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                    }
                    aeronave = arrayAeronave.find((f) => f.codigo === resp);
                    if (aeronave) break;
                    console.log("Aeronave com esse Codigo não encontrada. Tente novamente.");
                }
                if (resp == -2) break;
                let newPeca = new Peca(
                    (arrayPecas.length + 1).toString(),
                    nomePeca,
                    tipoPeca,
                    fornecedorPeca,
                    statusPeca,
                    aeronave.codigo
                );
                aeronave.associarPeca(newPeca);
                arrayPecas.push(newPeca);
                newPeca.salvar();
                break;

            case "7":
                resp = "1";
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID da Peça para atualizar o status\n0 - Finalizar\n-1 Listar as Etapas\n-2 - Cancelar operação\n"
                    );

                    if (resp == -1) {
                        arrayPecas.forEach((value) => {
                            value.printPeca();
                        });
                    }

                    const peca = arrayPecas.find((f) => f.id === resp);

                    if (peca) {
                        const tipoPeca: StatusPeca = await selecionarOpcao<StatusPeca>(
                            "Qual o novo status da peça??\n1 - EM PRODUÇÂO\n2 - EM TRANSPOSTE\n3 - PRONTA",
                            {
                                "1": StatusPeca.EM_PRODUÇÃO,
                                "2": StatusPeca.EM_TRANSPORTE,
                                "3": StatusPeca.PRONTA,
                            }
                        );
                        peca.atualizarStatus(tipoPeca);
                        continue;
                    }
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                break;

            case "8":
                let nomeEtapa = await askQuestion("Nome da etapa: \n");
                let prazo = await askQuestion("Prazo da etapa: \n");

                resp = "1";
                let arrayFunc: Array<Funcionario> = [];

                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID do funcionário para associar à Etapa\n0 - Finalizar\n-1 Listar os funcionarios\n-2 - Cancelar operação\n"
                    );

                    if (resp == -1) {
                        arrayFuncionarios.forEach((value) => {
                            value.printFuncionario();
                        });
                    }

                    const funcionario = arrayFuncionarios.find((f) => f.id === resp);

                    if (funcionario) {
                        arrayFunc.push(funcionario);
                        console.log(`\nFuncionário ${funcionario.nome} adicionado.`);
                        continue;
                    }
                    console.log("Funcionário com esse ID não encontrado. Tente novamente.");
                }

                if (resp == -2) break;

                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o Codigo da aeronave para associar à Etapa\n 0 - Finalizar\n-1 - Listar aeronaves disponíveis\n-2 - Cancelar operação\n"
                    );

                    if (resp === "-1") {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                        continue;
                    }

                    const aeronave = arrayAeronave.find((f) => f.codigo === resp);

                    if (aeronave) {
                        newEtapa = new Etapa(
                            (arrayEtapas.length + 1).toString(),
                            nomeEtapa,
                            prazo,
                            arrayFunc,
                            aeronave.codigo
                        );
                        aeronave.associarEtapa(newEtapa);
                        console.log(`\nEtapa ${newEtapa.nome} associada!`);
                        break;
                    }

                    console.log("Aeronave com esse código não encontrada. Tente novamente.");
                }

                if (resp == -2) break;

                arrayFunc.forEach((value) => {
                    FileManagement.addValueToArray(value.id, newEtapa.id, "etapasAssociadas", "funcionario.txt");
                });

                newEtapa.salvar();
                arrayEtapas.push(newEtapa);
                break;

            case "9":
                arrayEtapas.forEach((value) => {
                    value.printEtapa();
                });
                break;

            case "10":
                resp = "1";
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID da Etapa para inicializar\n0 - Finalizar\n-1 Listar as Etapas\n-2 - Cancelar operação\n"
                    );

                    if (resp == -1) {
                        arrayEtapas.forEach((value) => {
                            value.printEtapa();
                        });
                    }

                    const etapa = arrayEtapas.find((f) => f.id === resp);

                    if (etapa) {
                        etapa.iniciar();
                        FileManagement.changeValue(etapa.id, "ANDAMENTO", "status", "etapa.txt");
                        console.log(`\nEtapa: ${etapa.nome} iniciada.`);
                        continue;
                    }
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                break;

            case "11":
                resp = "1";
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID da Etapa para finalizar\n0 - Finalizar\n-1 Listar as Etapas\n-2 - Cancelar operação\n"
                    );

                    if (resp == -1) {
                        arrayEtapas.forEach((value) => {
                            value.printEtapa();
                        });
                    }

                    const etapa = arrayEtapas.find((f) => f.id === resp);

                    if (etapa) {
                        etapa.finalizar();
                        FileManagement.changeValue(etapa.id, "CONCLUIDA", "status", "etapa.txt");
                        console.log(`\nEtapa: ${etapa.nome} concluida.`);
                        continue;
                    }
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                break;

            case "12":
                resp = "1";
                while (resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o Codigo da aeronave para associar o Teste\n-1 - Listar aeronaves disponiveis\n-2 - Cancelar operação\n"
                    );
                    if (resp == -1) {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                    }
                    aeronave = arrayAeronave.find((f) => f.codigo === resp);
                    if (aeronave) break;
                    console.log("Aeronave com esse Codigo não encontrada. Tente novamente.");
                }
                if (resp == -2) break;
                tipoTeste = await selecionarOpcao<TipoTeste>(
                    "Qual o tipo do teste?\n1 - ELETRICO\n2 - HIDRAULICON\n3 - AERODINAMICO",
                    {
                        "1": TipoTeste.ELETRICO,
                        "2": TipoTeste.HIDRAULICO,
                        "3": TipoTeste.AERODINAMICO,
                    }
                );
                resultadoTeste = await selecionarOpcao<ResultadoTeste>(
                    "Qual foi o resultado do teste?\n1 - APROVADO\n2 - REPROVADO",
                    {
                        "1": ResultadoTeste.APROVADO,
                        "2": ResultadoTeste.REPROVADO,
                    }
                );
                let teste = new Teste(tipoTeste, resultadoTeste, aeronave.codigo);
                aeronave.associarTeste(teste);
                teste.salvar();
                break;

            case "13":
                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o Código da aeronave para ver o Relatório\n0 - Finalizar\n-1 - Listar aeronaves disponíveis\n-2 - Cancelar operação\n"
                    );

                    if (resp === "-1") {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                        continue;
                    }

                    const aeronave = arrayAeronave.find((f) => f.codigo === resp);

                    if (aeronave) {
                        Relatorio.gerarRelatorio(aeronave);
                        continue;
                    }

                    console.log("Aeronave com esse código não encontrada. Tente novamente.");
                }
                if (resp == "-2") break;
                break;

            case "14":
                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o Código da aeronave para gerar e salvar o Relatório\n0 - Finalizar\n-1 - Listar aeronaves disponíveis\n-2 - Cancelar operação\n"
                    );

                    if (resp === "-1") {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                        continue;
                    }

                    const aeronave = arrayAeronave.find((f) => f.codigo === resp);

                    if (aeronave) {
                        Relatorio.salvarEmArquivo(aeronave);
                        continue;
                    }

                    console.log("Aeronave com esse código não encontrada. Tente novamente.");
                }
                break;

            case "5":
                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o Código da Etapa para associar o funcionário\n-1 - Listar Etapas disponíveis\n-2 - Cancelar operação\n"
                    );

                    if (resp === "-1") {
                        arrayEtapas.forEach((value) => {
                            value.printEtapa();
                        });
                        continue;
                    }

                    newEtapa = arrayEtapas.find((f) => f.id === resp);

                    if (newEtapa) {
                        break;
                    }

                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                if (resp == "-2") break;

                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o ID do funcionario para associar à Etapa\n-1 - Listar funcionarios disponíveis\n-2 - Cancelar operação\n"
                    );

                    if (resp === "-1") {
                        arrayFuncionarios.forEach((value) => {
                            value.printFuncionario();
                        });
                        continue;
                    }

                    funcionario = arrayFuncionarios.find((f) => f.id === resp);

                    if (funcionario) {
                        newEtapa.associarFuncionario(funcionario);
                        FileManagement.addValueToArray(
                            funcionario.id,
                            newEtapa.id,
                            "etapasAssociadas",
                            "funcionario.txt"
                        );
                        break;
                    }

                    console.log("Funcionario com esse ID não encontrado. Tente novamente.");
                }
                break;

            case "15":
                return;
            default:
                console.log("Opção Inválida!");
        }
    }
}
async function menuOperador(
    arrayEtapas: Array<Etapa>,
    arrayFuncionarios: Array<Funcionario>,
    arrayAeronave: Array<Aeronave>,
    arrayPecas: Array<Peca>
) {
    while (true) {
        console.log("\n===================");
        console.log("Menu - Operador");
        console.log("📋 1 - Listar Aeronaves");
        console.log("📄 2 - Listar Funcionários");
        console.log("🔧 3 - Criar Peça");
        console.log("♻️  4 - Atualizar Status de Peça");
        console.log("🗂️ 5 - Listar Etapas");
        console.log("▶️ 6 - Iniciar Etapa");
        console.log("⏹️ 7 - Finalizar Etapa");
        console.log("💾 8 - Logoff");
        const option = await askQuestion("Escolha uma opção: \n");
        let resp;
        let funcionario;
        let aeronave;
        switch (option) {
            case "1":
                arrayAeronave.forEach((value) => {
                    value.printAeronave();
                });
                break;
            case "2":
                arrayFuncionarios.forEach((value) => {
                    value.printFuncionario();
                });
                break;
            case "3":
                let nomePeca = await askQuestion("Digite o nome da peça");
                let tipoPeca = await selecionarOpcao<TipoPeca>("Qual o tipo da peça?\n1 - NACIONAL\n2 - IMPORTADA", {
                    "1": TipoPeca.NACIONAL,
                    "2": TipoPeca.IMPORTADA,
                });
                let fornecedorPeca = await askQuestion("Digite o nome do fornecedor");
                let statusPeca = await selecionarOpcao<StatusPeca>(
                    "Qual o status da peça?\n1 - EM PRODUÇÃO\n2 - EM TRANSPORTE\n3 - PRONTA",
                    {
                        "1": StatusPeca.EM_PRODUÇÃO,
                        "2": StatusPeca.EM_TRANSPORTE,
                        "3": StatusPeca.PRONTA,
                    }
                );
                resp = "1";
                while (resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o Codigo da aeronave para associar a Peça\n-1 - Listar aeronaves disponiveis\n-2 - Cancelar operação\n"
                    );
                    if (resp == -1) {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                    }
                    aeronave = arrayAeronave.find((f) => f.codigo === resp);
                    if (aeronave) break;
                    console.log("Aeronave com esse Codigo não encontrada. Tente novamente.");
                }
                if (resp == -2) break;
                let newPeca = new Peca(
                    (arrayPecas.length + 1).toString(),
                    nomePeca,
                    tipoPeca,
                    fornecedorPeca,
                    statusPeca,
                    aeronave.codigo
                );
                aeronave.associarPeca(newPeca);
                arrayPecas.push(newPeca);
                newPeca.salvar();
                break;
            case "4":
                resp = "1";
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID da Peça para atualizar o status\n0 - Finalizar\n-1 Listar as Etapas\n-2 - Cancelar operação\n"
                    );

                    if (resp == -1) {
                        arrayPecas.forEach((value) => {
                            value.printPeca();
                        });
                    }

                    const peca = arrayPecas.find((f) => f.id === resp);

                    if (peca) {
                        const tipoPeca: StatusPeca = await selecionarOpcao<StatusPeca>(
                            "Qual o novo status da peça??\n1 - EM PRODUÇÂO\n2 - EM TRANSPOSTE\n3 - PRONTA",
                            {
                                "1": StatusPeca.EM_PRODUÇÃO,
                                "2": StatusPeca.EM_TRANSPORTE,
                                "3": StatusPeca.PRONTA,
                            }
                        );
                        peca.atualizarStatus(tipoPeca);
                        continue;
                    }
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                break;
            case "5":
                arrayEtapas.forEach((value) => {
                    value.printEtapa();
                });
                break;
            case "6":
                resp = "1";
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID da Etapa para inicializar\n0 - Finalizar\n-1 Listar as Etapas\n-2 - Cancelar operação\n"
                    );

                    if (resp == -1) {
                        arrayEtapas.forEach((value) => {
                            value.printEtapa();
                        });
                    }

                    const etapa = arrayEtapas.find((f) => f.id === resp);

                    if (etapa) {
                        etapa.iniciar();
                        FileManagement.changeValue(etapa.id, "ANDAMENTO", "status", "etapa.txt");
                        console.log(`\nEtapa: ${etapa.nome} iniciada.`);
                        continue;
                    }
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                break;
            case "7":
                resp = "1";
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID da Etapa para finalizar\n0 - Finalizar\n-1 Listar as Etapas\n-2 - Cancelar operação\n"
                    );

                    if (resp == -1) {
                        arrayEtapas.forEach((value) => {
                            value.printEtapa();
                        });
                    }

                    const etapa = arrayEtapas.find((f) => f.id === resp);

                    if (etapa) {
                        etapa.finalizar();
                        FileManagement.changeValue(etapa.id, "CONCLUIDA", "status", "etapa.txt");
                        console.log(`\nEtapa: ${etapa.nome} concluida.`);
                        continue;
                    }
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                break;
            case "8":
                return;
            default:
                console.log("Opção Inválida!");
        }
    }
}

async function menuEngenherio(
    arrayEtapas: Array<Etapa>,
    arrayFuncionarios: Array<Funcionario>,
    arrayAeronave: Array<Aeronave>,
    arrayPecas: Array<Peca>
) {
    console.log("\n===================");
    console.log("Menu - Engenheiro");
    console.log("📋 1 - Listar Aeronaves");
    console.log("📄 2 - Listar Funcionários");
    console.log("📄 3 - Associar Funcionário à Etapa");
    console.log("🔧 4 - Criar Peça");
    console.log("♻️  5 - Atualizar Status de Peça");
    console.log("🛠️ 6 - Criar Etapa");
    console.log("🗂️ 7 - Listar Etapas");
    console.log("▶️ 8 - Iniciar Etapa");
    console.log("⏹️ 9 - Finalizar Etapa");
    console.log("🧪 10 - Realizar Teste");
    console.log("📊 11 - Gerar Relatório");
    console.log("💾 12 - Salvar Relatório");
    console.log("🔚 13 - Logoff");
    const option = await askQuestion("Escolha uma opção: \n");
    let resp;
    let funcionario, aeronave, newEtapa, tipoTeste, resultadoTeste;
    while(true){

        switch (option) {
            case "1":
                arrayAeronave.forEach((value) => {
                    value.printAeronave();
                });
                break;
            case "2":
                arrayFuncionarios.forEach((value) => {
                    value.printFuncionario();
                });
                break;
            case "3":
                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o Código da Etapa para associar o funcionário\n-1 - Listar Etapas disponíveis\n-2 - Cancelar operação\n"
                    );
    
                    if (resp === "-1") {
                        arrayEtapas.forEach((value) => {
                            value.printEtapa();
                        });
                        continue;
                    }
    
                    newEtapa = arrayEtapas.find((f) => f.id === resp);
    
                    if (newEtapa) {
                        break;
                    }
    
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                if (resp == "-2") break;
    
                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o ID do funcionario para associar à Etapa\n-1 - Listar funcionarios disponíveis\n-2 - Cancelar operação\n"
                    );
    
                    if (resp === "-1") {
                        arrayFuncionarios.forEach((value) => {
                            value.printFuncionario();
                        });
                        continue;
                    }
    
                    funcionario = arrayFuncionarios.find((f) => f.id === resp);
    
                    if (funcionario) {
                        newEtapa.associarFuncionario(funcionario);
                        FileManagement.addValueToArray(funcionario.id, newEtapa.id, "etapasAssociadas", "funcionario.txt");
                        break;
                    }
    
                    console.log("Funcionario com esse ID não encontrado. Tente novamente.");
                }
                break;
            case "4":
                let nomePeca = await askQuestion("Digite o nome da peça");
                let tipoPeca = await selecionarOpcao<TipoPeca>("Qual o tipo da peça?\n1 - NACIONAL\n2 - IMPORTADA", {
                    "1": TipoPeca.NACIONAL,
                    "2": TipoPeca.IMPORTADA,
                });
                let fornecedorPeca = await askQuestion("Digite o nome do fornecedor");
                let statusPeca = await selecionarOpcao<StatusPeca>(
                    "Qual o status da peça?\n1 - EM PRODUÇÃO\n2 - EM TRANSPORTE\n3 - PRONTA",
                    {
                        "1": StatusPeca.EM_PRODUÇÃO,
                        "2": StatusPeca.EM_TRANSPORTE,
                        "3": StatusPeca.PRONTA,
                    }
                );
                resp = "1";
                while (resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o Codigo da aeronave para associar a Peça\n-1 - Listar aeronaves disponiveis\n-2 - Cancelar operação\n"
                    );
                    if (resp == -1) {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                    }
                    aeronave = arrayAeronave.find((f) => f.codigo === resp);
                    if (aeronave) break;
                    console.log("Aeronave com esse Codigo não encontrada. Tente novamente.");
                }
                if (resp == -2) break;
                let newPeca = new Peca(
                    (arrayPecas.length + 1).toString(),
                    nomePeca,
                    tipoPeca,
                    fornecedorPeca,
                    statusPeca,
                    aeronave.codigo
                );
                aeronave.associarPeca(newPeca);
                arrayPecas.push(newPeca);
                newPeca.salvar();
                break;
            case "5":
                resp = "1";
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID da Peça para atualizar o status\n0 - Finalizar\n-1 Listar as Etapas\n-2 - Cancelar operação\n"
                    );
    
                    if (resp == -1) {
                        arrayPecas.forEach((value) => {
                            value.printPeca();
                        });
                    }
    
                    const peca = arrayPecas.find((f) => f.id === resp);
    
                    if (peca) {
                        const tipoPeca: StatusPeca = await selecionarOpcao<StatusPeca>(
                            "Qual o novo status da peça??\n1 - EM PRODUÇÂO\n2 - EM TRANSPOSTE\n3 - PRONTA",
                            {
                                "1": StatusPeca.EM_PRODUÇÃO,
                                "2": StatusPeca.EM_TRANSPORTE,
                                "3": StatusPeca.PRONTA,
                            }
                        );
                        peca.atualizarStatus(tipoPeca);
                        continue;
                    }
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                break;
            case "6":
                let nomeEtapa = await askQuestion("Nome da etapa: \n");
                let prazo = await askQuestion("Prazo da etapa: \n");
    
                resp = "1";
                let arrayFunc: Array<Funcionario> = [];
    
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID do funcionário para associar à Etapa\n0 - Finalizar\n-1 Listar os funcionarios\n-2 - Cancelar operação\n"
                    );
    
                    if (resp == -1) {
                        arrayFuncionarios.forEach((value) => {
                            value.printFuncionario();
                        });
                    }
    
                    const funcionario = arrayFuncionarios.find((f) => f.id === resp);
    
                    if (funcionario) {
                        arrayFunc.push(funcionario);
                        console.log(`\nFuncionário ${funcionario.nome} adicionado.`);
                        continue;
                    }
                    console.log("Funcionário com esse ID não encontrado. Tente novamente.");
                }
    
                if (resp == -2) break;
    
                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o Codigo da aeronave para associar à Etapa\n 0 - Finalizar\n-1 - Listar aeronaves disponíveis\n-2 - Cancelar operação\n"
                    );
    
                    if (resp === "-1") {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                        continue;
                    }
    
                    const aeronave = arrayAeronave.find((f) => f.codigo === resp);
    
                    if (aeronave) {
                        newEtapa = new Etapa(
                            (arrayEtapas.length + 1).toString(),
                            nomeEtapa,
                            prazo,
                            arrayFunc,
                            aeronave.codigo
                        );
                        aeronave.associarEtapa(newEtapa);
                        console.log(`\nEtapa ${newEtapa.nome} associada!`);
                        break;
                    }
    
                    console.log("Aeronave com esse código não encontrada. Tente novamente.");
                }
    
                if (resp == -2) break;
    
                arrayFunc.forEach((value) => {
                    FileManagement.addValueToArray(value.id, newEtapa.id, "etapasAssociadas", "funcionario.txt");
                });
    
                newEtapa.salvar();
                arrayEtapas.push(newEtapa);
                break;
    
            case "7":
                arrayEtapas.forEach((value) => {
                    value.printEtapa();
                });
                break;
            case "8":
                resp = "1";
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID da Etapa para inicializar\n0 - Finalizar\n-1 Listar as Etapas\n-2 - Cancelar operação\n"
                    );
    
                    if (resp == -1) {
                        arrayEtapas.forEach((value) => {
                            value.printEtapa();
                        });
                    }
    
                    const etapa = arrayEtapas.find((f) => f.id === resp);
    
                    if (etapa) {
                        etapa.iniciar();
                        FileManagement.changeValue(etapa.id, "ANDAMENTO", "status", "etapa.txt");
                        console.log(`\nEtapa: ${etapa.nome} iniciada.`);
                        continue;
                    }
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                break;
            case "9":
                resp = "1";
                while (resp != 0 && resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o ID da Etapa para finalizar\n0 - Finalizar\n-1 Listar as Etapas\n-2 - Cancelar operação\n"
                    );
    
                    if (resp == -1) {
                        arrayEtapas.forEach((value) => {
                            value.printEtapa();
                        });
                    }
    
                    const etapa = arrayEtapas.find((f) => f.id === resp);
    
                    if (etapa) {
                        etapa.finalizar();
                        FileManagement.changeValue(etapa.id, "CONCLUIDA", "status", "etapa.txt");
                        console.log(`\nEtapa: ${etapa.nome} concluida.`);
                        continue;
                    }
                    console.log("Etapa com esse ID não encontrado. Tente novamente.");
                }
                break;
            case "10":
                resp = "1";
                while (resp != -2) {
                    resp = await askQuestion(
                        "\nDigite o Codigo da aeronave para associar o Teste\n-1 - Listar aeronaves disponiveis\n-2 - Cancelar operação\n"
                    );
                    if (resp == -1) {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                    }
                    aeronave = arrayAeronave.find((f) => f.codigo === resp);
                    if (aeronave) break;
                    console.log("Aeronave com esse Codigo não encontrada. Tente novamente.");
                }
                if (resp == -2) break;
                tipoTeste = await selecionarOpcao<TipoTeste>(
                    "Qual o tipo do teste?\n1 - ELETRICO\n2 - HIDRAULICON\n3 - AERODINAMICO",
                    {
                        "1": TipoTeste.ELETRICO,
                        "2": TipoTeste.HIDRAULICO,
                        "3": TipoTeste.AERODINAMICO,
                    }
                );
                resultadoTeste = await selecionarOpcao<ResultadoTeste>(
                    "Qual foi o resultado do teste?\n1 - APROVADO\n2 - REPROVADO",
                    {
                        "1": ResultadoTeste.APROVADO,
                        "2": ResultadoTeste.REPROVADO,
                    }
                );
                let teste = new Teste(tipoTeste, resultadoTeste, aeronave.codigo);
                aeronave.associarTeste(teste);
                teste.salvar();
                break;
            case "11":
                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o Código da aeronave para ver o Relatório\n0 - Finalizar\n-1 - Listar aeronaves disponíveis\n-2 - Cancelar operação\n"
                    );
    
                    if (resp === "-1") {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                        continue;
                    }
    
                    const aeronave = arrayAeronave.find((f) => f.codigo === resp);
    
                    if (aeronave) {
                        Relatorio.gerarRelatorio(aeronave);
                        continue;
                    }
    
                    console.log("Aeronave com esse código não encontrada. Tente novamente.");
                }
                if (resp == "-2") break;
                break;
            case "12":
                resp = "1";
                while (resp != "0" && resp != "-2") {
                    resp = await askQuestion(
                        "\nDigite o Código da aeronave para gerar e salvar o Relatório\n0 - Finalizar\n-1 - Listar aeronaves disponíveis\n-2 - Cancelar operação\n"
                    );
    
                    if (resp === "-1") {
                        arrayAeronave.forEach((value) => {
                            value.printAeronave();
                        });
                        continue;
                    }
    
                    const aeronave = arrayAeronave.find((f) => f.codigo === resp);
    
                    if (aeronave) {
                        Relatorio.salvarEmArquivo(aeronave);
                        continue;
                    }
    
                    console.log("Aeronave com esse código não encontrada. Tente novamente.");
                }
                break;
            case "13":
                return;
            default:
                console.log("Opção Inválida!");
        }
    }
}

async function criarFuncionario(arrayFuncionarios: Array<Funcionario>) {
    console.log("\n===================");
    const id = (arrayFuncionarios.length + 1).toString();
    const nome = await askQuestion("Qual o nome do funcionario?\n");
    const telefone = await askQuestion("Qual o telefone do funcionario?\n");
    const endereco = await askQuestion("Qual o endereco do funcionario?\n");
    const usuario = await askQuestion("Qual o nome de usuario?\n");
    const senha = await askQuestion("Qual a senha do usuario?\n");

    let nivelPermissao = await selecionarOpcao<NivelPermissao>(
        "Escolha o nível de permissão:\n1 - ADMINISTRADOR\n2 - OPERADOR\n3 - ENGENHEIRO\n> ",
        {
            "1": NivelPermissao.ADMINISTRADOR,
            "2": NivelPermissao.OPERADOR,
            "3": NivelPermissao.ENGENHEIRO,
        }
    );

    arrayFuncionarios.push(new Funcionario(id, nome, telefone, endereco, usuario, senha, nivelPermissao, []));
    arrayFuncionarios[arrayFuncionarios.length - 1]?.salvar();
    return;
}

async function menu() {
    let arrayEtapas: Array<Etapa> = [];
    let arrayAeronave: Array<Aeronave> = [];
    let arrayFuncionarios: Array<Funcionario> = [];
    let arrayTestes: Array<Teste> = [];
    let arrayPecas: Array<Peca> = [];
    arrayAeronave = Aeronave.carregar();
    arrayPecas = Peca.carregar();
    arrayTestes = Teste.carregar();
    arrayFuncionarios = Funcionario.carregar();
    arrayEtapas = Etapa.carregar();

    arrayFuncionarios.forEach((funcionario) => {
        funcionario.arrayEtapasAssociadas.forEach((etapaId) => {
            const etapa = arrayEtapas.find((e) => e.id == etapaId.toString());
            if (etapa) {
                etapa.associarFuncionario(funcionario);
            }
        });
    });

    arrayEtapas.forEach((etapa) => {
        const aeronave = arrayAeronave.find((aeronave) => aeronave.codigo === etapa.aeronaveAssociada);
        if (aeronave) {
            aeronave.associarEtapa(etapa);
        }
    });

    arrayTestes.forEach((teste) => {
        const aeronave = arrayAeronave.find((aeronave) => aeronave.codigo === teste.aeronaveAssociada);
        if (aeronave) {
            aeronave.associarTeste(teste);
        }
    });

    arrayPecas.forEach((peca) => {
        const aeronave = arrayAeronave.find((aeronave) => aeronave.codigo === peca.aeronaveAssociada);
        if (aeronave) {
            aeronave.associarPeca(peca);
        }
    });

    console.log(`\n\n █████╗ ███████╗██████╗  ██████╗  ██████╗ ██████╗ ██████╗ ███████╗
██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
███████║█████╗  ██████╔╝██║   ██║██║     ██║   ██║██║  ██║█████╗  
██╔══██║██╔══╝  ██╔══██╗██║   ██║██║     ██║   ██║██║  ██║██╔══╝  
██║  ██║███████╗██║  ██║╚██████╔╝╚██████╗╚██████╔╝██████╔╝███████╗
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
                                                                  `);

    while (true) {
        console.log("===================");
        console.log("O que deseja realizar?");
        console.log("1 - Login");
        console.log("2 - Sair");

        const option = await askQuestion("Escolha uma opção: \n");
        switch (option.trim()) {
            case "1":
                console.log("===================");
                const nomeUsuario = await askQuestion("Digite o nome de usuário\n");

                let funcionarioEncontrado = false;

                for (const value of arrayFuncionarios) {
                    if (nomeUsuario.trim() === value.usuario) {
                        funcionarioEncontrado = true;
                        const senhaUsuario = await askQuestion("Digite a senha do usuário\n");

                        if (senhaUsuario.trim() === value.getSenha) {
                            switch (value.nivelPermissao) {
                                case NivelPermissao.ADMINISTRADOR:
                                    await menuAdministrador(arrayEtapas, arrayFuncionarios, arrayAeronave, arrayPecas);
                                    break;
                                case NivelPermissao.OPERADOR:
                                    await menuOperador(arrayEtapas, arrayFuncionarios, arrayAeronave, arrayPecas);
                                    break;
                                case NivelPermissao.ENGENHEIRO:
                                    await menuEngenherio(arrayEtapas, arrayFuncionarios, arrayAeronave, arrayPecas);
                                    break;
                            }
                        } else {
                            console.log("Senha incorreta!");
                        }
                        break;
                    }
                }

                if (!funcionarioEncontrado) {
                    console.log("Usuário não encontrado.");
                }

                break;
            case "2":
                console.log("Saindo...");
                rl.close();
                process.exit(0);
            default:
                console.log("Opção Inválida!");
        }
    }
}

menu();
