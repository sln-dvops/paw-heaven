import { petImages } from "../data/images.js";
import PetImage from "../components/PetImage";
import { Link } from "react-router-dom";
import { Heart, ArrowUpRight, PawPrint } from "lucide-react";
import { PageIntro, SectionHead } from "../components/Layout";
import { leadershipTeam, teamPhoto } from "../data/team";

export default function About() {
  return (
    <>
      {/* Page Introduction */}
      <PageIntro
        eyebrow="ABOUT PET HEAVEN"
        title={<>Every paw deserves a loving home.</>}
        body="Bringing people and pets together through kindness, care and responsible adoption."
        tone="pink"
      />

      {/* Our Story */}
      <section className="section">
        <div className="container about-story">
          <div className="about-image">
            <PetImage src="/images/petcare.jpg" alt="pet care" />
          </div>

          <div>
            <div className="eyebrow">WHO WE ARE</div>
            <h2>Small paws. Big second chances.</h2>

            <p>
              At Pet Heaven, we believe every animal deserves to feel safe,
              loved and cared for. Our purpose is to help pets find suitable
              homes and encourage meaningful connections between animals and
              people.
            </p>

            <p>
              Adoption is more than bringing a pet home. It is a lifelong
              commitment built on patience, understanding and love.
            </p>

            <div className="about-mini-grid">
              <div>
                <Heart />
                <strong>Our Mission</strong>
                <span>
                  To promote responsible adoption and help animals find caring,
                  loving homes.
                </span>
              </div>

              <div>
                <PawPrint />
                <strong>Our Vision</strong>
                <span>
                  A future where every pet has the opportunity to live a happy
                  and fulfilling life.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section
        className="section section-blush"
        aria-labelledby="meet-the-team"
      >
        <div className="container">
          <div className="section-head text-center">
            <div>
              <div className="eyebrow">
                <PawPrint size={14} /> OUR PEOPLE
              </div>

              <h2 id="meet-the-team">
                Meet the <em>team.</em>
              </h2>

              <p>A team brought together by a shared love for animals.</p>
            </div>
          </div>

          <div className="about-team-grid">
            {leadershipTeam.map((member) => (
              <article
                className={`about-team-card team-${member.id}`}
                key={member.id}
              >
                <div className="about-team-portrait">
                  <img
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    loading="lazy"
                  />

                  <span className="about-team-paw" aria-hidden="true">
                    <PawPrint size={22} />
                  </span>
                </div>

                <div className="about-team-details">
                  <span className="mini-eyebrow">{member.role}</span>

                  <h3>{member.name}</h3>
                  <p>{member.bio}</p>
                </div>
              </article>
            ))}
          </div>

          <figure className="about-team-together">
            <div className="about-team-group-photo">
              <img src={teamPhoto.image} alt={teamPhoto.alt} loading="lazy" />

              <span>
                <Heart size={16} />
                Better together, paws and all.
              </span>
            </div>

            <figcaption>
              <div>
                <span className="eyebrow">THE PET HEAVEN FAMILY</span>

                <h3>Kind hearts. Happy paws.</h3>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="section">
        <div className="container center-cta">
          <PawPrint size={34} />

          <h2>
            Ready to make a <em>difference?</em>
          </h2>
          <Link className="button button-dark" to="/adopt">
            Meet Our Pets <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
