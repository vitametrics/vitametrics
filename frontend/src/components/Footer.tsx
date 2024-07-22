import DiscordIcon from "../assets/DiscordIcon";
import logo from "../assets/images/vitamix.webp";
import LinkedInIcon from "../assets/LinkedInIcon";
const Footer = () => {
  return (
    <footer className="bg-container text-black font-bold border-">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex flex sm:items-center sm:justify-between">
          <a className="flex items-center  sm:mb-0 space-x-3 rtl:space-x-reverse">
            <div className="flex flex-col">
              <img
                src={logo}
                alt="footer-logo"
                className="w-[150px] rounded-lg border-2 border-gray-300"
              />
              <span className="text-base text-primary sm:hidden font-semibold">
                {" "}
              </span>
            </div>
          </a>
          <ul className="flex flex-wrap items-center ml-auto text-sm font-medium text-primary sm:mb-0">
            <li>
              <a
                href="/PrivacyPolicy"
                className=" me-4 md:me-6 text-xl font-bold hover:text-hoverPrimary"
              >
                Privacy Policy
              </a>
              <a
                href="/TOS"
                className=" me-4 md:me-6 text-xl font-bold hover:text-hoverPrimary"
              >
                Terms and Service
              </a>
            </li>
            <li>
              <a
                href="https://docs.vitametrics.org/getting-started/introduction/"
                className="font-bold me-4 md:me-6 text-xl hover:text-hoverPrimary"
              >
                Docs
              </a>
            </li>
            <li>
              <a
                href="#"
                className=" text-xl font-bold hover:text-hoverPrimary"
              >
                Credits
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-3 border-[#45496a] sm:mx-auto " />
        <div className="grid-cols-3 grid items-center">
          <span className="text-sm text-primary text-left">
            Made with ❤️ by{" "}
            <a
              href="https://www.vitametrics.org"
              className="hover:text-hoverPrimary"
            >
              Vitametrics
            </a>
          </span>
          <span className="block text-sm text-primary text-center ">
            © 2024{" "}
            <a href="/" className=" gap-10">
              Vitametrics™
            </a>
            All Rights Reserved.
          </span>
          <span className="flex flex-row items-center ml-auto gap-2">
            <LinkedInIcon />
            <DiscordIcon />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
