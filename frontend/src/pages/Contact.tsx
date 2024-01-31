import Navbar from "../components/Navbar";
import axios from "axios";
import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import WatchLogo from "../components/Watch";
import { Turnstile } from "@marsidev/react-turnstile";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [showStatus, setShowStatus] = useState("");
  const [token, setToken] = useState<string | undefined>();

  const editorRef = useRef<TinyMCEEditor | null>(null);

  const logMsg = () => {
    if (editorRef.current) {
      setMessage(editorRef.current.getContent());
    }
  };

  const handleContactMessage = async () => {
    if (!organizationName || !email || !message) {
      console.log("Please fill out all fields");
      setShowStatus("Please fill out all fields");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      console.log("Please enter a valid email");
      setShowStatus("Please enter a valid email");
      return;
    }

    setShowStatus("");

    if (!token) {
      setShowStatus("Please complete captcha verification!");
      return;
    }

    try {
      const response = await axios.post(
        "https://physiobit.seancornell.io/api/contact",
        {
          email: email,
          organizationName: organizationName,
          msgBody: message,
          "cf-turnstile-response": token,
        }
      );

      if (response.status === 200) {
        setShowStatus("Success");
        console.log("Message sent successfully");
      } else {
        setShowStatus(response.data.msg);
        console.log("Error sending message");
      }
    } catch (error) {
      setShowStatus("Error sending message");
      console.log("Error sending message");
    }
  };

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex flex-col justify-center place-items-center p-20 sm:p-0">
        <div className="flex flex-row sm:flex-col-reverse sm:h-screen">
          <div className="flex flex-col items-center justify-center bg-[#BA6767] w-[500px] h-[600px] rounded-tl-2xl rounded-bl-2xl sm:hidden p-10">
            <WatchLogo />
            <h2 className="font-bold text-5xl text-[#4d2020]">Contact</h2>
            <h4 className="font-bold text-2xl text-gray-300 mt-1 text-center">
              Enter your credentials and you will automatically receive an
              organization account from us!
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center bg-[#F9F6EE] w-[500px] h-[600px] p-5 rounded-tr-2xl rounded-br-2xl  sm:w-screen sm:rounded-none sm:h-full sm:p-5 ">
            <h1 className="text-4xl font-bold text-black text-center w-full mt-0">
              Getting Started
            </h1>
            {showStatus != "Success" ? (
              <div className="text-red-500 mt-5">{showStatus}</div>
            ) : (
              <div className="text-green-300 mt-5">{showStatus}</div>
            )}
            <div className="flex flex-row items-center justify-between gap-2">
              <input
                className="p-[10px] mt-5 w-full mb-5 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c]"
                type="text"
                placeholder="Email"
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="p-[10px] mt-5 w-full bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c] mb-5"
                type="text"
                placeholder="Organization Name"
                required={true}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
            <Editor
              apiKey="4e60st8alywzg4ld3g5kvbfr8jtu13azwxr2h5n4olv9m7lv"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              onChange={() => logMsg()}
              initialValue="<p></p>"
              init={{
                statusbar: false,
                menubar: false,
                resize: true,
                height: 200,
                min_height: 200,
                max_height: 200,
                width: "90%",
                placeholder: "Enter your message here...",

                plugins: [
                  "autoresize",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />{" "}
            <br />
            <Turnstile
              style={{
                width: "100%",
                justifyContent: "center",
                placeItems: "center",
                display: "flex",
              }}
              siteKey="0x4AAAAAAAQ0Qk1HHciMTLH0"
              onSuccess={setToken}
            />{" "}
            {/* for sean (ty)*/}
            <button
              onClick={handleContactMessage}
              className="p-[10px] mt-5 bg-[#BA6767] w-[300px] rounded-lg cursor-pointer font-bold text-white sm:mb-auto"
            >
              {" "}
              Submit{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
