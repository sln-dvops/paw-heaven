import PetImage from "../components/PetImage";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  ArrowUpRight,
  Home,
  ShieldCheck,
  PawPrint,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PetCard } from "../components/PetCard";
export default function PetDetail() {
  const { id } = useParams();
  const { pets, user, favorites, toggleFavorite, notify } = useApp();
  const pet = pets.find((p) => p.id === id && p.status === "Available");
  if (!pet)
    return (
      <div className="container protect">
        <h1>We can't find this little friend.</h1>
        <Link className="button button-dark" to="/adopt">
          Back to all pets
        </Link>
      </div>
    );
  const fav = favorites.some((f) => f.userId === user?.id && f.petId === id);
  const related = pets
    .filter(
      (p) =>
        p.id !== id && p.species === pet.species && p.status === "Available",
    )
    .slice(0, 3);
  return (
    <>
      <div className="container detail-breadcrumb">
        <Link to="/adopt">
          <ArrowLeft size={17} /> All pets
        </Link>
        <span>/</span>
        <span>{pet.name}</span>
      </div>
      <section className="section pet-detail-section">
        <div className="container pet-detail-grid">
          <div
            className="pet-detail-picture"
            style={{
              background: pet.color,
            }}
          >
            <PetImage src={pet.image} alt={`${pet.name} the ${pet.breed}`} />
          </div>
          <div className="pet-detail-copy">
            <span className="eyebrow">
              <PawPrint size={14} /> HELLO, NEW FRIEND!
            </span>
            <h1>
              I'm <em>{pet.name}!</em>
            </h1>
            <p className="detail-lead">{pet.personality}</p>
            <div className="detail-tags">
              <span>{pet.species}</span>
              <span>{pet.age}</span>
              <span>{pet.gender}</span>
              <span>{pet.size}</span>
              <span>{pet.energy} energy</span>
            </div>
            <div className="detail-section">
              <h3>A little about me</h3>
              <p>{pet.story}</p>
            </div>
            <div className="detail-section">
              <h3>
                <Home size={20} /> My kind of home
              </h3>
              <p>{pet.home}</p>
            </div>
            <div className="detail-section">
              <h3>
                <ShieldCheck size={20} /> Health & wellbeing
              </h3>
              <p>{pet.health}</p>
            </div>
            <div className="detail-actions">
              {pet.status === "Available" ? (
                <Link className="button button-dark" to={`/apply/${pet.id}`}>
                  Apply & book a visit <ArrowUpRight size={17} />
                </Link>
              ) : (
                <span className="info-chip">
                  {pet.status} — currently unavailable for new applications
                </span>
              )}
              <button
                className="button button-outline"
                onClick={() =>
                  user
                    ? toggleFavorite(pet.id)
                    : notify("Please log in to favourite a pet.", "error")
                }
              >
                <Heart size={17} fill={fav ? "currentColor" : "none"} />
                {fav ? "Saved" : "Save pet"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-blush">
        <div className="container">
          <h2 className="related-title">More little faces to fall for.</h2>
          <div className="pet-grid">
            {related.map((p) => (
              <PetCard pet={p} key={p.id} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
