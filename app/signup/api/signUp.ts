import { base_url } from "@/config/url";

export const submitOnboardingData = async (payload: any) => {
  const response = await fetch(`${base_url}/create/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("API submission failed");
  }

  return response.json();
};
