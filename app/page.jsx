// Sample input at the bottom of the file 👇

"use client";

import { useCompletion } from "ai/react";
import { useState } from "react";
import { set } from "zod";

export default function Chat() {
  const [studentWriting, setStudentWriting] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [markingCriteria, setMarkingCriteria] = useState("");
  const [promptType, setPrompt] = useState("");

  const { completion: responseFromServer, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: "/api/feedback",
    body: {
      learningOutcomes,
      markingCriteria,
      promptType,
    }
  });

  const handleButton = (setPrompt, promptType) => async (e) => {
    setPrompt(promptType);
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   const formData = { studentWriting, learningOutcomes, markingCriteria };
  //   console.log(formData)
  //   handleSubmit('wwwwww');
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <section className="max-w-lg items-center justify-center mt-14">
      <h1 className="text-5xl font-bold max-w-xl text-center p-3 text-slate-200">
        Get AI generated feedback and grades for student writing
      </h1>
      
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="studentWriting" className="text-slate-200">Student Writing</label>
          <textarea
            id="studentWriting"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="learningOutcomes" className="text-slate-200">Expected Learning Outcomes</label>
          <textarea
            id="learningOutcomes"
            value={learningOutcomes}
            onChange={handleChange(setLearningOutcomes)}
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="markingCriteria" className="text-slate-200">Marking Criteria</label>
          <textarea
            id="markingCriteria"
            value={markingCriteria}
            onChange={handleChange(setMarkingCriteria)}
            disabled={isLoading}
          />
        </div>
        <button id="giveFeedback" onClick={handleButton(setPrompt, 'feedback')}>{(isLoading && onclick) ? "Loading..." : "Give feedback"}</button>
        <button id="generateGrade" onClick={handleButton(setPrompt, 'grade')}>{isLoading && onclick ? "Loading..." : "Generate grade"}</button>
      </form>
      
      {responseFromServer && (
        <div className="mt-6 text-slate-200">
          {responseFromServer}
        </div>
      )
      }
    </section>
  </div>
  );
}

/* SAMPLE INPUT

- Student Writing ------

A World Heritage site is a landmark or area with legal protection by an international convention administered by UNESCO. These sites are recognized for having cultural, historical, scientific, or other forms of significance and are deemed to be of outstanding value to humanity.

- Expected Learning Outcomes ------

A student: 
4.1 identifies and gathers geographical information
4.2 organises and interprets geographical information
4.3 uses a range of written, oral and graphic forms to communicate geographical information
4.5 demonstrates a sense of place about global environments

- Marking Criteria ------

Students will be assessed on their ability to:

identify and gather geographical information about World Heritage sites
explain the importance of World Heritage listing of natural and cultural sites
provide arguments for the inclusion of the Sydney Opera House as a World Heritage site
communicate their findings by presenting geographical information in a written report.

*/