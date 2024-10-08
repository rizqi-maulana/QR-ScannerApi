import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


async function loadConfiguration() {
  const configPath = path.join(process.cwd(), "config.json");
  const configData = await fs.readFile(configPath, "utf8");
  return JSON.parse(configData);
}

interface UserData {
  token?: string;
  tokenExpiry?: number;
  [key: string]: any;
}

async function updateTokens(expirationHours: number): Promise<void> {
  console.log('Starting token update process...');
  console.log('----------------------------------------------------------------------------------');

  try {
    const expirationTime = expirationHours * 60 * 60 * 1000;
    const usersDirectory = path.join(process.cwd(), 'UserData', 'Users');

    // Periksa apakah folder users ada
    try {
      await fs.access(usersDirectory);
    } catch (err: any) {
      console.error('Users directory does not exist:', err.message);
      return;
    }

    const files = await fs.readdir(usersDirectory);
    const now = Date.now();

    console.log(`Current time: ${new Date(now).toISOString()}`);

    for (const file of files) {
      const filePath = path.join(usersDirectory, file);

      try {
        const data: UserData = JSON.parse(await fs.readFile(filePath, 'utf-8'));

        console.log(`Processing file: ${file}`);
        console.log(`[Before] Token: ${data.token}, Token expiry: ${data.tokenExpiry}`);

        if (!data.token || data.tokenExpiry === undefined) {
          console.log(`[Action] Initializing token and tokenExpiry for file: ${file}`);
          data.token = uuidv4();
          data.tokenExpiry = now + expirationTime;
          await fs.writeFile(filePath, JSON.stringify(data, null, 2));
          console.log(`[After] Token: ${data.token}, Token expiry: ${new Date(data.tokenExpiry).toISOString()}`);
          console.log('----------------------------------------------------------------------------------');
        } else if (now > data.tokenExpiry) {
          console.log(`[Action] Updating expired token for file: ${file}`);
          data.token = uuidv4();
          data.tokenExpiry = now + expirationTime;
          await fs.writeFile(filePath, JSON.stringify(data, null, 2));
          console.log(`[After] Token: ${data.token}, Token expiry: ${new Date(data.tokenExpiry).toISOString()}`);
          console.log('----------------------------------------------------------------------------------');
        } else {
          console.log(`[Action] Token not updated for file ${file}. Current expiry: ${new Date(data.tokenExpiry).toISOString()}`);
          console.log('----------------------------------------------------------------------------------');

        }
      } catch (err: any) {
        console.error(`Error reading or updating file ${file}:`, err.message);
      }
    }
  } catch (error: any) {
    console.error('Error updating tokens:', error.message);
  }
}

export async function startTokenUpdater(expirationHours: number, checkIntervalMinutes: number): Promise<void> {
  console.log(`Starting token updater with expirationHours: ${expirationHours} and checkIntervalMinutes: ${checkIntervalMinutes}`);
  await updateTokens(expirationHours);
  setInterval(async () => {
    console.log('Checking for expired tokens...');
    await updateTokens(expirationHours);
  }, checkIntervalMinutes * 60 * 1000);
}

const Runner = async () => {
  const Configuration = await loadConfiguration();
  startTokenUpdater(Configuration.UpdateUserToken.hour, Configuration.UpdateUserToken.minute);
};

Runner()

