import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 'global' }
    });
    
    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: { id: 'global' }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const settings = await prisma.siteSetting.upsert({
      where: { id: 'global' },
      update: {
        deliveryTaguig: Number(body.deliveryTaguig),
        deliveryMakati: Number(body.deliveryMakati),
        aboutDescription: body.aboutDescription,
        aboutDevs: body.aboutDevs,
        facebookUrl: body.facebookUrl
      },
      create: {
        id: 'global',
        deliveryTaguig: Number(body.deliveryTaguig),
        deliveryMakati: Number(body.deliveryMakati),
        aboutDescription: body.aboutDescription,
        aboutDevs: body.aboutDevs,
        facebookUrl: body.facebookUrl
      }
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
