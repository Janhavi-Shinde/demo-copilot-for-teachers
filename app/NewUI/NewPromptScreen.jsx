"use client";

import { useCompletion } from "ai/react";
import { useState } from "react";
import { useEffect } from "react";
import { set } from "zod";
import Assignment from "../Assignment";
import React from "react";

function NewPromptScreen() {
  const [learningOutcomes, setLearningOutcomes] = useState("");
  const [markingCriteria, setMarkingCriteria] = useState("");
  const [promptType, setPrompt] = useState("");
  const [isGenerationModuleVisible, setIsGenerationModuleVisible] =
    useState(false);

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
    onComplete: () => {
      setIsGenerationModuleVisible(true);
    },
  });

  const handleButton = (newPromptType) => async (e) => {
    e.preventDefault();
    setPrompt(newPromptType);
    setIsGenerationModuleVisible(true);
    handleSubmit();
  };

  useEffect(() => {
    setLearningOutcomes(Assignment.learningOutcomes);
    setMarkingCriteria(Assignment.markingCriteria);
  }, []);

  return isGenerationModuleVisible ? (
    <div className="generation-module">
      <div className="generation-response">
        {responseFromServer && (
          <div className="response">{responseFromServer}</div>
        )}
      </div>
      <textarea className="question-field"></textarea>
    </div>
  ) : (
    <form className="prompt-form">
      <div className="submission-module">
        <div className="user-input-field">
          <textarea
            id="studentWriting"
            placeholder="Submit your assignment here or upload your file below..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="textarea"
          ></textarea>
        </div>
        <div className="upload-assignment-button">
          <p>UPLOAD ASSIGNMENT PDF</p>
        </div>
        <div className="button-container">
          <button
            className="generation-button"
            id="giveFeedback"
            type="button"
            onClick={handleButton("feedback")}
          >
            <p className="button-title">Student Feedback</p>
            <p>
              Generate custom tailored feedback based on your Assignment
              Submission
            </p>
            <ul className="button-list">
              <li>- Custom Tailored Feedback</li>
              <li>- Improve Grade</li>
            </ul>
          </button>
          <button
            className="generation-button"
            id="generateGrade"
            type="button"
            onClick={handleButton("grade")}
            style={{ cursor: "pointer" }}
          >
            <p className="button-title">Estimate My Grade</p>
            <p>
              Estimate what your current mark is and what you can do to increase
              your grade.
            </p>
            <ul className="button-list">
              <li>
                - Uses the Marking Criteria and Learning Guide to estimate your
                current grade
              </li>
            </ul>
          </button>
        </div>
      </div>
    </form>
  );
}

export default NewPromptScreen;
