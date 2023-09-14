import React, { useState } from "react"; // Import React and useState
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    { id: "64fc97da191da30c43fb6956",
      title: "Jurassic Park",
      description: "A group of people visit a remote island where cloned dinosaurs have been unleashed, leading to a fight for survival.",
      director: "James Cameron",
      imageurl: "https://www.imdb.com/title/tt0163025/?ref_=fn_al_tt_2"
    },
    { id: "64fc9aaf191da30c43fb6965",
      title: "Titanic",
      description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
      director: "The Wachowskis",
      imageurl: "https://www.imdb.com/title/tt0120338/mediaviewer/rm2647458304/?ref_=tt_ov_i",
    },
    { id: "64fc9b13191da30c43fb6968",
      title: "The Matrix",
      description: "A computer programmer discovers that reality as he knows it is a simulation created by machines to subjugate humanity.",
      director: "Robert Zemeckis",
      imageurl: "https://www.imdb.com/title/tt0133093/mediaviewer/rm525547776/?ref_=tt_ov_i",
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
      {/* Map through the movies array */}
      {movies.map((movie) => (
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
