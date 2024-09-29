import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const method = event.req.method;
    const id = event.context.params?.id; // الحصول على المعرف من المسار

    if (method === 'GET') {
        try {
            const nurse = await prisma.nurse.findUnique({
                where: { id: Number(id) },
            });
            if (!nurse) {
                return createError({ statusCode: 404, statusMessage: 'Nurse not found' });
            }
            return nurse;
        } catch (error) {
            console.error(error);
            return createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
        }
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
            console.error(error);
            return createError({ statusCode: 404, statusMessage: 'Nurse not found' });
        }
    } else if (method === 'PUT') {
        const body = await readBody(event);
        if (!id) {
            return createError({ statusCode: 400, statusMessage: 'Missing nurse ID' });
        }
        try {
            const updatedNurse = await prisma.nurse.update({
                where: { id: Number(id) },
                data: body,
            });
            return updatedNurse; // إرجاع الممرض المحدث
        } catch (error) {
            console.error(error);
            return createError({ statusCode: 404, statusMessage: 'Nurse not found' });
        }
    } else {
        return createError({ statusCode: 405, statusMessage: 'Method not allowed' });
    }
});
