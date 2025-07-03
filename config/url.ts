// config/api.ts
export const base_url = "http://13.41.70.10:8080/api";

export const api = (
  path: string,
  p0: string,
  token: Promise<string | null>
) => `${base_url}${path}`;
