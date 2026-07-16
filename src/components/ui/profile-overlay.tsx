import { useEffect } from "react";
import {
  Code2,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  X,
} from "lucide-react";
import content from "../../../content.json";

interface ProfileOverlayProps {
  onClose: () => void;
}

export default function ProfileOverlay({ onClose }: ProfileOverlayProps) {
  const { personal, education, projects, skills, achievements } = content;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const skillLabels: Record<string, string> = {
    programmingLanguages: "Languages",
    frameworks: "Frameworks",
    databases: "Databases",
    tools: "Tools",
  };

  return (
    // biome-ignore lint: backdrop click
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4 md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* biome-ignore lint: propagation prevention */}
      <div
        className="relative w-full max-w-2xl rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl my-4"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-400 hover:border-neutral-500 hover:text-white transition-all"
        >
          <X className="h-3.5 w-3.5" />
          Back to Terminal
        </button>

        {/* Header / Hero */}
        <div className="flex flex-col items-center gap-4 border-b border-neutral-800 p-8 pt-12 text-center">
          {personal.profileImage ? (
            // biome-ignore lint: standard HTML img
            <img
              src={personal.profileImage}
              alt={personal.name}
              className="h-24 w-24 rounded-full border-2 border-emerald-500/40 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-neutral-800">
              <Code2 className="h-10 w-10 text-emerald-400" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{personal.name}</h1>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-neutral-400">
              <MapPin className="h-3.5 w-3.5" />
              {personal.location}
            </div>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-neutral-400">
            {personal.about}
          </p>

          {/* Social links */}
          <div className="flex flex-wrap justify-center gap-2">
            <a href={`mailto:${personal.email}`} className="profile-btn">
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn"
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn"
            >
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn
            </a>
            {personal.x && (
              <a
                href={personal.x}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-btn"
              >
                <Twitter className="h-3.5 w-3.5" /> Twitter
              </a>
            )}
            <a
              href={personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-btn profile-btn-accent"
            >
              <FileText className="h-3.5 w-3.5" /> Resume
            </a>
          </div>
        </div>

        {/* Education */}
        <section className="border-b border-neutral-800 p-6">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Education
            </h2>
          </div>
          <div className="space-y-4">
            {education.map((e) => (
              <div
                key={e.institution}
                className="flex items-start justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {e.institution}
                  </p>
                  <p className="text-xs text-neutral-400">{e.degree}</p>
                  <p className="text-xs text-neutral-500">{e.location}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
                    {e.grade}
                  </span>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {e.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="border-b border-neutral-800 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Code2 className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Projects
            </h2>
          </div>
          <div className="space-y-4">
            {projects.map((p) => (
              <div
                key={p.title}
                className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">
                    {p.title}
                  </h3>
                  <div className="flex shrink-0 gap-2">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="profile-btn-sm"
                      >
                        <Github className="h-3 w-3" />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="profile-btn-sm"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="mb-3 text-xs leading-relaxed text-neutral-400">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-[11px] text-neutral-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="border-b border-neutral-800 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Skills
            </h2>
          </div>
          <div className="space-y-3">
            {Object.entries(skills).map(([cat, items]) => (
              <div
                key={cat}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-2"
              >
                <span className="w-24 shrink-0 text-xs text-neutral-500">
                  {skillLabels[cat] ?? cat}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(items as string[]).map((s) => (
                    <span
                      key={s}
                      className="rounded border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[11px] text-emerald-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Achievements
            </h2>
          </div>
          <div className="space-y-3">
            {achievements.map((a) => (
              <div key={a.title} className="flex gap-3">
                <span className="mt-0.5 text-emerald-400">✔</span>
                <div>
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  <p className="text-xs text-neutral-400">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
