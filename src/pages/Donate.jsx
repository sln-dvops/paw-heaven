import { petImages } from "../data/images.js";
import { validDonationAmount } from "../utils/logic";
import PetImage from "../components/PetImage";
import { useState } from "react";
import { Heart, ShieldCheck, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageIntro } from "../components/Layout";
export default function Donate() {
  const { simulateDonation } = useApp();
  const [amount, setAmount] = useState("25");
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState("Card");
  const [done, setDone] = useState(false);
  const selected = amount === "custom" ? Number(custom) : Number(amount);
  const submit = (e) => {
    e.preventDefault();
    if (!validDonationAmount(selected)) return;
    simulateDonation({
      amount: selected,
      method,
    });
    setDone(true);
  };
  return (
    <>
      <PageIntro
        eyebrow="GIVE A LITTLE LOVE"
        title={
          <>
            Small acts of kindness. <em>Big</em> paw-sitive changes.
          </>
        }
        body="Explore ways to give towards animal welfare. Every contribution, no matter the size, helps us make a difference in the lives of animals in need."
        tone="yellow"
      />
      <section className="section">
        <div className="container donation-grid">
          <div>
            <div className="donation-photo">
              <PetImage src="/images/donate.jpg" alt="donate" />
              <div>Every little bit of kindness matters ♡</div>
            </div>
          </div>
          {done ? (
            <div className="donation-form donation-done">
              <div className="success-illustration">♡</div>
              <h2>You're a lovely human!</h2>
              <p>
                You selected <strong>S${selected.toFixed(2)}</strong> as a
                contribution amount.
              </p>
              <div className="donation-confirmation">
                <CheckCircle2 size={20} /> Your donation has been successfully
                received. Thank you for your generosity!
              </div>
              <br></br>
              <button
                className="button button-dark"
                onClick={() => setDone(false)}
              >
                Choose another amount
              </button>
            </div>
          ) : (
            <form className="donation-form" onSubmit={submit}>
              <div className="eyebrow">
                <Heart size={14} /> MAKE A DIFFERENCE
              </div>
              <h2>A little love goes a long way.</h2>
              <p>Choose an amount to try out the donation flow.</p>
              <div className="donation-amounts">
                {["5", "10", "25", "50"].map((v) => (
                  <button
                    type="button"
                    className={amount === v ? "active" : ""}
                    onClick={() => setAmount(v)}
                    key={v}
                  >
                    S${v}
                  </button>
                ))}
                <button
                  type="button"
                  className={amount === "custom" ? "active" : ""}
                  onClick={() => setAmount("custom")}
                >
                  Other
                </button>
              </div>
              {amount === "custom" && (
                <label className="custom-amount">
                  Custom amount (S$)
                  <input
                    min="0.01"
                    max="10000"
                    step="0.01"
                    type="number"
                    required
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="25"
                  />
                </label>
              )}
              <h3>Choose a payment method</h3>
              <div className="payment-options">
                {["Card", "PayNow", "Bank transfer"].map((m) => (
                  <label key={m}>
                    <input
                      type="radio"
                      name="payment-method"
                      value={m}
                      checked={method === m}
                      onChange={() => setMethod(m)}
                    />
                    <span>{m}</span>
                    <CheckCircle2 size={18} />
                  </label>
                ))}
              </div>
              <div className="donation-total">
                <strong>
                  S$
                  {Number.isFinite(selected) && selected > 0
                    ? selected.toFixed(2)
                    : "0.00"}
                </strong>
              </div>
              <button
                className="button button-dark submit-wide"
                disabled={!validDonationAmount(selected)}
                type="submit"
              >
                Donate Now <ArrowUpRight size={18} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
