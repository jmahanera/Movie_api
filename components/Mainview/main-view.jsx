import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      
      title: "Inception",
      id: 1,
      director: "Christopher Nolan",
      directorBio: "Christopher Nolan is a British-American filmmaker known for his complex and visually stunning films. He gained widespread recognition for his work on The Dark Knight trilogy and Inception, among others.",
      imageUrl: "https://www.imdb.com/title/tt1375666/",
    },
    {
      title: "The Shawshank Redemption",
      id: 2,
      director: "Frank Darabont",
      directorBio:  "Frank Darabont is an American director and screenwriter known for his adaptations of Stephen King's works. He directed The Shawshank Redemption and also worked on The Green Mile and The Mist.",
      imageUrl: "https://www.imdb.com/title/tt0111161/"
    },
    {
      title: "The Grand Budapest Hotel",
      id: 3,
      director: "Wes Anderson",
      directorBio: "Wes Anderson is an American filmmaker known for his distinct visual style and quirky storytelling. He has directed films like Moonrise Kingdom, The Royal Tenenbaums, and The Grand Budapest Hotel.",
      imageUrl: "https://www.imdb.com/title/tt2278388/"
    },
    
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
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
};
