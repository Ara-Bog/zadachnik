import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchNavbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const confirmSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
  };

  return (
    <div className="navbar" onSubmit={confirmSearch}>
      <form className="navbar__controls">
        <input
          type="search"
          placeholder="Найти интересующую тему"
          style={{ width: "100%" }}
          value={search}
          onChange={(el) => setSearch(el.target.value)}
        />
        <button className="fill-button bg--orange" type="submit" style={{ width: "auto" }}>
          Найти
        </button>
      </form>
    </div>
  );
}
