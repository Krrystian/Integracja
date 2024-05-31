
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function GET(request: Request, { params }: { params: { token: string, tabela:string } }) {
  try {
    const isValid = jwt.verify(params.token, "cFElLPPssQqLmIoxTwL+ddVbKW0ajvF7s4iKucz/MOI=");
    if (!isValid) {
      return NextResponse.json({message: "Invalid token"}, {status:401});
    }
    const session = await prisma.session.findFirst({where: {sessionToken: params.token}});
    if (session == null) {
      return NextResponse.json({message: "Session not found"}, {status:404});
    }

    switch (params.tabela) {
      case "dzietnosc":
        const dzietnosc = await prisma.wsp_dzietnosci.findMany();
        return NextResponse.json(dzietnosc, {status: 200});
      case "pkb":
        const pkb = await prisma.pkb.findMany();
        return NextResponse.json(pkb, {status: 200});
      case "bezrobocie":
        const bezrobocie = await prisma.bezrobocie.findMany();
        return NextResponse.json(bezrobocie, {status: 200});
      case "srednie_wynagrodzenie":
        const wynagrodzenie = await prisma.wynagrodzenie.findMany();
        return NextResponse.json(wynagrodzenie, {status: 200});
      case "dlugosc_zycia":
        const dlugosc = await prisma.srednia_dl_zycia.findMany();
        return NextResponse.json(dlugosc, {status: 200});
      default:
        return NextResponse.json({message: "Bad Request"}, {status: 400});
    }
  } catch (error) {
    return NextResponse.json({message: "Bad Request"}, {status: 400});
  }
}