import { getAuthToken } from "./authToken";
import { base_url } from "@/config/url";

export const fetchGoals = async () => {
  try {
    const token = await getAuthToken("user");
    console.log("🔑 Token:", token);

    const res = await fetch(`${base_url}/goals/user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📡 Response status:", res.status);

    const data = await res.json();
    console.log("📦 Raw response data:", data);

    const allGoals = data?.data?.data ?? [];
    console.log("✅ Extracted goals:", allGoals);

return allGoals.reverse(); // newest first
  } catch (err) {
    console.error("❌ Error fetching goals:", err);
    return [];
  }
};
