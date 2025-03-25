import { promises as fs } from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get('token');
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return new Response(JSON.stringify({ error: "File tidak valid atau tidak ditemukan" }), { status: 400 });
  }

  const usersDirectory = path.join(process.cwd(), 'public', "UserData", "Users");
  const publicProfileDirectory = path.join(process.cwd(), 'public', "UserData", "Profile");

  await fs.mkdir(usersDirectory, { recursive: true });
  await fs.mkdir(publicProfileDirectory, { recursive: true });

  try {
    const files = await fs.readdir(usersDirectory);
    for (const userFile of files) {
      const filePath = path.join(usersDirectory, userFile);
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;

      const fileData = await fs.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(fileData);

      if (parsedData.token === token) {
        const fileName = uniqid();
        const fileExtension = file.name.split('.').pop(); // Ambil ekstensi file
        const profileFilePath = path.join(publicProfileDirectory, `${fileName}.${fileExtension}`);

        // Simpan file ke disk
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(profileFilePath, buffer);

        // Update data pengguna dengan path gambar baru
        parsedData.ImagePath = `${fileName}.${fileExtension}`;
        await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), 'utf-8');

        return new Response(JSON.stringify({ status: "Success", imagePath: `${fileName}.${fileExtension}` }), { status: 200 });
      }
    }

    // Jika tidak ada file yang cocok dengan token
    return new Response(JSON.stringify({ error: "Token tidak ditemukan" }), { status: 404 });
  } catch (error) {
    console.error("Error processing Update Picture:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan saat memproses Memperbarui Profile" }), { status: 500 });
  }
}