import { GoogleGenAI, Type } from "@google/genai";
import { RAGChunk, AIResponse } from "../types";

// NOTE: In a real app, never expose API keys on the client side. 
// This is for demonstration purposes within this secure environment.
const apiKey = process.env.API_KEY || ''; 

// We create the instance lazily or check validity before usage
const getAIClient = () => {
  if (!apiKey) {
    throw new Error("API Key not found. Please set REACT_APP_GEMINI_API_KEY or process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_PROMPT = `
You are "LMS Pro Assistant", an educational AI assistant for students, teachers, admins, and content creators. Your job is to answer questions based on (1) provided course context and (2) general knowledge. Always prioritize the provided context and cite sources when possible.

RULES:
- Use ONLY the context provided inside triple backticks unless general knowledge is required.
- When using context, cite lesson/module titles and timestamps.
- If unsure, clearly say "I am not fully sure — please verify with your instructor."
- Keep replies simple, step-by-step, and beginner-friendly.
- Provide examples when useful.
- Never give grading decisions, deadlines, or confidential information—tell users to ask their teacher.
- Tone: friendly, neutral, international-friendly English.
- Limit responses to 200–400 words unless user asks for long-form.
- Answer ONLY educational questions; redirect inappropriate ones.

TEACHER'S PERSPECTIVE:
- Additionally, you must always provide a "teacher_insight".
- This should be a specific tip, alternative explanation, pedagogical note, or clarification of a common misconception related to the user's question, written from the perspective of an experienced instructor.
- It should be distinct from the main direct answer.
`;

export const generateStudentAnswer = async (
  query: string,
  contextChunks: RAGChunk[],
  courseName: string,
  lessonName: string
): Promise<AIResponse> => {
  const client = getAIClient();

  // 1. Format Context for Prompt
  const contextString = contextChunks.map(chunk => 
    `Course: ${chunk.metadata.course} — Lesson: ${chunk.metadata.lesson} — Timestamp ${chunk.metadata.timestamp}\nContent: "${chunk.text}"`
  ).join('\n\n');

  // 2. Construct Prompt
  const fullPrompt = `
Context: \`\`\`${contextString}\`\`\`
User question: "${query}"
User metadata: {role: "student", course: "${courseName}", lesson: "${lessonName}"}

INSTRUCTIONS TO MODEL:
Use the system prompt + the context above.
Base your answer on the context. If something is NOT in the context, give a general explanation and mention that context didn’t cover this part.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            teacher_insight: { type: Type.STRING, description: "A pedagogical tip, common pitfall, or alternative explanation from a teacher's view." },
            sources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  lesson: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                }
              }
            },
            confidence_score: { type: Type.NUMBER }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback response in case of API failure
    return {
      answer: "I'm having trouble connecting to the AI tutor right now. Please try again later.",
      sources: [],
      confidence_score: 0
    };
  }
};

export const generateQuiz = async (transcript: string) => {
  const client = getAIClient();
  const prompt = `
  You are an educational content assistant for LMS Pro. Based on the lesson transcript below, generate:
  1) 5 multiple-choice questions (MCQs) with 4 options each + correct answer.
  2) 3 short-answer questions with marking rubrics (2–3 bullet points each).
  3) A quick formative exercise (2 minutes) + learning objective.

  Context:
  \`\`\`${transcript}\`\`\`
  
  Return the output in Markdown format.
  `;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text;
};

export const generateCourseDescription = async (title: string, category: string, level: string) => {
  const client = getAIClient();
  const prompt = `
  You are an expert Proffessor. Write a compelling and educational course description for a course with the following details:
  
  Title: ${title}
  Category: ${category}
  Level: ${level}
  
  The description should be:
  1. Engaging and professional.
  2. Highlight key learning outcomes.
  3. About 100-150 words long.
  4. Formatted as a single paragraph or two short paragraphs.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate description. Please try again.";
  }
};
