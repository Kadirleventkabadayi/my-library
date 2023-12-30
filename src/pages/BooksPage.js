import { json, useLoaderData } from "react-router-dom";
import BooksList from "../components/BookList";
import InfoArea from "../components/InfoArea";

function BooksPage() {
  const data = useLoaderData();
  const books = data.items;
  if (data.isError) {
    return <p>{data.message}</p>;
  }

  return (
    <>
      <InfoArea />

      <BooksList books={books} />
    </>
  );
}

export default BooksPage;

export async function loader() {
  const apiKey = "AIzaSyBaAaijdYTvKhJIuj_l_LL_9wDzto2eOeM";
  const maxResults = 40; // 40 kitap almak için

  const url = `https://www.googleapis.com/books/v1/volumes?q=search+terms&key=${apiKey}&maxResults=${maxResults}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        JSON.stringify({
          message: "Could not fetch books.",
          data: errorResponse,
        })
      );
    }

    const data = await response.json();
    const books = data.items;
    return { items: books };
  } catch (error) {
    console.error("Hata:", error);
    throw json(
      { message: "Could not fetch books." },
      {
        status: 500,
      }
    );
  }
}
