import { promises as fs } from 'fs';
import { revalidatePath } from 'next/cache';
import path from 'path';

export async function GET() {
  revalidatePath("/user/FetchUser");
  const usersDirectory = path.join(process.cwd(), 'public', "UserData", "Users");

  try {
    await fs.access(usersDirectory);

    const files = await fs.readdir(usersDirectory);

    const filesData = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(usersDirectory, file);
        
        const stat = await fs.stat(filePath);
        if (!stat.isFile() || !file.endsWith('.json')) {
          return null; // Skip jika bukan file atau bukan file JSON
        }
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
      })
    );

    // Filter out null values (skipped files)
    const validUsers = filesData.filter(user => user !== null);

    if (validUsers.length === 0) {
      return new Response(JSON.stringify({ message: "No files found", total: 0 }), {status: 404});
    }

    // Hitung jumlah aktif dan tidak aktif
    const aktif = validUsers.filter(user => user.status === true).length;
    const tidakAktif = validUsers.filter(user => user.status === false).length;

    return new Response(JSON.stringify({ 
      filesData, 
      total: validUsers.length, 
      aktif, 
      tidakAktif
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error reading directory:", error);
    return new Response(JSON.stringify({ message: "Error reading directory" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}