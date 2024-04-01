import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

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

            const customCompletions = [
                { caption: "foo", value: "foo", meta: "Custom" },
                { caption: "bar", value: "bar", meta: "Custom" },
                { caption: "baz", value: "baz", meta: "Custom" },
                {
                    caption: "for loop",
                    value: "for (var i = 0; i < length; i++) {\n\t//  Your code here\n}",
                    meta: "for snippet",
                },
                {
                    caption: "saurabh",
                    value: `rana
  saaurabh`,
                    meta: "abc",
                },
            ];

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
                    defaultValue="some value"
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