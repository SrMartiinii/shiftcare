-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ABIERTA', 'EN_PROGRESO', 'RESUELTA');

-- CreateEnum
CREATE TYPE "Prioridad" AS ENUM ('BAJA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('EQUIPAMIENTO', 'PERSONAL', 'PACIENTE', 'OTRO');

-- CreateTable
CREATE TABLE "Incidencia" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ABIERTA',
    "prioridad" "Prioridad" NOT NULL DEFAULT 'MEDIA',
    "categoria" "Categoria" NOT NULL DEFAULT 'OTRO',
    "asignadoA" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incidencia_pkey" PRIMARY KEY ("id")
);
