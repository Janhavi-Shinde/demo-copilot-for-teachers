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
    const {prompt: studentWriting, learningOutcomes, markingCriteria, promptType } = await req.json()
    const generatePrompt = promptType === 'feedback' ? 'Please provide detailed feedback only on the following student writing based on the expected learning outcomes and marking criteria.' : 'grade the student writing. Based on the expected learning outcomes and marking criteria, please provide a mark out of 100 for the following student writing.'
    console.log(studentWriting, learningOutcomes, markingCriteria, promptType);

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      system:
        'You are an experienced high school teacher.',
      messages: [
        {
          role: 'user',
          content: `You are a high school teacher which is responsible for teaching Geography.
          You need to: ${generatePrompt}.
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