import { promises as fs } from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import { v4 as uuidv4 } from 'uuid';
import { loadConfiguration } from '@/app/loadConfiguration';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const Configuration = await loadConfiguration();
  const { [Configuration.userLoggin.label]: TypeValue, nama, password, email, no_hp, alamat, SelectData, image, jenis_kelamin, status } = await req.json();

  try {
    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const expirationHours = 24;
    const UserExpirationTime = Date.now() + expirationHours * 60 * 60 * 1000;
    const RandomBackground = Configuration.RandomColor.BackGround[Math.floor(Math.random() * Configuration.RandomColor.BackGround.length)];
    const RandomText = Configuration.RandomColor.Text[Math.floor(Math.random() * Configuration.RandomColor.Text.length)];

    const publicProfileDirectory = path.join(process.cwd(), 'public', "UserData", "Profile");
    const fileName = `${TypeValue}_${uniqid()}`;
    const jsonFilePath = path.join(process.cwd(), 'public', "UserData", "Users", `${fileName}.json`);
    const profileFilePath = path.join(publicProfileDirectory, `${fileName}.jpg`);

    await fs.mkdir(publicProfileDirectory, { recursive: true });

    const data = {
      [Configuration.userLoggin.label]: TypeValue,
      nama,
      password,
      email,
      no_hp,
      alamat,
      jenis_kelamin,
      status,
      Color: { BackGround: RandomBackground, Text: RandomText },
      Keterangan: { Hadir: 0, Izin: 0, TanpaKeterangan: 0 },
      ImagePath: `${fileName}.jpg`,
      SelectData,
      token: uuidv4(),
      tokenExpiry: UserExpirationTime,
      absensi: [],
    };

    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2));
    await fs.writeFile(profileFilePath, buffer);

    return new Response(JSON.stringify({ message: "Data berhasil di Tambahkan!" }), { status: 200 });
  } catch (error) {
    console.error("Error saving data:", error);
    return new Response(JSON.stringify({ message: "Error saving data" }));
  }
}
