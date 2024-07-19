import { useState, Fragment } from "react";

const MailSettings = () => {
  const [showSecret, setShowSecret] = useState(false);
  const displayPartialSecret = (secret: string) => {
    const visibleLength = 10; // Number of characters to show
    if (secret.length > visibleLength) {
      return `${secret.substring(0, visibleLength)}${"*".repeat(secret.length - visibleLength)}`;
    }
    return secret; // In case the secret is shorter than the visible length
  };

  return (
    <div className="w-full h-full flex flex-col font-neueHassUnica bg-primary">
      <div className="flex flex-col w-full gap-5">
        <span className="bg-primary2 text-white font-bold text-xl px-5 py-3">
          Mail Environment Variable Configurations
        </span>
        <div className="px-5 flex flex-col">
          <Fragment>
            <span className="bg-primary text-white font-bold text-lg mb-3">
              Current SENDGRID API Key of the instance
            </span>
            <span className="bg-primary text-[#f5f5f5] pb-0 text-sm mb-3">
              Current SENDGRID Key:{" "}
              {showSecret
                ? process.env.SENDGRID_API_KEY
                : displayPartialSecret(process.env.SENDGRID_API_KEY as string)}
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="bg-primary text-lightPrimary p-2 italic "
              >
                {showSecret ? "Hide" : "Show"}
              </button>
            </span>
          </Fragment>
          <Fragment>
            <span className="bg-primary text-white font-bold text-lg mb-3">
              Current SENDGRID Sender of the instance
            </span>
            <span className="bg-primary text-[#f5f5f5] pb-0 text-sm mb-3">
              Current SENDGRID Sender: {process.env.SENDGRID_FROM}
            </span>
          </Fragment>
        </div>
      </div>
    </div>
  );
};

export default MailSettings;
