import { promises as fs } from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
  const { TypeValue } = await req.json();
  const UserDirectory = path.join(process.cwd(), 'public', "UserData", "Users");

  const files = await fs.readdir(UserDirectory);
  const matchingFile = files.find(file => file.includes(TypeValue));

  if (!matchingFile) {
    return new Response(JSON.stringify({ message: "User not found" }));
  }

  const filePath = path.join(UserDirectory, matchingFile);
  const Data = await fs.readFile(filePath, 'utf-8');
  const user = JSON.parse(Data);

  return new Response(JSON.stringify({ user }), { status: 200 });
}
