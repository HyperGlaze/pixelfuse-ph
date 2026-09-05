import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let orders;
    if (email) {
      orders = await prisma.order.findMany({
        where: { customerEmail: email },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }
    
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Safely extract and fallback values
    const customerName = body.customerName || 'Guest';
    const customerEmail = body.customerEmail || 'no-email@example.com';
    const address = body.address || 'N/A';
    const deliveryFee = Number(body.deliveryFee) || 0;
    const totalAmount = Number(body.totalAmount) || 0;
    const paymentMethod = body.paymentMethod || 'cash';
    const proofOfPayment = body.proofOfPayment || null;
    
    // Explicitly stringify the items payload for SQLite
    let itemsString = '[]';
    if (body.items) {
      itemsString = typeof body.items === 'string' ? body.items : JSON.stringify(body.items);
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        address,
        deliveryFee,
        items: itemsString,
        totalAmount,
        paymentMethod,
        proofOfPayment,
        status: 'Pending',
      },
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order API Error Details:", error);
    // Explicitly extract the error message to avoid empty {} serialization
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Failed to update order:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
