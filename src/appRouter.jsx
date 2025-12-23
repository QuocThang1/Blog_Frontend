// Fixed import case sensitivity issues
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./route/ProtectedRoute.jsx";
import App from "./layout/generalLayout.jsx";
import HomePage from "./pages/home.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import UserLayout from "./layout/userLayout.jsx";
import Profile from "./pages/profile.jsx";
import ListOfCategory from "./pages/admin/Category/listOfCategory.jsx";
import ListOfBlog from "./pages/admin/Blog/listOfBlog.jsx";
import BlogDetailManagement from "./pages/admin/Blog/blogDetailManagement.jsx";
import Blog from "./pages/blog.jsx";
import BlogDetail from "./pages/blogDetail.jsx";
import ListOfTag from "./pages/admin/Tag/listOfTag.jsx";
import ListOfUsers from "./pages/admin/Users/listOfUsers.jsx";
import ShareBlog from "./pages/shareBlog.jsx";
import ListOfSubmissions from "./pages/admin/Content/listOfContent.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UserInsights from "./pages/admin/UserInsights.jsx";
import ModerationQueue from "./pages/admin/ModerationQueue.jsx";
import UserSegmentation from "./pages/admin/UserSegmentation.jsx";
import Recommendations from "./pages/admin/Recommendations.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";

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
      {
        path: "/submissions",
        element: (
          <ShareBlog />
        ),
      },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
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
        path: "content-management",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListOfSubmissions />
          </ProtectedRoute>
        ),
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
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListOfUsers/>
          </ProtectedRoute>
        ),
      },
      {
        path: "tags",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListOfTag />
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
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "insights",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserInsights />
          </ProtectedRoute>
        ),
      },
      {
        path: "moderation",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ModerationQueue />
          </ProtectedRoute>
        ),
      },
      {
        path: "segmentation",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserSegmentation />
          </ProtectedRoute>
        ),
      },
      {
        path: "recommendations",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Recommendations />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminReports />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
};
