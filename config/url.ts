// config/api.ts
export const base_url = "https://androidapi.xombus.com/api";

export const api = (
  path: string,
  p0: string,
  token: Promise<string | null>
) => `${base_url}${path}`;
