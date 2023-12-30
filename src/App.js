import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootPage from "./pages/RootPage";
import ErrorPage from "./pages/ErrorPage";
import BooksPage, { loader as BookLoader } from "./pages/BooksPage";
import BookDetailPage, {
  loader as BookDetailLoader,
} from "./pages/BookDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContanctUsPage from "./pages/ContactUsPage";
import { UserProvider } from "./components/UserContex";
import LibraryPage from "./pages/LibraryPage";
import Profile from "./pages/Profile";

function App() {
  const myRouter = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <BooksPage />,
          loader: BookLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: ":bookId",
          element: <BookDetailPage />,
          loader: BookDetailLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: "/contact",
          element: <ContanctUsPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/library",
          element: <LibraryPage />,
          errorElement: <ErrorPage />,
        },
        //BURADA BİR KAÇ DEĞİŞİKLİK GEREKEBİLİR ÇÜNKÜ PROFİL SAYAFASI PAYLAŞMAK İÇİN FARKLI URLLER GEREKLİ OLABİLİR
        {
          path: "/profile",
          element: <Profile />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      path: "/signin",
      element: <LoginPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <RegisterPage />,
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <UserProvider>
      <RouterProvider router={myRouter} />
    </UserProvider>
  );
}

export default App;
