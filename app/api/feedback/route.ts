import OpenAI from 'openai'
import { NextResponse } from 'next/server'

import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

type Prompt = {
  prompt: string
}

export const runtime = 'edge'

export async function POST(req: Request): Promise<Response> {
  try {
    const {prompt: studentWriting, learningOutcomes, markingCriteria } = await req.json()
    console.log(studentWriting, learningOutcomes, markingCriteria);

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      system:
        'You are an expert resume writer with over 20 years of experience working with job seekers.',
      messages: [
        {
          role: 'user',
          content: `You are a high school teacher which is responsible for teaching Geography.
          You need to give feedback to student writing.
          Here is the student writing: ${studentWriting}.
          Here is the expected learning outcomes: ${learningOutcomes}.
          Here is the marking criteria: ${markingCriteria}
          `
        }
      ],
      temperature: 0.8
    })

    return result.toAIStreamResponse();
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error
      return NextResponse.json({ name, status, headers, message }, { status })
    } else {
      throw error
    }
  }
}