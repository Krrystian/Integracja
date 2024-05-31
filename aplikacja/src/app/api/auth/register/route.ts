
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword } = body;
    if (password !== confirmPassword) {
      return NextResponse.json({message: "Passwords do not match"}), {status: 400};
    }
    const passwd = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: passwd,
      },
    });
    return NextResponse.json({message: "User created", status: 201});
  } catch (error) {
    return NextResponse.json({message: "Bad Request"}, {status: 400});
  }
}