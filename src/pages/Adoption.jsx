import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Heart,
  ArrowUpRight,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { PetCard } from "../components/PetCard";
import { PageIntro } from "../components/Layout";
import { filterPets } from "../utils/logic";
export default function Adoption() {
  const { pets, user, favorites } = useApp();
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("All");
  const [age, setAge] = useState("All");
  const [size, setSize] = useState("All");
  const [energy, setEnergy] = useState("All");
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("name");
  const [onlyFav, setOnlyFav] = useState(false);
  const visible = useMemo(
    () =>
      filterPets(pets, {
        search,
        species,
        age,
        size,
        energy,
        gender,
        status,
        sort,
        onlyFav,
        favorites,
        userId: user?.id,
      }),
    [
      pets,
      search,
      species,
      age,
      size,
      energy,
      gender,
      status,
      sort,
      onlyFav,
      favorites,
      user,
    ],
  );
  const reset = () => {
    setSearch("");
    setSpecies("All");
    setAge("All");
    setSize("All");
    setEnergy("All");
    setGender("All");
    setStatus("All");
    setOnlyFav(false);
  };
  return (
    <>
      <PageIntro
        eyebrow="THE CUTEST CORNER OF THE INTERNET"
        title={
          <>
            Meet your potential <em>bestie.</em>
          </>
        }
        body="Big hearts, little paws, and so many stories waiting to begin. Explore personalities and care needs to understand a thoughtful match."
        tone="yellow"
      />
      <section className="section catalogue-section">
        <div className="container">
          <div className="catalogue-toolbar">
            <div className="search-input">
              <Search size={19} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search names, breeds, personalities..."
                aria-label="Search pets"
              />
            </div>
            <label className="sort-select">
              Sort by{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">Name A–Z</option>
                <option value="young">Age group</option>
                <option value="species">Species</option>
              </select>
            </label>
          </div>
          <div className="filter-row">
            <SlidersHorizontal size={19} />
            {[
              ["Species", species, setSpecies, ["Cat", "Dog"]],
              ["Age", age, setAge, ["Baby", "Young", "Adult", "Senior"]],
              ["Size", size, setSize, ["Small", "Medium", "Large"]],
              ["Energy", energy, setEnergy, ["Calm", "Balanced", "Playful"]],
              ["Gender", gender, setGender, ["Male", "Female"]],
            ].map(([label, value, change, options]) => (
              <label key={label}>
                {label}
                <select
                  aria-label={`Filter by ${label.toLowerCase()}`}
                  value={value}
                  onChange={(e) => change(e.target.value)}
                >
                  <option>All</option>
                  {options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            ))}
            <button
              className={`filter-fav ${onlyFav ? "selected" : ""}`}
              onClick={() => setOnlyFav(!onlyFav)}
            >
              <Heart size={15} /> Favourites
            </button>
            <button className="reset-filters" onClick={reset}>
              <X size={15} /> Clear
            </button>
          </div>
          <div className="catalogue-count">
            <p>
              <strong>{visible.length}</strong> adorable{" "}
              {visible.length === 1 ? "friend" : "friends"} to discover
            </p>
          </div>
          {visible.length ? (
            <div className="pet-grid">
              {visible.map((p) => (
                <PetCard key={p.id} pet={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Heart size={38} />
              <h3>No little paws here (yet).</h3>
              <p>
                Try changing your filters — another furry face may be the
                perfect match.
              </p>
              <button className="button button-dark" onClick={reset}>
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
