import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();


  const usersDirectory = path.join(process.cwd(), 'public', "UserData", "Users");

  await fs.mkdir(usersDirectory, { recursive: true });

  try {
    const files = await fs.readdir(usersDirectory);
    for (const file of files) {
      const filePath = path.join(usersDirectory, file);
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;

      const fileData = await fs.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(fileData);

      if (parsedData.token === token) {
          parsedData["devices"] = 0
        await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), 'utf-8');
        return new Response(JSON.stringify({ status: "Success" }), { status: 200 });
      }
    }

    // Jika tidak ada file yang cocok dengan token
    return new Response(JSON.stringify({ error: "Token tidak ditemukan" }), { status: 404 });
  } catch (error) {
    console.error("Error processing logout:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan saat memproses logout" }), { status: 500 });
  }
}