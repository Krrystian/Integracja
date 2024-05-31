
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        await prisma.session.delete({
            where: {
                sessionToken: id,
            },
        });
        return NextResponse.json({message: "User logged out"}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Bad Request"}, {status: 400});
    }
}