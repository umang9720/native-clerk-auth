import { getAuthToken } from "./authToken";
import { base_url } from "@/config/url";

export const fetchActiveGoals = async () => {
  const token = await getAuthToken("user");

  const res = await fetch(`${base_url}/goals/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  const allGoals = data?.data?.data ?? [];

  const activeGoals = allGoals
    .filter((g: any) => g.status?.toLowerCase() === "active")
    .reverse();

  const selectedGoal = activeGoals[0] ?? null;
  const selectedGoalId = selectedGoal?.id ?? selectedGoal?._id ?? null;

  return { activeGoals, selectedGoal, selectedGoalId };
};

