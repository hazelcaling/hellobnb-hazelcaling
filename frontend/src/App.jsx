import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import Navigation from "./components/Navigation/Navigation"
import * as sessionActions from "./store/session"
import Home from "./components/Spots/Home"
import SpotDetails from "./components/Spots/SpotDetails"
import Reviews from "./components/Reviews/Reviews"
import SpotForm from "./components/Spots/SpotForm"
import ManageSpots from "./components/Spots/ManageSpots"
import UpdateSpotForm from "./components/Spots/UpdateSpotForm"

function Layout() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "new-spot",
        element: <SpotForm />,
      },
      {
        path: "spots",
        element: <ManageSpots />,
      },
      {
        path: ":spotId",
        element: <SpotDetails />,
        children: [
          {
            path: "reviews",
            element: <Reviews />,
          },
        ],
      },
      {
        path: "spots/:spotId",
        element: <SpotDetails />,
        children: [
          {
            path: "reviews",
            element: <Reviews />,
          },
        ],
      },
      {
        path: "spots/:spotId/update",
        element: <UpdateSpotForm />,
      },

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
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
