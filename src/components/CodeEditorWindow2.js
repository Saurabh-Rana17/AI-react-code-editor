import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-min-noconflict/ext-searchbox";

// import language
import "ace-builds/src-noconflict/mode-c_cpp";

// import theme
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import { AceSnippet } from "../constants/AceSnippet";
import { ReactAceThemes } from "../constants/ReactAceThemes";

// dynamic import
const languages = [
  "javascript",
  "java",
  "python",
  "ruby",
  "golang",
  "csharp",
  "elixir",
  "typescript",
  "c_cpp",
];

// const themes = [
//     "monokai",
//     "github",
//     "tomorrow",
//     "kuroir",
//     "twilight",
//     "xcode",
//     "textmate",
//     "solarized_dark",
//     "solarized_light",
//     "terminal"
// ];

languages.forEach((lang) => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});

ReactAceThemes.forEach((themeval) =>
  require(`ace-builds/src-noconflict/theme-${themeval}`)
);

const CodeEditorWindow2 = ({ onChange, language, code, theme }) => {
  const editorRef = useRef(null);
  const [value, setValue] = useState(code || "");
  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;

      const customCompletions = AceSnippet;

      window.ace.acequire("ace/ext/language_tools").addCompleter({
        getCompletions: function (editor, session, pos, prefix, callback) {
          callback(null, customCompletions);
        },
      });
    }
  }, []);

  return (
    <>
      <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
        <AceEditor
          ref={editorRef}
          height="85vh"
          width={`100%`}
          mode={language || "javascript"}
          value={value}
          theme={theme}
          fontSize={14}
          defaultValue=""
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          setOptions={{
            useWorker: false,
            enableSnippets: true,
          }}
          onChange={handleEditorChange}
        />
      </div>
    </>
  );
};

export default CodeEditorWindow2;
