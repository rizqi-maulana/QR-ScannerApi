import { promises as fs } from 'fs';
import path from 'path';
import uniqid from 'uniqid';
import { loadConfiguration } from '@/app/loadConfiguration';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const Configuration = await loadConfiguration();
  const { OldValueType, newValueType, password, email, no_hp, alamat, SelectData, image, status, jenis_kelamin } = await req.json();

  try {
    const usersDirectory = path.join(process.cwd(), 'public', "UserData", "Users");
    const files = await fs.readdir(usersDirectory);
    let userFile;

    for (const file of files) {
      const filePath = path.join(usersDirectory, file);
  const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;
      const fileData = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      if (fileData[Configuration.userLoggin.label] === OldValueType) {
        userFile = file;
        break;
      }
    }

    if (!userFile) {
      return new Response(JSON.stringify({ message: "User tidak ditemukan" }));
    }

    const oldFilePath = path.join(usersDirectory, userFile);
    const existingData = JSON.parse(await fs.readFile(oldFilePath, 'utf-8'));

    const updatedData = {
      ...existingData,
      [Configuration.userLoggin.label]: newValueType || existingData[Configuration.userLoggin.label],
      password: password || existingData.password,
      email: email || existingData.email,
      no_hp: no_hp || existingData.no_hp,
      status,
      alamat: alamat || existingData.alamat,
      jenis_kelamin: jenis_kelamin || existingData.jenis_kelamin,
      SelectData: SelectData || existingData.SelectData,
    };

    let newFilePath = oldFilePath;
    if (newValueType && newValueType !== OldValueType) {
      const fileName = `${newValueType}_${uniqid()}`;
      newFilePath = path.join(usersDirectory, `${fileName}.json`);
      await fs.rename(oldFilePath, newFilePath);
      await fs.writeFile(newFilePath, JSON.stringify(updatedData, null, 2));
    }

    if (image) {
      const imageBuffer = Buffer.from(image, 'base64');
      const newImageName = `${newValueType || OldValueType}_${uniqid()}.jpg`;
      const publicProfileDirectory = path.join(process.cwd(), 'public', "UserData", "Profile");
      const newImagePath = path.join(publicProfileDirectory, newImageName);
      await fs.writeFile(newImagePath, imageBuffer);
      updatedData.ImagePath = newImageName;
    }

    await fs.writeFile(newFilePath, JSON.stringify(updatedData, null, 2));
    return new Response(JSON.stringify({ message: "Data user berhasil diupdate!" }), { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    return new Response(JSON.stringify({ message: "Error saat mengupdate data" }));
  }
}
