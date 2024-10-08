import { promises as fs } from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const usersDirectory = path.join(process.cwd(), 'public', "UserData", "Users");

  try {
    const files = await fs.readdir(usersDirectory);

    let userData = null;
    let TypeValue = null;

    for (const file of files) {
      const filePath = path.join(usersDirectory, file);
      const fileData = await fs.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(fileData);

      if (parsedData.token === token) {
        parsedData.Keterangan.Hadir += 1;
        parsedData.absensi.unshift({
          date: new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: new Date().toLocaleTimeString("id-ID", { hour: 'numeric', minute: 'numeric', hour12: true }),
          status: "Hadir",
        });

        await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), 'utf-8');

        userData = parsedData;
        TypeValue = parsedData.TypeValue;
        break;
      }
    }

    if (!userData) {
      return new Response(JSON.stringify({ error: "TypeValue tidak ditemukan" }));
    }

    return new Response(JSON.stringify({ status: "Log", TypeValue }), { status: 200 });
  } catch (error) {
    console.error("Error processing login:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan saat memproses login" }));
  }
}
