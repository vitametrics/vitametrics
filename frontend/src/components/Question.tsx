import React from "react";

interface QuestionProps {
  q: string;
  a: string;
}

const Question: React.FC<QuestionProps> = ({ q, a }) => {
  return (
    <div>
      <p> {q} </p>
      <p> {a}</p>
    </div>
  );
};
export default Question;
