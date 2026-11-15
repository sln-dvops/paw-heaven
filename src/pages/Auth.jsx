import { petImages } from "../data/images.js";
import PetImage from "../components/PetImage";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowUpRight, Eye, EyeOff, Heart, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Brand } from "../components/Layout";
import { Field, FormError } from "../components/FormBits";
export default function Auth({ mode = "login" }) {
  const { user, login, signUp } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const change = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  const signup = mode === "signup";
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (signup && form.password !== form.confirm)
        throw new Error("Your passwords do not match.");
      const account = signup
        ? await signUp(form)
        : await login(form.email, form.password);
      const target =
        location.state?.from ||
        (account.role === "staff" ? "/staff" : "/profile");
      navigate(target, {
        replace: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (user)
    return (
      <div className="container protect">
        <h2>You're already logged in!</h2>
        <Link
          className="button button-dark"
          to={user.role === "staff" ? "/staff" : "/profile"}
        >
          Go to my dashboard
        </Link>
      </div>
    );
  return (
    <section className="auth-wrap">
      <div className="auth-art">
        <div className="auth-art-inner">
          <div className="auth-corner-logo">
            <Brand />
          </div>
          <h1>
            Good things come to those who <em>adopt.</em>
          </h1>
          <p>One tiny account. So many lovely possibilities.</p>
          <PetImage src="/images/auth.jpg" alt="auth pets" />
          <div className="auth-sticker">
            Your next little adventure starts here ♡
          </div>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-box">
          <span className="eyebrow">
            <Heart size={14} />{" "}
            {signup ? "WELCOME TO THE FAMILY" : "HELLO AGAIN, FRIEND"}
          </span>
          <h1>
            {signup ? (
              <>
                Let's be <em>paw-pals.</em>
              </>
            ) : (
              <>
                Welcome <em>back!</em>
              </>
            )}
          </h1>
          <p>
            {signup
              ? "Make room for a little more pawsitivity."
              : "Log in to keep track of your little adventures."}
          </p>
          <form onSubmit={submit}>
            {signup && (
              <Field
                label="Your name"
                name="name"
                value={form.name}
                onChange={change}
                placeholder="Your first and last name"
                required
              />
            )}
            <Field
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              required
              placeholder="you@example.com"
            />
            <div className="form-field">
              <label htmlFor="auth-password">
                Password <span>*</span>
              </label>
              <div className="password-field">
                <input
                  id="auth-password"
                  type={visible ? "text" : "password"}
                  autoComplete={signup ? "new-password" : "current-password"}
                  minLength={signup ? 8 : undefined}
                  required
                  name="password"
                  value={form.password}
                  onChange={change}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  aria-label={visible ? "Hide password" : "Show password"}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {signup && (
              <Field
                label="Confirm password"
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={change}
                required
              />
            )}
            <FormError message={error} />
            <button
              disabled={loading}
              type="submit"
              className="button button-dark submit-wide"
            >
              {loading
                ? "One moment..."
                : signup
                  ? "Create my account"
                  : "Log in"}{" "}
              <ArrowUpRight size={18} />
            </button>
          </form>
          <div className="auth-switch">
            {signup ? (
              <>
                Already part of our family?{" "}
                <Link to="/login" state={location.state}>
                  Log in
                </Link>
              </>
            ) : (
              <>
                New around here?{" "}
                <Link to="/signup" state={location.state}>
                  Create an account
                </Link>
              </>
            )}
          </div>
          {!signup && (
            <>
              <div className="auth-divider">EXPLORE WITH A GUEST ACCOUNT</div>
              <div className="demo-login-box">
                <strong>
                  <ShieldCheck size={17} /> Guest accounts
                </strong>
                <button
                  onClick={() =>
                    setForm({
                      name: "",
                      email: "member@petheaven.demo",
                      password: "Member123!",
                      confirm: "",
                    })
                  }
                >
                  Member · autofill credentials
                </button>
                <button
                  onClick={() =>
                    setForm({
                      name: "",
                      email: "staff@petheaven.demo",
                      password: "Staff123!",
                      confirm: "",
                    })
                  }
                >
                  Staff · autofill credentials
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
