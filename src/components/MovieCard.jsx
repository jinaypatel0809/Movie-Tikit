import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        src={movie.backdrop_path}
        alt=""
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} .{" "}
        {movie.genres
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}{" "}
        . {timeFormat(movie.runtime)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3 px-2">
        {/* Buy Tickets Button */}
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="bg-[#f84c56] hover:bg-[#e03e47] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md transition duration-300"
        >
          Buy Tickets
        </button>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm text-white bg-[#121212] px-3 py-1 rounded-full shadow-sm">
          <svg
            className="w-4 h-4 text-[#f84c56] fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.905L19.335 24 12 19.897 4.665 24 6 15.655 0 9.75l8.332-1.595z" />
          </svg>
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
