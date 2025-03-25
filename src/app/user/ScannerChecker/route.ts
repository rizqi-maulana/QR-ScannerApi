import { promises as fs } from 'fs';
import path from 'path';

export interface AbsensiItem {
  date: string;
  status: string;
}

interface UserData {
  token: string;
  absensi: AbsensiItem[];
}

export async function POST(req: Request) {
  const { Date, token } = await req.json();
  const UserDirectory = path.join(process.cwd(), 'public', "UserData", "Users");
  const files = await fs.readdir(UserDirectory);

  for (const file of files) {
    const filePath = path.join(UserDirectory, file);
        const stat = await fs.stat(filePath);
    if (!stat.isFile()) continue;
    const fileData = await fs.readFile(filePath, 'utf-8');
    const parsedData: UserData = JSON.parse(fileData);

    if (parsedData.token === token) {
      const attendanceRecord = parsedData.absensi.filter(
        (item: AbsensiItem) => item.date === Date
      );

      if (attendanceRecord) {
        return new Response(JSON.stringify({ data: attendanceRecord }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ status: "Tidak Hadir" }), { status: 200 });
      }
    }
  }

  return new Response(JSON.stringify({ status: "User not found" }));
}
