"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   AUDIO
═══════════════════════════════════════════════════════════ */
const KEY_SOUNDS_DOWN: Record<string, [number, number]> = {
  A: [31542, 85], B: [40621, 107], C: [39632, 95], D: [32492, 85],
  E: [23317, 83], F: [32973, 87], G: [33453, 94], H: [33986, 93],
  I: [25795, 91], J: [34425, 88], K: [34932, 90], L: [35410, 95],
  M: [41610, 93], N: [41103, 90], O: [26309, 84], P: [26804, 83],
  Q: [22245, 95], R: [23817, 92], S: [32031, 88], T: [24297, 92],
  U: [25313, 95], V: [40136, 94], W: [22790, 89], X: [39148, 76],
  Y: [24811, 93], Z: [38694, 80], " ": [51541, 144], "-": [42594, 90],
  "@": [23317, 83], "/": [42594, 90], ".": [42594, 90], ":": [42594, 90],
  "0": [26309, 84], "1": [25313, 95], "2": [23317, 83], "3": [23817, 92],
  "4": [24297, 92], "5": [24811, 93], "6": [25313, 95], "7": [25795, 91],
  "8": [26309, 84], "9": [26804, 83], Enter: [19065, 110],
};
const KEY_SOUNDS_UP: Record<string, [number, number]> = {
  A: [31632, 80], B: [40736, 95], C: [39732, 85], D: [32577, 80],
  E: [23402, 80], F: [33063, 80], G: [33553, 85], H: [34081, 85],
  I: [25890, 85], J: [34515, 85], K: [35027, 85], L: [35510, 85],
  M: [41710, 85], N: [41198, 85], O: [26394, 80], P: [26889, 80],
  Q: [22345, 85], R: [23912, 85], S: [32121, 80], T: [24392, 85],
  U: [25413, 85], V: [40236, 85], W: [22880, 85], X: [39228, 70],
  Y: [24911, 85], Z: [38779, 75], " ": [51691, 130], "-": [42689, 85],
  "@": [23402, 80], "/": [42689, 85], ".": [42689, 85], ":": [42689, 85],
  "0": [26394, 80], "1": [25413, 85], "2": [23402, 80], "3": [23912, 85],
  "4": [24392, 85], "5": [24911, 85], "6": [25413, 85], "7": [25890, 85],
  "8": [26394, 80], "9": [26889, 80], Enter: [19180, 100],
};

function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        ctxRef.current = new AudioContext();
        const res = await fetch("/sounds/sound.ogg");
        if (!res.ok) return;
        bufferRef.current = await ctxRef.current.decodeAudioData(await res.arrayBuffer());
        readyRef.current = true;
      } catch {}
    };
    init();
    return () => { ctxRef.current?.close(); };
  }, []);

  const play = useCallback((sound: [number, number] | undefined) => {
    if (!readyRef.current || !ctxRef.current || !bufferRef.current || !sound) return;
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    const src = ctxRef.current.createBufferSource();
    src.buffer = bufferRef.current;
    src.connect(ctxRef.current.destination);
    src.start(0, sound[0] / 1000, sound[1] / 1000);
  }, []);

  const down = useCallback((key: string) =>
    play(KEY_SOUNDS_DOWN[key.toUpperCase()] || KEY_SOUNDS_DOWN[key]), [play]);
  const up = useCallback((key: string) =>
    play(KEY_SOUNDS_UP[key.toUpperCase()] || KEY_SOUNDS_UP[key]), [play]);

  return { down, up };
}

/* ═══════════════════════════════════════════════════════════
   SYNTAX HIGHLIGHTING
═══════════════════════════════════════════════════════════ */
type TT = "command" | "flag" | "string" | "number" | "operator" | "path" | "variable" | "comment" | "default";

