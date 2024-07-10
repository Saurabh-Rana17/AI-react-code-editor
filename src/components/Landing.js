import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import OpenAI from "openai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import CodeEditorWindow2 from "./CodeEditorWindow2";
import { Button, Modal, Spinner, Tabs, TextInput } from "flowbite-react";
import { Link, json } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { RiRobot2Line } from "react-icons/ri";
import { SiCcleaner, SiCompilerexplorer } from "react-icons/si";
import { CiSaveDown2 } from "react-icons/ci";
import languageConstant from "../constants/languageConstant";
import { IoCloudOfflineOutline } from "react-icons/io5";
import { VscOpenPreview } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_GPT_KEY, // For self-hosted version you can put anything
  baseURL: "https://api.pawan.krd/v1", // For self-hosted version, use "http://localhost:3040/v1"
  dangerouslyAllowBrowser: true,
});

const javascriptDefault = `/**
* Problem: Binary Search: Search a sorted array for a target value.
*/

// Time: O(log n)
const binarySearch = (arr, target) => {
 return binarySearchHelper(arr, target, 0, arr.length - 1);
};

const binarySearchHelper = (arr, target, start, end) => {
 if (start > end) {
   return false;
 }
 let mid = Math.floor((start + end) / 2);
 if (arr[mid] === target) {
   return mid;
 }
 if (arr[mid] < target) {
   return binarySearchHelper(arr, target, mid + 1, end);
 }
 if (arr[mid] > target) {
   return binarySearchHelper(arr, target, start, mid - 1);
 }
};

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const target = 5;
console.log(binarySearch(arr, target));
`;

