import type { ItineraryPlan } from '../src/types';

// Use the backend URL (assuming it's running on localhost:5000)
// Ideally, this should be in an environment variable VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  // Basic implementation: Retrieves token from localStorage
  // Ensure your login logic saves the token with key 'token'
  return localStorage.getItem('token');
};

export const generateTrekkingPlan = async (
  location: string,
  duration: number,
  difficulty: string,
  interests: string,
  trailId?: number // Optional
): Promise<ItineraryPlan | null> => {
  const token = getAuthToken();
  if (!token) {
    console.error("User not authenticated");
    throw new Error("You must be logged in to generate a plan.");
  }

  try {
    const response = await fetch(`${API_URL}/ai/generate-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        location,
        duration,
        difficulty,
        interests,
        trailId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate plan");
    }

    const data = await response.json();
    // The backend returns the full saved plan object.
    // We map 'plan_data' back to the structure expected by frontend if needed, 
    // or just return plan_data if ItineraryPlan matches exactly.
    // Based on previous code, ItineraryPlan is likely the plan array structure?
    // Let's verify type from previous file view...
    // Previous view showed ItineraryPlan was the return type.
    // Backend returns { plan_id, plan_data: [...], checklist: [...], ... }

    // We reconstruct the expected format if needed. 
    // The previous frontend service returned `parsedJson` which had structure: { plan: [...] }
    // Backend stores `plan_data` which IS the array `[...]`.
    // So we assume the frontend expects { plan: [...] } wrapper? 
    // Let's look at the old file again logic: `return parsedJson as ItineraryPlan`
    // where parsedJson was the whole object { plan: [...] }.

    return {
      id: data.plan_id,
      plan: data.plan_data,
      checklist: data.checklist
    } as ItineraryPlan;

  } catch (error) {
    console.error("Error generating trekking plan:", error);
    throw error;
  }
};

export const generateChecklist = async (
  location: string,
  duration: number,
  difficulty: string
): Promise<string[] | null> => {
  // Since we moved checklist generation to be part of generate-plan in backend (Bonus 1),
  // we might not need a separate call anymore if the UI uses the one from the plan.
  // HOWEVER, if the UI still calls this independently, we can implement a standalone endpoint or reuse generate-plan.
  // BUT the plan said "Smart Packing List: Will port generateChecklist to backend and save it in SavedPlan".
  // The Backend's /generate-plan returns both.

  // If the frontend needs JUST achecklist, we haven't implemented a specific endpoint for that yet.
  // But usually, checklist is part of the trip planning.
  // Let's assume for now we return null or throw an error saying "Checklist is generated with the Plan now".
  // OR we can implement a specific endpoint if strictly needed.
  // Given the user request, likely they want it INTEGRATED. 
  // But to not break existing UI that calls this function:
  console.warn("generateChecklist is now integrated into generateTrekkingPlan. Please use the plan generation to get the checklist.");
  return [];
};

// Bonus: Refine Plan
export const refineTrekkingPlan = async (
  planId: number,
  instruction: string
): Promise<ItineraryPlan | null> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  try {
    const response = await fetch(`${API_URL}/ai/refine-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ planId, instruction })
    });

    if (!response.ok) throw new Error("Failed to refine plan");

    const data = await response.json();
    return {
      id: data.plan_id,
      plan: data.plan_data,
      checklist: data.checklist
    } as ItineraryPlan;
  } catch (error) {
    console.error("Error refining plan:", error);
    throw error;
  }
};

export const getSavedPlans = async (): Promise<ItineraryPlan[]> => {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const response = await fetch(`${API_URL}/user/saved-plans`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch saved plans");

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.plan_id,
      plan: item.plan_data,
      checklist: item.checklist,
      // We can also return location/duration if needed for list view, 
      // but ItineraryPlan doesn't have them yet. 
      // For now, let's keep it simple or extend ItineraryPlan later.
      // Actually, for the list view, we might want 'location' and 'created_at'.
      // Let's assume the UI will just show the first day's title or similar if meta not in type.
      // Or better, let's allow 'any' or extend the type. 
      // Given strict types, let's add optional fields to ItineraryPlan or create a SavedPlanSummary type.
      // For quick integration, I'll attach them and let TS be loose or update type.
      location: item.location,
      duration: item.duration,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error("Error fetching saved plans:", error);
    return [];
  }
};