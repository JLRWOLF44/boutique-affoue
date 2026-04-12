export default function SearchBar({ search, setSearch, handleSearchSubmit }) {
  return (
    <form onSubmit={handleSearchSubmit}>
      <input
        type="text"
        placeholder="Tape une catégorie : robe, veste, pull..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit">Rechercher</button>
    </form>
  );
}