import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const incidencia = await prisma.incidencia.update({
    where: { id: Number(id) },
    data: {
      titulo: body.titulo,
      descripcion: body.descripcion,
      estado: body.estado,
      prioridad: body.prioridad,
      categoria: body.categoria,
      asignadoA: body.asignadoA,
    },
  })
  return NextResponse.json(incidencia)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.incidencia.delete({
    where: { id: Number(id) },
  })
  return new NextResponse(null, { status: 204 })
}