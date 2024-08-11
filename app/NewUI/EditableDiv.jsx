import React, { useState } from "react";

const EditableDiv = ({ placeholder }) => {
  const [content, setContent] = useState("");

  const handleInput = (e) => {
    setContent(e.target.textContent);
  };

  return (
    <div
      className={`editable-div ${content.trim() === "" ? "is-empty" : ""}`}
      contentEditable="true"
      onInput={handleInput}
      data-placeholder={placeholder}
    >
      {content}
    </div>
  );
};

export default EditableDiv;
