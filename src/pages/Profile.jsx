import { petImages } from "../data/images.js";
import PetImage from "../components/PetImage";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  ClipboardList,
  CalendarDays,
  HandHeart,
  UserRound,
  Settings,
  Gift,
  ArrowUpRight,
  PawPrint,
  LogOut,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PetCard } from "../components/PetCard";
import { Field } from "../components/FormBits";
const tabs = [
  ["overview", "Overview", UserRound],
  ["applications", "Applications", ClipboardList],
  ["appointments", "Meet & greets", CalendarDays],
  ["favorites", "Favourites", Heart],
  ["activities", "My activities", CalendarDays],
  ["releases", "Rehoming", HandHeart],
  ["donations", "Donations", Gift],
  ["settings", "Settings", Settings],
];
const dateLabel = (date) =>
  date
    ? new Date(date + "T12:00:00").toLocaleDateString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
export default function Profile() {
  const {
    user,
    logout,
    pets,
    events,
    applications,
    favorites,
    registrations,
    releases,
    donations,
    cancelApplication,
    cancelEvent,
    saveProfile,
    resetDemo,
  } = useApp();
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.section || "overview");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const myApps = applications.filter((a) => a.userId === user.id);
  const myFavs = pets.filter(
    (p) =>
      p.status !== "Archived" &&
      favorites.some((f) => f.userId === user.id && f.petId === p.id),
  );
  const myRegs = registrations.filter((r) => r.userId === user.id);
  const myReleases = releases.filter((r) => r.userId === user.id);
  const myDonations = donations.filter((d) => d.userId === user.id);
  const setField = (e) =>
    setProfile((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  return (
    <section className="section profile-section">
      <div className="container">
        <div className="profile-heading">
          <div>
            <div className="eyebrow">
              <PawPrint size={14} /> YOUR LITTLE HAPPY PLACE
            </div>
            <h1>
              Hey, {user.name.split(" ")[0]}! <em>♡</em>
            </h1>
            <p>Here's a cosy little home for all your Pet Heaven adventures.</p>
          </div>
          <span className="profile-heading-avatar">
            {user.name[0]?.toUpperCase()}
          </span>
        </div>
        <div className="dashboard-grid">
          <aside className="dashboard-sidebar">
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {user.name[0]?.toUpperCase()}
              </div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
              <span>
                {user.role === "staff" ? "Staff" : "Pet-loving member"}
              </span>
            </div>
            <nav aria-label="Dashboard sections">
              {tabs.map(([key, label, Icon]) => (
                <button
                  className={tab === key ? "active" : ""}
                  key={key}
                  onClick={() => setTab(key)}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
              {user.role === "staff" && (
                <Link to="/staff">
                  <Settings size={18} /> Staff dashboard
                </Link>
              )}
              <button onClick={logout}>
                <LogOut size={18} /> Log out
              </button>
            </nav>
          </aside>
          <div className="dashboard-main">
            {tab === "overview" && (
              <>
                <div className="dash-welcome">
                  <span>YOUR HAPPY LITTLE OVERVIEW</span>
                  <h2>Every journey starts with a little love.</h2>
                  <p>
                    Keep track of the paws you've met, the events you're joining
                    and all the good you've shared.
                  </p>
                  <Link className="button button-dark button-sm" to="/adopt">
                    Find a furry friend <ArrowUpRight size={16} />
                  </Link>
                </div>
                <div className="stat-grid">
                  {[
                    ["Applications", myApps.length],
                    ["Favourites", myFavs.length],
                    ["Activities", myRegs.length],
                    ["Donations", myDonations.length],
                  ].map(([label, value]) => (
                    <div className="stat-card" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <h3 className="dashboard-subtitle">Recent activity</h3>
                {myApps.length ? (
                  <div className="record-list">
                    {myApps.slice(0, 3).map((a) => (
                      <div key={a.id} className="record-row">
                        <span className="record-dot" />
                        <div>
                          <strong>
                            Adoption request for{" "}
                            {pets.find((p) => p.id === a.petId)?.name ||
                              "a pet"}
                          </strong>
                          <small>
                            Requested {dateLabel(a.date)} at {a.slot}
                          </small>
                        </div>
                        <Status value={a.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty
                    title="A fresh start!"
                    body="Once you apply to meet a pet, your request will appear here."
                    to="/adopt"
                    action="Explore pets"
                  />
                )}
              </>
            )}
            {tab === "applications" && (
              <>
                <Title
                  title="My adoption applications"
                  desc="Your appointment requests and staff review outcomes, all in one place."
                />
                {myApps.length ? (
                  <div className="record-list">
                    {myApps.map((a) => {
                      const p = pets.find((p) => p.id === a.petId);
                      return (
                        <div className="record-row record-row-app" key={a.id}>
                          <PetImage
                            src={p?.image || petImages["pet-1"]}
                            alt={p?.name || "Pet"}
                          />
                          <div>
                            <strong>{p?.name || "Archived pet"}</strong>
                            <small>
                              Requested {dateLabel(a.date)} · {a.slot}
                            </small>
                            <small>
                              Submitted{" "}
                              {new Date(a.createdAt).toLocaleDateString(
                                "en-SG",
                              )}
                            </small>
                            {["Pending", "Under Review"].includes(a.status) && (
                              <button
                                className="danger-link"
                                onClick={() => {
                                  if (
                                    window.confirm("Cancel this application?")
                                  )
                                    cancelApplication(a.id);
                                }}
                              >
                                Cancel my request
                              </button>
                            )}
                          </div>
                          <Status value={a.status} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty
                    title="No applications yet"
                    body="Explore our pet profiles and start your adoption journey."
                    to="/adopt"
                    action="Meet our pets"
                  />
                )}
              </>
            )}
            {tab === "appointments" && (
              <>
                <Title
                  title="My meet-and-greets"
                  desc="The dates and times requested as part of your adoption applications."
                />
                {myApps.filter(
                  (a) => a.status !== "Cancelled" && a.status !== "Rejected",
                ).length ? (
                  <div className="record-list">
                    {myApps
                      .filter(
                        (a) =>
                          a.status !== "Cancelled" && a.status !== "Rejected",
                      )
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((a) => (
                        <div className="record-row" key={a.id}>
                          <CalendarDays size={24} />
                          <div>
                            <strong>
                              {pets.find((p) => p.id === a.petId)?.name ||
                                "Pet"}{" "}
                              · {dateLabel(a.date)}
                            </strong>
                            <small>
                              {a.slot} ·{" "}
                              {a.status === "Approved"
                                ? "Approved locally - no visit arranged"
                                : "Awaiting staff review"}
                            </small>
                          </div>
                          <Status value={a.status} />
                        </div>
                      ))}
                  </div>
                ) : (
                  <Empty
                    title="No upcoming meet-and-greets"
                    body="Choose an available pet, then request a date and time."
                    to="/adopt"
                    action="Explore pets"
                  />
                )}
              </>
            )}
            {tab === "favorites" && (
              <>
                <Title
                  title="Your saved little faces"
                  desc="A happy collection of adorable paws that caught your eye."
                />
                {myFavs.length ? (
                  <div className="pet-grid dash-pet-grid">
                    {myFavs.map((p) => (
                      <PetCard key={p.id} pet={p} />
                    ))}
                  </div>
                ) : (
                  <Empty
                    title="Your heart has room!"
                    body="Tap a heart on any pet card to save them here."
                    to="/adopt"
                    action="Find a favourite"
                  />
                )}
              </>
            )}
            {tab === "activities" && (
              <>
                <Title
                  title="My upcoming activities"
                  desc="See all the activity previews you've signed up for."
                />
                {myRegs.length ? (
                  <div className="record-list">
                    {myRegs.map((r) => {
                      const e = events.find((e) => e.id === r.eventId);
                      return (
                        <div className="record-row" key={r.id}>
                          <CalendarDays size={23} />
                          <div>
                            <strong>{e?.title || "Past event"}</strong>
                            <small>
                              {e
                                ? `${dateLabel(e.date)} · ${e.time}`
                                : "Archived event"}
                            </small>
                            <button
                              className="danger-link"
                              onClick={() => {
                                if (window.confirm("Cancel your registration?"))
                                  cancelEvent(r.eventId);
                              }}
                            >
                              Cancel registration
                            </button>
                          </div>
                          <Status
                            value={
                              e?.status === "Cancelled"
                                ? "Cancelled"
                                : "Registered"
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty
                    title="Your calendar is waiting"
                    body="Fun little meetups are one click away."
                    to="/activities"
                    action="Browse events"
                  />
                )}
              </>
            )}
            {tab === "releases" && (
              <>
                <Title
                  title="Rehoming requests"
                  desc="Your private submissions and their staff review status."
                />
                {myReleases.length ? (
                  <div className="record-list">
                    {myReleases.map((r) => (
                      <div className="record-row" key={r.id}>
                        <HandHeart size={23} />
                        <div>
                          <strong>
                            {r.petName} · {r.species}
                          </strong>
                          <small>
                            Submitted{" "}
                            {new Date(r.createdAt).toLocaleDateString("en-SG")}
                          </small>
                        </div>
                        <Status value={r.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty
                    title="No rehoming requests"
                    body="If you ever need support with rehoming, you can start here."
                    to="/release"
                    action="Learn about rehoming"
                  />
                )}
              </>
            )}
            {tab === "donations" && (
              <>
                <Title
                  title="Donation history"
                  desc="Thank you for your generosity! Every contribution helps animals in need."
                />
                {myDonations.length ? (
                  <div className="record-list">
                    {myDonations.map((d) => (
                      <div className="record-row" key={d.id}>
                        <Gift size={24} />
                        <div>
                          <strong>
                            S${d.amount.toFixed(2)} · {d.method}
                          </strong>
                          <small>
                            {new Date(d.createdAt).toLocaleString("en-SG")}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty
                    title="No contribution examples yet"
                    body="You can try the safe donation interface at any time."
                    to="/donate"
                    action="Try donating"
                  />
                )}
              </>
            )}
            {tab === "settings" && (
              <>
                <Title
                  title="Your little corner"
                  desc="Update the display details."
                />
                <form
                  className="settings-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveProfile(profile);
                  }}
                >
                  <Field
                    label="Display name"
                    name="name"
                    required
                    value={profile.name}
                    onChange={setField}
                  />
                  <Field
                    label="Contact number (optional)"
                    name="phone"
                    value={profile.phone}
                    onChange={setField}
                  />
                  <Field
                    label="About me"
                    name="bio"
                    value={profile.bio}
                    onChange={setField}
                    textarea
                    rows={3}
                  />
                  <button type="submit" className="button button-dark">
                    Save my profile <CheckCircle2 size={17} />
                  </button>
                </form>
                {user.role === "staff" && (
                  <div className="danger-zone">
                    <h3>Reset this browser’s data</h3>
                    <p>
                      Erase all local applications, registrations, user and
                      staff edits in this browser. This cannot be undone.
                    </p>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Reset all Pet Heaven data in this browser and log out?",
                          )
                        )
                          resetDemo();
                      }}
                      className="button button-outline"
                    >
                      <RotateCcw size={17} /> Reset browser data
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
function Title({ title, desc }) {
  return (
    <div className="dash-page-head">
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}
function Status({ value }) {
  const cls = ["Approved", "Available", "Registered"].includes(value)
    ? "good"
    : ["Rejected", "Cancelled"].includes(value)
      ? "bad"
      : "wait";
  return <span className={`status-chip chip-${cls}`}>{value}</span>;
}
function Empty({ title, body, to, action }) {
  return (
    <div className="empty-state dash-empty">
      <Heart size={28} />
      <h3>{title}</h3>
      <p>{body}</p>
      <Link className="button button-primary button-sm" to={to}>
        {action} <ArrowUpRight size={16} />
      </Link>
    </div>
  );
}
