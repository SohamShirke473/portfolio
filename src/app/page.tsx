"use client";
import { useState, lazy, Suspense } from "react";
import {
  Terminal,
  type CommandHandler,
  type OutputLine,
} from "@/components/ui/terminal";
import content from "../../content.json";
import { UserCircle, HelpCircle, Play, Square } from "lucide-react";

const ProfileOverlay = lazy(() => import("@/components/ui/profile-overlay"));

const { personal, education, projects, skills, achievements } = content;

/* ── Helper: format output lines ─────────────────────────── */
function out(text: string, color?: OutputLine["color"]): OutputLine {
  return { text, color };
}
const blank = (): OutputLine => ({ text: "" });

/* ══════════════════════════════════════════════════════════
   COMMAND MAP
══════════════════════════════════════════════════════════ */

// Setter for auto mode — set from inside the component and injected into commandMap
let _setAutoMode: ((v: boolean) => void) | null = null;
let _setShowProfile: ((v: boolean) => void) | null = null;

const commandMap: Record<string, CommandHandler> = {
  help: () => [
    out(""),
    out("  Available commands:", "green"),
    out("  ──────────────────────────────────────────────────", "dim"),
    out("  whoami          →  Who is Soham?", "default"),
    out("  about           →  Longer bio", "default"),
    out("  education       →  Academic background", "default"),
    out("  projects        →  All projects", "default"),
    out("  projects <name> →  Details for a specific project", "default"),
    out("  skills          →  Tech stack", "default"),
    out("  contact         →  Email & social links", "default"),
    out("  open <target>   →  open github | linkedin | resume", "default"),
    out(
      "  cat <file>      →  cat about.txt | education.txt | skills.txt",
      "default",
    ),
    out("  ls              →  List files", "default"),
    out("  date            →  Current date", "default"),
    out("  clear           →  Clear the terminal  (also Ctrl+L)", "default"),
    out("  auto            →  Start the auto tour", "default"),
    out("  profile         →  Open the profile card view", "default"),
    out("  ──────────────────────────────────────────────────", "dim"),
    out("  🎮  Easter eggs  →  matrix | hack | neofetch | coffee", "amber"),
    out("                      git log | ping | sudo rm -rf /", "amber"),
    out("  ──────────────────────────────────────────────────", "dim"),
    out("  Tip: ↑ ↓ history  |  Tab to autocomplete  |  Ctrl+L clear", "dim"),
    out(""),
  ],

  whoami: () => [
    out(""),
    out(`  ${personal.name}`, "green"),
    out(`  📍 ${personal.location}   ✉  ${personal.email}`),
    out(""),
    out(`  ${personal.about}`),
    out(""),
  ],

  about: () => [
    out(""),
    out("  # About Soham Shirke", "green"),
    out(""),
    out(`  ${personal.about}`),
    out(""),
    out(
      "  Currently studying B.E Computer Engineering at TSEC, Mumbai.",
      "dim",
    ),
    out("  CGPA: 8.82  |  Graduation: June 2028", "dim"),
    out(""),
    out("  Always building. Always learning. Open to collaborations.", "amber"),
    out(""),
  ],

  education: () => [
    out(""),
    ...education.flatMap((e) => [
      out(`  ┌─ ${e.institution}`, "green"),
      out(`  │  ${e.degree}`, "default"),
      out(`  │  ${e.location}  ·  ${e.duration}`, "dim"),
      out(`  └─ ${e.grade}`, "amber"),
      blank(),
    ]),
  ],

  projects: (args) => {
    if (args.length > 0) {
      const query = args.join(" ").toLowerCase();
      const match = projects.find((p) => p.title.toLowerCase().includes(query));
      if (!match) {
        return [
          out(""),
          out(`  Project not found: "${args.join(" ")}"`, "red"),
          out(
            "  Available: " + projects.map((p) => p.title).join("  |  "),
            "dim",
          ),
          out(""),
        ];
      }
      const links = [
        match.liveUrl ? `live  → ${match.liveUrl}` : null,
        match.githubUrl ? `src   → ${match.githubUrl}` : null,
      ].filter(Boolean) as string[];

      return [
        out(""),
        out(`  # ${match.title}`, "green"),
        out(`  ${match.technologies.join("  ·  ")}`, "amber"),
        out(""),
        out(`  ${match.description}`),
        ...(links.length
          ? [blank(), ...links.map((l) => out(`  ${l}`, "blue"))]
          : []),
        out(""),
      ];
    }

    return [
      out(""),
      out("  Projects:", "green"),
      out(""),
      ...projects.map((p, i) => {
        const badge = p.liveUrl ? "🟢 live" : p.githubUrl ? "⚫ github" : "";
        return out(
          `  [${String(i + 1).padStart(2, "0")}]  ${p.title.padEnd(22)}  ${badge}  →  ${p.technologies.slice(0, 3).join(", ")}`,
          "default",
        );
      }),
      out(""),
      out("  Tip: projects <name>  for full details", "dim"),
      out(""),
    ];
  },

  skills: () => {
    const labels: Record<string, string> = {
      programmingLanguages: "languages ",
      frameworks: "frameworks",
      databases: "databases ",
      tools: "tools     ",
    };
    return [
      out(""),
      out("  Tech Stack:", "green"),
      out(""),
      ...Object.entries(skills).map(([cat, items]) =>
        out(`  ${labels[cat] ?? cat}  →  ${(items as string[]).join("  ·  ")}`),
      ),
      out(""),
    ];
  },

  contact: () => [
    out(""),
    out("  Open for projects & collaborations.", "green"),
    out(""),
    out(`  email     →  ${personal.email}`, "default"),
    out(`  github    →  ${personal.github}`, "blue"),
    out(`  linkedin  →  ${personal.linkedin}`, "blue"),
    out(`  twitter   →  ${personal.x}`, "blue"),
    out(`  resume    →  ${personal.resumeUrl}`, "blue"),
    out(""),
    out("  Type 'open github' to open directly.", "dim"),
    out(""),
  ],

  open: (args) => {
    const target = args[0]?.toLowerCase();
    const urlMap: Record<string, string> = {
      github: personal.github,
      linkedin: personal.linkedin,
      twitter: personal.x,
      resume: personal.resumeUrl,
    };
    if (!target || !urlMap[target]) {
      return [
        out(""),
        out("  Usage: open <github | linkedin | twitter | resume>", "red"),
        out(""),
      ];
    }
    if (typeof window !== "undefined") window.open(urlMap[target], "_blank");
    return [
      out(""),
      out(`  Opening ${target}...`, "green"),
      out(`  → ${urlMap[target]}`, "blue"),
      out(""),
    ];
  },

  // cat <file> — alias to known handlers
  cat: (args) => {
    const file = args[0]?.toLowerCase().replace(/\.\w+$/, "") ?? "";
    const aliases: Record<string, CommandHandler> = {
      about: commandMap.about,
      "about.txt": commandMap.about,
      education: commandMap.education,
      "education.txt": commandMap.education,
      skills: commandMap.skills,
      "skills.txt": commandMap.skills,
      "skills.json": commandMap.skills,
      contact: commandMap.contact,
      projects: commandMap.projects,
    };
    if (aliases[file]) return aliases[file]([]);
    if (!file)
      return [
        out(""),
        out("  Usage: cat <about.txt | education.txt | skills.txt>", "red"),
        out(""),
      ];
    return [
      out(""),
      out(`  cat: ${args[0]}: No such file or directory`, "red"),
      out("  Try: cat about.txt | cat education.txt | cat skills.txt", "dim"),
      out(""),
    ];
  },

  achievements: () => [
    out(""),
    out("  Achievements:", "green"),
    out(""),
    ...achievements
      .map((a) => [
        out(`  ✔  ${a.title}`, "green"),
        out(`     ${a.description}`, "dim"),
        blank(),
      ])
      .flat(),
  ],

  ls: (args) => {
    const dir = args[0]?.toLowerCase() ?? "";
    if (dir.includes("project")) {
      return [
        out(""),
        ...projects.map((p) =>
          out(
            `  -rw-r--r--  projects/${p.title.toLowerCase().replace(/\s+/g, "-")}.md`,
            "green",
          ),
        ),
        out(""),
      ];
    }
    return [
      out(""),
      out("  drwxr-xr-x  projects/", "green"),
      out("  drwxr-xr-x  skills/", "green"),
      out("  drwxr-xr-x  education/", "green"),
      out("  drwxr-xr-x  achievements/", "green"),
      out("  -rw-r--r--  resume.pdf", "amber"),
      out("  -rw-r--r--  about.txt", "default"),
      out("  -rw-r--r--  education.txt", "default"),
      out("  -rw-r--r--  skills.txt", "default"),
      out(""),
    ];
  },

  date: () => [out(""), out(`  ${new Date().toString()}`, "dim"), out("")],

  // Trigger auto tour from inside the terminal
  auto: () => {
    setTimeout(() => _setAutoMode?.(true), 100);
    return [
      out(""),
      out("  Starting Auto Tour...", "green"),
      out("  Press any key at any time to take control.", "dim"),
      out(""),
    ];
  },

  // Open profile overlay from inside the terminal
  profile: () => {
    setTimeout(() => _setShowProfile?.(true), 100);
    return [out(""), out("  Opening profile view...", "green"), out("")];
  },

  // history is handled inside terminal.tsx but we add an alias here
  history: () => [
    out(""),
    out("  (Use ↑ ↓ arrow keys to cycle through command history)", "dim"),
    out(""),
  ],
};