const Landing = () => {
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageConstant[54]);
  const [showAiEditor, setShowAiEditor] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [gptResponse, setGptResponse] = useState("");
  const [promtValue, setPromptValue] = useState("");
  const [gptLoading, setGptLoading] = useState(false);
  const [activePrompt, setActivePrompt] = useState("pai");
  const [isOffline, setIsOffline] = useState(false);
  const [filecode, setFileCode] = useState("");

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  // useEffect(() => {
  //   if (enterPress && ctrlPress) {
  //     console.log("enterPress", enterPress);
  //     console.log("ctrlPress", ctrlPress);
  //     handleCompile();
  //   }
  // }, [ctrlPress, enterPress]);
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        // console.log(err)
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("monokai").then((_) =>
      setTheme({ value: "monokai", label: "monokai" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  function handleShowAiEditor() {
    console.log("handleShowAiEditor clicked");
    setShowAiEditor((prev) => !prev);
  }

  async function handleGptResp() {
    console.log(promtValue);
    setGptLoading(true);
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            " just provide code , give code in proper format that can be display within a div tag with proprer formatting dont use any comments dont give html code use new line and tab spaces and indentation to properly format code dont give comments and dont give explaination,give multiline response",
        },
        { role: "user", content: promtValue },
      ],
      model: "pai-001",
    });
    console.log(chatCompletion.choices[0].message.content);
    setGptResponse(
      chatCompletion.choices[0].message.content.replace("```", "")
    );
    setGptLoading(false);
  }

  async function handleSelfGpt() {
    console.log(promtValue);
    setGptLoading(true);
    const promptData = {
      keyword: promtValue,
    };
    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptData),
    });
    const data = await res.json();
    console.log(data.predicted_code);
    setGptResponse(data.predicted_code);
    setGptLoading(false);
  }

  function handleSave() {
    const blob = new Blob([code], { type: "text/plain" });

    // Generate a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create an anchor element with download attribute set to the desired filename and href attribute set to the generated URL
    const a = document.createElement("a");
    a.href = url;
    switch (language.name) {
      case "javascript":
        a.download = "myCode.js"; // Change the filename as needed
        break;
      case "java":
        a.download = "myCode.java"; // Change the filename as needed
        break;
      case "python":
        a.download = "myCode.py"; // Change the filename as needed
        break;
      case "c":
        a.download = "myCode.c"; // Change the filename as needed
        break;
      case "cpp":
        a.download = "myCode.cpp"; // Change the filename as needed
        break;

      default:
        a.download = "myCode.txt"; // Change the filename as needed

        break;
    }

    // Simulate a click on the anchor element to trigger the file download
    a.click();

    // Clean up by revoking the URL object to free up resources
    URL.revokeObjectURL(url);
  }

  async function handlePiston() {
    setProcessing(true);
    const formData = {
      language: language.name,
      version: language.version,
      files: [
        {
          content: code,
        },
      ],
      stdin: customInput,
    };

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed
        },
        body: JSON.stringify(formData),
      });

      // Check if request was successful
      if (response.ok) {
        const responseData = await response.json();
        // Handle successful response data
        console.log(responseData.run.code);
        setOutputDetails(responseData.run);
        if (responseData.run.code == 0) {
          showSuccessToast(`Compiled Successfully!`);
        } else {
          showErrorToast("failed to execute");
        }
        setProcessing(false);
      } else {
        // Handle error response
        console.error("Error:", response.statusText);
        setProcessing(false);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error);
      setProcessing(false);
    }
  }

  function handleOffline() {
    setIsOffline((prev) => !prev);
  }

  async function handleOfflineCompile() {
    setProcessing(true);
    const formData = {
      code: code,
    };

    try {
      let a = JSON.stringify(formData);
      console.log(a);
      const response = await fetch(
        `http://localhost:4000/execute/${language.name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: a,
        }
      );

      // Check if request was successful
      if (response.ok) {
        const responseData = await response.json();
        // Handle successful response data
        console.log(responseData);
        setOutputDetails(responseData);

        showSuccessToast(`Compiled Successfully!`);

        setProcessing(false);
      } else {
        // Handle error response
        const responseData = await response.json();

        console.error("Error:", responseData);
        showErrorToast("Failed to execute");
        setOutputDetails(responseData);
        setProcessing(false);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      if (error) console.error("Error:", error);
      setProcessing(false);
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      setCode(content);
      setFileCode(content);
      // console.log(content);
    };

    reader.readAsText(file);
  }
  console.log(code);

  // console.log(activePrompt);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div> */}
      <div className="flex flex-row">
        <div className="px-1 py-2">
          <input className="w-28" type="file" onChange={handleFileChange} />
        </div>
        <div className="px-1 ml-1 py-2 mr-2">
          <LanguagesDropdown
            isOffline={isOffline}
            onSelectChange={onSelectChange}
          />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <div className="px-2 py-2 ">
          <button
            onClick={handleShowAiEditor}
            className=" border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0"
          >
            {" "}
            <div
              className={`h-2 w-2 mr-1 rounded-full  inline-block ${
                showAiEditor ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            Ai Editor
          </button>
        </div>
        <div className="px-2 py-2 ">
          <button
            onClick={() => {
              setOpenModal(true);
              setPromptValue("");
              setGptResponse("");
              setActivePrompt("pai");
            }}
            className=" border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0"
          >
            Ask AI{" "}
          </button>
        </div>
        <div className="px-2 py-2 ">
          <Link
            to={"preview"}
            className=" inline-block cursor-pointer border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 font-bold"
          >
            <VscOpenPreview className="inline-block mr-1" />
            Preview Editor
          </Link>
        </div>

        <div className="px-2 py-2 ">
          <button
            className=" inline-block cursor-pointer border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 font-bold "
            onClick={handleSave}
          >
            <CiSaveDown2 className="inline-block mr-1" />
            Save
          </button>
        </div>
        {/* <div className="px-2 py-2 ">
          <button
            className={`  inline-block cursor-pointer border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 ${
              isOffline && "bg-black text-white "
            }  `}
            onClick={handleOffline}
          >
            <IoCloudOfflineOutline className="inline-block mr-1" />
            Use Offline
          </button>
        </div> */}
        {/* modal  code */}

        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Ask Ai</Modal.Header>
          <Modal.Body>
            <TextInput
              value={promtValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Enter your query here"
              className="w-4/5 inline-block mr-4"
              variant="outlined"
            />
            <Button
              className="inline-block"
              color={"success"}
              onClick={activePrompt === "pai" ? handleGptResp : handleSelfGpt}
              // onClick={handleSelfGpt}
            >
              Generate
            </Button>
            <div className="mt-1">
              <button
                className={`px-3 py-2 my-2 rounded-xl hover:bg-gray-200 mx-2 border-2 ${
                  activePrompt === "pai" && "bg-gray-200"
                }  `}
                onClick={() => setActivePrompt("pai")}
              >
                Pai-001
              </button>
              <button
                className={`px-3 py-2 my-2 rounded-xl hover:bg-gray-200 mx-2 border-2 ${
                  activePrompt === "selfgpt" && "bg-gray-200"
                }`}
                onClick={() => setActivePrompt("selfgpt")}
              >
                <span>
                  <RiRobot2Line className="inline-block mr-1" />
                  Ai Model
                </span>
              </button>
            </div>
            <pre className="mt-3 ">
              {gptLoading && (
                <>
                  <p>Processing Query....</p>{" "}
                  <div>
                    <Spinner aria-label="Default status example" />
                  </div>
                </>
              )}

              {gptResponse ? (
                <div>
                  <SyntaxHighlighter language="javascript">
                    {!gptLoading && gptResponse}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <p className="p-2 pl-4  bg-zinc-100">
                  click on generate to get your response
                </p>
              )}
            </pre>
          </Modal.Body>
          <Modal.Footer>
            <Button color={"failure"} onClick={() => setOpenModal(false)}>
              Close{" "}
            </Button>
          </Modal.Footer>
        </Modal>
        {/* modal code */}
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          {showAiEditor && (
            <CodeEditorWindow
              key={filecode}
              code={code}
              onChange={onChange}
              language={language?.name}
              theme={theme.value}
            />
          )}
          {!showAiEditor && (
            <CodeEditorWindow2
              key={filecode}
              code={code}
              onChange={onChange}
              language={language?.name}
              theme={theme.value}
            />
          )}
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <div>
              <button
                // onClick={handleCompile}
                onClick={isOffline ? handleOfflineCompile : handlePiston}
                disabled={!code}
                className={classnames(
                  "mt-4 inline-block border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 hover:bg-green-500 hover:text-white",
                  !code ? "opacity-50" : ""
                )}
              >
                <SiCompilerexplorer className="inline-block m-1" />

                {processing ? "Processing..." : "Compile and Execute"}
              </button>
            </div>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Landing;
