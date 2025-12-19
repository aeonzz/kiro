export function parseCookies(cookieHeader: string | null) {
  return Object.fromEntries(
    cookieHeader?.split("; ").map((pair) => {
      const [k, ...v] = pair.split("=");
      return [k, decodeURIComponent(v.join("="))];
    }) ?? []
  );
}
