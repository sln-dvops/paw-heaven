import { petImages } from '../data/images.js';
import PetImage from './PetImage';
import { Heart, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
export function PetCard({
  pet
}) {
  const {
    user,
    favorites,
    toggleFavorite,
    notify
  } = useApp();
  const navigate = useNavigate();
  const isFav = favorites.some(f => f.userId === user?.id && f.petId === pet.id);
  const heart = () => {
    if (!user) {
      notify('Log in to save your favourites.', 'error');
      navigate('/login', {
        state: {
          from: '/adopt'
        }
      });
      return;
    }
    toggleFavorite(pet.id);
  };
  return <motion.article whileHover={{
    y: -6
  }} transition={{
    duration: .2
  }} className="pet-card"><div className="pet-photo" style={{
    background: pet.color || '#ffe6db'
  }}><Link to={`/adopt/${pet.id}`} aria-label={`View ${pet.name}`}><PetImage src={pet.image || petImages['pet-1']} alt={`${pet.name}, a ${pet.breed}`} loading="lazy" /></Link><span className={`pet-status ${pet.status === 'Available' ? 'status-available' : 'status-other'}`}>{pet.status}</span><button onClick={heart} className={`heart-button ${isFav ? 'loved' : ''}`} aria-label={isFav ? `Remove ${pet.name} from favourites` : `Add ${pet.name} to favourites`} aria-pressed={isFav}><Heart size={19} fill={isFav ? 'currentColor' : 'none'} /></button></div><div className="pet-details"><div className="pet-top"><div><span className="pet-tag">{pet.tag || 'New friend'}</span><h3>{pet.name}</h3></div><span className="pet-type">{pet.species}</span></div><p className="pet-breed">{pet.breed} · {pet.age}</p><div className="pet-traits"><span>{pet.gender}</span><span>{pet.size}</span><span>{pet.energy}</span></div><Link className="pet-link" to={`/adopt/${pet.id}`}>Get to know {pet.name}<ArrowUpRight size={19} /></Link></div></motion.article>;
}
