
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function explainQuadratic(a: number, b: number, c: number) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert Math Tutor. Explain the quadratic equation ${a}x² + ${b}x + ${c} = 0. 
    1. Analyze the discriminant.
    2. Explain the shape of the parabola (opens up/down).
    3. Describe the roots and what they represent on a graph.
    Keep it encouraging, clear, and use Markdown for formatting.`,
    config: {
      temperature: 0.7,
    },
  });
  return response.text;
}

export async function askTutor(question: string, a: number, b: number, c: number) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The current quadratic equation is ${a}x² + ${b}x + ${c} = 0. The student asks: "${question}". Answer them as a helpful math teacher.`,
  });
  return response.text;
}

export async function generateChallenge() {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Generate a fun quadratic equation challenge. Provide a, b, and c as integers. Ensure 'a' is not 0.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          a: { type: Type.INTEGER },
          b: { type: Type.INTEGER },
          c: { type: Type.INTEGER },
          hint: { type: Type.STRING }
        },
        required: ["a", "b", "c", "hint"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { a: 1, b: -4, c: 4, hint: "A perfect square!" };
  }
}
