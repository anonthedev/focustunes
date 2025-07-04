"use server";

import { OpenAI } from "openai";
import { Sound } from "@/components/sound-mixer/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SoundSuggestion {
  soundId: string;
  volume: number;
  reasoning: string;
}

interface GenerateMixResult {
  suggestions: SoundSuggestion[];
  description: string;
}

export async function generateSoundMix(
  prompt: string,
  soundLibrary: Sound[]
): Promise<GenerateMixResult> {
  // Format sound library for GPT context
  const soundsInfo = soundLibrary.map((sound) => ({
    id: sound.id,
    name: sound.name,
    tags: sound.tags.join(", "),
  }));

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert sound designer who creates perfect ambient soundscapes for focus and productivity. 
Your task is to analyze user prompts and suggest a combination of sounds from the available library that would create the described atmosphere.

Available sounds:
${soundsInfo.map((s) => `- ${s.name} (ID: ${s.id}) - Tags: ${s.tags}`).join("\n")}

For each suggestion, provide:
1. The sound ID
2. A volume level (0-100) that would work well in the mix
3. Brief reasoning for why this sound fits

Guidelines:
- Suggest 2-5 sounds that complement each other
- Consider volume balance (dominant sounds 60-80%, ambient sounds 30-50%, accent sounds 20-40%)
- Match the mood and environment described in the prompt
- Avoid overwhelming combinations`,
        },
        {
          role: "user",
          content: `Create a focus soundscape for: "${prompt}"

Respond in this exact JSON format:
{
  "suggestions": [
    {
      "soundId": "sound_id",
      "volume": 75,
      "reasoning": "Brief explanation"
    }
  ],
  "description": "Brief description of the overall atmosphere created"
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as GenerateMixResult;

    // Validate that suggested sounds exist in the library
    result.suggestions = result.suggestions.filter((suggestion) =>
      soundLibrary.some((sound) => sound.id === suggestion.soundId)
    );

    if (result.suggestions.length === 0) {
      throw new Error("No valid sounds found for the requested mix");
    }

    return result;
  } catch (error) {
    console.error("Error generating mix:", error);
    
    // Fallback: Try to find sounds based on keywords in the prompt
    const fallbackSuggestions: SoundSuggestion[] = [];
    const lowercasePrompt = prompt.toLowerCase();

    // Try to match sounds based on their tags
    soundLibrary.forEach((sound) => {
      const matchingTags = sound.tags.filter(tag => 
        lowercasePrompt.includes(tag.toLowerCase())
      );
      
      if (matchingTags.length > 0 && !fallbackSuggestions.some(s => s.soundId === sound.id)) {
        fallbackSuggestions.push({
          soundId: sound.id,
          volume: 50, // Default volume
          reasoning: `Matched tags: ${matchingTags.join(", ")}`
        });
      }
    });

    // If no matches found through tags, add a default mix
    if (fallbackSuggestions.length === 0) {
      throw new Error("Could not find any matching sounds for your request. Try using keywords like: rain, forest, birds, ocean, piano, etc.");
    }

    return {
      suggestions: fallbackSuggestions,
      description: "A basic soundscape created from matching keywords in your prompt"
    };
  }
}
