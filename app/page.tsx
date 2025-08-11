"use client";

import { useState, useEffect } from "react";

type Pokemon = {
  id: number;
  name: string;
  image: string;
};

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!res.ok) throw new Error("API fetch failed");
        const data = await res.json();
        const list = data.results.map((pokemon, index) => ({
          id: index + 1,
          name: pokemon.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
            index + 1
          }.png`,
        }));
        setPokemons(list);
      } catch (error) {
        console.error(error);
        setPokemons([]);
      }
    }
    fetchData();
  }, []);

  const filtered = pokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>ポケモン図鑑</h1>
      <input
        type="text"
        placeholder="ポケモン名で検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "100%",
          maxWidth: "300px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "10px",
        }}
      >
        {filtered.map((pokemon) => (
          <a
            key={pokemon.id}
            href={`/pokemon/${pokemon.id}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              textDecoration: "none",
              color: "black",
            }}
          >
            <img
              src={pokemon.image}
              alt={pokemon.name}
              width={96}
              height={96}
            />
            <p>{pokemon.name}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
