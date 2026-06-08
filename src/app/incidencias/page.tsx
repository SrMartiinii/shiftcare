'use client'

import { useEffect, useState } from 'react'

type Incidencia = {
  id: number
  titulo: string
  descripcion: string
  estado: 'ABIERTA' | 'EN_PROGRESO' | 'RESUELTA'
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA'
  categoria: 'EQUIPAMIENTO' | 'PERSONAL' | 'PACIENTE' | 'OTRO'
  asignadoA: string | null
  createdAt: string
}

const estadoColor = {
  ABIERTA: 'bg-red-100 text-red-700',
  EN_PROGRESO: 'bg-yellow-100 text-yellow-700',
  RESUELTA: 'bg-green-100 text-green-700',
}

const prioridadColor = {
  BAJA: 'bg-gray-100 text-gray-600',
  MEDIA: 'bg-orange-100 text-orange-600',
  ALTA: 'bg-red-100 text-red-700',
}

const empty = {
  titulo: '', descripcion: '', estado: 'ABIERTA',
  prioridad: 'MEDIA', categoria: 'OTRO', asignadoA: '',
}

export default function IncidenciasPage() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([])
  const [form, setForm] = useState<typeof empty>(empty)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  async function cargar() {
    const res = await fetch('/api/incidencias')
    setIncidencias(await res.json())
  }

  useEffect(() => { cargar() }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (editId) {
      await fetch(`/api/incidencias/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setEditId(null)
    } else {
      await fetch('/api/incidencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setForm(empty)
    setLoading(false)
    cargar()
  }

  async function eliminar(id: number) {
    if (!confirm('¿Eliminar esta incidencia?')) return
    await fetch(`/api/incidencias/${id}`, { method: 'DELETE' })
    cargar()
  }
async function cambiarEstado(id: number, estadoActual: string) {
  const siguienteEstado = {
    ABIERTA: 'EN_PROGRESO',
    EN_PROGRESO: 'RESUELTA',
    RESUELTA: 'ABIERTA',
  }[estadoActual] ?? 'ABIERTA'

  await fetch(`/api/incidencias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estadoActual, nuevoEstado: siguienteEstado }),
  })
  cargar()
}
  function editar(inc: Incidencia) {
    setEditId(inc.id)
    setForm({
      titulo: inc.titulo, descripcion: inc.descripcion,
      estado: inc.estado, prioridad: inc.prioridad,
      categoria: inc.categoria, asignadoA: inc.asignadoA ?? '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">ShiftCare</h1>
        <p className="text-gray-500 mb-8">Gestión de incidencias</p>

        {/* Formulario */}
        <form onSubmit={guardar} className="bg-white rounded-2xl shadow p-6 mb-10 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {editId ? '✏️ Editar incidencia' : '➕ Nueva incidencia'}
          </h2>
          <input
            required
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            placeholder="Título"
            className="w-full border rounded-lg px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            required
            value={form.descripcion}
            onChange={e => setForm({ ...form, descripcion: e.target.value })}
            placeholder="Descripción"
            rows={3}
            className="w-full border rounded-lg px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <select
              value={form.estado}
              onChange={e => setForm({ ...form, estado: e.target.value as any })}
              className="border rounded-lg px-3 py-2 text-sm text-gray-800"
            >
              <option value="ABIERTA">Abierta</option>
              <option value="EN_PROGRESO">En progreso</option>
              <option value="RESUELTA">Resuelta</option>
            </select>
            <select
              value={form.prioridad}
              onChange={e => setForm({ ...form, prioridad: e.target.value as any })}
              className="border rounded-lg px-3 py-2 text-sm text-gray-800"
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>
            <select
              value={form.categoria}
              onChange={e => setForm({ ...form, categoria: e.target.value as any })}
              className="border rounded-lg px-3 py-2 text-sm text-gray-800"
            >
              <option value="EQUIPAMIENTO">Equipamiento</option>
              <option value="PERSONAL">Personal</option>
              <option value="PACIENTE">Paciente</option>
              <option value="OTRO">Otro</option>
            </select>
            <input
              value={form.asignadoA}
              onChange={e => setForm({ ...form, asignadoA: e.target.value })}
              placeholder="Asignado a"
              className="border rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear incidencia'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setForm(empty) }}
                className="px-6 py-2 rounded-lg text-sm border text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Listado */}
        <div className="space-y-4">
          {incidencias.length === 0 && (
            <p className="text-center text-gray-400 py-12">No hay incidencias todavía.</p>
          )}
          {incidencias.map(inc => (
            <div key={inc.id} className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${estadoColor[inc.estado]}`}>{inc.estado.replace('_', ' ')}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${prioridadColor[inc.prioridad]}`}>{inc.prioridad}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600">{inc.categoria}</span>
                </div>
                <h3 className="font-semibold text-gray-800">{inc.titulo}</h3>
                <p className="text-sm text-gray-500 mt-1">{inc.descripcion}</p>
                {inc.asignadoA && <p className="text-xs text-gray-400 mt-2">👤 {inc.asignadoA}</p>}
              </div>
<div className="flex gap-2 shrink-0">
                <button onClick={() => cambiarEstado(inc.id, inc.estado)}
                  className="text-sm px-4 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50">
                  {inc.estado === 'ABIERTA' ? '▶ Iniciar' : inc.estado === 'EN_PROGRESO' ? '✓ Resolver' : '↩ Reabrir'}
                </button>
                <button onClick={() => editar(inc)} className="text-sm px-4 py-1.5 rounded-lg border text-gray-700 hover:bg-gray-50">Editar</button>
                <button onClick={() => eliminar(inc.id)} className="text-sm px-4 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Borrar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}