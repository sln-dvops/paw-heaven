import { petImages } from '../data/images.js';
import { Link } from 'react-router-dom';
import PetImage from './PetImage';
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { petFacts } from "../data/seed";
import { findMatches } from "../utils/logic";
import { getRandomPetPhoto } from "../services/petApi";
import { RefreshCw, Cat, Dog, ChevronLeft, ChevronRight } from "lucide-react";
export function DailyFact() {
  const [idx, setIdx] = useState(() => Math.floor(Date.now() / 86400000) % petFacts.length);
  return <div className="fact-widget">
    <span className="mini-eyebrow">A LITTLE SOMETHING TO LEARN</span>
    <h3>
      Did you know? <span>✦</span>
    </h3>
    <p>{petFacts[idx]}</p>
    <div className="fact-controls">
      <span>
        {idx + 1} / {petFacts.length}
      </span>
      <div>
        <button aria-label="Previous fact" onClick={() => setIdx(v => (v + petFacts.length - 1) % petFacts.length)}>
          <ChevronLeft size={18} />
        </button>
        <button aria-label="Next fact" onClick={() => setIdx(v => (v + 1) % petFacts.length)}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  </div>;
}
export function RandomPetPhotos() {
  const [kind, setKind] = useState("cat");
  const [url, setUrl] = useState(petImages['pet-2']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fetchPet = async chosen => {
    setKind(chosen);
    setBusy(true);
    setError("");
    try {
      const image = await getRandomPetPhoto(chosen);
      setUrl(image);
    } catch {
      setUrl(chosen === "cat" ? petImages['pet-2'] : petImages['pet-3']);
      setError("Couldn’t fetch a fresh photo, so here is one of our favourites.");
    } finally {
      setBusy(false);
    }
  };
  return <div className="api-card">
    <div className="api-photo">
      <PetImage alt={`Random ${kind} for fun; not an adoptable Pet Heaven animal`} src={url} onError={() => setError('The photo could not load. A replaceable illustration is shown instead.')} />
    </div>
    <div className="api-meta">
      <span className="mini-eyebrow">JUST FOR FUN · NOT FOR ADOPTION</span>
      <h3>Cutie of the moment</h3>
      <p>
        Need a smile? Discover a random furry face from public pet photo APIs.
      </p>
      <div className="api-buttons">
        <button disabled={busy} onClick={() => fetchPet("cat")} className="button button-primary button-sm">
          <Cat size={16} />
          {busy && kind === "cat" ? "Loading..." : "Another cat"}
        </button>
        <button disabled={busy} onClick={() => fetchPet("dog")} className="button button-light button-sm">
          <Dog size={16} />
          {busy && kind === "dog" ? "Loading..." : "Another dog"}
        </button>
      </div>
      {error && <small role="status" className="muted">
        {error}
      </small>}
    </div>
  </div>;
}
export function MatchQuiz() {
  const {
    pets
  } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const questions = [{
    key: "species",
    label: "Which furry friend speaks to you?",
    options: ["Cat", "Dog", "Either"]
  }, {
    key: "energy",
    label: "What pace do you enjoy?",
    options: ["Calm", "Balanced", "Playful"]
  }, {
    key: "space",
    label: "How much room do you have?",
    options: ["Cosy apartment", "Room to roam"]
  }, {
    key: "time",
    label: "How much time can you give?",
    options: ["A relaxed routine", "Lots of active play"]
  }];
  const finished = step >= questions.length;
  const scored = findMatches(pets, answers);
  return <div className="quiz-widget">
    {!finished ? <>
      <div className="quiz-progress">
        <span>
          QUESTION {step + 1} OF {questions.length}
        </span>
        <div>
          <i style={{
            width: `${(step + 1) / questions.length * 100}%`
          }} />
        </div>
      </div>
      <h3>{questions[step].label}</h3>
      <div className="quiz-options">
        {questions[step].options.map(opt => <button key={opt} onClick={() => {
          setAnswers(prev => ({
            ...prev,
            [questions[step].key]: opt
          }));
          setStep(v => v + 1);
        }}>
          {opt} <span>→</span>
        </button>)}
      </div>
    </> : <>
      <div className="mini-eyebrow">YOUR PAW-FECT MATCHES</div>
      <h3>We've got a little hunch!</h3>
      <div className="match-results">
        {scored.map(p => <Link to={`/adopt/${p.id}`} key={p.id}>
          <PetImage src={p.image} alt={p.name} />
          <span>
            <strong>{p.name}</strong>
            <small>
              {p.breed} · {p.energy}
            </small>
          </span>
          <span>→</span>
        </Link>)}
      </div>
      <p className="fine-print">
        Friendly guidance only
      </p>
      <button className="text-button" onClick={() => {
        setStep(0);
        setAnswers({});
      }}>
        <RefreshCw size={15} /> Retake the quiz
      </button>
    </>}
  </div>;
}
