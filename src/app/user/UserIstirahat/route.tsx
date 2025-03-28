import { promises as fs } from "fs";
import path from "path";
import { loadConfiguration } from "@/app/loadConfiguration";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const Configuration = await loadConfiguration();
  const { TypeValue, status } = await req.json();
  const usersDirectory = path.join(
    process.cwd(),
    "public",
    "UserData",
    "Users"
  );

  try {
    const files = await fs.readdir(usersDirectory);
    for (const file of files) {
      const filePath = path.join(usersDirectory, file);
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;
      const fileData = await fs.readFile(filePath, "utf-8");
      const parsedData = JSON.parse(fileData);

      if (parsedData[Configuration.userLoggin.label] === TypeValue) {
        parsedData.absensi.unshift({
          date: new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: new Date().toLocaleTimeString("id-ID", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          status:
            status === "Mulai Istirahat"
              ? "Mulai Istirahat"
              : "Selesai Istirahat",
        });

        await fs.writeFile(
          filePath,
          JSON.stringify(parsedData, null, 2),
          "utf-8"
        );
        return new Response(JSON.stringify({ status: "Success" }), {
          status: 200,
        });
      }
    }
  } catch (error) {
    console.error("Error processing izin:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan saat memproses izin" })
    );
  }
}
