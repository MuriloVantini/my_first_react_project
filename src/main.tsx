import ReactDOM from 'react-dom/client';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App';
import HomePage from './pages/home';
import LoginPage from './pages/login';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '/home',
        element: <HomePage/>
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage/>
  }
  // {
  //   path: '/home',
  //   element: <Home />,
  // },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)

