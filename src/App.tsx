import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminLayout from './components/layout/AdminLayout'
import ErrorBoundary from './components/ErrorBoundary'
import CookieConsent from './components/CookieConsent'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import Privacy from './pages/Privacy'
import Login from './pages/admin/login'
import Dashboard from './pages/admin/Dashboard'
import AdminProperties from './pages/admin/Properties'
import PropertyForm from './pages/admin/PropertyForm'
import Settings from './pages/admin/Settings'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'

// Layout compartilhado para páginas públicas
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
    <CookieConsent />
  </div>
);

const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <PublicLayout><Home /></PublicLayout>,
      },
      {
        path: "/imoveis",
        element: <PublicLayout><Properties /></PublicLayout>,
      },
      {
        path: "/imoveis/:tipo/:cidade/:id",
        element: <PublicLayout><PropertyDetails /></PublicLayout>,
      },
      {
        path: "/privacidade",
        element: <PublicLayout><Privacy /></PublicLayout>,
      },
      {
        path: "/admin",
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "",
            element: <AdminLayout><Outlet /></AdminLayout>,
            children: [
              {
                index: true,
                element: <Dashboard />,
              },
              {
                path: "properties",
                children: [
                  {
                    index: true,
                    element: <AdminProperties />,
                  },
                  {
                    path: "new",
                    element: <PropertyForm />,
                  },
                  {
                    path: "edit/:id",
                    element: <PropertyForm />,
                  },
                  {
                    path: ":id",
                    element: <PropertyForm />,
                  },
                ],
              },
              {
                path: "settings",
                element: <Settings />,
              },
              {
                path: "users",
                element: <div>Admin Users</div>,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
