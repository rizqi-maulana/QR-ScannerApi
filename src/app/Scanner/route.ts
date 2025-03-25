import { promises as fs } from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';
import { AbsensiItem } from '../user/ScannerChecker/route';

interface DataStatusProps {
  // data: {
    date: string;
    time: string;
    status: string;
    Keterangan?: string;
  // }[];
}

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const usersDirectory = path.join(process.cwd(), 'public', "UserData", "Users");

  try {
    const files = await fs.readdir(usersDirectory);

    let userData = null;

    for (const file of files) {
      const filePath = path.join(usersDirectory, file);
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;
      const fileData = await fs.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(fileData);

      if (parsedData.token === token) {
        const attendanceRecord = parsedData.absensi.filter(
          (item: AbsensiItem) => item.date === new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        );
  
          const resultHadir = attendanceRecord?.find((data: DataStatusProps) => data?.status == "Hadir") !== undefined ? true : false
          const resultTanpaKet = attendanceRecord?.find((data: DataStatusProps) => data?.status == "Tanpa Keterangan") !== undefined ? true : false
          
          if (resultHadir) {
            parsedData.absensi.unshift({
              date: new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
              time: new Date().toLocaleTimeString("id-ID", { hour: 'numeric', minute: 'numeric', hour12: true }),
              status: "Pulang",
            });
          } else {
            if (resultTanpaKet) {
                return new Response(JSON.stringify({ error: "Tidak dapat mencatat absensi karena status 'Tanpa Keterangan' ditemukan" }), { status: 400 });
            } else {
              parsedData.Keterangan.Hadir += 1;
              parsedData.absensi.unshift({
                date: new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                time: new Date().toLocaleTimeString("id-ID", { hour: 'numeric', minute: 'numeric', hour12: true }),
                status: "Hadir",
              });
            }
          }

        await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), 'utf-8');

        userData = parsedData;
        break;
      }
    }

    if (!userData) {
      return new Response(JSON.stringify({ error: "User tidak ditemukan" }), {status: 404});
    }

    return new Response(JSON.stringify({ status: "Success" }), { status: 200 });
  } catch (error) {
    console.error("Error processing login:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan saat memproses login" }));
  }
}
