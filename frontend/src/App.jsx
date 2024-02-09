import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginFormPage from "./components/LoginFormPage/LoginFormPage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Welcome!</h1>
  },
  {
    path: '/login',
    element: <LoginFormPage />
  }
]);

function App() {
  return <RouterProvider router={router} />;
  // return (
  //   <>
  //     <h1> Hello from App </h1>;
  //     <LoginFormPage />
  //   </>
  // )

}

export default App;
