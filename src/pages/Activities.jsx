import { eventHasEnded } from "../utils/logic";
import PetImage from "../components/PetImage";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Users, ArrowUpRight, Heart } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageIntro, SectionHead } from "../components/Layout";
export default function Activities() {
  const { events, registrations, user, joinEvent, cancelEvent, notify } =
    useApp();
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const visible = events.filter(
    (e) =>
      e.status === "Published" &&
      (category === "All" || e.category === category),
  );
  const handle = (id) => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/activities",
        },
      });
      return;
    }
    try {
      joinEvent(id);
    } catch (err) {
      notify(err.message, "error");
    }
  };
  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="COME JOIN THE FUN"
            title="Your calendar, but make it cuter."
          />
          <div className="chip-tabs" role="group" aria-label="Event categories">
            {["All", "Adoption", "Volunteer", "Community", "Workshop"].map(
              (c) => (
                <button
                  key={c}
                  className={category === c ? "active" : ""}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ),
            )}
          </div>
          <div className="event-grid">
            {visible.map((e) => {
              const count = registrations.filter(
                (r) => r.eventId === e.id,
              ).length;
              const joined = registrations.some(
                (r) => r.eventId === e.id && r.userId === user?.id,
              );
              const full = count >= Number(e.capacity);
              const ended = eventHasEnded(e);
              return (
                <article className="event-card" key={e.id}>
                  <div className="event-card-image">
                    <PetImage
                      src={e.image}
                      alt={`${e.title} replaceable activity illustration`}
                      loading="lazy"
                    />
                    <span>{e.category}</span>
                  </div>
                  <div className="event-card-content">
                    <span className="mini-eyebrow">ACTIVITY PREVIEW</span>
                    <h3>{e.title}</h3>
                    <p>{e.description}</p>
                    <div className="event-detail">
                      <CalendarDays size={18} />
                      <span>
                        {new Date(e.date + "T12:00:00").toLocaleDateString(
                          "en-SG",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}{" "}
                        · {e.time}
                      </span>
                    </div>
                    <div className="event-detail">
                      <MapPin size={18} />
                      <span>{e.location}</span>
                    </div>
                    <div className="event-detail">
                      <Users size={18} />
                      <span>
                        {Math.max(0, Number(e.capacity) - count)} of{" "}
                        {e.capacity} spaces left
                      </span>
                    </div>
                    <div className="event-card-footer">
                      {joined ? (
                        <button
                          className="button button-outline button-sm"
                          onClick={() => cancelEvent(e.id)}
                        >
                          Registered ✓ · Cancel
                        </button>
                      ) : (
                        <button
                          className="button button-dark button-sm"
                          onClick={() => handle(e.id)}
                          disabled={full || ended}
                        >
                          {ended
                            ? "Registration closed"
                            : full
                              ? "Event full"
                              : "Join activity"}{" "}
                          <ArrowUpRight size={16} />
                        </button>
                      )}
                      <span>
                        {joined ? "Interest saved here" : "Everyone welcome"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {visible.length === 0 && (
            <div className="empty-state">
              <h3>No activities in this category.</h3>
              <button
                className="button button-dark"
                onClick={() => setCategory("All")}
              >
                Show all events
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="section section-blush">
        <div className="container center-cta">
          <Heart size={32} />
          <h2>
            Good company. Great causes. <em>Happy tails.</em>
          </h2>
          <Link className="button button-dark" to="/how-it-works">
            See how we work <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
