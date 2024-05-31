
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(request: Request, { params }: { params: { token: string } }) {
  try {
    
    const isValid = jwt.verify(params.token, "cFElLPPssQqLmIoxTwL+ddVbKW0ajvF7s4iKucz/MOI=");

    if (!isValid) {
      return NextResponse.json({message: "Invalid token"}, {status:401});
    }

    const session = await prisma.session.findFirst({where: {sessionToken: params.token}});
    if (session == null) {
      return NextResponse.json({message: "Session not found"}, {status:404});
    }


    const isExpired = session.expires < new Date();
    if (isExpired) {
      return NextResponse.json({message: "Session expired"}, {status:401});
    }
    return NextResponse.json({message: "User verfied", status: 200});
  } catch (error) {
    return NextResponse.json({message: "Bad Request"}, {status: 400});
  }
}