import logo from "../assets/logo.webp";
const Footer = () => {
  return (
    <footer className="bg-black">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex flex sm:items-center sm:justify-between">
          <a className="flex items-center  sm:mb-0 space-x-3 rtl:space-x-reverse">
            <div className="flex flex-col">
              <img src={logo} className="w-[200px]" />
              <span className="text-base text-white sm:hidden font-semibold">
                {" "}
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
              <a href="/PrivacyPolicy" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
              <a href="/TOS" className="hover:underline me-4 md:me-6">
                Terms and Service
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
        <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
        <span className="block text-sm text-white text-center sm:text-center ">
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
