import { promises as fs } from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';

export async function DELETE(req: NextRequest) {
  const { TypeValue } = await req.json();

  if (!TypeValue) {
    return new Response(JSON.stringify({ message: "TypeValue is required" }));
  }

  const UserDirectory = path.join(process.cwd(), 'public', "UserData", "Users");
  const files = await fs.readdir(UserDirectory);

  const matchingFile = files.find(file => file.includes(TypeValue));

  if (!matchingFile) {
    return new Response(JSON.stringify({ message: "User not found" }));
  }

  const filePath = path.join(UserDirectory, matchingFile);
      const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      console.error("Error: Path mengarah ke direktori.");
    }
  await fs.unlink(filePath);

  return new Response(JSON.stringify({ status: 200, message: "User deleted successfully" }), { status: 200 });
}
