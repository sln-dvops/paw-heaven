import { petImages } from "../data/images.js";
import PetImage from "../components/PetImage";
import { useState } from "react";
import { Mail, Heart, ArrowUpRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageIntro } from "../components/Layout";
import { Field, FormError } from "../components/FormBits";
export default function Contact() {
  const { submitContact } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const change = (e) =>
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  const submit = (e) => {
    e.preventDefault();
    try {
      submitContact(form);
      setDone(true);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <>
      <PageIntro
        eyebrow="WE'D LOVE TO HEAR FROM YOU"
        title={
          <>
            Say hello. We're all <em>ears!</em>
          </>
        }
        body="Questions, kind words or ideas? Find the right starting point for adoption, rehoming or getting involved."
        tone="pink"
      />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-left">
            <div className="contact-sticker">
              <Mail size={27} />
            </div>
            <h2>Have a question? Let's talk paws.</h2>
            <PetImage src="/images/contact.jpg" alt="contact" />
          </div>
          <div className="surface-form">
            {done ? (
              <div className="form-success">
                <Heart size={40} />
                <h2>Your message is tucked away!</h2>
                <p>We will get back to you soon!</p>
                <button
                  className="button button-dark"
                  onClick={() => {
                    setDone(false);
                    setForm({
                      name: "",
                      email: "",
                      topic: "",
                      message: "",
                    });
                  }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h2>Send us a little note</h2>
                <div className="form-grid">
                  <Field
                    label="Your name"
                    name="name"
                    value={form.name}
                    onChange={change}
                    required
                  />
                  <Field
                    label="Your email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={change}
                    required
                  />
                </div>
                <Field
                  label="What can we help with?"
                  name="topic"
                  value={form.topic}
                  onChange={change}
                  options={[
                    "Adoption question",
                    "Volunteering",
                    "Rehoming support",
                    "General enquiry",
                  ]}
                  required
                />
                <Field
                  label="Your message"
                  name="message"
                  value={form.message}
                  onChange={change}
                  required
                  textarea
                  placeholder="What's on your mind?"
                />
                <FormError message={error} />
                <button
                  type="submit"
                  className="button button-dark submit-wide"
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
