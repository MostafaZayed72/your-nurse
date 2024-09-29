import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const method = event.req.method;
    const id = event.context.params?.id; // الحصول على المعرف من المسار

    if (method === 'POST') {
        const body = await readBody(event);
        const nurse = await prisma.nurse.create({
            data: {
                name: body.name,
                mobile: body.mobile,
                region: body.region,
                email: body.email,
            },
        });
        return nurse;
    } else if (method === 'GET') {
        const nurses = await prisma.nurse.findMany();
        return nurses;
    } else if (method === 'DELETE') {
        if (!id) {
            return createError({ statusCode: 400, statusMessage: 'Missing nurse ID' });
        }
        try {
            const deletedNurse = await prisma.nurse.delete({
                where: { id: Number(id) }, // استخدام المعرف المحول إلى رقم
            });
            return deletedNurse; // إرجاع الممرض المحذوف
        } catch (error) {
            return createError({ statusCode: 404, statusMessage: 'Nurse not found' });
        }
    } else if (method === 'PUT') {
        const body = await readBody(event);
        if (!id) {
            return createError({ statusCode: 400, statusMessage: 'Missing nurse ID' });
        }
        const updatedNurse = await prisma.nurse.update({
            where: { id: Number(id) },
            data: {
                name: body.name,
                mobile: body.mobile,
                region: body.region,
                email: body.email,
            },
        });
        return updatedNurse; // إرجاع الممرض المحدث
    } else {
        return createError({ statusCode: 405, statusMessage: 'Method not allowed' });
    }
});
