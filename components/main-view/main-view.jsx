import { useState } from "react";
import { MovieCard } from "movie-card/movie-card";
import { MovieView } from "movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    { id: "644a38baa33d5b41dd203aff",
      title: "Jurassic Park",
      description: "A theme park with cloned dinosaurs goes wrong",
      director: "Steven Spielberg",
      imageurl: "https://www.imdb.com/title/tt0107290/?ref_=nv_sr_srsg_0_tt_8_nm_0_q_Jurassic%2520Park"
      },

     { id: "644a352ca33d5b41dd203afb",
       title: "Matrix",
       description: "A Hacker discovers he is living in a simulated reality",
       director: "Lana Wachowski",
       imageurl: "https://www.imdb.com/title/tt0133093/",
      },
     { id: "644a35e0a33d5b41dd203afc",
       title: "Goodfellas",
       description: "A young man rises through the ranks of the Mafia",
       director: "Martin Scorsese",
       imageurl: "https://www.imdb.com/title/tt0099685/?ref_=fn_al_tt_1",
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