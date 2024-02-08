import Question from "../components/Question";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const FAQs = () => {
  return (
    <div className="h-full w-full font-ralewayBold">
      <Navbar />
      <p> Hello, World! from the FAQs</p>
      <Question q="What is the weather today?" a="70 degrees" />
      <Footer />
    </div>
  );
};

export default FAQs;
