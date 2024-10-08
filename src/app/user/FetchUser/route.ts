import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const usersDirectory = path.join(process.cwd(), 'public', "UserData", "Users");

  try {
    await fs.access(usersDirectory);

    const files = await fs.readdir(usersDirectory);

    const filesData = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(usersDirectory, file);
        const content = await fs.readFile(filePath, 'utf-8');
        return {
          content: JSON.parse(content),
        };
      })
    );

    if (filesData.length === 0) {
      return new Response(JSON.stringify({ message: "No files found", length: 0 }));
    }

    return new Response(JSON.stringify({ filesData }), { status: 200 });
  } catch (error) {
    console.error("Error reading directory:", error);
    return new Response(JSON.stringify({ message: "Error reading directory" }));
  }
}
