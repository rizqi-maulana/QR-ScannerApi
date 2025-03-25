import { promises as fs } from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const token = formData.get('token');
  const FromDate = formData.get('FromDate');
  const UntilDate = formData.get('UntilDate');
  const IzinMessage = formData.get('IzinMessage');
  const IzinOptions = formData.get('IzinOptions');
  const ProofImage = formData.get('ProofImage');

  // Validasi data yang diperlukan
  if (!token || !FromDate || !UntilDate || !IzinMessage || !IzinOptions) {
    return new Response(JSON.stringify({ error: "Data tidak lengkap" }), { status: 400 });
  }

  const usersDirectory = path.join(process.cwd(), 'public', "UserData", "Users");
  const publicSuratIzinDirectory = path.join(process.cwd(), 'public', "UserData", "SuratIzin");

  // Buat direktori jika belum ada
  await fs.mkdir(usersDirectory, { recursive: true });
  await fs.mkdir(publicSuratIzinDirectory, { recursive: true });

  try {
    const files = await fs.readdir(usersDirectory);
    for (const file of files) {
      const filePath = path.join(usersDirectory, file);
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;

      const fileData = await fs.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(fileData);

      if (parsedData.token === token) {
        // Generate nama file unik
        const fileName = `${new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}_${uniqid()}`;
        const fileExtension = ProofImage ? ProofImage.name.split('.').pop() : 'jpg'; // Ambil ekstensi file
        const profileFilePath = path.join(publicSuratIzinDirectory, `${fileName}.${fileExtension}`);

        // Simpan gambar jika ada
        if (ProofImage) {
          const buffer = Buffer.from(await ProofImage.arrayBuffer());
          await fs.writeFile(profileFilePath, buffer);
        }

        // Update data pengguna
        parsedData.Keterangan.Izin += 1;
        parsedData.absensi.unshift({
          date: new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time: new Date().toLocaleTimeString("id-ID", { hour: 'numeric', minute: 'numeric', hour12: true }),
          from: FromDate,
          until: UntilDate,
          proof: ProofImage ? `${fileName}.${fileExtension}` : null, // Simpan nama file gambar
          status: "Izin",
          Description: IzinMessage,
          Keterangan: IzinOptions,
        });

        // Simpan perubahan ke file
        await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2), 'utf-8');
        return new Response(JSON.stringify({ status: "Success" }), { status: 200 });
      }
    }

    // Jika tidak ada file yang cocok dengan token
    return new Response(JSON.stringify({ error: "Token tidak ditemukan" }), { status: 404 });
  } catch (error) {
    console.error("Error processing izin:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan saat memproses izin" }), { status: 500 });
  }
}