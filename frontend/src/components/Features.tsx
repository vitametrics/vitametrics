type interview = {
  name: string;
  review: string;
  img: string;
};
const Features = () => {
  const reviews = [
    {
      name: "Tom Rebold",
      review:
        "It's perfect for not just advanced researchers, but beginners too!",
      img: "",
    },
    {
      name: "Greg Welk",
      review:
        "The platform is free to use and perfect for my graduate research in kinesiology.",
      img: "",
    },
    {
      name: "Lief Koepsel",
      review:
        "Nothing is better than open-source. I love that I can see the code and contribute to the project!",
      img: "",
    },
    {
      name: "Zyrille Lumbang",
      review:
        "As a undergraduate pre-health student, this is perfect for getting into research! ",
      img: "",
    },
    {
      name: "Jasmine Sebastian",
      review:
        "The exercise research I've done with Vitametrics is great for my portfolio!",
      img: "",
    },
    {
      name: "Timothy Liu",
      review:
        "Vitametrics data analysis tools extracts helpful insights of my running capabilities.",
      img: "",
    },
  ];

  const reviewCard = (content: interview[]) => {
    return (
      <div className="flex flex-col bg-[#F2F2F2] p-5 rounded-xl">
        <div className="flex flex-row items-center gap-5">
          <img
            src={content[0].img}
            className="h-10 w-10 rounded-full"
            alt={`reviewer-${content[0].name}`}
          />
          <h1 className="text-primary text-2xl">{content[0].name}</h1>
        </div>
        <div className="bg-[#c9c9c9] h-[0.25px] w-full mt-2" />
        <p className="text-desc mt-2 font-leagueSpartan">{content[0].review}</p>
      </div>
    );
  };

  return (
    <section className="w-full h-full flex flex-col box-border px-10 lg:px-32 lg:pb-16 ">
      <div className="flex flex-col bg-glass rounded-lg p-12 lg:px-40 items-center mb-10">
        <h1 className="text-5xl text-primary text-center mb-5">
          See what researchers have said.
        </h1>
        <p className="text-xl text-desc text-center font-leagueSpartan mb-5">
          Our platform enables meaningful collaborations and your next
          discoveries.
        </p>
        <div className="grid grid-cols-2 gap-5 mb-5 text-white">
          <button className="bg-quaternary hover:bg-hoverQuaternary p-3 rounded-lg w-[175px] text-2xl">
            Feedback
          </button>
          <button className="bg-quinary hover:bg-hoverQuinary p-3 rounded-lg w-[175px] text-2xl">
            FAQs
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
          {reviews.map((review) => reviewCard([review]))}
        </div>
      </div>
    </section>
  );
};

export default Features;
