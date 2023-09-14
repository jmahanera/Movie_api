import React, { useState } from "react"; // Import React and useState
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    { id: "64fc97da191da30c43fb6956",
      title: "Jurassic Park",
      description: "A group of people visit a remote island where cloned dinosaurs have been unleashed, leading to a fight for survival.",
      director: "James Cameron",
      imageurl: "https://eskipaper.com/images/jurassic-park-wallpaper-3.jpg"
    },
    { id: "64fc9aaf191da30c43fb6965",
      title: "Titanic",
      description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
      director: "The Wachowskis",
      imageurl: "https://eskipaper.com/images/titanic-movie-1.jpg",
    },
    { id: "64fc9b13191da30c43fb6968",
      title: "The Matrix",
      description: "A computer programmer discovers that reality as he knows it is a simulation created by machines to subjugate humanity.",
      director: "Robert Zemeckis",
      imageurl: "https://eskipaper.com/images/neo-matrix-1.jpg",
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
