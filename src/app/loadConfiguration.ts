import path from 'path';
import { promises as fs } from 'fs';

export async function loadConfiguration() {
  try {
    const configPath = path.join(process.cwd(), "config.json");
    const configData = await fs.readFile(configPath, "utf8");
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
}
