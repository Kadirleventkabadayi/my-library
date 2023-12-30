import React from "react";
import BookItem from "../components/BookItem";
import { useLoaderData } from "react-router-dom";

function BookDetailPage() {
  const { book, selfLink, id } = useLoaderData();
  return <BookItem selfLink={selfLink} book={book} id={id} />;
}

export default BookDetailPage;

export async function loader({ params }) {
  const id = params.bookId;
  const apiKey = "AIzaSyBaAaijdYTvKhJIuj_l_LL_9wDzto2eOeM"; // Replace with your API key

  const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Could not fetch book details.");
    }

    const bookData = await response.json();

    return {
      book: bookData.volumeInfo,
      selfLink: bookData.selfLink,
      id: bookData.id,
    }; // Only send the volumeInfo and id and selflink
  } catch (error) {
    console.error("Error fetching book details:", error);
    throw error;
  }
}
