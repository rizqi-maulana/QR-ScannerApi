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

    for (const file of files) {
      const filePath = path.join(usersDirectory, file);
         const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;
      const fileData = await fs.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(fileData);

      if (parsedData[Configuration.userLoggin.label] === TypeValue) {
        if (parsedData.devices === 1) {
            return new Response(JSON.stringify({ error: "Anda harus keluar dari perangkat sebelumnya" }), { status: 403 });
        }
        if (parsedData.password === password) {
          parsedData.devices = 1;
          await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), 'utf-8');
          return new Response(JSON.stringify({
            auth: "user",
            lgn_us: parsedData.token,
            user: Configuration.userLoggin.label,
          }), { status: 200 });
        } else {
          return new Response(JSON.stringify({ error: "Password salah" }));
        }
      }
    }


    if (!matchingFile) {
      return new Response(JSON.stringify({ error: `${Configuration.userLoggin.label} tidak ditemukan` }));
    }

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan saat memproses login" }));
  }
}
