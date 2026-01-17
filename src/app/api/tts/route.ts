import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { NextResponse } from 'next/server';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

export async function POST(req: Request) {
  const { text } = await req.json();

  const audioStream = await client.textToSpeech.convert(
    'JBFqnCBsd6RMkjVDRZzb', // voiceId
    {
      text,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    }
  );

  const reader = audioStream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const audioBuffer = Buffer.concat(chunks);

  return new NextResponse(audioBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });
}
