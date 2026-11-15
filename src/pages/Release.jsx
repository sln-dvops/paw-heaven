import { petImages } from "../data/images.js";
import PetImage from "../components/PetImage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageIntro } from "../components/Layout";
import { Field, FormError } from "../components/FormBits";
import ImageUpload from "../components/ImageUpload";
export default function Release() {
  const { user, submitRelease } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState({
    owner: user?.name || "",
    email: user?.email || "",
    phone: "",
    petName: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    medical: "",
    temperament: "",
    reason: "",
    photo: "",
    extra: "",
    consent: false,
  });
  const [error, setError] = useState("");
  const change = (e) =>
    setData((p) => ({
      ...p,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  const submit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", {
        state: {
          from: "/release",
        },
      });
      return;
    }
    if (!data.consent) {
      setError("Please acknowledge the declaration.");
      return;
    }
    try {
      submitRelease(data);
      navigate("/profile", {
        state: {
          section: "releases",
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <>
      <PageIntro
        eyebrow="A KINDER NEW BEGINNING"
        title={
          <>
            Sometimes love means finding a <em>new beginning.</em>
          </>
        }
        body="If circumstances change, asking for help can be an act of care. Tell us about your pet with honesty and compassion."
        tone="pink"
      />
      <section className="section">
        <div className="container release-layout">
          <aside className="release-aside">
            <PetImage src="/images/rehome.jpg" alt="Rehome" />
            <div className="release-message">
              <Heart size={25} />
              <h3>Every story deserves compassion.</h3>
              <p>
                Rehoming should be considered carefully. We will review your
                request and provide support to help you and your pet find a
                suitable new home.
              </p>
            </div>
            <div className="info-list">
              <p>
                <ShieldCheck size={18} /> Requests require member login.
              </p>
              <p>
                <ShieldCheck size={18} /> Staff reviews all submissions.
              </p>
            </div>
          </aside>
          <form className="surface-form" onSubmit={submit}>
            <h2>Request rehoming support</h2>
            <h3 className="form-divider-title">About you</h3>
            <div className="form-grid">
              <Field
                label="Your name"
                name="owner"
                value={data.owner}
                onChange={change}
                required
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={data.email}
                onChange={change}
                required
              />
              <Field
                label="Contact number"
                name="phone"
                value={data.phone}
                onChange={change}
                required
              />
            </div>
            <h3 className="form-divider-title">About your pet</h3>
            <div className="form-grid">
              <Field
                label="Pet name"
                name="petName"
                value={data.petName}
                onChange={change}
                required
              />
              <Field
                label="Species"
                name="species"
                value={data.species}
                onChange={change}
                options={["Cat", "Dog"]}
                required
              />
              <Field
                label="Breed"
                name="breed"
                value={data.breed}
                onChange={change}
                required
              />
              <Field
                label="Age"
                name="age"
                value={data.age}
                onChange={change}
                required
              />
              <Field
                label="Gender"
                name="gender"
                value={data.gender}
                onChange={change}
                options={["Female", "Male", "Unknown"]}
                required
              />
            </div>
            <Field
              label="Medical history & care needs"
              name="medical"
              value={data.medical}
              onChange={change}
              textarea
              required
            />
            <Field
              label="Temperament and behaviour"
              name="temperament"
              value={data.temperament}
              onChange={change}
              textarea
              required
            />
            <Field
              label="Why are you seeking a new home?"
              name="reason"
              value={data.reason}
              onChange={change}
              textarea
              required
            />
            <ImageUpload
              label="Upload Pet Photo"
              value={data.photo}
              onChange={(image) =>
                setData((prev) => ({
                  ...prev,
                  photo: image,
                }))
              }
              required
            />

            <Field
              label="Other notes"
              name="extra"
              value={data.extra}
              onChange={change}
              textarea
              rows={3}
            />
            <label className="check-row">
              <input
                type="checkbox"
                name="consent"
                checked={data.consent}
                onChange={change}
                required
              />
              <span>
                I confirm that the information provided is accurate and
                complete.
              </span>
            </label>

            {!user && (
              <div className="form-alert">
                <ShieldCheck size={18} /> You will need to log in before
                submitting.
              </div>
            )}
            <FormError message={error} />
            <button className="button button-dark submit-wide" type="submit">
              {user ? "Submit request" : "Log in to submit"}{" "}
              <ArrowUpRight size={17} />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
