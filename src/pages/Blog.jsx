import PetImage from "../components/PetImage";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowLeft,
  BookOpen,
  PlayCircle,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { PageIntro, SectionHead } from "../components/Layout";
import { demoVideo, demoDogVideo } from "../data/seed";
export default function Blog() {
  const { blogs } = useApp();
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(blogs.map((b) => b.category))];
  const visible = blogs.filter(
    (b) => category === "All" || category === b.category,
  );
  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="THE LATEST FROM OUR JOURNAL"
            title="For curious humans & happy paws."
          />
          <div className="chip-tabs">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? "active" : ""}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="blog-grid blog-grid-all">
            {visible.map((b) => (
              <Link to={`/blog/${b.slug}`} className="blog-card" key={b.id}>
                <div className="blog-img">
                  <PetImage src={b.image} loading="lazy" alt={b.title} />
                </div>
                <div className="blog-body">
                  <span className="mini-eyebrow">
                    {b.category} · {b.readTime}
                  </span>
                  <h3>{b.title}</h3>
                  <p>{b.excerpt}</p>
                  <span className="read-link">
                    Read story <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-mint" id="learn">
        <div className="container">
          <SectionHead
            eyebrow="WATCH & LEARN"
            title="A little learning goes a long way."
            body="Educational videos from animal welfare organisations. Watch here or open YouTube."
          />
          <div className="video-grid">
            {[demoVideo, demoDogVideo].map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
export function VideoCard({ video }) {
  const [play, setPlay] = useState(false);
  return (
    <article className="video-card">
      <div className="video-thumb">
        {play ? (
          <iframe
            title={video.title}
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            <PetImage
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt={`${video.title} thumbnail`}
              loading="lazy"
            />
            <button
              aria-label={`Play ${video.title}`}
              onClick={() => setPlay(true)}
            >
              <PlayCircle size={48} />
            </button>
          </>
        )}
      </div>
      <div className="video-copy">
        <span className="mini-eyebrow">{video.channel}</span>
        <h3>{video.title}</h3>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noreferrer"
        >
          Watch on YouTube <ExternalLink size={16} />
        </a>
      </div>
    </article>
  );
}
export function BlogDetail() {
  const { slug } = useParams();
  const { blogs } = useApp();
  const post = blogs.find((p) => p.slug === slug);
  if (!post)
    return (
      <div className="container protect">
        <h2>We couldn't find that story.</h2>
        <Link to="/blog" className="button button-dark">
          Back to blog
        </Link>
      </div>
    );
  const more = blogs.filter((b) => b.id !== post.id).slice(0, 2);
  return (
    <>
      <div className="container detail-breadcrumb">
        <Link to="/blog">
          <ArrowLeft size={17} /> Back to journal
        </Link>
        <span>/</span>
        <span>{post.category}</span>
      </div>
      <article className="article-page">
        <div className="article-title">
          <span className="eyebrow">
            <BookOpen size={15} />
            {post.category} · {post.readTime}
          </span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <span className="muted">
            {new Date(post.date + "T12:00:00").toLocaleDateString("en-SG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · Pet Heaven Journal
          </span>
        </div>
        <PetImage className="article-hero" src={post.image} alt={post.title} />
        <div className="article-content">
          {(post.content || []).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <div className="article-note">
            Pet care articles are for general education and do not replace
            guidance from a qualified veterinarian or behaviour professional.
          </div>
        </div>
      </article>
      <section className="section section-blush">
        <div className="container">
          <SectionHead
            eyebrow="KEEP THE CURIOSITY GOING"
            title="You might also love these."
          />
          <div className="blog-grid">
            {more.map((b) => (
              <Link to={`/blog/${b.slug}`} className="blog-card" key={b.id}>
                <div className="blog-img">
                  <PetImage src={b.image} alt={b.title} />
                </div>
                <div className="blog-body">
                  <span className="mini-eyebrow">
                    {b.category} · {b.readTime}
                  </span>
                  <h3>{b.title}</h3>
                  <span className="read-link">
                    Read story <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
