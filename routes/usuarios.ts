import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const router = Router();

/* Rota de listagem do banco */
router.get("/", async (req, res) => {
    const usuario = await prisma.usuario.findMany();
    res.status(200).json(usuario);
})

function validaSenha(senha: string) {

    const mensa: string[] = []

    // .length: retorna o tamanho da string (da senha)
    if (senha.length < 8) {
        mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
    }

    // contadores
    let pequenas = 0
    let grandes = 0
    let numeros = 0
    let simbolos = 0

    // senha = "abc123"
    // letra = "a"

    // percorre as letras da variável senha
    for (const letra of senha) {
        // expressão regular
        if ((/[a-z]/).test(letra)) {
            pequenas++
        }
        else if ((/[A-Z]/).test(letra)) {
            grandes++
        }
        else if ((/[0-9]/).test(letra)) {
            numeros++
        } else {
            simbolos++
        }
    }

    if (pequenas == 0 || grandes == 0 || numeros == 0 || simbolos == 0) {
        mensa.push("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos")
    }

    return mensa
}

/* Rota de add no banco  */
router.post("/", async (req, res) => {
    console.log(req.body);

    const { nome, email, telefone, senha, } = req.body;

    if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({ mensagem: "Dados inválidos" });
    }
    const erros = validaSenha(senha)
    if (erros.length > 0) {
        res.status(400).json({ erro: erros.join("; ") })
        return
    }

    // 12 é o número de voltas (repetições) que o algoritmo faz
    // para gerar o salt (sal/tempero)
    const salt = bcrypt.genSaltSync(12)
    // gera o hash da senha acrescida do salt
    const hash = bcrypt.hashSync(senha, salt)


    try {
        const usuarios = await prisma.usuario.create({
            data: { nome, email, telefone, senha: hash }
        });
        res.status(201).json(usuarios);
    } catch (error) {
        res.status(400).json(error);
    }


})

/* Rota de deleta algum registro do banco */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const usuario = await prisma.usuario.delete({
        where: { id: Number(id) }
    });

    const usuarios = await prisma.usuario.findMany();
    res.status(204).json(usuarios);
})

/* Rota de alterar Statos dos usuario */
router.put("/:id", async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const usuario = await prisma.usuario.update({
        where: { id: Number(id) },
        data: { status }
    });

    const usuarios = await prisma.usuario.findMany();
    res.status(200).json(usuario);
})

// Rota de alterar Dados gerais dos usuários
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, senha } = req.body;

    try {
        // Atualiza o usuário no banco de dados
        await prisma.usuario.update({
            where: { id: Number(id) },
            data: { nome, email, telefone, senha }
        });

        // Retorna o usuário atualizado
        const usuarioAtualizado = await prisma.usuario.findUnique({
            where: { id: Number(id) },
        });

        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        // Trata erros que podem ocorrer durante a atualização
        res.status(500).json({ error: "Erro ao atualizar o usuário." });
    }
});


export default router;