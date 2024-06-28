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

/* busca algum usuario para fazer login  */
router.post("/", async (req, res) => {
   /*  console.log(req.body); */

    const {email, senha, } = req.body;

    if (!email || !senha) {
        res.status(400).json({ mensagem: "Informe e-mail e senha do usuario" });
        return
    }

    try {
        const usuarios = await prisma.usuario.findFirst({
            where: {
                email: email
            }
        });
        if (usuarios == null) {
            res.status(400).json({ mensagem: "E-mail invalido" });
            return
        }

        if (bcrypt.compareSync(senha, usuarios.senha)){
            res.status(400).json({
                id: usuarios.id,
                nome: usuarios.nome,
                email: usuarios.email,
            });
        } else {
            res.status(400).json({ mensagem: "Senha incorreta" });
        }
    }catch (error) {
        res.status(400).json(error);
    }

})

export default router;