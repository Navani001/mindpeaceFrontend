import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { createDataStreamResponse, formatDataStreamPart } from 'ai';

export const runtime = 'nodejs';


export async function POST(req: Request) {
  const apiKey = process.env['CEREBRAS_API_KEY'];
  if (!apiKey) {
    return Response.json({ error: 'Missing CEREBRAS_API_KEY' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const messages =
    typeof body === 'object' && body !== null && 'messages' in body
      ? (body as { messages?: unknown }).messages
      : undefined;

  if (!Array.isArray(messages)) {
    return Response.json({ error: 'Invalid messages payload' }, { status: 400 });
  }

  const client = new Cerebras({ apiKey });

  let completionCreateResponse: any;
  try {
    completionCreateResponse = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'you are mind peace ai assistant helping user to achieve mental peace and provide useful information related to mental peace and mental health',
        },
        ...messages,
      ],
      model: 'llama3.1-8b',
    });
  } catch (error) {
    console.error('Cerebras chat completion failed', error);
    return Response.json({ error: 'Failed to generate response' }, { status: 502 });
  }

  const assistantText =
    completionCreateResponse?.choices?.[0]?.message?.content ??
    'I am here with you. Tell me what is on your mind.';

  const promptTokens = completionCreateResponse?.usage?.prompt_tokens;
  const completionTokens = completionCreateResponse?.usage?.completion_tokens;

  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.write(formatDataStreamPart('text', assistantText));
      dataStream.write(
        formatDataStreamPart('finish_message', {
          finishReason: 'stop',
          usage:
            typeof promptTokens === 'number' && typeof completionTokens === 'number'
              ? {
                  promptTokens,
                  completionTokens,
                }
              : undefined,
        })
      );
      dataStream.write(
        formatDataStreamPart('finish_step', {
          isContinued: false,
          finishReason: 'stop',
          usage:
            typeof promptTokens === 'number' && typeof completionTokens === 'number'
              ? {
                  promptTokens,
                  completionTokens,
                }
              : undefined,
        })
      );
    },
    onError: () => 'Failed to generate response',
  });
}