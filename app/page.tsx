"use client";

import { useState, useEffect } from "react";

type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!res.ok) throw new Error("API fetch failed");
        const data: { results?: { name: string }[] } = await res.json();
        const results = Array.isArray(data.results) ? data.results : [];
        // 各ポケモンのタイプも取得
        const list: Pokemon[] = await Promise.all(
          results.map(async (pokemon: { name: string }, index: number) => {
            const detailRes = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${index + 1}`
            );
            const detail = await detailRes.json();
            return {
              id: index + 1,
              name: pokemon.name,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                index + 1
              }.png`,
              types: detail.types.map((t: any) => t.type.name),
            };
          })
        );
        setPokemons(list);
      } catch (error) {
        console.error(error);
        setPokemons([]);
      }
    }
    fetchData();
  }, []);

  // タイプ一覧を抽出
  const allTypes = Array.from(new Set(pokemons.flatMap((p) => p.types))).sort();

  // フィルター処理
  const filtered = pokemons.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedType === "" || p.types.includes(selectedType))
  );

  // 英語→日本語タイプ変換テーブル
  const typeJa: { [key: string]: string } = {
    normal: "ノーマル",
    fire: "ほのお",
    water: "みず",
    electric: "でんき",
    grass: "くさ",
    ice: "こおり",
    fighting: "かくとう",
    poison: "どく",
    ground: "じめん",
    flying: "ひこう",
    psychic: "エスパー",
    bug: "むし",
    rock: "いわ",
    ghost: "ゴースト",
    dragon: "ドラゴン",
    dark: "あく",
    steel: "はがね",
    fairy: "フェアリー",
  };

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
      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontFamily: "inherit",
          }}
        >
          <option value="">すべてのタイプ</option>
          {allTypes.map((type) => (
            <option key={type} value={type}>
              {typeJa[type] ?? type}
            </option>
          ))}
        </select>
      </div>
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
              style={{ imageRendering: "pixelated" }}
            />
            <p>{pokemon.name}</p>
            <div>
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  style={{
                    fontSize: "10px",
                    background: "#ffe",
                    border: "1px solid #888",
                    borderRadius: "4px",
                    margin: "2px",
                    padding: "2px 6px",
                    display: "inline-block",
                  }}
                >
                  {typeJa[type] ?? type}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
