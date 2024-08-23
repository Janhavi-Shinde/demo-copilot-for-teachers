"use client";

import React, { useState } from "react";
import PromptScreen from "./PromptScreen";
import AssignmentView from "./AssignmentView";
import MainScreen from "./NewUI/MainScreen";
import ChatNew from "./ChatNew";
export default function Chat() {
  const assignmentArray = ["English", "Geography", "History"];
  const [showCustomView, setShowCustomView] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleButtonClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowCustomView(!showCustomView);
  };

  return (
    // <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
    //   <h1 className="text-5xl font-bold max-w-xl text-center p-3 text-slate-200">
    //     Get AI generated feedback and grades for student writing
    //   </h1>
    //   <div>
    //     {assignmentArray.map((item, index) => (
    //       <button
    //         key={index}
    //         onClick={() => handleButtonClick(item)}
    //         className="m-2 p-2 bg-blue-500 text-white rounded"
    //       >
    //         {showCustomView && selectedAssignment === item ? "Close" : item}
    //       </button>
    //     ))}
    //   </div>
    //   {showCustomView && <AssignmentView assignment={selectedAssignment} />}
    // </div>
    <MainScreen></MainScreen>
  );
}
