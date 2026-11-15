import { petImages } from "../data/images.js";
import PetImage from "../components/PetImage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  CalendarDays,
  HandHeart,
  ShieldCheck,
  Sparkles,
  PawPrint,
  ArrowRight,
  BookOpen,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { PetCard } from "../components/PetCard";
import { SectionHead } from "../components/Layout";
import { DailyFact, RandomPetPhotos, MatchQuiz } from "../components/Widgets";

export default function Home() {
  const { pets, events, submitContact } = useApp();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <motion.div
            className="hero-copy"
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <div className="hero-pill">
              <span className="hero-pill-dot" /> THE HAPPIEST LITTLE PLACE ON
              EARTH
            </div>
            <h1>
              Every little paw deserves a place called <em>home.</em>
              <span className="hero-doodle">✳</span>
            </h1>
            <p>
              Meet your new best friend, make a little difference, and help us
              turn second chances into happy beginnings.
            </p>
            <div className="hero-buttons">
              <Link to="/adopt" className="button button-dark">
                Meet our pets <ArrowUpRight size={18} />
              </Link>
              <Link to="/how-it-works" className="button button-outline">
                How adoption works <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-note">
              <span className="avatar-stack">
                <PetImage src={petImages["pet-2"]} alt="Mochi" />
                <PetImage src={petImages["pet-7"]} alt="Toffee" />
                <PetImage src={petImages["pet-8"]} alt="Oreo" />
              </span>
              <span>
                Happy hearts start with
                <br />
                <strong>one little hello</strong>
              </span>
            </div>
          </motion.div>
          <motion.div
            className="hero-art"
            initial={{
              opacity: 0,
              scale: 0.93,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.13,
            }}
          >
            <div className="hero-pink-orb" />
            <div className="hero-yellow-flower">✽</div>
            <div className="hero-large-photo">
              <PetImage
                src={petImages["pet-1"]}
                alt="Biscuit, a smiling golden retriever puppy"
              />
            </div>
            <div className="hero-small-photo">
              <PetImage
                src={petImages["pet-2"]}
                alt="Mochi, a curious tabby kitten"
              />
            </div>
            <div className="hero-sticker">
              <Sparkles size={18} /> Cuteness overload
              <br />
              ahead!
            </div>
            <span className="hero-squiggle">〰</span>
          </motion.div>
        </div>
        <div className="hero-marquee">
          <div className="container">
            <span>GOOD THINGS COME TO THOSE WHO ADOPT</span>
            <PawPrint size={17} />
            <span>GIVE LOVE. GET LOVE.</span>
            <PawPrint size={17} />
            <span>EVERY PAW HAS A STORY</span>
            <PawPrint size={17} />
            <span>BE PART OF THE NEXT CHAPTER</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="YOUR FUTURE BESTIE"
            title={
              <>
                A little face, a <span className="scribble">lot of love.</span>
              </>
            }
            body="Sweet personalities, silly habits and a whole lot of heart. Explore the kinds of companions you might welcome home."
            action={
              <Link className="section-link" to="/adopt">
                Meet all our friends <ArrowUpRight size={19} />
              </Link>
            }
          />
          <div className="pet-grid pet-grid-home">
            {pets
              .filter((p) => p.status === "Available")
              .slice(0, 4)
              .map((p) => (
                <PetCard key={p.id} pet={p} />
              ))}
          </div>
        </div>
      </section>
      {/* Paw-fect Match Quiz */}
      <section className="section section-blush" id="match-quiz">
        <div className="container quiz-container">
          <div className="quiz-intro">
            <span className="eyebrow">
              <Heart size={14} /> FIND YOUR MATCH
            </span>

            <h2>
              Who might be your <em>paw-fect match?</em>
            </h2>

            <p>
              Not sure which furry friend is right for you? Answer four quick
              questions and discover pets that might suit your lifestyle!
            </p>

            <PetImage
              src="/images/pawfect.jpg"
              alt="Find your perfect pet companion"
            />
          </div>

          <MatchQuiz />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="OUR LITTLE MISSION"
            title={
              <>
                Care, connection,
                <br />A <span className="scribble">whole lot of heart.</span>
              </>
            }
            body="Every animal deserves kindness, comfort and a chance to be seen."
          />
          <div className="mission-grid">
            {[
              {
                icon: <Heart />,
                name: "Rescue with care",
                text: "Compassion comes first — we believe every animal deserves a safe new beginning.",
                color: "pink",
              },
              {
                icon: <ShieldCheck />,
                name: "Rehome thoughtfully",
                text: "Connecting pets with people through patience, guidance and responsible choices.",
                color: "purple",
              },
              {
                icon: <BookOpen />,
                name: "Learn together",
                text: "Helpful pet care resources for confident, informed animal lovers.",
                color: "yellow",
              },
              {
                icon: <HandHeart />,
                name: "Grow our community",
                text: "Friendly events and volunteer opportunities that bring kind people together.",
                color: "mint",
              },
            ].map((m) => (
              <article
                key={m.name}
                className={`mission-card mission-${m.color}`}
              >
                <div className="mission-icon">{m.icon}</div>
                <h3>{m.name}</h3>
                <p>{m.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-blush">
        <div className="container">
          <SectionHead
            eyebrow="MORE WAYS TO MAKE A DIFFERENCE"
            title={
              <>
                Good things happen when
                <br />
                we <span className="accent-pink">show up together.</span>
              </>
            }
            action={
              <Link className="section-link" to="/activities">
                All activities <ArrowUpRight size={19} />
              </Link>
            }
          />
          <div className="home-event-grid">
            {events
              .filter((e) => e.status === "Published")
              .slice(0, 2)
              .map((e) => (
                <article className="home-event" key={e.id}>
                  <div>
                    <PetImage src={e.image} alt="activity" />
                  </div>
                  <section>
                    <span className="event-category">
                      {e.category} · Activity preview
                    </span>
                    <h3>{e.title}</h3>
                    <p>{e.description}</p>
                    <div className="event-meta">
                      <CalendarDays size={16} />{" "}
                      {new Date(e.date + "T12:00:00").toLocaleDateString(
                        "en-SG",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </div>
                    <Link to="/activities" className="text-button">
                      Explore this event <ArrowUpRight size={18} />
                    </Link>
                  </section>
                </article>
              ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="newsletter">
            <div>
              <div className="eyebrow">
                <Mail size={14} /> LITTLE LETTERS, BIG LOVE
              </div>
              <h2>
                Good news looks
                <br />
                better with <em>paws.</em>
              </h2>
              <p>Save your interest in future Pet Heaven updates.</p>
            </div>
            {joined ? (
              <div className="newsletter-success">
                Your interest is saved. Check your profile for updates.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email.trim()) return;
                  submitContact({
                    name: "Newsletter subscriber",
                    email,
                    message: "Newsletter interest",
                    type: "newsletter",
                  });
                  setJoined(true);
                }}
              >
                <label htmlFor="newsletter-email">Your email address</label>
                <div className="newsletter-form">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="button button-dark">
                    Count me in <ArrowUpRight size={17} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