/* ══════════════════════════════════════════════════════════
   INTRO SEQUENCE
══════════════════════════════════════════════════════════ */
const introCommands = ["whoami", "ls -la projects/", "cat about.txt"];
const introOutputs: Record<number, string[]> = {
  0: [`  ${personal.name}`, `  📍 ${personal.location}   ✉  ${personal.email}`],
  1: [
    "",
    ...projects.map(
      (p, i) => `  [${String(i + 1).padStart(2, "0")}]  ${p.title}`,
    ),
    "",
  ],
  2: [
    "",
    `  ${personal.about}`,
    "",
    "  Type 'help' to see all commands.",
    "  Or press ▶ Auto Tour for a hands-free walkthrough.",
  ],
};

/* ══════════════════════════════════════════════════════════
   AUTO TOUR — curated command showcase
══════════════════════════════════════════════════════════ */
const autoTourCommands = [
  "neofetch",
  "whoami",
  "education",
  "projects",
  "projects sourcemind",
  "projects codecook",
  "skills",
  "achievements",
  "coffee",
  "contact",
];

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const [showProfile, setShowProfile] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [autoMode, setAutoMode] = useState(false);

  // Inject setters so commandMap handlers can trigger UI state
  _setAutoMode = setAutoMode;
  _setShowProfile = setShowProfile;

  const startAutoTour = () => {
    setAutoMode(true);
    setShowHint(false);
  };

  const stopAutoTour = () => {
    setAutoMode(false);
  };

  return (
    <main className="h-dvh w-screen overflow-hidden bg-[#0a0a0a] relative">
      {/* ── Full-screen Terminal ────────────────────────────── */}
      <Terminal
        key={autoMode ? "auto" : "manual"}
        commandMap={commandMap}
        intro={{
          commands: introCommands,
          outputs: introOutputs,
          typingSpeed: 80,
          delayBetweenCommands: 1500,
        }}
        autoCommands={autoMode ? autoTourCommands : undefined}
        username="soham@portfolio"
        fullHeight
        className="h-full max-w-full px-0"
      />

      {/* ── Floating buttons (bottom-right) ─────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Help hint bubble */}
        {showHint && (
          <div className="flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/95 px-4 py-2 text-xs text-neutral-400 backdrop-blur-sm shadow-lg animate-bounce">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
            Type <span className="text-emerald-400 font-mono mx-1">help</span>{" "}
            or press
            <span className="text-amber-400 font-mono mx-1">Auto Tour</span>
            <button
              type="button"
              onClick={() => setShowHint(false)}
              className="ml-1 text-neutral-600 hover:text-neutral-400 transition-colors"
              aria-label="Dismiss hint"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Auto Tour button */}
          <button
            type="button"
            onClick={autoMode ? stopAutoTour : startAutoTour}
            className={`float-btn transition-all ${
              autoMode
                ? "border-amber-500/50 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                : ""
            }`}
          >
            {autoMode ? (
              <>
                <Square className="h-3.5 w-3.5" /> Stop Tour
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Auto Tour
              </>
            )}
          </button>

          {/* View Profile button */}
          <button
            type="button"
            onClick={() => {
              setShowProfile(true);
              setShowHint(false);
            }}
            className="float-btn"
          >
            <UserCircle className="h-4 w-4" />
            View Profile
          </button>
        </div>
      </div>

      {/* ── Profile Overlay ──────────────────────────────── */}
      {showProfile && (
        <Suspense fallback={null}>
          <ProfileOverlay onClose={() => setShowProfile(false)} />
        </Suspense>
      )}
    </main>
  );
}
