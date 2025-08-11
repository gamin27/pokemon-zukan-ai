import { Metadata } from "next";

export default async function PokemonDetail(props: any) {
  const { params } = props;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  const pokemon = await res.json();

  // 日本語名取得
  const speciesRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${params.id}`
  );
  const species = await speciesRes.json();
  const jpNameObj = species.names.find(
    (n: any) => n.language.name === "ja-Hrkt"
  );
  const jpName = jpNameObj ? jpNameObj.name : pokemon.name;

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
    <div
      style={{
        fontFamily: '"Press Start 2P", monospace',
        background:
          "repeating-linear-gradient(45deg, #eee, #eee 2px, #ccc 2px, #ccc 4px)",
        padding: "24px",
        border: "8px solid #222",
        borderRadius: "16px",
        maxWidth: "400px",
        margin: "40px auto",
        boxShadow: "0 0 0 8px #fff, 0 0 0 16px #222",
      }}
    >
      <a
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          color: "#222",
          textDecoration: "none",
          fontSize: "12px",
          border: "2px solid #222",
          background: "#fff",
          padding: "2px 8px",
          borderRadius: "8px",
          boxShadow: "2px 2px 0 #888",
        }}
      >
        ← 戻る
      </a>
      <h1
        style={{
          fontSize: "18px",
          margin: "0 0 12px 0",
          letterSpacing: "2px",
          color: "#222",
          textShadow: "2px 2px 0 #fff, 4px 4px 0 #888",
        }}
      >
        {jpName} (No.{pokemon.id})
      </h1>
      <img
        src={pokemon.sprites.front_default}
        alt={jpName}
        width={96}
        height={96}
        style={{
          imageRendering: "pixelated",
          border: "4px solid #222",
          background: "#fff",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      />
      <h2
        style={{
          fontSize: "14px",
          margin: "12px 0 4px 0",
          color: "#444",
          borderBottom: "2px dotted #888",
        }}
      >
        タイプ
      </h2>
      <ul style={{ paddingLeft: "16px", marginBottom: "12px" }}>
        {pokemon.types.map((t: any, idx: number) => (
          <li
            key={idx}
            style={{
              fontSize: "12px",
              color: "#222",
              background: "#ffe",
              border: "1px solid #888",
              borderRadius: "4px",
              marginBottom: "4px",
              display: "inline-block",
              padding: "2px 8px",
              boxShadow: "1px 1px 0 #888",
            }}
          >
            {typeJa[t.type.name] ?? t.type.name}
          </li>
        ))}
      </ul>
      <h2
        style={{
          fontSize: "14px",
          margin: "12px 0 4px 0",
          color: "#444",
          borderBottom: "2px dotted #888",
        }}
      >
        能力値
      </h2>
      <ul style={{ paddingLeft: "0", listStyle: "none" }}>
        {pokemon.stats.map((stat: any, idx: number) => (
          <li
            key={idx}
            style={{
              marginBottom: "8px",
              fontSize: "12px",
              color: "#222",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ width: "80px", display: "inline-block" }}>
              {stat.stat.name}
            </span>
            <div
              style={{
                height: "16px",
                width: "160px",
                background: "#ddd",
                border: "1px solid #888",
                borderRadius: "4px",
                marginRight: "8px",
                overflow: "hidden",
                boxShadow: "1px 1px 0 #888",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(stat.base_stat, 160)}px`,
                  background: "#66c",
                  imageRendering: "pixelated",
                }}
              />
            </div>
            <span style={{ minWidth: "32px", textAlign: "right" }}>
              {stat.base_stat}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
