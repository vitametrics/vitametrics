import Navbar from "../components/Navbar";
import axios from "axios";
import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import WatchLogo from "../components/Watch";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");

  const editorRef = useRef<TinyMCEEditor | null>(null);

  const logMsg = () => {
    if (editorRef.current) {
      setMessage(editorRef.current.getContent());
    }
  };

  const handleContactMessage = async () => {
    try {
      const response = await axios.post("https://localhost:7970/api/contact", {
        email: email,
        subject: subject,
        message: message,
      });

      if (response.status === 200) {
        // Message sent successfully
        console.log("Message sent successfully");
      } else {
        // Handle other response statuses
        console.log("Error sending message");
      }
    } catch (error) {
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
          <div className="flex flex-col items-center justify-center bg-white w-[500px] h-[600px] p-10 rounded-tr-2xl rounded-br-2xl  sm:w-screen sm:rounded-none sm:h-full sm:p-5">
            <h1 className="text-4xl font-bold text-black text-center w-full">
              Getting Started
            </h1>
            <input
              className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c]"
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="p-[10px] mt-5 w-72 bg-[#d2d1d1] text-black  rounded-lg border-[#6d6c6c] mb-5"
              type="text"
              placeholder="Subject"
              onChange={(e) => setSubject(e.target.value)}
            />
            <Editor
              apiKey="4e60st8alywzg4ld3g5kvbfr8jtu13azwxr2h5n4olv9m7lv"
              onInit={(evt, editor) => (editorRef.current = editor)}
              onChange={() => logMsg()}
              initialValue="<p></p>"
              init={{
                statusbar: false,
                menubar: false,
                height: "100%",
                width: "80%",
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
            <button
              onClick={handleContactMessage}
              className="p-[10px] mt-5 bg-[#BA6767] w-72 rounded-lg cursor-pointer font-bold text-white sm:mb-auto"
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
