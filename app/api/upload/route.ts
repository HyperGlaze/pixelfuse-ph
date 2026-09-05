import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('pixelfuse')
      .upload(filename, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json({ error: 'Failed to upload file to storage' }, { status: 500 });
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('pixelfuse')
      .getPublicUrl(filename);
      
    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
