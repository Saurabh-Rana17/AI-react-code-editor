import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing";
import LiveEditor from "./components/LiveEditor";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    }, {
      path: '/preview',
      element: <LiveEditor  />
    }
  ])
  return <RouterProvider router={router} />;
}

export default App;
