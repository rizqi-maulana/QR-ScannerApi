import { promises as fs } from 'fs';
import path from 'path';
import { loadConfiguration } from '@/app/loadConfiguration';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const Configuration = await loadConfiguration();
  const { [Configuration?.userLoggin?.label]: TypeValue, password } = await req.json();

  if (TypeValue === Configuration.admin.Username && password === Configuration.admin.Password) {
    return new Response(JSON.stringify({ auth: "admin", adm_ac: Math.random(), user: "admin" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const usersDirectory = path.join(process.cwd(), 'public', "UserData", "Users");

  try {
    const files = await fs.readdir(usersDirectory);
    const matchingFile = files.find(file => file.includes(TypeValue));

    let userData = null;
    for (const file of files) {
      const filePath = path.join(usersDirectory, file);
         const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;
      const fileData = await fs.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(fileData);

      if (parsedData[Configuration.userLoggin.label] === TypeValue) {
        userData = parsedData;
        break;
      }
    }

    if (!matchingFile) {
      return new Response(JSON.stringify({ error: `${Configuration.userLoggin.label} tidak ditemukan` }));
    }

    if (userData.password === password) {
      return new Response(JSON.stringify({
        auth: "user",
        lgn_us: userData.token,
        user: Configuration.userLoggin.label,
      }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Password salah" }));
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan saat memproses login" }));
  }
}
