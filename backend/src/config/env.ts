import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  TRUST_PROXY: z.boolean().default(false),

  // Domínios permitidos (CORS)
  ALLOWED_ORIGINS: z.string().default("https://dozeroaomilhao.com"),

  // Cookie secret (CSRF + sessão)
  COOKIE_SECRET: z.string().min(32),

  // Database (PostgreSQL)
  DATABASE_URL: z.string().startsWith("postgresql://"),

  // Download seguro
  DOWNLOAD_SECRET: z.string().min(32),
  DOWNLOAD_URL: z.string().url(),
  DOWNLOAD_FILE_PATH: z.string().optional(),

  // Token HMAC (opcional, usa DOWNLOAD_SECRET se não definido)
  TOKEN_SECRET: z.string().min(32).optional(),

  // Newsletter
  MAILCHIMP_API_KEY: z.string().optional(),
  MAILCHIMP_LIST_ID: z.string().optional(),

  // Log
  LOG_LEVEL: z.string().default("info"),
});

type Env = z.infer<typeof envSchema>;

function loadConfig(): Env {
  // Carrega .env em desenvolvimento
  if (process.env.NODE_ENV !== "production") {
    try {
      import("dotenv").then((dotenv) => dotenv.config());
    } catch {
      // dotenv não instalado - assume variáveis no ambiente
    }
  }

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Configuração inválida:", result.error.format());
    process.exit(1);
  }

  return result.data;
}

export const config = loadConfig();
