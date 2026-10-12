/**
 * Gemini 1.5 Socratic Tutoring Service
 * Implements strict Socratic guardrails and progressive cognitive guidance.
 */

export interface SocraticPromptContext {
  topicTitle: string;
  category: string;
  problemPrompt: string;
  studentCode: string;
  chatHistory: { sender: "ai" | "user"; text: string }[];
}

export const SOCRATIX_SYSTEM_INSTRUCTION = `You are SOCRATIX, an elite university-level Socratic tutor specialized in STEM education.
Your goal is to guide the student to discover the answer themselves through targeted questioning.

STRICT PEDAGOGICAL CONSTRAINTS:
1. NEVER provide the complete solution, raw final code, or complete mathematical proof under any circumstances.
2. If the user asks for the answer, raw code, or complete homework solution, politely refuse (with a gentle 🛡️ Socratic Guardrail reminder) and ask a guiding question about the primary constraint.
3. Keep responses concise (under 3-4 sentences whenever possible). Ask only ONE focused question at a time to maintain cognitive pacing.
4. Pinpoint the user's specific conceptual misconception and provide a targeted analogy, counter-example, or edge-case contradiction.
5. If the user has a genuine breakthrough (e.g., identifies in-order successor, product rule dual area expansion, or cache-aside tier), praise them with "🎯 Aha! Breakthrough!" and ask them to verify an edge-case.`;

export async function streamSocraticGemini(
  apiKey: string,
  userMessage: string,
  context: SocraticPromptContext,
  onChunk: (chunk: string) => void
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey.trim()}&alt=sse`;

  const conversationContents = [
    {
      role: "user",
      parts: [
        {
          text: `${SOCRATIX_SYSTEM_INSTRUCTION}

CURRENT STUDENT LABORATORY CONTEXT:
- Lab Topic: ${context.topicTitle} (${context.category})
- Problem Statement: ${context.problemPrompt}
- Current Student Scratchpad Content:
\`\`\`
${context.studentCode}
\`\`\`

CONVERSATION HISTORY SO FAR:
${context.chatHistory.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join("\n")}

STUDENT'S LATEST MESSAGE:
"${userMessage}"

Respond as SOCRATIX adhering to all 5 strict pedagogical constraints. Remember: NEVER give the answer. Guide with one diagnostic question.`,
        },
      ],
    },
  ];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: conversationContents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 300,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedMsg = response.statusText;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.error?.message) {
        parsedMsg = parsed.error.message;
      }
    } catch {
      parsedMsg = errorText || response.statusText;
    }
    throw new Error(`Gemini API Error (${response.status}): ${parsedMsg}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Unable to read stream response from Gemini API");
  }

  const decoder = new TextDecoder("utf-8");
  let accumulatedText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const jsonStr = line.slice(6).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          const data = JSON.parse(jsonStr);
          const candidate = data.candidates?.[0];
          const partText = candidate?.content?.parts?.[0]?.text;

          if (partText) {
            accumulatedText += partText;
            onChunk(accumulatedText);
          }
        } catch {
          // Ignore SSE delimiter parse errors
        }
      }
    }
  }

  return accumulatedText;
}
