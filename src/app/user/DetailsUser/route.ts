import { promises as fs } from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
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
        return new Response(JSON.stringify({ user }), { status: 200 });
      }
    }

    return new Response(JSON.stringify({ user: "Not Found" }), { status: 404 });

  } catch (error) {
    console.error('Error occurred:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
  }
}
