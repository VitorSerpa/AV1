import Funcionario from "./Models/Controller/Funcionario";
import { NivelPermissao } from "./Models/Entities/NivelPermissao";
import * as readline from "readline";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}
async function menuAdministrador() {
    console.log("Bem vindo ao adm");
}
async function menuOperador() {
    console.log("Bem vindo ao operador");
}

async function menuEngenherio() {
    console.log("Bem vindo ao engenhreior");
}

async function menu() {
    let arrayFuncionarios: Array<Funcionario> = [];
    arrayFuncionarios = Funcionario.carregar();

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
                                    await menuAdministrador();
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
                console.log("\n===================");
                const id = arrayFuncionarios.length.toString();
                const nome = await askQuestion("Qual o nome do funcionario?\n");
                const telefone = await askQuestion("Qual o telefone do funcionario?\n");
                const endereco = await askQuestion("Qual o endereco do funcionario?\n");
                const usuario = await askQuestion("Qual o nome de usuario?\n");
                const senha = await askQuestion("Qual a senha do usuario?\n");

                let nivelPermissao = NivelPermissao.OPERADOR;

                while (true) {
                    const nivelPermissaoOption = await askQuestion(
                        "Escolha o nível de permissão:\n1 - ADMINISTRADOR\n2 - OPERADOR\n3 - ENGENHEIRO\n> "
                    );

                    switch (nivelPermissaoOption.trim()) {
                        case "1":
                            nivelPermissao = NivelPermissao.ADMINISTRADOR;
                            break;
                        case "2":
                            nivelPermissao = NivelPermissao.OPERADOR;
                            break;
                        case "3":
                            nivelPermissao = NivelPermissao.ENGENHEIRO;
                            break;
                        default:
                            console.log("Opção inválida. Tente novamente.");
                            continue;
                    }
                    break;
                }

                arrayFuncionarios.push(new Funcionario(id, nome, telefone, endereco, usuario, senha, nivelPermissao));
                arrayFuncionarios[arrayFuncionarios.length - 1]?.salvar();
                return;
            default:
                console.log("Saindo...");
                rl.close();
                process.exit(0);
        }
    }
}

menu();
