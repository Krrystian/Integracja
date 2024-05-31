import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;
        const user = await prisma.user.findFirst({ where: { email: email } });
        if (user == null) {
            return NextResponse.json({ message: "User not found" }, {status:404});
        }
        const passwd = await bcrypt.compare(password, user?.password);
        if (!passwd) {
            return NextResponse.json({ message: "Invalid password", status: 401 });
        }
        const secret = "cFElLPPssQqLmIoxTwL+ddVbKW0ajvF7s4iKucz/MOI="
        const token = jwt.sign({
            user: {
            email: user.email,
            role: user.role,
            },
        }, secret, { expiresIn: "1h"})
        
        await prisma.session.deleteMany({ where: { userId: user.id } });

        await prisma.session.create({
            data: {
                sessionToken: token,
                userId: user.id,
                expires: new Date(Date.now() + 3600000),
            },
        });
        return NextResponse.json({ message: "User logged in", status: 200, user: { email: user.email, role: user.role , token: token}});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Bad Request", status: 400 });
    }
}