import { RouterProvider, createBrowserRouter } from "react-router-dom";

//Layout
import Layout from "./pages/layout/RootLayout";
//Pages
import IndexPage from "./pages/index/page";
import AboutPage from "./pages/about/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <IndexPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
