import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Landing from "./pages/MainEditorPage/Landing";
import LiveEditor from "./pages/LiveEditorPage/LiveEditor";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/preview",
      element: <LiveEditor />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
