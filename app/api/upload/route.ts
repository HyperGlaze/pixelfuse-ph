import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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
      throw error;
    }
    
    // Get public URL
    const publicUrl = supabase.storage
      .from('pixelfuse')
      .getPublicUrl(filename).data.publicUrl;
      
    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error: any) {
    console.error('Upload API Error details:', error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
