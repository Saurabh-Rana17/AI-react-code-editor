import React, { useState } from "react";

import Editor from "@monaco-editor/react";
import { CodeiumEditor } from "@codeium/react-code-editor";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <CodeiumEditor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue=""
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;
