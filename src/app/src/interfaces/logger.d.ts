interface Logger {
  log(message: string, source?: string, level = "info"): void;
}

export { Logger };
