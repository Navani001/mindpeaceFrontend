import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';


export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    system:"you are mind peace ai assistant helping user to achieve mental peace and provide useful information related to mental peace and mental health",
    messages
  });
  console.log(messages)
  

  return result.toDataStreamResponse();
}