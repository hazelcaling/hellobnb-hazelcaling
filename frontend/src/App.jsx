import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import Home from './components/Spots/Home';
import SpotDetails from './components/Spots/SpotDetails';
import Reviews from './components/Reviews/Reviews';
import NewSpotForm from './components/Spots/NewSpotForm';
import ManageSpots from './components/Spots/ManageSpots'


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
        element: <Home />,
      },
      {
        path: 'new-spot',
        element: <NewSpotForm />,
      },
      {
        path: ':spotId',
        element: <SpotDetails />,
        children: [
          {
            path: 'reviews',
            element: <Reviews />
          }
        ]
      },
      {
        path: 'spots',
        element: <ManageSpots />,
        children: [
          {
            path: ':spotId',
            element: <SpotDetails />,
            children: [
              {
                path: 'reviews',
                element: <Reviews />
              }
            ]
          },
        ]
      }
      // {
      //   path: 'spots',
      //   children: [
      //     {
      //       path: ':spotId',
      //       element: <SpotDetails />,
      //       children: [
      //         {
      //           path: 'reviews',
      //           element: <Reviews />
      //         }
      //       ]
      //     },

      //   ]
      // },

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
