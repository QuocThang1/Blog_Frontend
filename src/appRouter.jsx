import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute.jsx";
import App from "./layout/generalLayout.jsx";
import HomePage from "./pages/home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import UserLayout from "./layout/userLayout.jsx";
import Profile from "./pages/Profile.jsx";
import ListOfCategory from "./pages/admin/Category/listOfCategory.jsx";
import ListOfBlog from "./pages/admin/Blog/listOfBlog.jsx";
import BlogDetailManagement from "./pages/admin/Blog/blogDetailManagement.jsx";
import Blog from "./pages/blog.jsx";
import BlogDetail from "./pages/blogDetail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/blog", element: <Blog /> },
      {
        path: "/blog/:id",
        element: (
          <BlogDetail />
        ),
      },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/profile",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element:
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <Profile />
          </ProtectedRoute>
      },
      {
        path: "categories",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListOfCategory />
          </ProtectedRoute>
        ),
      },
      {
        path: "blogs",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListOfBlog />
          </ProtectedRoute>
        ),
      },
      {
        path: "blogs/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <BlogDetailManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
};
