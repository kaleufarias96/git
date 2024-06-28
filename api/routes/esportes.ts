import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

/* Rota de listagem do banco */
router.get("/", async (req, res) => {
    const esporte = await prisma.esporte.findMany();
    res.status(200).json(esporte);
})

/* Rota de add no banco  */
router.post("/", async (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "Dados inválidos" });
    }
    const esportes = await prisma.esporte.create({
        data: {
            nome,
        }
    });

    const esporte = await prisma.esporte.findMany();
    res.status(201).json(esporte);
})

/* Rota de deleta algum registro do banco */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const esporte = await prisma.esporte.delete({
        where: { id: Number(id) }
    });

    const esportes = await prisma.esporte.findMany();
    res.status(204).json(esportes);
})

export default router;