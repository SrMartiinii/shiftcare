import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const incidencias = await prisma.incidencia.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(incidencias)
}

export async function POST(request: Request) {
  const body = await request.json()
  const incidencia = await prisma.incidencia.create({
    data: {
      titulo: body.titulo,
      descripcion: body.descripcion,
      estado: body.estado,
      prioridad: body.prioridad,
      categoria: body.categoria,
      asignadoA: body.asignadoA,
    },
  })
  return NextResponse.json(incidencia, { status: 201 })
}