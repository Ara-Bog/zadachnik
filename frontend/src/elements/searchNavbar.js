export default function SearchNavbar() {
  return (
    <div className="navbar">
      <form className="navbar__controls">
        <input type="search" placeholder="Найти интересующую тему" style={{ width: "100%" }} />
        <button className="fill-button bg--orange" type="submit" style={{ width: "auto" }}>
          Найти
        </button>
      </form>
    </div>
  );
}
