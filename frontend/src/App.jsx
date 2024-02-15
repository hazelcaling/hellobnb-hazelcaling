import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import SpotList from './components/Spots/Spotlist';
import SpotDetails from './components/Spots/SpotDetails';
import Reviews from './components/Reviews/Reviews';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotList />
      },
      {
        path: 'spots/:spotId',
        element: <SpotDetails />,
        children: [
          {
            path: 'reviews',
            element: <Reviews />
          },
        ]
      },

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
