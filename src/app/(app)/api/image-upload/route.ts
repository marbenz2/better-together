import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const supabase = createClient()

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const id = formData.get('id') as string

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei hochgeladen' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `media/${id}/${fileName}`

    const { data, error } = await supabase.storage
      .from('better-together-media')
      .upload(filePath, file)

    if (error) {
      throw error
    }

    const { data: urlData } = supabase.storage.from('better-together-media').getPublicUrl(filePath)

    return NextResponse.json({ imageUrl: urlData.publicUrl })
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error)
    return NextResponse.json({ error: 'Fehler beim Hochladen des Bildes' }, { status: 500 })
  }
}
