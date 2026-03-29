// Note: Don't forget to update ServiceEnv when you change here
export interface IEnv {
  MODE_EXPORT_API_SCHEMA?: string;

  ENV_NAME: string;
  BUILD_TIME?: string;
  BUILD_ID?: string;

  DEMO?: string;

  PORT: string;

  DB_MIG_DIR: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_RESET_EACH_RUN?: boolean;

  STORAGE_DISK_PATH?: string;
  STORAGE_S3_ENDPOINT?: string;
  STORAGE_S3_REGION?: string;
  STORAGE_S3_BUCKET?: string;
  STORAGE_S3_ACCESS_KEY_ID?: string;
  STORAGE_S3_SECRET_ACCESS_KEY?: string;

  AMQP_HOST?: string;
  AMQP_PORT?: number;
  AMQP_USER?: string;
  AMQP_PASSWORD?: string;

  QUEUE_AGENT_READINGS?: string;
  QUEUE_AGENT_STATS?: string;
  QUEUE_REPORT_RENDER?: string;
  QUEUE_REPORT_PDF?: string;
  QUEUE_ANALYZER_FEATURE_ELIMINATION?: string;
  QUEUE_ANALYZER_FEATURE_ELIMINATION_RESULT?: string;

  TOLGEE_API_URL?: string;
  TOLGEE_API_KEY?: string;
  TOLGEE_PROJECT_ID?: string;

  PRIVATE_INTEGRATION_PROXY_URL?: string;
  PRIVATE_INTEGRATION_PROXY_USER?: string;
  PRIVATE_INTEGRATION_PROXY_PASSWORD?: string;

  ISSUE_REPORT_MATRIX_HOST?: string;
  ISSUE_REPORT_MATRIX_ROOM_ID?: string;
  ISSUE_REPORT_MATRIX_ACCESS_TOKEN?: string;

  SECURE_COOKIE: boolean;
  COOKIE_SECRET: string;
  HCAPTCHA_SECRET_KEY?: string;
  WORKSPACE_ROOT_DOMAINS: string[];

  OTEL_TRACE_EXPORT_URL?: string;
  LOG_LEVEL?: string;
  LOG_LOKI_ENDPOINT?: string;
  WEATHER_API_TOKEN?: string;
  OPEN_WEATHER_API_TOKEN?: string;
}
