const isDev = process.env.ENVIRONMENT !== "prod";

type LogLevel = "log" | "error" | "warn" | "info";

function format(level: LogLevel, args: any[]) {
  return [`[${level.toUpperCase()}]`, new Date().toISOString(), ...args];
}

export const Logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...format("log", args));
  },

  info: (...args: any[]) => {
    if (isDev) console.info(...format("info", args));
  },

  warn: (...args: any[]) => {
    console.warn(...format("warn", args));
  },

  error: (...args: any[]) => {
    console.error(...format("error", args));
  },
};