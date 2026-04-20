import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { createDataStreamResponse, formatDataStreamPart } from 'ai';

const client = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY'],
});


export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!process.env['CEREBRAS_API_KEY']) {
    return Response.json({ error: 'Missing CEREBRAS_API_KEY' }, { status: 500 });
  }

  const completionCreateResponse: any = await client.chat.completions.create({
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