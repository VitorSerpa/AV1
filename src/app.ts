import Aeronave from "./Models/Controller/Aeronave";
import Etapa from "./Models/Controller/Etapa";
import Funcionario from "./Models/Controller/Funcionario";
import { NivelPermissao } from "./Models/Entities/NivelPermissao";
import * as readline from "readline";
import { TipoAeronave } from "./Models/Entities/TipoAeronave";
import { TipoTeste } from "./Models/Entities/TipoTeste";
import { ResultadoTeste } from "./Models/Entities/ResultadoTeste";
import Teste from "./Models/Controller/Teste";

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
    arrayAeronave: Array<Aeronave>
) {
    while (true) {
        console.log("\n===================");
        console.log("O que deseja realizar?");
        console.log("1 - Criar Aeronave");
        console.log("2 - Listar Aeronaves");
        console.log("3 - Criar Etapa");
        console.log("4 - Listar Etapas");
        console.log("6 - Listar funcionários");
        console.log("7 - Realizar teste");
        console.log("8 - Criar peça");

        const option = await askQuestion("Escolha uma opção: \n");
        let resp;
        switch (option) {
            case "3":
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

                let newEtapa;

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
                            arrayEtapas.length.toString(),
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

                newEtapa.salvar();
                arrayEtapas.push(newEtapa);
                break;
            case "4":
                arrayEtapas.forEach((value) => {
                    value.printEtapa();
                });
                break;
            case "5":
                arrayFuncionarios.forEach((value) => {
                    value.printFuncionario();
                });
                break;
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
                let cod = arrayAeronave.length.toString();

                arrayAeronave.push(new Aeronave(cod, modelo, tipo, capacidade, alcance));
                arrayAeronave[arrayAeronave.length - 1]?.salvar();
                break;
            case "2":
                arrayAeronave.forEach((value) => {
                    value.printAeronave();
                });
                break;

            case "7":
                let resultadoTeste;
                let tipoTeste;
                let aeronave;
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

                    if (aeronave) {
                        break;
                    }
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
            default:
                console.log("Opção Invalida!");
        }
    }
}
async function menuOperador() {
    console.log("Bem vindo ao operador");
}

async function menuEngenherio() {
    console.log("Bem vindo ao engenhreior");
}

async function criarFuncionario(arrayFuncionarios: Array<Funcionario>) {
    console.log("\n===================");
    const id = arrayFuncionarios.length.toString();
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
}

async function menu() {
    let arrayEtapas: Array<Etapa> = [];
    let arrayAeronave: Array<Aeronave> = [];
    let arrayFuncionarios: Array<Funcionario> = [];
    let arrayTestes: Array<Teste> = [];
    arrayTestes = Teste.carregar();
    arrayFuncionarios = Funcionario.carregar();
    arrayAeronave = Aeronave.carregar();
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

    while (true) {
        console.log("===================");
        console.log("O que deseja realizar?");
        console.log("1 - Login");
        console.log("2 - Criar funcionário");

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
                                    await menuAdministrador(arrayEtapas, arrayFuncionarios, arrayAeronave);
                                    break;
                                case NivelPermissao.OPERADOR:
                                    await menuOperador();
                                    break;
                                case NivelPermissao.ENGENHEIRO:
                                    await menuEngenherio();
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
                criarFuncionario(arrayFuncionarios);
                break;
            default:
                console.log("Saindo...");
                rl.close();
                process.exit(0);
        }
    }
}

menu();
