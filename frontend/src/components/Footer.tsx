const Footer = () => {
  return (
    <footer className="bg-[#373F51] dark:bg-[#171619]">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center  sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <div className="flex flex-col">
              <span className=" font-bold text-2xl  whitespace-nowrap text-[#5086A2] dark:text-[#BA6767]">
                Physiobit{" "}
              </span>
              <span className="text-base text-white sm:hidden font-semibold">
                {" "}
                Associated with Monterey Peninsula College
              </span>
            </div>
          </a>
          <ul className="flex flex-wrap items-center ml-auto text-sm font-medium text-white sm:mb-0">
            <li>
              <a href="/contact" className="hover:underline me-4 md:me-6">
                Contact
              </a>
            </li>
            <li>
              <a
                href="/privacy-policy"
                className="hover:underline me-4 md:me-6"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/FAQs" className="hover:underline me-4 md:me-6">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Credits
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 dark:border-gray-200 sm:mx-auto  lg:my-8" />
        <span className="block text-sm text-[#5086A2] dark:text-white text-center sm:text-center ">
          © 2024{" "}
          <a href="/" className="hover:underline gap-10">
            Physiobit™
          </a>
          All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
