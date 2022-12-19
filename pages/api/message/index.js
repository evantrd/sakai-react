import { PrismaClient } from '@prisma/client';

export default async (NextApiRequest, NextApiResponse) => {
    const prisma = new PrismaClient();
    const { method } = NextApiRequest;

    switch (method) {
        case 'GET':
            const messagingProduct = await prisma.messaging_product.findMany();
            return NextApiResponse.status(200).json({ messagingProduct });
        case 'POST':
            const postMessagingProduct = await prisma.messaging_product.create({
                data: NextApiRequest.body
            });
            console.log({ data });
            return NextApiResponse.status(200).json({ postMessagingProduct });
        default:
            return NextApiResponse.status(400).json('Connect Fail');
    }
};
