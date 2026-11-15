import { petImages } from '../data/images.js';
import { Link } from 'react-router-dom';
import PetImage from './PetImage';
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { findMatches } from "../utils/logic";
import { getRandomPetPhoto } from "../services/petApi";
import { RefreshCw, Cat, Dog, ChevronLeft, ChevronRight } from "lucide-react";
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
