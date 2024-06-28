import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

/* Rota de listagem do banco */
router.get("/", async (req, res) => {
    const quadra = await prisma.quadra.findMany();
    res.status(200).json(quadra);
})

/* Rota de add no banco  */
router.post("/", async (req, res) => {
    const { nome, tipoDaQuadra, esporte_id } = req.body;

    if (!nome || !tipoDaQuadra || !esporte_id) {
        return res.status(400).json({ mensagem: "Dados inválidos" });
    }
    const quadras = await prisma.quadra.create({
        data: {
            nome,
            tipoDaQuadra,
            esporte_id,
        }
    });

    const quadra = await prisma.quadra.findMany();
    res.status(201).json(quadra);
})

/* Rota de deleta algum registro do banco */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const quadra = await prisma.quadra.delete({
        where: { id: Number(id) }
    });

    const quadras = await prisma.quadra.findMany();
    res.status(204).json(quadras);
})

export default router;