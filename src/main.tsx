import ReactDOM from 'react-dom/client';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App';
import HomePage from './pages/home';
import LoginPage from './pages/auth/login';
import ProtectedRoute from './api/store/verifyLoggedUser';
import ShowPost from './pages/showPost';
import MyProfile from './pages/my_profile';
import RegisterPage from './pages/auth/register';
import { UserContextProvider } from './store/userContext';


const router = createBrowserRouter([

  {
    path: '/',
    element: <ProtectedRoute child={<App/>}/>,
    children: [
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path: '/post/:id',
        element: <ShowPost/>
      },
      {
        path: '/profile',
        element: <MyProfile/>
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage/>
  },
  {
    path: '/register',
    element: <RegisterPage/>
  }
  // {
  //   path: '/home',
  //   element: <Home />,
  // },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
  <UserContextProvider>
    <RouterProvider router={router} />
  </UserContextProvider>
  </>
)

