import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

/* Rota de listagem do banco */
router.get("/", async (req, res) => {
    const Agendamentos = await prisma.agendamento.findMany();
    res.status(200).json(Agendamentos);
})

/* Rota de add no banco  */
router.post("/", async (req, res) => {
    const { data, hora, usuario_id, esporte_id, quadra_id } = req.body;

    if (!data || !hora || !usuario_id || !esporte_id || !quadra_id) {
        return res.status(400).json({ mensagem: "Dados inválidos" });
    }
    const agendamento = await prisma.agendamento.create({
        data: {
            data,
            hora,
            usuario_id,
            esporte_id,
            quadra_id
        }
    });

    const agendamentos = await prisma.agendamento.findMany();
    res.status(201).json(agendamentos);
})

/* Rota de deleta algum registro do banco */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const agendamento = await prisma.agendamento.delete({
        where: { id: Number(id) }
    });

    const agendamentos = await prisma.agendamento.findMany();
    res.status(204).json(agendamentos);
})

/* Rota de alterar hora dos registros */
router.put("/:id", async (req, res) => {

    const { id } = req.params;
    const { data } = req.body;

    const agendamento = await prisma.agendamento.update({
        where: { id: Number(id) },
        data: { data }
    });

    const agendamentos = await prisma.agendamento.findMany();
    res.status(200).json(agendamentos);
})


export default router;