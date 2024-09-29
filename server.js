import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/api/nurses', async (req, res) => {
    const nurses = await prisma.nurse.findMany();
    res.json(nurses);
});

app.post('/api/nurses', async (req, res) => {
    const nurse = await prisma.nurse.create({ data: req.body });
    res.json(nurse);
});

app.put('/api/nurses/:id', async (req, res) => {
    const updatedNurse = await prisma.nurse.update({
        where: { id: Number(req.params.id) },
        data: req.body,
    });
    res.json(updatedNurse);
});

app.delete('/api/nurses/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete nurse with ID: ${id}`); // تسجيل ID الممرض
    try {
        const deletedNurse = await prisma.nurse.delete({
            where: { id: Number(id) },
        });
        console.log('Deleted nurse:', deletedNurse); // تسجيل الممرض المحذوف
        res.json(deletedNurse);
    } catch (error) {
        console.error('Error while deleting nurse:', error); // تسجيل الخطأ
        res.status(404).json({ message: "Nurse not found" });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
