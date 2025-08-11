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

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <a href="/" style={{ display: "inline-block", marginBottom: "20px" }}>
        ← 戻る
      </a>
      <h1>
        {jpName} (No.{pokemon.id})
      </h1>
      <img
        src={pokemon.sprites.front_default}
        alt={jpName}
        width={150}
        height={150}
      />
      <h2>タイプ</h2>
      <ul>
        {pokemon.types.map((t: any, idx: number) => (
          <li key={idx}>{t.type.name}</li>
        ))}
      </ul>
      <h2>能力値</h2>
      <ul>
        {pokemon.stats.map((stat: any, idx: number) => (
          <li key={idx}>
            {stat.stat.name}: {stat.base_stat}
          </li>
        ))}
      </ul>
    </div>
  );
}
