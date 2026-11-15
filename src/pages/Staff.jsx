import { petImages } from "../data/images.js";
import PetImage from "../components/PetImage.jsx";
import { useState } from "react";
import ImageUpload from "../components/ImageUpload.jsx";
import {
  PawPrint,
  ClipboardList,
  CalendarDays,
  Heart,
  LayoutDashboard,
  Mail,
  BookOpen,
  HandHeart,
  Plus,
  PenLine,
  ChevronRight,
  Search,
  X,
  Save,
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { FormError } from "../components/FormBits.jsx";
const menu = [
  ["overview", "Overview", LayoutDashboard],
  ["pets", "Pets", PawPrint],
  ["applications", "Adoptions", ClipboardList],
  ["appointments", "Appointments", CalendarDays],
  ["releases", "Rehoming", HandHeart],
  ["events", "Activities", CalendarDays],
  ["blogs", "Journal", BookOpen],
  ["donations", "Donations", Heart],
  ["contacts", "Messages", Mail],
];
const emptyPet = {
  name: "",
  species: "Dog",
  breed: "",
  age: "",
  ageGroup: "Adult",
  gender: "Female",
  size: "Medium",
  energy: "Balanced",
  status: "Available",
  tag: "New arrival",
  personality: "",
  story: "",
  health: "Health details to be confirmed.",
  home: "",
  image: petImages["pet-1"],
  color: "#ffe4e4",
};
const emptyEvent = {
  title: "",
  category: "Volunteer",
  date: "",
  time: "10:00",
  location: "Location to be confirmed",
  capacity: 20,
  description: "",
  image: petImages["pet-1"],
  status: "Published",
};
const emptyBlog = {
  title: "",
  slug: "",
  category: "Pet Care Tips",
  date: new Date().toISOString().slice(0, 10),
  readTime: "4 min read",
  excerpt: "",
  image: petImages["pet-1"],
  content: [],
};
const stamp = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
export default function Staff() {
  const app = useApp();
  const {
    pets,
    events,
    blogs,
    applications,
    releases,
    registrations,
    donations,
    contacts,
    staffChange,
    staffUpsert,
    notify,
  } = app;
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState(null);
  const [draftType, setDraftType] = useState("");
  const [error, setError] = useState("");
  const [rejections, setRejections] = useState({});
  const stats = [
    ["Pet profiles", pets.length],
    ["Available pets", pets.filter((p) => p.status === "Available").length],
    [
      "Pending applications",
      applications.filter((a) => a.status === "Pending").length,
    ],
    [
      "Requested meet-ups",
      applications.filter((a) => !["Rejected", "Cancelled"].includes(a.status))
        .length,
    ],
    [
      "Rehoming requests",
      releases.filter((r) => r.status === "Pending").length,
    ],
    ["Volunteer sign-ups", registrations.length],
    ["Published events", events.filter((e) => e.status === "Published").length],
    [
      "Total donations",
      `S$${donations.reduce((s, d) => s + d.amount, 0).toFixed(2)}`,
    ],
  ];
  const filter = (items) =>
    items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase()),
    );
  const edit = (type, record) => {
    setDraftType(type);
    setDraft(
      record
        ? {
            ...record,
            ...(type === "blogs"
              ? {
                  contentText: (record.content || []).join("\n\n"),
                }
              : {}),
          }
        : {
            ...(type === "pets"
              ? emptyPet
              : type === "events"
                ? emptyEvent
                : {
                    ...emptyBlog,
                    contentText: "",
                  }),
          },
    );
    setError("");
  };
  const save = (e) => {
    e.preventDefault();
    setError("");
    let record = {
      ...draft,
    };
    if (draftType === "pets" && !record.name.trim()) {
      setError("Pet name is required.");
      return;
    }
    if (
      draftType === "pets" &&
      record.sourceReleaseId &&
      (!record.story?.trim() || !record.home?.trim() || !record.image)
    ) {
      setError("Add a pet story, suitable home and photo before publishing.");
      return;
    }
    if (draftType === "events") {
      if (!record.title || !record.date || !record.time) {
        setError("Title, date and time are required.");
        return;
      }
      record.capacity = Number(record.capacity);
      if (!Number.isInteger(record.capacity) || record.capacity < 1) {
        setError("Capacity must be a positive whole number.");
        return;
      }
      const taken = registrations.filter((r) => r.eventId === record.id).length;
      if (record.capacity < taken) {
        setError("Capacity cannot be lower than existing registrations.");
        return;
      }
    }
    if (draftType === "blogs") {
      if (
        !record.title.trim() ||
        !record.excerpt.trim() ||
        !record.contentText?.trim()
      ) {
        setError("Title, excerpt and article body are required.");
        return;
      }
      record.slug = (
        record.slug ||
        record.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      ).trim();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug)) {
        setError(
          "Use lowercase letters, numbers and single hyphens for the article URL.",
        );
        return;
      }
      if (blogs.some((b) => b.slug === record.slug && b.id !== record.id)) {
        setError("That blog URL slug already exists.");
        return;
      }
      record.content = (record.contentText || "")
        .split(/\n\s*\n/)
        .filter(Boolean);
      delete record.contentText;
    }
    try {
      staffUpsert(draftType, record);
      if (draftType === "pets" && record.sourceReleaseId) {
        staffChange("releases", record.sourceReleaseId, {
          status: "Published",
        });
      }
      setDraft(null);
    } catch (err) {
      setError(err.message || "Unable to save changes.");
    }
  };
  const mutate = (type, id, patch) => {
    try {
      staffChange(type, id, patch);
    } catch (err) {
      notify(err.message, "error");
    }
  };
  return (
    <section className="section staff-page">
      <div className="container">
        <div className="staff-title">
          <div>
            <span className="eyebrow">
              <PawPrint size={14} /> STAFF AREA
            </span>
            <h1>
              Behind the <em>paws.</em>
            </h1>
          </div>
        </div>
        <div className="staff-layout">
          <aside className="staff-sidebar">
            <div className="staff-sidebar-top">PET HEAVEN / STAFF</div>
            {menu.map(([key, label, Icon]) => (
              <button
                key={key}
                className={tab === key ? "active" : ""}
                onClick={() => {
                  setTab(key);
                  setDraft(null);
                  setSearch("");
                }}
              >
                <Icon size={18} />
                {label}
                <ChevronRight size={15} />
              </button>
            ))}
          </aside>
          <div className="staff-main">
            <div className="staff-main-head">
              <div>
                <span className="mini-eyebrow">PET HEAVEN MANAGEMENT</span>
                <h2>{menu.find((m) => m[0] === tab)?.[1]}</h2>
              </div>
              {["pets", "events", "blogs"].includes(tab) && (
                <button
                  className="button button-dark button-sm"
                  onClick={() => edit(tab, null)}
                >
                  <Plus size={16} /> Add{" "}
                  {tab === "pets"
                    ? "pet"
                    : tab === "events"
                      ? "event"
                      : "article"}
                </button>
              )}
            </div>
            {tab === "overview" && (
              <>
                <div className="staff-overview-stats">
                  {stats.map(([label, value]) => (
                    <div className="stat-card" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <div className="staff-dashboard-panels">
                  <div>
                    <h3>Recent adoption requests</h3>
                    {applications.length ? (
                      applications.slice(0, 5).map((a) => (
                        <div className="mini-record" key={a.id}>
                          <div>
                            <strong>
                              {pets.find((p) => p.id === a.petId)?.name ||
                                "Pet"}{" "}
                              · {a.name}
                            </strong>
                            <small>{stamp(a.createdAt)}</small>
                          </div>
                          <span className="status-chip chip-wait">
                            {a.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="muted">No applications yet.</p>
                    )}
                  </div>
                </div>
              </>
            )}
            {tab !== "overview" && (
              <div className="staff-search">
                <Search size={18} />
                <input
                  aria-label="Search staff records"
                  placeholder={`Search ${tab}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
            {tab === "pets" && (
              <div className="staff-records">
                {filter(pets).map((p) => (
                  <div className="staff-list-item" key={p.id}>
                    <PetImage src={p.image} alt={p.name} />
                    <div>
                      <strong>{p.name}</strong>
                      <small>
                        {p.species} · {p.breed} · {p.age}
                      </small>
                    </div>
                    <select
                      aria-label={`Change status for ${p.name}`}
                      value={p.status}
                      onChange={(e) =>
                        mutate("pets", p.id, {
                          status: e.target.value,
                        })
                      }
                    >
                      {["Available", "Adopted"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      className="icon-action"
                      aria-label={`Edit ${p.name}`}
                      onClick={() => edit("pets", p)}
                    >
                      <PenLine size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {tab === "applications" && (
              <div className="staff-records">
                {filter(applications).length ? (
                  filter(applications).map((a) => {
                    const pet = pets.find((p) => p.id === a.petId);
                    const reason = rejections[a.id] ?? a.rejectionReason ?? "";
                    return (
                      <article className="staff-application" key={a.id}>
                        <div className="staff-card-head">
                          <div className="staff-request-pet">
                            {pet?.image && (
                              <PetImage src={pet.image} alt={pet.name} />
                            )}
                            <div>
                              <span className="mini-eyebrow">
                                ADOPTION · {stamp(a.createdAt)}
                              </span>
                              <h3>
                                {a.name} · {pet?.name || "Pet unavailable"}
                              </h3>
                              <small>
                                {pet ? `${pet.species} · ${pet.breed}` : ""}
                              </small>
                            </div>
                          </div>
                          <span className="status-chip">
                            {a.status === "Approved" ? "Accepted" : a.status}
                          </span>
                        </div>
                        <p>
                          <strong>Contact:</strong> {a.email} · {a.phone}
                        </p>
                        <p>
                          <strong>Requested visit:</strong> {a.date} at {a.slot}
                        </p>
                        <p>
                          <strong>Home:</strong> {a.housing} · {a.household} ·{" "}
                          {a.experience}
                        </p>
                        <p>
                          <strong>Why adopt:</strong> {a.reason}
                        </p>
                        {a.remarks && (
                          <p>
                            <strong>Remarks:</strong> {a.remarks}
                          </p>
                        )}
                        {a.status === "Rejected" && a.rejectionReason && (
                          <p>
                            <strong>Rejection reason:</strong>{" "}
                            {a.rejectionReason}
                          </p>
                        )}
                        {!["Approved", "Rejected", "Cancelled"].includes(
                          a.status,
                        ) && (
                          <div className="staff-decision-actions">
                            <button
                              type="button"
                              className="button button-dark button-sm"
                              onClick={() =>
                                mutate("applications", a.id, {
                                  status: "Approved",
                                })
                              }
                            >
                              Accept application
                            </button>
                            <div className="staff-reject-form">
                              <label htmlFor={`reject-${a.id}`}>
                                Reason if rejecting
                              </label>
                              <textarea
                                id={`reject-${a.id}`}
                                rows={2}
                                placeholder="Explain the decision briefly"
                                value={reason}
                                onChange={(e) =>
                                  setRejections((prev) => ({
                                    ...prev,
                                    [a.id]: e.target.value,
                                  }))
                                }
                              />
                              <button
                                type="button"
                                className="button button-outline button-sm"
                                disabled={!reason.trim()}
                                onClick={() => {
                                  if (!reason.trim()) return;
                                  if (
                                    window.confirm(
                                      "Reject this adoption application?",
                                    )
                                  ) {
                                    mutate("applications", a.id, {
                                      status: "Rejected",
                                      rejectionReason: reason.trim(),
                                    });
                                  }
                                }}
                              >
                                Reject application
                              </button>
                            </div>
                          </div>
                        )}
                        {a.email && (
                          <a
                            href={`mailto:${a.email}?subject=${encodeURIComponent(`Pet Heaven adoption application: ${pet?.name || "pet"}`)}`}
                          >
                            Email applicant
                          </a>
                        )}
                      </article>
                    );
                  })
                ) : (
                  <EmptyStaff />
                )}
              </div>
            )}
            {tab === "appointments" && (
              <div className="staff-records">
                {filter(
                  applications
                    .filter(
                      (a) => !["Rejected", "Cancelled"].includes(a.status),
                    )
                    .sort((a, b) => a.date.localeCompare(b.date)),
                ).length ? (
                  filter(
                    applications
                      .filter(
                        (a) => !["Rejected", "Cancelled"].includes(a.status),
                      )
                      .sort((a, b) => a.date.localeCompare(b.date)),
                  ).map((a) => (
                    <div className="staff-list-item" key={a.id}>
                      <CalendarDays size={23} />
                      <div>
                        <strong>
                          {a.date} · {a.slot} —{" "}
                          {pets.find((p) => p.id === a.petId)?.name || "Pet"}
                        </strong>
                        <small>
                          {a.name} · {a.email}
                        </small>
                      </div>
                      <span className="status-chip">
                        {a.status === "Approved" ? "Accepted" : a.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <EmptyStaff />
                )}
              </div>
            )}
            {tab === "releases" && (
              <div className="staff-records">
                {filter(releases).length ? (
                  filter(releases).map((r) => (
                    <article className="staff-application" key={r.id}>
                      <div className="staff-card-head">
                        <div className="staff-request-pet">
                          {r.photo && (
                            <PetImage src={r.photo} alt={r.petName} />
                          )}
                          <div>
                            <span className="mini-eyebrow">
                              REHOMING · {stamp(r.createdAt)}
                            </span>
                            <h3>
                              {r.petName} · {r.species}
                            </h3>
                            <small>
                              {r.breed} · {r.age} · {r.gender}
                            </small>
                          </div>
                        </div>
                        <span className="status-chip">{r.status}</span>
                      </div>
                      <p>
                        <strong>Owner:</strong> {r.owner} · {r.email}{" "}
                        {r.phone && `· ${r.phone}`}
                      </p>
                      <p>
                        <strong>Temperament:</strong> {r.temperament}
                      </p>
                      <p>
                        <strong>Medical information:</strong> {r.medical}
                      </p>
                      <p>
                        <strong>Reason for rehoming:</strong> {r.reason}
                      </p>
                      {r.email && (
                        <a
                          href={`mailto:${r.email}?subject=${encodeURIComponent(`Pet Heaven rehoming visit: ${r.petName}`)}`}
                        >
                          Email owner to arrange a visit
                        </a>
                      )}
                      {!["Approved", "Rejected", "Published"].includes(
                        r.status,
                      ) && (
                        <div className="staff-decision-actions">
                          <button
                            type="button"
                            className="button button-outline button-sm"
                            onClick={() =>
                              mutate("releases", r.id, {
                                status: "Visit Requested",
                              })
                            }
                          >
                            Mark visit needed
                          </button>
                          <button
                            type="button"
                            className="button button-dark button-sm"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Confirm that you have reviewed this request AND completed the pet visit?",
                                )
                              ) {
                                mutate("releases", r.id, {
                                  status: "Approved",
                                });
                              }
                            }}
                          >
                            Approve after visit
                          </button>
                          <button
                            type="button"
                            className="button button-outline button-sm"
                            onClick={() => {
                              if (
                                window.confirm("Reject this rehoming request?")
                              ) {
                                mutate("releases", r.id, {
                                  status: "Rejected",
                                });
                              }
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {r.status === "Approved" && (
                        <div className="staff-decision-actions">
                          <p>
                            Complete the pet's profile before publishing it for
                            adoption.
                          </p>
                          <button
                            type="button"
                            className="button button-dark button-sm"
                            onClick={() => {
                              setDraftType("pets");
                              setDraft({
                                ...emptyPet,
                                sourceReleaseId: r.id,
                                name: r.petName,
                                species: r.species,
                                breed: r.breed,
                                age: r.age,
                                gender: r.gender,
                                personality: r.temperament || "",
                                health: r.medical || "",
                                image: r.photo || "",
                                status: "Available",
                                story: "",
                                home: "",
                              });
                              setError("");
                            }}
                          >
                            Complete adoption profile <PenLine size={16} />
                          </button>
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <EmptyStaff />
                )}
              </div>
            )}
            {tab === "events" && (
              <div className="staff-records">
                {filter(events).map((e) => (
                  <div className="staff-list-item" key={e.id}>
                    <PetImage src={e.image} alt="Activity illustration" />
                    <div>
                      <strong>{e.title}</strong>
                      <small>
                        {e.date} · {e.time} ·{" "}
                        {registrations.filter((r) => r.eventId === e.id).length}
                        /{e.capacity} registered
                      </small>
                      {registrations.some((r) => r.eventId === e.id) && (
                        <details className="participants">
                          <summary>View participants</summary>
                          {registrations
                            .filter((r) => r.eventId === e.id)
                            .map((r) => (
                              <span key={r.id}>
                                {app.users.find((u) => u.id === r.userId)
                                  ?.name || "Member"}{" "}
                                ·{" "}
                                {app.users.find((u) => u.id === r.userId)
                                  ?.email || "Guest account"}
                              </span>
                            ))}
                        </details>
                      )}
                    </div>
                    <select
                      value={e.status}
                      onChange={(ev) =>
                        mutate("events", e.id, {
                          status: ev.target.value,
                        })
                      }
                      aria-label={`Change event status for ${e.title}`}
                    >
                      <option>Published</option>
                      <option>Cancelled</option>
                      <option>Draft</option>
                    </select>
                    <button
                      className="icon-action"
                      onClick={() => edit("events", e)}
                      aria-label={`Edit ${e.title}`}
                    >
                      <PenLine size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {tab === "blogs" && (
              <div className="staff-records">
                {filter(blogs).map((b) => (
                  <div className="staff-list-item" key={b.id}>
                    <PetImage src={b.image} alt="Article" />
                    <div>
                      <strong>{b.title}</strong>
                      <small>
                        {b.category} · {b.date} · {b.readTime}
                      </small>
                    </div>
                    <button
                      className="button button-outline button-sm"
                      onClick={() => edit("blogs", b)}
                    >
                      <PenLine size={16} /> Edit
                    </button>
                  </div>
                ))}
              </div>
            )}
            {tab === "donations" && (
              <div className="staff-records">
                {filter(donations).length ? (
                  filter(donations).map((d) => {
                    const donor = app.users.find((u) => u.id === d.userId);
                    const email = d.email || donor?.email;
                    const name = d.name || donor?.name || "Guest donor";
                    return (
                      <div className="staff-list-item" key={d.id}>
                        <Heart size={22} />
                        <div>
                          <strong>
                            S${Number(d.amount).toFixed(2)} · {d.method}
                          </strong>
                          <div>
                            <strong>{name}</strong>
                          </div>
                          <small>
                            {stamp(d.createdAt)} · {d.status}
                          </small>
                          <small>{email || "No email provided"}</small>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyStaff />
                )}
              </div>
            )}
            {tab === "contacts" && (
              <div className="staff-records">
                {filter(contacts).length ? (
                  filter(contacts).map((m) => (
                    <div className="staff-application" key={m.id}>
                      <span className="mini-eyebrow">
                        {stamp(m.createdAt)} ·{" "}
                        {m.type || m.topic || "General enquiry"}
                      </span>
                      <h3>{m.name}</h3>
                      <p>{m.email}</p>
                      <p>{m.message}</p>
                    </div>
                  ))
                ) : (
                  <EmptyStaff />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {draft && (
        <div
          className="modal-scrim"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDraft(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${draftType}`}
            className="edit-modal"
          >
            <div className="modal-head">
              <div>
                <span className="mini-eyebrow">PET HEAVEN MANAGEMENT</span>
                <h2>
                  {draft.id ? "Edit" : "Add"}{" "}
                  {draftType === "pets"
                    ? "pet profile"
                    : draftType === "events"
                      ? "activity"
                      : "blog article"}
                </h2>
              </div>
              <button onClick={() => setDraft(null)} aria-label="Close editor">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={save}>
              {draftType === "pets" ? (
                <>
                  <EditField
                    label="Pet name"
                    name="name"
                    draft={draft}
                    setDraft={setDraft}
                    required
                  />
                  <div className="form-grid">
                    <EditSelect
                      label="Species"
                      name="species"
                      draft={draft}
                      setDraft={setDraft}
                      options={["Dog", "Cat"]}
                    />
                    <EditField
                      label="Breed"
                      name="breed"
                      draft={draft}
                      setDraft={setDraft}
                      required
                    />
                    <EditField
                      label="Age"
                      name="age"
                      draft={draft}
                      setDraft={setDraft}
                      required
                    />
                    <EditSelect
                      label="Age group"
                      name="ageGroup"
                      draft={draft}
                      setDraft={setDraft}
                      options={["Baby", "Young", "Adult", "Senior"]}
                    />
                    <EditSelect
                      label="Gender"
                      name="gender"
                      draft={draft}
                      setDraft={setDraft}
                      options={["Female", "Male"]}
                    />
                    <EditSelect
                      label="Size"
                      name="size"
                      draft={draft}
                      setDraft={setDraft}
                      options={["Small", "Medium", "Large"]}
                    />
                    <EditSelect
                      label="Energy"
                      name="energy"
                      draft={draft}
                      setDraft={setDraft}
                      options={["Calm", "Balanced", "Playful"]}
                    />
                    <EditSelect
                      label="Status"
                      name="status"
                      draft={draft}
                      setDraft={setDraft}
                      options={["Available", "Adopted"]}
                    />
                  </div>
                  <EditField
                    label="Fun tag"
                    name="tag"
                    draft={draft}
                    setDraft={setDraft}
                  />
                  <EditField
                    label="Personality"
                    name="personality"
                    draft={draft}
                    setDraft={setDraft}
                  />
                  <EditField
                    label="Pet story"
                    name="story"
                    draft={draft}
                    setDraft={setDraft}
                    textarea
                  />
                  <EditField
                    label="Suitable home"
                    name="home"
                    draft={draft}
                    setDraft={setDraft}
                    textarea
                  />
                  <EditField
                    label="Health notes"
                    name="health"
                    draft={draft}
                    setDraft={setDraft}
                    textarea
                  />
                  <ImageUpload
                    label="Pet Photo"
                    value={draft.image}
                    onChange={(image) =>
                      setDraft((prev) => ({
                        ...prev,
                        image,
                      }))
                    }
                  />
                </>
              ) : draftType === "events" ? (
                <>
                  <EditField
                    label="Activity title"
                    name="title"
                    draft={draft}
                    setDraft={setDraft}
                    required
                  />
                  <div className="form-grid">
                    <EditSelect
                      label="Category"
                      name="category"
                      draft={draft}
                      setDraft={setDraft}
                      options={[
                        "Adoption",
                        "Volunteer",
                        "Community",
                        "Workshop",
                      ]}
                    />
                    <EditField
                      label="Date"
                      name="date"
                      type="date"
                      draft={draft}
                      setDraft={setDraft}
                      required
                    />
                    <EditField
                      label="Time"
                      name="time"
                      type="time"
                      draft={draft}
                      setDraft={setDraft}
                      required
                    />
                    <EditField
                      label="Capacity"
                      name="capacity"
                      type="number"
                      draft={draft}
                      setDraft={setDraft}
                      required
                    />
                    <EditSelect
                      label="Visibility"
                      name="status"
                      draft={draft}
                      setDraft={setDraft}
                      options={["Published", "Draft", "Cancelled"]}
                    />
                  </div>
                  <EditField
                    label="Location"
                    name="location"
                    draft={draft}
                    setDraft={setDraft}
                  />
                  <EditField
                    label="Description"
                    name="description"
                    draft={draft}
                    setDraft={setDraft}
                    textarea
                  />
                  <ImageUpload
                    label="Activity Image"
                    value={draft.image}
                    onChange={(image) =>
                      setDraft((prev) => ({
                        ...prev,
                        image,
                      }))
                    }
                  />
                </>
              ) : (
                <>
                  <EditField
                    label="Article title"
                    name="title"
                    draft={draft}
                    setDraft={setDraft}
                    required
                  />
                  <EditField
                    label="URL slug (optional)"
                    name="slug"
                    draft={draft}
                    setDraft={setDraft}
                  />
                  <EditField
                    label="Category"
                    name="category"
                    draft={draft}
                    setDraft={setDraft}
                  />
                  <div className="form-grid">
                    <EditField
                      label="Date"
                      name="date"
                      type="date"
                      draft={draft}
                      setDraft={setDraft}
                    />
                    <EditField
                      label="Reading time"
                      name="readTime"
                      draft={draft}
                      setDraft={setDraft}
                    />
                  </div>
                  <EditField
                    label="Excerpt"
                    name="excerpt"
                    draft={draft}
                    setDraft={setDraft}
                    textarea
                    required
                  />
                  <EditField
                    label="Article body (separate paragraphs with empty lines)"
                    name="contentText"
                    draft={draft}
                    setDraft={setDraft}
                    textarea
                  />
                  <ImageUpload
                    label="Article Image"
                    value={draft.image}
                    onChange={(image) =>
                      setDraft((prev) => ({
                        ...prev,
                        image,
                      }))
                    }
                  />
                </>
              )}
              <FormError message={error} />
              <div className="modal-actions">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setDraft(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-dark">
                  <Save size={17} /> Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
function EditField({
  label,
  name,
  draft,
  setDraft,
  textarea = false,
  helper,
  type = "text",
  required = false,
}) {
  return (
    <div className="form-field">
      <label htmlFor={`edit-${name}`}>{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          id={`edit-${name}`}
          name={name}
          value={draft[name] ?? ""}
          required={required}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              [name]: e.target.value,
            }))
          }
        />
      ) : (
        <input
          id={`edit-${name}`}
          name={name}
          type={type}
          value={draft[name] ?? ""}
          required={required}
          onChange={(e) =>
            setDraft((d) => ({
              ...d,
              [name]: e.target.value,
            }))
          }
        />
      )}{" "}
      {helper && <small>{helper}</small>}
    </div>
  );
}
function EditSelect({ label, name, draft, setDraft, options }) {
  return (
    <div className="form-field">
      <label htmlFor={`edit-${name}`}>{label}</label>
      <select
        id={`edit-${name}`}
        value={draft[name]}
        onChange={(e) =>
          setDraft((d) => ({
            ...d,
            [name]: e.target.value,
          }))
        }
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
function EmptyStaff() {
  return (
    <div className="empty-state">
      <PawPrint size={30} />
      <h3>Nothing here yet</h3>
      <p>
        Try submitting an action from your member account and then review it
        here.
      </p>
    </div>
  );
}