function tokenize(text: string): { type: TT; value: string }[] {
  const tokens: { type: TT; value: string }[] = [];
  let isFirst = true;
  for (const word of text.split(/(\s+)/)) {
    if (/^\s+$/.test(word)) { tokens.push({ type: "default", value: word }); continue; }
    if (word.startsWith("#"))  { tokens.push({ type: "comment", value: word }); continue; }
    if (word.startsWith("$"))  { tokens.push({ type: "variable", value: word }); isFirst = false; continue; }
    if (word.startsWith("--") || word.startsWith("-")) { tokens.push({ type: "flag", value: word }); isFirst = false; continue; }
    if (/^["'].*["']$/.test(word)) { tokens.push({ type: "string", value: word }); isFirst = false; continue; }
    if (/^\d+$/.test(word))   { tokens.push({ type: "number", value: word }); isFirst = false; continue; }
    if (/^[|>&<]+$/.test(word)) { tokens.push({ type: "operator", value: word }); isFirst = true; continue; }
    if (word.includes("/") || word.startsWith(".") || word.startsWith("~")) { tokens.push({ type: "path", value: word }); isFirst = false; continue; }
    if (isFirst) { tokens.push({ type: "command", value: word }); isFirst = false; continue; }
    tokens.push({ type: "default", value: word });
  }
  return tokens;
}

const TT_COLOR: Record<TT, string> = {
  command: "text-emerald-400", flag: "text-sky-400", string: "text-amber-300",
  number: "text-purple-400", operator: "text-red-400", path: "text-cyan-300",
  variable: "text-pink-400", comment: "text-neutral-500", default: "text-neutral-300",
};

function Highlighted({ text }: { text: string }) {
  return (
    <>
      {tokenize(text).map((t, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable token layout
        <span key={i} className={TT_COLOR[t.type]}>
          {t.value}
        </span>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
export type OutputLine = {
  text: string;
  color?: "green" | "amber" | "red" | "dim" | "blue" | "pink" | "default";
};

export type CommandHandler = (args: string[]) => OutputLine[] | string[];

export interface InteractiveTerminalProps {
  /** Map of command name → handler */
  commandMap: Record<string, CommandHandler>;
  /** Auto-typed intro sequence before interactive mode */
  intro?: {
    commands: string[];
    outputs: Record<number, string[]>;
    typingSpeed?: number;
    delayBetweenCommands?: number;
  };
  /**
   * Commands to auto-run after intro (auto-tour mode).
   * Any keypress exits auto mode and goes interactive.
   */
  autoCommands?: string[];
  username?: string;
  fullHeight?: boolean;
  className?: string;
}

/* ═══════════════════════════════════════════════════════════
   LINE TYPES
═══════════════════════════════════════════════════════════ */
type Line =
  | { kind: "cmd";    text: string; user: string }
  | { kind: "out";    text: string; color?: OutputLine["color"] }
  | { kind: "blank" }
  | { kind: "matrix"; id: number }
  | { kind: "hack";   id: number };

const COLOR_CLASS: Record<NonNullable<OutputLine["color"]>, string> = {
  green:   "text-emerald-400",
  amber:   "text-amber-400",
  red:     "text-red-400",
  dim:     "text-neutral-500",
  blue:    "text-sky-400",
  pink:    "text-pink-400",
  default: "text-neutral-300",
};

/* ═══════════════════════════════════════════════════════════
   LINK PARSER HELPER
═══════════════════════════════════════════════════════════ */
function renderTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      const url = part.replace(/[.,;:]$/, "");
      return (
        <a
          // biome-ignore lint/suspicious/noArrayIndexKey: simple split index
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-emerald-400 underline transition-colors"
          onClick={e => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

/* ═══════════════════════════════════════════════════════════
   MATRIX ANIMATION LINE
═══════════════════════════════════════════════════════════ */
function MatrixLine() {
  const [frame, setFrame] = useState("");
  useEffect(() => {
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF0123456789";
    const len = 64;
    let i = 0;
    const iv = setInterval(() => {
      setFrame(Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
      if (++i > 18) clearInterval(iv);
    }, 80);
    return () => clearInterval(iv);
  }, []);
  return <span className="text-emerald-400 font-mono text-xs opacity-80">{frame}</span>;
}

/* ═══════════════════════════════════════════════════════════
   HACK ANIMATION LINE
═══════════════════════════════════════════════════════════ */
function HackLine() {
  const [frame, setFrame] = useState("");
  useEffect(() => {
    const chars = "0123456789ABCDEF";
    let i = 0;
    const iv = setInterval(() => {
      setFrame(Array.from({ length: 48 }, () => chars[Math.floor(Math.random() * chars.length)]).join(" "));
      if (++i > 12) clearInterval(iv);
    }, 60);
    return () => clearInterval(iv);
  }, []);
  return <span className="text-green-300 font-mono text-xs opacity-70 tracking-widest">{frame}</span>;
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export function Terminal({
  commandMap,
  intro,
  autoCommands,
  username = "soham@portfolio",
  fullHeight = false,
  className,
}: InteractiveTerminalProps) {
  const { down, up } = useAudio();

  /* ── State ─────────────────────────────────────────── */
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  // biome-ignore lint/correctness/noUnusedVariables: State tracker for cycle history resets
  const [histIdx, setHistIdx] = useState(-1);
  const [interactive, setInteractive] = useState(!intro);
  const [cursorOn, setCursorOn] = useState(true);
  const [matrixCounter, setMatrixCounter] = useState(0);
  const [hackCounter, setHackCounter] = useState(0);

  /* Intro state */
  const [introPhase, setIntroPhase] = useState<"idle" | "typing" | "executing" | "outputting" | "pausing" | "done">("idle");
  const [introCmdIdx, setIntroCmdIdx] = useState(0);
  const [introCharIdx, setIntroCharIdx] = useState(0);
  const [introCurrentText, setIntroCurrentText] = useState("");
  const [introOutputIdx, setIntroOutputIdx] = useState(-1);

  /* Auto mode state */
  const [autoMode, setAutoMode] = useState(false);
  const [autoText, setAutoText] = useState("");
  const [autoCmdIdx, setAutoCmdIdx] = useState(0);
  const [autoCharIdx, setAutoCharIdx] = useState(0);
  const [autoPhase, setAutoPhase] = useState<"idle" | "typing" | "executing" | "pausing">("idle");

  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Cursor blink ───────────────────────────────────── */
  useEffect(() => {
    const iv = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(iv);
  }, []);

  /* ── Auto-scroll ────────────────────────────────────── */
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  });

  /* ── Focus input on click ───────────────────────────── */
  const focusInput = useCallback(() => {
    if (interactive) inputRef.current?.focus();
  }, [interactive]);

  /* ── Helpers ────────────────────────────────────────── */
  const addLines = useCallback((newLines: Line[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const pushOutput = useCallback((raw: string[] | OutputLine[]) => {
    const normalized: Line[] = raw.map(r => {
      if (typeof r === "string") return r === "" ? { kind: "blank" as const } : { kind: "out" as const, text: r };
      return r.text === "" ? { kind: "blank" as const } : { kind: "out" as const, text: r.text, color: r.color };
    });
    addLines(normalized);
  }, [addLines]);

  /* ── INTRO sequence ─────────────────────────────────── */
  // Kick off after mount
  useEffect(() => {
    if (intro && introPhase === "idle") {
      const t = setTimeout(() => setIntroPhase("typing"), 400);
      return () => clearTimeout(t);
    }
  }, [intro, introPhase]);

  const introCmd = intro?.commands[introCmdIdx] ?? "";
  const introOutputs = intro?.outputs[introCmdIdx] ?? [];
  const introTypingSpeed = intro?.typingSpeed ?? 32;
  const introDelay = intro?.delayBetweenCommands ?? 700;
  const introIsLast = introCmdIdx === (intro?.commands.length ?? 0) - 1;

  // Typing phase
  useEffect(() => {
    if (introPhase !== "typing") return;
    if (introCharIdx < introCmd.length) {
      const char = introCmd[introCharIdx];
      down(char);
      const t = setTimeout(() => {
        up(char);
        setIntroCurrentText(introCmd.slice(0, introCharIdx + 1));
        setIntroCharIdx(c => c + 1);
      }, introTypingSpeed + Math.random() * 20);
      return () => clearTimeout(t);
    }
    down("Enter");
    const t = setTimeout(() => { up("Enter"); setIntroPhase("executing"); }, 80);
    return () => clearTimeout(t);
  }, [introPhase, introCharIdx, introCmd, introTypingSpeed, down, up]);

  // Executing phase
  useEffect(() => {
    if (introPhase !== "executing") return;
    addLines([{ kind: "cmd", text: introCmd, user: username }]);
    setIntroCurrentText("");
    if (introOutputs.length > 0) { setIntroOutputIdx(0); setIntroPhase("outputting"); }
    else if (introIsLast) setIntroPhase("done");
    else setIntroPhase("pausing");
  }, [introPhase, introCmd, introOutputs.length, introIsLast, username, addLines]);

  // Outputting phase
  useEffect(() => {
    if (introPhase !== "outputting") return;
    if (introOutputIdx >= 0 && introOutputIdx < introOutputs.length) {
      const t = setTimeout(() => {
        const text = introOutputs[introOutputIdx];
        addLines([text === "" ? { kind: "blank" } : { kind: "out", text }]);
        setIntroOutputIdx(i => i + 1);
      }, 120);
      return () => clearTimeout(t);
    }
    if (introOutputIdx >= introOutputs.length) {
      const t = setTimeout(() => {
        if (introIsLast) setIntroPhase("done");
        else setIntroPhase("pausing");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [introPhase, introOutputIdx, introOutputs, introIsLast, addLines]);

  // Pausing phase
  useEffect(() => {
    if (introPhase !== "pausing") return;
    const t = setTimeout(() => {
      setIntroCharIdx(0);
      setIntroOutputIdx(-1);
      setIntroCmdIdx(c => c + 1);
      setIntroPhase("typing");
    }, introDelay);
    return () => clearTimeout(t);
  }, [introPhase, introDelay]);

  // Done — hand off to auto mode OR interactive
  useEffect(() => {
    if (introPhase !== "done") return;
    addLines([{ kind: "blank" }]);
    const t = setTimeout(() => {
      if (autoCommands && autoCommands.length > 0) {
        setAutoMode(true);
        setAutoPhase("typing");
      } else {
        setInteractive(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [introPhase, addLines, autoCommands]);

  /* ── AUTO MODE sequence ──────────────────────────────── */
  const autoCmd = autoCommands?.[autoCmdIdx] ?? "";
  const autoIsLast = autoCmdIdx === (autoCommands?.length ?? 0) - 1;

  // Auto typing
  useEffect(() => {
    if (!autoMode || autoPhase !== "typing") return;
    if (autoCharIdx < autoCmd.length) {
      const char = autoCmd[autoCharIdx];
      down(char);
      const t = setTimeout(() => {
        up(char);
        setAutoText(autoCmd.slice(0, autoCharIdx + 1));
        setAutoCharIdx(c => c + 1);
      }, 35 + Math.random() * 25);
      return () => clearTimeout(t);
    }
    down("Enter");
    const t = setTimeout(() => { up("Enter"); setAutoPhase("executing"); }, 80);
    return () => clearTimeout(t);
  }, [autoMode, autoPhase, autoCharIdx, autoCmd, down, up]);

  // Auto executing — run the command through the command map
  useEffect(() => {
    if (!autoMode || autoPhase !== "executing") return;
    addLines([{ kind: "cmd", text: autoCmd, user: username }]);
    setAutoText("");
    // Run through commandMap
    const [cmd, ...args] = autoCmd.toLowerCase().trim().split(/\s+/);
    if (commandMap[cmd]) {
      pushOutput(commandMap[cmd](args));
    }
    addLines([{ kind: "blank" }]);
    if (autoIsLast) {
      // All auto commands done — hand off to interactive
      const t = setTimeout(() => {
        setAutoMode(false);
        setInteractive(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }, 1200);
      return () => clearTimeout(t);
    }
    setAutoPhase("pausing");
  }, [autoMode, autoPhase, autoCmd, autoIsLast, username, addLines, pushOutput, commandMap]);

  // Auto pausing between commands
  useEffect(() => {
    if (!autoMode || autoPhase !== "pausing") return;
    const t = setTimeout(() => {
      setAutoCharIdx(0);
      setAutoCmdIdx(c => c + 1);
      setAutoPhase("typing");
    }, 1400);
    return () => clearTimeout(t);
  }, [autoMode, autoPhase]);

  // Exit auto mode on any keypress
  useEffect(() => {
    if (!autoMode) return;
    const exit = () => {
      setAutoMode(false);
      setAutoText("");
      setInteractive(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    };
    window.addEventListener("keydown", exit, { once: true });
    return () => window.removeEventListener("keydown", exit);
  }, [autoMode]);

  /* ── Command execution ──────────────────────────────── */
  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // Add command line
    addLines([{ kind: "cmd", text: trimmed, user: username }]);

    // Update history
    setHistory(prev => [trimmed, ...prev.filter(h => h !== trimmed)]);
    setHistIdx(-1);

    const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/);

    // Built-in: clear
    if (cmd === "clear") { setLines([]); return; }

    // Easter egg: matrix
    if (cmd === "matrix") {
      addLines([{ kind: "out", text: "  Entering the Matrix...", color: "green" }]);
      const id = matrixCounter;
      setMatrixCounter(c => c + 1);
      for (let i = 0; i < 8; i++) {
        addLines([{ kind: "matrix", id: id * 100 + i }]);
      }
      addLines([
        { kind: "blank" },
        { kind: "out", text: "  Wake up, Soham...", color: "green" },
        { kind: "out", text: "  The Matrix has you.", color: "dim" },
        { kind: "blank" },
      ]);
      return;
    }

    // Easter egg: hack
    if (cmd === "hack") {
      addLines([
        { kind: "out", text: "  Initializing hack sequence...", color: "red" },
        { kind: "blank" },
      ]);
      const id = hackCounter;
      setHackCounter(c => c + 1);
      for (let i = 0; i < 6; i++) {
        addLines([{ kind: "hack", id: id * 100 + i }]);
      }
      addLines([
        { kind: "blank" },
        { kind: "out", text: "  ██████████ ACCESS GRANTED ██████████", color: "green" },
        { kind: "out", text: "  Welcome, root.", color: "green" },
        { kind: "blank" },
      ]);
      return;
    }

    // Easter egg: sudo rm -rf
    if (trimmed.startsWith("sudo rm -rf") || trimmed.startsWith("sudo rm-rf")) {
      addLines([
        { kind: "out", text: "  [sudo] password for soham:", color: "dim" },
        { kind: "out", text: "  Removing /boot...", color: "red" },
        { kind: "out", text: "  Removing /usr...", color: "red" },
        { kind: "out", text: "  Removing /home/soham/projects...", color: "red" },
        { kind: "out", text: "  Removing /heart...", color: "red" },
        { kind: "blank" },
        { kind: "out", text: "  Just kidding 😄  Nice try though.", color: "amber" },
        { kind: "blank" },
      ]);
      return;
    }

    // Easter egg: git log
    if (trimmed === "git log") {
      addLines([
        { kind: "out", text: "  commit a3f91b2  (HEAD -> main)", color: "amber" },
        { kind: "out", text: "  Author: Soham Shirke <sohamshirke473@gmail.com>", color: "dim" },
        { kind: "out", text: "  Date:   Today", color: "dim" },
        { kind: "out", text: "      fix: finally got that bug after 3 hours", color: "default" },
        { kind: "blank" },
        { kind: "out", text: "  commit 7c2e441", color: "amber" },
        { kind: "out", text: "      feat: add feature (it works on my machine)", color: "default" },
        { kind: "blank" },
        { kind: "out", text: "  commit 1a9f003", color: "amber" },
        { kind: "out", text: "      WIP: please don't look at this commit", color: "default" },
        { kind: "blank" },
        { kind: "out", text: "  commit 0000000", color: "amber" },
        { kind: "out", text: "      init: copied from stackoverflow", color: "dim" },
        { kind: "blank" },
      ]);
      return;
    }

    // Easter egg: coffee
    if (cmd === "coffee") {
      addLines([
        { kind: "out", text: "        )  (", color: "amber" },
        { kind: "out", text: "       (   ) )", color: "amber" },
        { kind: "out", text: "        ) ( (", color: "amber" },
        { kind: "out", text: "      _______", color: "default" },
        { kind: "out", text: "   .-'-------'-.", color: "default" },
        { kind: "out", text: "  ( C|  Soham  |", color: "green" },
        { kind: "out", text: "   '-._______.-'", color: "default" },
        { kind: "out", text: "    '._______.'", color: "default" },
        { kind: "blank" },
        { kind: "out", text: "  Brewing ideas... ☕", color: "amber" },
        { kind: "blank" },
      ]);
      return;
    }

    // Easter egg: neofetch
    if (cmd === "neofetch") {
      addLines([
        { kind: "blank" },
        { kind: "out", text: "  ███████╗ ██████╗ ██╗  ██╗ █████╗ ███╗   ███╗", color: "green" },
        { kind: "out", text: "  ██╔════╝██╔═══██╗██║  ██║██╔══██╗████╗ ████║", color: "green" },
        { kind: "out", text: "  ███████╗██║   ██║███████║███████║██╔████╔██║", color: "green" },
        { kind: "out", text: "  ╚════██║██║   ██║██╔══██║██╔══██║██║╚██╔╝██║", color: "green" },
        { kind: "out", text: "  ███████║╚██████╔╝██║  ██║██║  ██║██║ ╚═╝ ██║", color: "green" },
        { kind: "out", text: "  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝", color: "green" },
        { kind: "blank" },
        { kind: "out", text: "  soham@portfolio", color: "green" },
        { kind: "out", text: "  ─────────────────────────────", color: "dim" },
        { kind: "out", text: "  OS:       Mumbai, India", color: "default" },
        { kind: "out", text: "  Host:     Thadomal Shahani Engineering College", color: "default" },
        { kind: "out", text: "  Kernel:   B.E Computer Engineering", color: "default" },
        { kind: "out", text: "  Uptime:   2+ years coding", color: "default" },
        { kind: "out", text: "  Shell:    TypeScript / Node.js", color: "default" },
        { kind: "out", text: "  Terminal: This one 😄", color: "default" },
        { kind: "out", text: "  CPU:      Curiosity × Caffeine", color: "default" },
        { kind: "out", text: "  Memory:   Infinite (if it's interesting)", color: "default" },
        { kind: "out", text: "  Projects: 5 shipped", color: "amber" },
        { kind: "out", text: "  CGPA:     8.82", color: "green" },
        { kind: "blank" },
      ]);
      return;
    }

    // Easter egg: ping
    if (cmd === "ping") {
      const target = args[0] || "soham";
      addLines([
        { kind: "out", text: `  PING ${target} (sohamshirke473@gmail.com)`, color: "dim" },
        { kind: "out", text: "  64 bytes: icmp_seq=1 ttl=64 time=0.001 ms", color: "green" },
        { kind: "out", text: "  64 bytes: icmp_seq=2 ttl=64 time=0.001 ms", color: "green" },
        { kind: "out", text: "  64 bytes: icmp_seq=3 ttl=64 time=0.001 ms", color: "green" },
        { kind: "blank" },
        { kind: "out", text: "  Always available. No packet loss. 🟢", color: "green" },
        { kind: "blank" },
      ]);
      return;
    }

    // Easter egg: yes
    if (cmd === "yes") {
      const word = args[0] || "yes";
      addLines(Array.from({ length: 10 }, (_, i) => ({
        kind: "out" as const,
        text: `  ${Array(8).fill(word).join(" ")}`,
        color: i % 2 === 0 ? "green" as const : "dim" as const,
      })));
      addLines([{ kind: "out", text: "  ^C (killed)", color: "red" }, { kind: "blank" }]);
      return;
    }

    // Easter egg: exit / logout
    if (cmd === "exit" || cmd === "logout") {
      addLines([
        { kind: "out", text: "  logout", color: "dim" },
        { kind: "out", text: "  Connection to soham.dev closed.", color: "dim" },
        { kind: "blank" },
        { kind: "out", text: "  ...psych. You can't leave 😄", color: "amber" },
        { kind: "blank" },
      ]);
      return;
    }

    // Easter egg: echo
    if (cmd === "echo") {
      addLines([
        { kind: "out", text: `  ${args.join(" ")}`, color: "default" },
        { kind: "blank" },
      ]);
      return;
    }

    // Registered command
    if (commandMap[cmd]) {
      const result = commandMap[cmd](args);
      pushOutput(result);
      addLines([{ kind: "blank" }]);
      return;
    }

    // Unknown
    addLines([
      { kind: "out", text: `  command not found: ${cmd}`, color: "red" },
      { kind: "out", text: `  Type 'help' to see available commands.`, color: "dim" },
      { kind: "blank" },
    ]);
  }, [commandMap, username, addLines, pushOutput, matrixCounter, hackCounter]);

  /* ── Keyboard handler ───────────────────────────────── */
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      down("Enter");
      setTimeout(() => { up("Enter"); runCommand(input); setInput(""); }, 40);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistIdx(i => {
        const next = Math.min(i + 1, history.length - 1);
        setInput(history[next] ?? "");
        return next;
      });
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistIdx(i => {
        const next = Math.max(i - 1, -1);
        setInput(next === -1 ? "" : (history[next] ?? ""));
        return next;
      });
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const allCmds = [
        ...Object.keys(commandMap),
        "clear", "matrix", "hack", "coffee", "neofetch", "git log",
        "ping", "yes", "echo", "exit", "sudo rm -rf /",
      ];
      const match = allCmds.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
      return;
    }
    // Play key sound for printable chars
    if (e.key.length === 1) {
      down(e.key);
      setTimeout(() => up(e.key), 60);
    }
  }, [input, history, commandMap, down, up, runCommand]);

  /* ── Prompt ─────────────────────────────────────────── */
  const Prompt = ({ user }: { user?: string }) => (
    <span className="text-neutral-500 select-none">
      <span className="text-sky-500">{user ?? username}</span>
      <span className="text-emerald-600">:</span>
      <span className="text-sky-400">~</span>
      <span className="text-neutral-500">$</span>{" "}
    </span>
  );

  /* ── Render ─────────────────────────────────────────── */
  return (
    // biome-ignore lint: click wrapper focuses input
    <div
      className={cn("mx-auto w-full font-mono text-xs", className)}
      onClick={focusInput}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 shadow-2xl">

        {/* Title bar */}
        <div className="flex shrink-0 items-center gap-2 bg-neutral-800 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="text-xs text-neutral-400">{username} — bash</span>
            {autoMode && (
              <span className="inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-400 animate-pulse">
                AUTO
              </span>
            )}
          </div>
          <div className="w-[52px]" />
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className={cn(
            "flex-1 overflow-y-auto p-4 leading-relaxed",
            fullHeight ? "h-[calc(100vh-48px)]" : "h-80",
          )}
        >
          {lines.map((line, i) => {
            if (line.kind === "blank") {
              // biome-ignore lint/suspicious/noArrayIndexKey: stable append-only log index
              return <div key={i} className="h-3" />;
            }
            if (line.kind === "matrix") {
              // biome-ignore lint/suspicious/noArrayIndexKey: stable append-only log index
              return <div key={i} className="whitespace-pre-wrap"><MatrixLine /></div>;
            }
            if (line.kind === "hack") {
              // biome-ignore lint/suspicious/noArrayIndexKey: stable append-only log index
              return <div key={i} className="whitespace-pre-wrap"><HackLine /></div>;
            }
            if (line.kind === "cmd") {
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: stable append-only log index
                <div key={i} className="whitespace-pre-wrap">
                  <Prompt user={line.user} />
                  <Highlighted text={line.text} />
                </div>
              );
            }
            // output
            const cls = line.color ? COLOR_CLASS[line.color] : "text-neutral-400";
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: stable append-only log index
              <div key={i} className={cn("whitespace-pre-wrap", cls)}>
                {renderTextWithLinks(line.text)}
              </div>
            );
          })}

          {/* Intro typing animation */}
          {introPhase === "typing" && (
            <div className="whitespace-pre-wrap">
              <Prompt />
              <Highlighted text={introCurrentText} />
              <span className="ml-0.5 inline-block h-4 w-2 bg-neutral-300 align-middle" />
            </div>
          )}

          {/* Auto mode typing animation */}
          {autoMode && autoPhase === "typing" && (
            <div className="whitespace-pre-wrap">
              <Prompt />
              <Highlighted text={autoText} />
              <span className="ml-0.5 inline-block h-4 w-2 bg-amber-400 align-middle" />
            </div>
          )}

          {/* Auto mode idle cursor (between commands) */}
          {autoMode && autoPhase === "pausing" && (
            <>
              <div className="whitespace-pre-wrap">
                <Prompt />
                <span className={cn("inline-block h-4 w-2 bg-amber-400 align-middle", !cursorOn && "opacity-0")} />
              </div>
              <div className="mt-1 text-[11px] text-amber-500/60 italic pl-1">
                ▶ Auto Tour running — press any key to take control
              </div>
            </>
          )}

          {/* Interactive input */}
          {interactive && (
            <div className="flex items-center whitespace-pre-wrap">
              <Prompt />
              <span className="text-neutral-300">
                <Highlighted text={input} />
              </span>
              <span
                className={cn(
                  "ml-px inline-block h-4 w-2 bg-emerald-400 align-middle transition-opacity duration-75",
                  !cursorOn && "opacity-0",
                )}
              />
              {/* Hidden real input for keyboard capture */}
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
            </div>
          )}

          {/* Idle cursor during intro pauses */}
          {!interactive && (introPhase === "done" || introPhase === "pausing" || introPhase === "outputting") && (
            <div className="whitespace-pre-wrap">
              <Prompt />
              <span className={cn("inline-block h-4 w-2 bg-neutral-300 align-middle", !cursorOn && "opacity-0")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
