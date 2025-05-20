import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { walletAddress, name, email } = await req.json();

  if (!walletAddress) {
    return new NextResponse("Missing wallet address", { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { walletAddress },
    update: { name, email },
    create: { walletAddress, name, email },
  });

  return NextResponse.json(user);
}
