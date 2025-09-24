import Funcionario from "./Models/Controller/Funcionario"

const func = new Funcionario("1", "Vitor Serpa", "", "", "", "", "ADMINISTRADOR")

func.carregar()

console.log(func) 