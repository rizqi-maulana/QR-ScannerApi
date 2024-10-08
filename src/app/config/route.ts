import path from 'path';
import { revalidatePath } from 'next/cache';
import fs from 'fs';

export async function GET() {
  revalidatePath("/config");
  try {
    const configPath = path.join(process.cwd(), "config.json");
    const config = await fs.promises.readFile(configPath, "utf8");
    const file = JSON.parse(config);

    return new Response(JSON.stringify(file), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error loading configuration:", error);
    return new Response(JSON.stringify({ error: "Failed to load configuration" }));
  }
}
