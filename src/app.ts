import Aeronave from "./Models/Controller/Aeronave";
import Etapa from "./Models/Controller/Etapa";
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
async function menuAdministrador(arrayEtapas: Array<Etapa>, arrayFuncionarios: Array<Funcionario>) {

    while (true) {
        console.log("===================");
        console.log("O que deseja realizar?");
        console.log("1 - Criar Etapa");
        console.log("2 - Listar Etapas");
        console.log("3 - Listar funcionarios");
        console.log("4 - Associar funcionario funcionario à etapa");
        console.log("5 - Logout");

        const option = await askQuestion("Escolha uma opção: \n");

        switch(option){
            case "1":
                let nomeEtapa = await askQuestion("Nome da etapa: \n")
                let prazo = await askQuestion("Prazo da etapa: \n")

                arrayEtapas.push(new Etapa(nomeEtapa, prazo))
                break
            case "2":
                arrayEtapas.forEach((value) =>{
                    value.printarEtapa()
                })
                break
            case "3":
                arrayFuncionarios.forEach((value) =>{
                    value.printFuncionario()
                })
                break
            case "4":
                nomeEtapa = await askQuestion("Digite o nome da etapa")
                const etapa = arrayEtapas.find((value) => value.nome === nomeEtapa);
                if(!etapa){
                    console.log("Funcionario não encontrado!")
                    break
                } 

                let idFuncionario = await askQuestion("Digite o ID do funcionário para associar")
                const funcionario = arrayFuncionarios.find((value) => value.id === idFuncionario);
                if(!funcionario){
                    console.log("Funcionario não encontrado!")
                    break
                } 
                
                etapa.associarFuncionario(funcionario)
                break   
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
}



async function menu() {
    let arrayEtapas: Array<Etapa> = []
    let arrayAeronave: Array<Aeronave> = []
    let arrayFuncionarios: Array<Funcionario> = [];
    arrayFuncionarios = Funcionario.carregar();
    arrayEtapas = Etapa.carregar()

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
                                    await menuAdministrador(arrayEtapas, arrayFuncionarios);
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
                criarFuncionario(arrayFuncionarios)
                break;
            default:
                console.log("Saindo...");
                rl.close();
                process.exit(0);
        }
        
    }
}

menu();
