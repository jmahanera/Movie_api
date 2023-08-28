 export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <div>
        <img src={movie.image} alt={movie.title} />
      </div>
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>director: </span>
        <span>{movie.director}</span>
      </div>
      <button onClick={onBackClick}>Back</button>
      
    </div>
  );
};
