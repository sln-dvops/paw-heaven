import { Routes, Route, Link } from "react-router-dom";
import { ArrowUpRight, PawPrint } from "lucide-react";
import { Header, Footer, Toast, Protect, ScrollTop } from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Adoption from "./pages/Adoption";
import PetDetail from "./pages/PetDetail";
import Apply from "./pages/Apply";
import Release from "./pages/Release";
import Activities from "./pages/Activities";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Blog, { BlogDetail } from "./pages/Blog";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";
export default function App() {
  return (
    <>
      <ScrollTop />
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/adopt" element={<Adoption />} />
          <Route path="/adopt/:id" element={<PetDetail />} />
          <Route
            path="/apply/:id"
            element={
              <Protect>
                <Apply />
              </Protect>
            }
          />
          <Route path="/release" element={<Release />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route
            path="/profile"
            element={
              <Protect>
                <Profile />
              </Protect>
            }
          />
          <Route
            path="/staff"
            element={
              <Protect staff>
                <Staff />
              </Protect>
            }
          />
          <Route
            path="*"
            element={
              <div className="container protect not-found">
                <PawPrint size={50} />
                <h1>Oops! This page ran off chasing a butterfly.</h1>
                <p>
                  Our little explorer couldn't find what you were looking for.
                </p>
                <Link to="/" className="button button-dark">
                  Back to happy place <ArrowUpRight size={17} />
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </>
  );
}
