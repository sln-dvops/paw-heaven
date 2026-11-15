import PetImage from "../components/PetImage";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  ArrowLeft,
  ArrowUpRight,
  LockKeyhole,
  PawPrint,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Field, FormError } from "../components/FormBits";
import { appointmentSlots as slots, tomorrowDate } from "../utils/logic";
export default function Apply() {
  const tomorrow = tomorrowDate();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, user, applications, submitApplication } = useApp();
  const pet = pets.find((p) => p.id === id);
  const [details, setDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    housing: "",
    experience: "",
    household: "",
    reason: "",
    date: "",
    slot: "",
    remarks: "",
    consent: false,
  });
  const [error, setError] = useState("");
  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "date"
        ? {
            slot: "",
          }
        : {}),
    }));
    setError("");
  };
  const unavailable = useMemo(
    () =>
      new Set(
        applications
          .filter(
            (a) =>
              a.petId === id &&
              a.date === details.date &&
              !["Rejected", "Cancelled"].includes(a.status),
          )
          .map((a) => a.slot),
      ),
    [applications, id, details.date],
  );
  if (!pet || pet.status !== "Available")
    return (
      <div className="container protect">
        <h2>That application isn't available.</h2>
        <Link className="button button-dark" to="/adopt">
          Browse all pets
        </Link>
      </div>
    );
  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!details.consent) {
      setError("Please confirm the consent checkbox.");
      return;
    }
    if (details.date < tomorrow) {
      setError("Please choose a future appointment date.");
      return;
    }
    try {
      submitApplication({
        ...details,
        petId: pet.id,
      });
      navigate("/profile", {
        state: {
          section: "applications",
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <section className="section">
      <div className="container application-layout">
        <div className="form-aside">
          <Link className="back-link" to={`/adopt/${id}`}>
            <ArrowLeft size={17} /> Back to {pet.name}
          </Link>
          <div className="eyebrow">
            <PawPrint size={14} /> ONE STEP CLOSER
          </div>
          <h1>
            Let's make this <em>thoughtful.</em>
          </h1>
          <p>
            Tell us a bit about yourself so we can help you prepare for a
            thoughtful introduction.
          </p>
          <div className="aside-pet">
            <PetImage src={pet.image} alt={pet.name} />
            <div>
              <strong>Applying to meet {pet.name}</strong>
              <small>
                {pet.breed} · {pet.age}
              </small>
            </div>
          </div>
        </div>
        <form className="surface-form" onSubmit={submit}>
          <div className="form-heading">
            <CalendarDays size={23} />
            <div>
              <h2>Adoption request & meet-up</h2>
              <p>Fields with * are required.</p>
            </div>
          </div>
          <h3 className="form-divider-title">01. About you</h3>
          <div className="form-grid">
            <Field
              label="Full name"
              name="name"
              value={details.name}
              onChange={change}
              required
            />
            <Field
              label="Email address"
              type="email"
              name="email"
              value={details.email}
              onChange={change}
              required
            />
            <Field
              label="Contact number"
              type="tel"
              name="phone"
              value={details.phone}
              onChange={change}
              required
              placeholder="Contact number"
            />
            <Field
              label="Housing type"
              name="housing"
              value={details.housing}
              onChange={change}
              options={["HDB apartment", "Condominium", "Landed home", "Other"]}
              required
            />
            <Field
              label="Previous pet experience"
              name="experience"
              value={details.experience}
              onChange={change}
              options={[
                "First-time pet owner",
                "Some experience",
                "Experienced owner",
              ]}
              required
            />
            <Field
              label="Household"
              name="household"
              value={details.household}
              onChange={change}
              options={[
                "Just me",
                "Adults only",
                "Family with children",
                "Home with other pets",
              ]}
              required
            />
          </div>
          <Field
            label="Why would you love to adopt this pet?"
            name="reason"
            textarea
            value={details.reason}
            onChange={change}
            required
            placeholder="Tell us about your routine, motivation and plans..."
          />
          <h3 className="form-divider-title">02. Request a meet-and-greet</h3>
          <div className="form-grid">
            <Field
              label="Preferred date"
              name="date"
              type="date"
              min={tomorrow}
              value={details.date}
              onChange={change}
              required
            />
            <Field
              label="Preferred time"
              name="slot"
              value={details.slot}
              onChange={change}
              required
              options={slots.map((s) => ({
                value: s,
                label: unavailable.has(s) ? `${s} — unavailable` : s,
                disabled: unavailable.has(s),
              }))}
            />
          </div>
          <Field
            label="Anything else we should know?"
            name="remarks"
            textarea
            value={details.remarks}
            onChange={change}
            placeholder="Optional additional details"
            rows={3}
          />
          <label className="check-row">
            <input
              name="consent"
              type="checkbox"
              checked={details.consent}
              onChange={change}
              required
            />
            <span>
              I understand the application will be reviewed and I will be
              contacted to confirm the meet-and-greet. I consent to my personal
              information being used for this purpose.
            </span>
          </label>
          <FormError message={error} />
          <button className="button button-dark submit-wide" type="submit">
            Send my request <ArrowUpRight size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}
