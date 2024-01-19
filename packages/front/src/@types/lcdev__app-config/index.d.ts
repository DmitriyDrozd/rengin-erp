// AUTO GENERATED CODE
// Run app-config with 'generate' command to regenerate this file

import '@app-config/main';

export interface Config {
  LOG_ROCKET?: string;
  MONGO_URI: string;
  port?: number;
  POSTGRES_URI: string;
  WRITE_PG?: boolean;
}

// augment the default export from app-config
declare module '@app-config/main' {
  export interface ExportedConfig extends Config {}
}
