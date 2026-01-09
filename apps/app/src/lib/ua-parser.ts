import { UAParser } from "ua-parser-js";

export function formatUserAgent(userAgent: string | null | undefined): string {
  if (!userAgent) return "Unknown Device";

  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();
  const os = parser.getOS();

  const browserName = browser.name || "Unknown Browser";
  const osName = os.name || "Unknown OS";

  return `${browserName} on ${osName}`;
}

export function getBrowserName(userAgent: string | null | undefined): string {
  if (!userAgent) return "Unknown";
  const parser = new UAParser(userAgent);
  return parser.getBrowser().name || "Unknown";
}
