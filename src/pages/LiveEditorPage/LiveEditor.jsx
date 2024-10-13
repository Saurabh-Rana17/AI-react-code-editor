import { useState } from "react";
import LiveEditorWindow from "../../components/LiveEditorWindow";
import "./liveEditor.css";
export default function LiveEditor() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");

  const srcDoc = `
  <html>
  <body>${html}</body>
  <style>${css}</style>
    <script>${js}</script>
  </html>
  `;
  console.log(html, css, js);

  return (
    <>
      <div className="box-border pane top-pane">
        <LiveEditorWindow
          language="html"
          displayName="HTML"
          value={html}
          onChange={setHtml}
        >
          {" "}
        </LiveEditorWindow>
        <LiveEditorWindow
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
        >
          {" "}
        </LiveEditorWindow>
        <LiveEditorWindow
          language="javascript"
          displayName="JAVASCRIPT"
          value={js}
          onChange={setJs}
        >
          {" "}
        </LiveEditorWindow>
      </div>
      <div className="pane box-border border-2 mt-1 border-black bottom-pane">
        <iframe
          srcDoc={srcDoc}
          title="output"
          // sandbox="allow-scripts"
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
}
