import { CodeiumEditor,Document,Language } from "@codeium/react-code-editor";
import React from "react";
import { Link } from "react-router-dom";
// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/material.css";
// import "codemirror/mode/xml/xml";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/mode/css/css";
// import { Controlled as ControlledEditor } from "react-codemirror2";

export default function LiveEditorWindow(props) {
  const { language, displayName, value, onChange } = props;
  function handleChange( value) {
    onChange(value);
  }
  return (
    <>
      <div className="editor-container">
        <div className="editor-title">
          {displayName}
          <Link to="/">
            <button>Home</button>{" "}
          </Link>
        </div  >
        
         <CodeiumEditor 
         height={'250px'} 
        onChange={handleChange}
        theme={'vs-dark'}
        language={language || "javascript"}
        value={value}
        defaultValue=""
    //   otherDocuments={[
    //       new Document({
    //         text: value,
    //         editorLanguage: language,
    //         language: `Language.${displayName}`,
    //       }),
    //     ]}
      />
      </div>
    </>
  );
}