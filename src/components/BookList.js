import { Link } from "react-router-dom";
import classes from "./BookList.module.css";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

function BooksList({ books }) {
  function trimedContent(book, content) {
    let letterCount;
    switch (content) {
      case "title":
        letterCount = book.volumeInfo?.title.length;

        if (letterCount < 29) {
          return book.volumeInfo?.title;
        }
        const title = book.volumeInfo?.title.substring(0, 28) + "...";

        return title;

      case "author":
        letterCount = book.volumeInfo?.authors?.join(", ").length;

        if (letterCount < 29) {
          return book.volumeInfo?.authors?.join(", ");
        }
        if (!book.volumeInfo?.authors) {
          return "Unknown author";
        }
        const author =
          book.volumeInfo?.authors?.join(", ").substring(0, 28) + "...";

        return author;

      default:
        throw new Error("Unknown Type.");
    }
  }

  return (
    <>
      <div style={{ height: "100vh" }} className={classes.books}>
        <h1>All books</h1>
        <p className={classes.pageDescription}>
          Let's find inspiration for your book to be read so that your knowledge
        </p>
        <p
          style={{ marginBlockEnd: "8rem" }}
          className={classes.pageDescription}
        >
          increases
        </p>
        <div
          style={{
            paddingLeft: "10rem",
            paddingRight: "16rem",
          }}
        >
          <Swiper
            style={{ paddingLeft: "9rem" }}
            spaceBetween={0}
            slidesPerView={4}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {books.map((book, index) => (
              <SwiperSlide s key={index}>
                <div className={classes.item}>
                  <div>
                    <img
                      src={
                        book.volumeInfo?.imageLinks
                          ? book.volumeInfo?.imageLinks?.thumbnail
                          : "https://www.vhv.rs/dpng/d/492-4923040_book-image-no-copyright-hd-png-download.png"
                      }
                      alt={book.volumeInfo?.title}
                    />
                    <div className={classes.content}>
                      <h4>{trimedContent(book, "title")}</h4>
                      <p>{trimedContent(book, "author")}</p>
                    </div>
                    <Link to={book.id}>
                      <button className={classes.detailbtn}>
                        Go to Details
                      </button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default BooksList;
