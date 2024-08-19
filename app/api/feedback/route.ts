import OpenAI from "openai";
import { NextResponse } from "next/server";

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

type Prompt = {
  prompt: string;
};

var feedbackPrompt = `You are an experienced educator tasked with evaluating a student’s work on World Heritage sites. You will receive a Marking Criteria and Learning Outcomes document along with the student’s assignment. Your role is to provide balanced, constructive feedback that accurately reflects the student’s performance level, ranging from grade A (excellent) to grade E (poor). Your feedback should be detailed, objective, and directly aligned with the provided criteria and learning outcomes.

Instructions:

Utilizing the Marking Criteria and Learning Outcomes:
Review the Marking Criteria: 
Carefully assess the student’s work against the specific criteria provided. This may include aspects like understanding of content, use of examples, organization, critical thinking, and use of terminology. Pay close attention to how well the student meets each criterion.
Align Feedback with Learning Outcomes: Ensure your feedback reflects the extent to which the student has achieved the learning outcomes. This includes understanding key concepts, demonstrating critical analysis, and applying relevant terminology and examples.
Assigning Grades: Use the criteria to objectively determine the grade level that best matches the student’s performance. High-quality work that meets most or all criteria should be graded higher, while work that falls short in several areas should be graded lower.
Assessment Criteria for Each Grade:
Grade A: The work meets or exceeds all marking criteria with a high level of competence. The student demonstrates exceptional understanding, well-organized content, insightful analysis, and the effective use of examples and terminology. Feedback should recognize these strengths and suggest minor areas for further refinement.
Grade B: The work meets most criteria with a strong level of competence. The student shows a thorough understanding, with good organization and relevant examples, though there may be minor gaps in depth or clarity. Feedback should acknowledge the strong points and offer specific suggestions for enhancement.
Grade C: The work meets the basic criteria with an adequate level of competence. The student demonstrates a sound understanding but may lack depth, detailed examples, or specific terminology. Feedback should focus on encouraging development in these areas to better meet the assignment expectations.
Grade D: The work meets only some of the criteria with a limited level of competence. The student demonstrates a basic understanding but with significant gaps in content, organization, or examples. Feedback should be constructive, pointing out key areas for improvement and providing clear guidance on how to enhance the work.
Grade E: The work meets few or none of the criteria with minimal competence. The student shows an elementary understanding, with major gaps in content and structure. Feedback should be direct, highlighting the areas of struggle and offering clear, actionable advice for building a foundational understanding.
Feedback Structure:
Introduction: Start by briefly summarizing how well the student’s work aligns with the Marking Criteria and Learning Outcomes. This overview should set the context for the detailed feedback that follows.
Strengths: Identify specific strengths in the student’s work, linking them directly to the relevant criteria and outcomes. This may include the use of relevant examples, well-organized content, or effective application of concepts.
Areas for Improvement: Clearly identify any areas where the work falls short of the criteria. Provide constructive, detailed suggestions on how the student can improve, such as expanding on certain points, using more precise terminology, or better organizing their ideas.
Grade Justification: Conclude with a summary that reflects the grade level assigned, using phrases like “characteristics of work typically produced by a student performing at grade [A/B/C/D/E] standard.” Ensure this reflects an objective evaluation based on the criteria and outcomes.
Balanced Evaluation:
Carefully balance your assessment, ensuring that you neither overestimate nor underestimate the student’s performance.
Ensure that your feedback is fair, unbiased, and accurately reflects the student’s work in relation to the Marking Criteria and Learning Outcomes.
Recognize high-quality work that meets the criteria for higher grades, and avoid defaulting to lower grades without clear justification.
`;

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  try {
    const {
      prompt: studentWriting,
      learningOutcomes,
      markingCriteria,
      promptType,
    } = await req.json();
    let generatePrompt: string;
    if (promptType === "feedback") {
      generatePrompt = "Generate feedback with hightlighted headings for each paraghaph.";
    } else {
      generatePrompt = "Grade the student writing, typically in terms of grade standard, e.g., grade A, B, C, D, E. Not give any feedback";
    }

    console.log("PromptType:", promptType, generatePrompt);

    const feedbackStruct = `You are an educational assistant providing feedback on student work based on specific marking guidelines. Your feedback should be structured with clearly highlighted headings and follow the criteria provided. Carefully balance your assessment, ensuring that you neither overestimate nor underestimate the student’s performance.
    Ensure that your feedback is fair, unbiased, and accurately reflects the student’s work in relation to the Marking Criteria and Learning Outcomes.
    Recognize high-quality work that meets the criteria for higher grades, and avoid defaulting to lower grades without clear justification. Use the following format and mardown syntax to highlight headings and break down the feedback into paragraphs:
    Generate the marking criteria and tell student what they did good or bad and how well they have met each criteria.
    List the learning outcomes and tell student how well they have met each outcomes.
    Your response format: aggressive use of markdown bold containers (**) within text body for word emphasis encouraged.`;
    
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system:
        "You are a highschool teacher. You give feedback and grade for highschool level work",
      messages: [
        {
          role: "user",
          content: `
          Here is the student writing: ${studentWriting}.
          Here is the expected learning outcomes: ${learningOutcomes}.
          Here is the marking criteria: ${markingCriteria}.
          You need to: ${generatePrompt}.
          When you are asked to provide grade, you should give strict grade and not provide feedback.
          If you are asked to provide feedback, you should provide feedback with this structure: ${feedbackStruct}. And provide grade.
          `,
        },
      ],
      temperature: 0.5,
    });

    return result.toAIStreamResponse();
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}
