import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
 const { token } = await req.json();

  const UserDirectory = path.join(process.cwd(), 'public', "UserData", "Users");

  try {
    const files = await fs.readdir(UserDirectory);
    for (const file of files) {
      const filePath = path.join(UserDirectory, file);
      const stat = await fs.stat(filePath);

      if (!stat.isFile()) continue;

      const Data = await fs.readFile(filePath, 'utf-8');
      const user = JSON.parse(Data);

      if (user.token === token) {
        user.status = true
        await fs.writeFile(filePath, JSON.stringify(user, null, 2), 'utf-8');
        return new Response(JSON.stringify({ status: "Success" }), { status: 200 });
      }
    }

    // Jika tidak ada file yang cocok dengan token
    return new Response(JSON.stringify({ error: "Token tidak ditemukan" }), { status: 404 });

  } catch (error) {
    console.error('Error occurred:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}