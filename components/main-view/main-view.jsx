import { useState } from "react";
import { MovieCard } from "movie-card/movie-card";
import { MovieView } from "movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    { id: "644a3373a33d5b41dd203af9",
      title: "The Shawshank Redemption",
      description: "A man befriends a fellow inmate in prison and escapes",
      director: "Frank Darabont",
      imageurl: "http://example.com/the_shawshank_redemption"
      },
     { id: "644a352ca33d5b41dd203afb",
       title: "Matrix",
       description: "A Hacker discovers he is living in a simulated reality",
       director: "Lana Wachowski",
       imageurl: "http://example.com/matrix",
      },
     { id: "644a35e0a33d5b41dd203afc",
       title: "Goodfellas",
       description: "A young man rises through the ranks of the Mafia",
       director: "Martin Scorsese",
       imageurl: "http://example.com/goodfellas",
      },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

    if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div> The list is Empty!</div>;
  }
  return (
    <div>
      {movie.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
}