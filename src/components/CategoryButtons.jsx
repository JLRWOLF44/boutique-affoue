export default function CategoryButtons({ openCategory }) {
  return (
    <div>
      <button onClick={() => openCategory("Robe")}>Robe</button>
      <button onClick={() => openCategory("Veste")}>Veste</button>
      <button onClick={() => openCategory("Pull")}>Pull</button>
      <button onClick={() => openCategory("Accessoire")}>Accessoire</button>
    </div>
  );
}