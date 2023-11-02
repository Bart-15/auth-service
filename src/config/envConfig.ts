import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface ENV {
  AUTH0_PUBLIC_KEY: string | undefined;
}

interface Config {
  AUTH0_PUBLIC_KEY: string;
}

export const getConfig = (): ENV => {
  return {
    AUTH0_PUBLIC_KEY: process.env.AUTH0_PUBLIC_KEY,
  };
};

const getSanitezedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitezedConfig(config);

export default sanitizedConfig;
