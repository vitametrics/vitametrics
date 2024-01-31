import Question from "../components/Question";

const FAQs = () => {
  return (
    <div className="h-screen font-ralewayBold">
      <p> Hello, World! from the FAQs</p>
      <Question q="What is the weather today?" a="70 degrees" />
    </div>
  );
};

export default FAQs;
