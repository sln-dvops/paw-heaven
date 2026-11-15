import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ArrowUpRight,
  UserPlus,
  Heart,
  PawPrint,
} from "lucide-react";

import { petImages } from "../data/images.js";
import PetImage from "../components/PetImage";
import { PageIntro, SectionHead } from "../components/Layout";

const steps = [
  [
    "Explore Our Pets",
    "Browse our cats and dogs, view their profiles and find a companion that suits your lifestyle.",
  ],
  [
    "Create an Account",
    "Sign up or log in to begin your adoption application and keep track of your requests.",
  ],
  [
    "Submit an Application",
    "Tell us a little about yourself, your home and your experience with pets.",
  ],
  [
    "Meet Your New Friend",
    "Request a meet-and-greet appointment to get to know your chosen pet better.",
  ],
  [
    "Welcome Them Home",
    "Once your application is reviewed and approved, you can discuss the next steps towards adoption.",
  ],
];

const faqs = [
  [
    "How do I adopt a pet?",
    "Browse our available pets, choose one you would like to meet and submit an adoption application. You can then request a meet-and-greet appointment.",
  ],
  [
    "Do I need an account to adopt?",
    "Yes. Creating an account allows you to submit applications, request appointments and view your application history.",
  ],
  [
    "Can I meet a pet before adopting?",
    "You can request a meet-and-greet through the pet's profile. Appointment arrangements are subject to confirmation.",
  ],
  [
    "Is there an adoption fee?",
    "Adoption fees may vary depending on the animal and its care requirements. Any applicable fees should be confirmed before proceeding with adoption.",
  ],
  [
    "What should I prepare before adopting?",
    "Make sure your household is ready for a new pet. Prepare a comfortable resting space, suitable food, water bowls, toys and other essential supplies.",
  ],
  [
    "What if I can no longer care for my pet?",
    "You can submit a rehoming request through our Release page. Providing accurate information about your pet helps with reviewing the request and finding a suitable home.",
  ],
];

const otherWays = [
  {
    icon: <PawPrint />,
    title: "Rehome a Pet",
    desc: "Need to find a new home for your pet? Learn how to submit a responsible rehoming request.",
    link: "/release",
    cta: "Learn More",
  },
  {
    icon: <UserPlus />,
    title: "Become a Volunteer",
    desc: "Join our activities and discover ways to support animals in need.",
    link: "/activities",
    cta: "Explore Activities",
  },
  {
    icon: <Heart />,
    title: "Support Our Cause",
    desc: "Every act of kindness helps promote better care and a brighter future for animals.",
    link: "/donate",
    cta: "Ways to Help",
  },
];

export default function HowItWorks() {
  const [expanded, setExpanded] = useState(0);

  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="THE ADOPTION PROCESS"
            title="Five steps to a loving home."
            body="Finding the right companion takes care, patience and a little preparation."
          />

          <div className="how-steps">
            {steps.map(([title, description], index) => (
              <div className="how-step" key={title}>
                <span className="step-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="center-button">
            <Link to="/adopt" className="button button-dark">
              Meet Our Pets <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Other Ways to Help */}
      <section className="section section-blush">
        <div className="container">
          <SectionHead
            eyebrow="GET INVOLVED"
            title="More ways to make a difference."
          />

          <div className="other-ways">
            {otherWays.map((item) => (
              <article key={item.title}>
                <div className="mission-icon">{item.icon}</div>

                <h3>{item.title}</h3>
                <p>{item.desc}</p>

                <Link to={item.link}>
                  {item.cta} <ArrowUpRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="section">
        <div className="container faq-layout">
          <div>
            <div className="eyebrow">FREQUENTLY ASKED QUESTIONS</div>

            <h2>Have a question?</h2>

            <p>Here are some helpful answers to get you started.</p>

            <PetImage src={petImages["pet-2"]} alt="A curious kitten" />
          </div>

          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <article
                key={question}
                className={expanded === index ? "faq-open" : ""}
              >
                <button
                  type="button"
                  aria-expanded={expanded === index}
                  onClick={() => setExpanded(expanded === index ? -1 : index)}
                >
                  <span>{question}</span>
                  <ChevronDown size={20} />
                </button>

                {expanded === index && <p>{answer}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
