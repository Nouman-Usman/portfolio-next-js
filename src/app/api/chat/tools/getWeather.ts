import { tool } from "ai";
import { z } from "zod";

export const getWeather = tool({
  description:
    "Return a short weather summary for a city (demo tool).",
  parameters: z.object({ city: z.string().optional() }),
  execute: async ({ city }: { city?: string }) => {
    const target = city?.trim() || "your city";
    // demo: return placeholder; real implementation would call a weather API
    return `I don't have live weather access here, but I can show a demo for ${target}.`;
  },
});