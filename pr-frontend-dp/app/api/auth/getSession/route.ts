import { NextResponse } from 'next/server';
import { getSession } from '@/lib/getSession';

export async function GET() {
  try {
    // Usamos directamente la función getSession del servidor
    const session = await getSession();
    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    return NextResponse.json(
      { error: 'Error al obtener la sesión' },
      { status: 500 }
    );
  }
}
