"use client";

import React from "react";
import { useState } from "react";
import NewAssignmentView from "./NewAssignmentView";
import NewPromptScreen from "./NewPromptScreen";
import "../styles.css";
import AssignmentView from "../AssignmentView";
import PromptScreen from "../PromptScreen";

export default function MainScreen() {
  const subjects = ["Geography", "English", "History"];

  const [selectedSubject, setSelectedSubject] = useState("Geography");

  const handleSelect = (subject) => {
    setSelectedSubject(subject);
  };

  return (
    <div className="main-container">
      <div className="subject-titles">
        {subjects.map((subject, index) => (
          <h1
            key={index}
            className={
              selectedSubject === subject
                ? "selected-subject"
                : "unselected-subject"
            }
            onClick={() => handleSelect(subject)}
          >
            {subject}
          </h1>
        ))}
      </div>
      <div className="module-container">
        <div className="assignment-module">
          <NewAssignmentView />
        </div>
        <NewPromptScreen></NewPromptScreen>
      </div>
    </div>
  );
}
