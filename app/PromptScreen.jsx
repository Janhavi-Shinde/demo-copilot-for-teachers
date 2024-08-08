"use client";

import { useCompletion } from "ai/react";
import { useState } from "react";
import { useEffect } from "react";
import { set } from "zod";
import Assignment from "./Assignment";

function PromptScreen() {
  const [studentWriting, setStudentWriting] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [markingCriteria, setMarkingCriteria] = useState("");
  const [promptType, setPrompt] = useState("");

  const {
    completion: responseFromServer,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useCompletion({
    api: "/api/feedback",
    body: {
      learningOutcomes,
      markingCriteria,
      promptType,
    },
  });

  const handleButton = (setPrompt, promptType) => async (e) => {
    setPrompt(promptType);
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  useEffect(() => {
    setLearningOutcomes(Assignment.learningOutcomes);
    setMarkingCriteria(Assignment.markingCriteria);
  }, []);

  return (
    <div className="prompt-screen-container">
      <section className="prompt-screen-section">
        <form className="prompt-form" onSubmit={handleSubmit}>
          <div className="textarea-container">
            <div className="textarea-wrapper">
              <label htmlFor="studentWriting" className="label">
                Student Writing
              </label>
              <textarea
                id="studentWriting"
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                className="textarea"
              />
            </div>
            {/* <div className="textarea-wrapper">
              <label htmlFor="learningOutcomes" className="label">
                Expected Learning Outcomes
              </label>
              <textarea
                id="learningOutcomes"
                value={learningOutcomes}
                onChange={handleChange(setLearningOutcomes)}
                disabled={isLoading}
                className="textarea"
              />
            </div>
            <div className="textarea-wrapper">
              <label htmlFor="markingCriteria" className="label">
                Marking Criteria
              </label>
              <textarea
                id="markingCriteria"
                value={markingCriteria}
                onChange={handleChange(setMarkingCriteria)}
                disabled={isLoading}
                className="textarea"
              />
            </div> */}
          </div>

          <div className="button-container">
            <button
              id="giveFeedback"
              onClick={handleButton(setPrompt, "feedback")}
              className="button"
            >
              {isLoading && onclick ? "Loading..." : "Give feedback"}
            </button>
            <button
              id="generateGrade"
              onClick={handleButton(setPrompt, "grade")}
              className="button"
            >
              {isLoading && onclick ? "Loading..." : "Generate grade"}
            </button>
          </div>
        </form>

        {responseFromServer && (
          <div className="response">{responseFromServer}</div>
        )}
      </section>
    </div>
  );
}

export default PromptScreen;
