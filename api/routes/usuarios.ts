import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

/* Rota de listagem do banco */
router.get("/", async (req, res) => {
    const usuario = await prisma.usuario.findMany();
    res.status(200).json(usuario);
})

/* Rota de add no banco  */
router.post("/", async (req, res) => {
    const { nome, email, telefone, senha, } = req.body;

    if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({ mensagem: "Dados inválidos" });
    }
    const usuarios = await prisma.usuario.create({
        data: {
            nome,
            email,
            telefone,
            senha,
        }
    });

    const usuario = await prisma.usuario.findMany();
    res.status(201).json(usuario);
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
