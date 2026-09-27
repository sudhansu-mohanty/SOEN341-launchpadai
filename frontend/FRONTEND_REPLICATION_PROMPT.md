# Full Frontend Replication Prompt

Copy everything below this line and paste it to your agent in the other project.

---

I need you to build the complete frontend for a project inside the `frontend/` directory. This is an AI-powered resume scoring app called "LaunchPad". The frontend is built with Next.js 14, TypeScript, Tailwind CSS v4, and uses Three.js for a pulsating shader background animation in the hero section. The design is dark/black themed with white and zinc accent colors, no bright colors except for the brand lime green in the logo SVGs.

## Step 1: Initialize the Next.js project

Run this in the project root:

```bash
npx create-next-app@14 frontend --typescript --app --use-npm
```

When prompted:
- ESLint: Yes
- Tailwind CSS: No (we install v4 manually)
- `src/` directory: Yes
- App Router: Yes
- Import alias: Yes, use `@/*`

## Step 2: Install exact dependencies

```bash
cd frontend
npm install next@14.2.5 react@18.2.0 react-dom@18.2.0 clsx@^2.1.1 lucide-react@^1.0.1 motion@^12.38.0 tailwind-merge@^3.5.0 three@^0.183.2 @types/three@^0.183.1
npm install -D tailwindcss@^4.2.2 @tailwindcss/postcss@^4.2.2 postcss@^8.5.8 autoprefixer@^10.4.27
```

## Step 3: Create all config files

Delete any default files that were generated (default page.tsx, layout.tsx, globals.css, page.module.css, favicon.ico, etc), then create the following:

### `frontend/next.config.mjs`
```js
/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

### `frontend/postcss.config.mjs`
```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### `frontend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Step 4: Create directory structure

```bash
mkdir -p src/app/score
mkdir -p src/components/ui
mkdir -p src/context
mkdir -p src/lib
mkdir -p public
```

## Step 5: Create all source files

Create every file below with EXACTLY the content shown. Do not modify, simplify, or skip any file.

---

### `frontend/src/lib/utils.ts`
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### `frontend/src/context/ScoreContext.tsx`

This is the global state context for resume score data. It includes mock data for development/demo purposes.

```tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ScoreData = {
  filename: string;
  score: number;
  skills_score: number;
  experience_score: number;
  projects_score: number;
  education_score: number;
  impact_score: number;
  formatting_score: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  highlights: string[];
  analysis: {
    email: string | null;
    phone: string | null;
    skills: string[];
    experience_preview: string;
    education_preview: string;
  };
  structured_resume: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    education: unknown[];
    experience: unknown[];
    certification: unknown[];
  };
  raw_text: string;
};

type ScoreContextType = {
  data: ScoreData | null;
  setData: (data: ScoreData) => void;
};

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

// TODO: Remove mock data before production
const MOCK_DATA: ScoreData = {
  filename: "Sudhansu_Mohanty_Resume.pdf",
  score: 74,
  skills_score: 21,
  experience_score: 18,
  projects_score: 16,
  education_score: 8,
  impact_score: 5,
  formatting_score: 6,
  strengths: [
    "Strong technical skill set with modern web technologies",
    "Clear section hierarchy — easy for ATS parsers to read",
    "Relevant project experience demonstrates hands-on ability",
    "Education section is well-structured with GPA included",
  ],
  weaknesses: [
    "Bullet points lack quantified impact — add metrics like % improvement or user counts",
    "No summary or objective statement at the top",
    "Work experience section could use stronger action verbs",
    "Missing keywords for target roles — tailor to each job description",
    "Certifications section is empty — add relevant ones if available",
  ],
  summary: "Resume extracted and analyzed successfully.",
  highlights: [
    "Email detected: sudhansu@example.com",
    "Phone detected: +1 555-123-4567",
    "Resume content successfully parsed",
  ],
  analysis: {
    email: "sudhansu@example.com",
    phone: "+1 555-123-4567",
    skills: ["python", "react", "node", "typescript", "docker", "aws", "sql"],
    experience_preview:
      "software engineer at techcorp inc. developed and maintained full-stack web applications using react, node.js, and postgresql...",
    education_preview:
      "bachelor of technology in computer science, xyz university, 2020. gpa: 3.7/4.0",
  },
  structured_resume: {
    name: "Sudhansu Mohanty",
    email: "sudhansu@example.com",
    phone: "+1 555-123-4567",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Redis",
      "Git",
      "Tailwind CSS",
    ],
    education: [
      {
        degree: "Bachelor of Technology in Computer Science",
        institution: "XYZ University",
        year: "2018 – 2022",
      },
    ],
    experience: [
      {
        title: "Software Engineer",
        company: "TechCorp Inc.",
        duration: "Jun 2022 – Present",
        description:
          "Developed and maintained full-stack web applications serving 50k+ monthly users.",
        responsibilities: [
          "Built RESTful APIs with FastAPI and Node.js, reducing response times by 40%",
          "Designed and implemented React-based dashboards for internal analytics",
          "Set up CI/CD pipelines with GitHub Actions and Docker",
          "Collaborated with product and design teams in agile sprints",
        ],
      },
      {
        title: "Frontend Developer Intern",
        company: "StartupXYZ",
        duration: "Jan 2022 – May 2022",
        description:
          "Contributed to the customer-facing web app during a high-growth phase.",
        responsibilities: [
          "Implemented responsive UI components with React and Tailwind CSS",
          "Integrated third-party APIs for payment and notification services",
          "Participated in code reviews and pair programming sessions",
        ],
      },
    ],
    certification: [
      "AWS Cloud Practitioner",
      "Meta Front-End Developer Certificate",
    ],
  },
  raw_text: "",
};

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ScoreData | null>(MOCK_DATA);
  return (
    <ScoreContext.Provider value={{ data, setData }}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const ctx = useContext(ScoreContext);
  if (!ctx) throw new Error("useScore must be used within ScoreProvider");
  return ctx;
}
```

---

### `frontend/src/app/globals.css`

This is the global stylesheet. It uses Tailwind CSS v4's `@import "tailwindcss"` syntax and `@theme` block for design tokens. It also defines all keyframe animations used throughout the app.

```css
@import "tailwindcss";

/* --- Theme --- */
@theme {
  --font-sans: var(--font-dm-sans), "Helvetica Neue", Helvetica, Arial, sans-serif;
  --color-background: #000000;
  --color-surface: #0a0a0a;
  --color-surface-2: #111111;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-mid: rgba(255, 255, 255, 0.14);
  --color-border-strong: rgba(255, 255, 255, 0.22);
  --color-text: #ffffff;
  --color-text-2: #a1a1aa;
  --color-text-3: #52525b;
  --color-accent: #ffffff;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

/* --- Reset & Base --- */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 21px;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #000000;
  color: #ffffff;
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 3px;
  border-radius: 4px;
}

/* --- Keyframes --- */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-down {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.4); }
  50%      { box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes scan {
  0%   { left: -70%; }
  100% { left: 120%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-8px); }
}
```

---

### `frontend/src/app/layout.tsx`

Root layout. Uses DM Sans from Google Fonts. Wraps the entire app in the ScoreProvider context.

```tsx
import "./globals.css";
import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import { ScoreProvider } from "@/context/ScoreContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "LaunchPad — AI Resume Feedback",
  description:
    "Get ATS-style scoring and clarity feedback on your resume in seconds. Built for fast, recruiter-ready iteration.",
  openGraph: {
    title: "LaunchPad — AI Resume Feedback",
    description:
      "Upload your resume and get ATS scoring, keyword gaps, and clarity improvements instantly.",
    type: "website",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="bg-black text-white antialiased">
        <ScoreProvider>{children}</ScoreProvider>
      </body>
    </html>
  );
}
```

---

### `frontend/src/components/ui/shader-animation.tsx`

This is a full-screen Three.js WebGL shader animation used as the hero section background. It creates a pulsating, colorful concentric ring effect on a black background. It uses raw GLSL vertex and fragment shaders rendered onto a full-screen plane.

```tsx
"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: any
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }

        gl_FragColor = vec4(color[0],color[1],color[2],1.0);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)

    container.appendChild(renderer.domElement)

    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    animate()

    return () => {
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-screen"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  )
}
```

---

### `frontend/src/components/ui/glowing-effect.tsx`

This is a mouse-tracking glow border effect component. It uses `motion/react` for smooth angle animation and creates a colorful conic gradient glow that follows the cursor around card borders. It's used on almost every card/section throughout the app.

```tsx
"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { animate } from "motion/react";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}
const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                  : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
                radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
                radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),
                radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #dd7bbb 0%,
                  #d79f1e calc(25% / var(--repeating-conic-gradient-times)),
                  #5a922c calc(50% / var(--repeating-conic-gradient-times)),
                  #4c7894 calc(75% / var(--repeating-conic-gradient-times)),
                  #dd7bbb calc(100% / var(--repeating-conic-gradient-times))
                )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
```

---

### `frontend/src/components/Navbar.tsx`

Sticky top navbar with scroll-triggered blur/border effect. Links include "Resume Builder", "ATS Analysis", "Pricing", and a "Try for free" CTA button. Brand name is "LaunchPad" with "Pad" in zinc-400.

```tsx
"use client";

import { useEffect, useState } from "react";

const links = [
  { label: "Resume Builder", href: "#" },
  { label: "ATS Analysis", href: "#upload" },
  { label: "Pricing", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ animation: "fade-down 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a
          href="/"
          className="text-lg font-extrabold tracking-tight text-white no-underline"
        >
          Launch<span className="text-zinc-400">Pad</span>
        </a>

        <div className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium tracking-tight text-zinc-500 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#upload"
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
        >
          Try for free
        </a>
      </nav>
    </header>
  );
}
```

---

### `frontend/src/components/HeroSection.tsx`

Full-viewport hero section with the Three.js ShaderAnimation as the background. Left side has the headline "Your resume, recruiter-ready." with a CTA button. Right side (desktop only) shows a floating score preview card that cycles through random scores every 3.5 seconds with animated progress bars. The card floats up and down with a CSS animation.

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShaderAnimation } from "@/components/ui/shader-animation";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSnapshot() {
  const score = randomBetween(62, 96);
  return {
    score,
    metrics: [
      { label: "Structure", value: randomBetween(60, 99) },
      { label: "Keywords", value: randomBetween(55, 95) },
      { label: "Clarity", value: randomBetween(65, 99) },
      { label: "Impact", value: randomBetween(58, 96) },
    ],
  };
}

const INITIAL = generateSnapshot();

export default function HeroSection() {
  const [displayScore, setDisplayScore] = useState(0);
  const [target, setTarget] = useState(INITIAL);
  const [metrics, setMetrics] = useState(INITIAL.metrics.map(() => 0));
  const [barsReady, setBarsReady] = useState(false);
  const rafRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const animateTo = useCallback((snapshot: ReturnType<typeof generateSnapshot>) => {
    const duration = 1200;
    const start = performance.now();
    const fromScore = displayScore;
    const fromMetrics = [...metrics];

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      setDisplayScore(Math.round(fromScore + (snapshot.score - fromScore) * eased));
      setMetrics(
        snapshot.metrics.map((m, i) =>
          Math.round(fromMetrics[i] + (m.value - fromMetrics[i]) * eased)
        )
      );

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [displayScore, metrics]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBarsReady(true);
      animateTo(INITIAL);
    }, 600);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = generateSnapshot();
      setTarget(next);
      animateTo(next);
    }, 3500);

    return () => clearInterval(intervalRef.current);
  }, [animateTo]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <ShaderAnimation />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />

      <div className="relative z-10 flex h-full items-center justify-center px-5">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div
            className="max-w-xl"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
          >
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your resume,
              <br />
              <span className="text-zinc-400">recruiter-ready.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed tracking-tight text-zinc-300 sm:text-lg">
              Get ATS-style scoring and clarity feedback in seconds — so your
              resume is easier to scan and easier to shortlist.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="#upload"
                className="rounded-lg bg-white px-6 py-3 text-sm font-bold tracking-tight text-black transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/20"
              >
                Analyze my resume
              </a>
              <span className="text-sm tracking-tight text-zinc-500">Free · No signup</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["No credit card", "ATS-friendly insights", "Results in seconds"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-md border border-white/10 px-3 py-1 text-xs tracking-tight text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-300"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div
            className="relative hidden lg:block"
            style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
          >
            <div style={{ animation: "float 7s ease-in-out 2s infinite" }}>
              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 shadow-2xl shadow-white/5 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full bg-white"
                      style={{ animation: "pulse-ring 2.4s ease-in-out 2.5s infinite" }}
                    />
                    <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                      LaunchPad Score
                    </span>
                  </div>
                  <span className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
                    {displayScore}
                    <span className="text-base font-medium text-zinc-500">/100</span>
                  </span>
                </div>

                <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-white"
                    style={{
                      width: barsReady ? `${target.score}%` : "0%",
                      transition: "width 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>

                <div className="space-y-3">
                  {target.metrics.map((metric, i) => (
                    <div key={metric.label}>
                      <div className="mb-1.5 flex justify-between">
                        <span className="text-xs tracking-tight text-zinc-400">{metric.label}</span>
                        <span className="text-xs tracking-tight text-zinc-400 tabular-nums">{metrics[i]}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-white"
                          style={{
                            width: barsReady ? `${metric.value}%` : "0%",
                            transition: `width 1200ms cubic-bezier(0.16, 1, 0.3, 1)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed tracking-tight text-zinc-400">
                  Strong keyword coverage. Improve bullet impact for top-quartile shortlisting.
                </p>
              </div>

              <div className="absolute -right-3 -bottom-3 flex items-center gap-2 rounded-lg border border-white/15 bg-black/80 px-3 py-2 shadow-xl backdrop-blur-md">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-white"
                  style={{ animation: "pulse-ring 2.4s ease-in-out 3s infinite" }}
                />
                <span className="text-xs font-semibold tracking-wider text-white">
                  ATS-optimized
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
```

---

### `frontend/src/components/ResumeUploader.tsx`

Drag-and-drop PDF upload form. Validates PDF MIME type. POSTs to the backend API at `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`). On success, stores the result in ScoreContext and navigates to `/score`. Shows a spinner while uploading and error messages on failure.

```tsx
"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScoreResult } from "./ScoreCard";
import { useScore, ScoreData } from "@/context/ScoreContext";

type Props = {
  onResult: (result: ScoreResult) => void;
  onError: (message: string) => void;
  onScored?: (result: ScoreResult) => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const API_URL = `${API_BASE}/resume/extract`;

type Status = "idle" | "dragging" | "uploading" | "error";

export default function ResumeUploader({ onResult, onError, onScored }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { setData } = useScore();

  const setError = (message: string) => {
    setStatus("error");
    setErrorMessage(message);
    onError(message);
  };

  const validatePdf = (candidate: File | null): candidate is File => {
    if (!candidate) {
      setError("Please select one PDF file.");
      return false;
    }
    const nameLooksPdf = candidate.name.toLowerCase().endsWith(".pdf");
    const isPdfType = candidate.type === "application/pdf";
    if (!isPdfType && !nameLooksPdf) {
      setError("Only PDF files are allowed.");
      return false;
    }
    return true;
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null;
    if (!validatePdf(picked)) return;
    setFile(picked);
    setStatus("idle");
    setErrorMessage("");
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (status !== "uploading") setStatus("dragging");
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (status !== "uploading") setStatus(errorMessage ? "error" : "idle");
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (status === "uploading") return;
    const dropped = event.dataTransfer.files?.[0] ?? null;
    if (!validatePdf(dropped)) return;
    setFile(dropped);
    setStatus("idle");
    setErrorMessage("");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validatePdf(file)) return;
    const formData = new FormData();
    formData.append("file", file);

    setStatus("uploading");
    setErrorMessage("");
    let hasError = false;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ detail: "Upload failed" }));
        setError(payload.detail ?? "Upload failed");
        hasError = true;
        return;
      }
      const raw = await response.json();

      const payload: ScoreResult = {
        filename: raw.filename,
        total_score: raw.score,
        summary: raw.summary,
        strengths: raw.strengths || [],
        weaknesses: raw.weaknesses || [],
        categories: {
          skills: raw.skills_score,
          experience: raw.experience_score,
          projects: raw.projects_score,
          education: raw.education_score,
          impact: raw.impact_score,
          formatting: raw.formatting_score,
        },
      };

      setData(raw as ScoreData);
      onResult(payload);
      onScored?.(payload);
      setStatus("idle");
      router.push("/score");
    } catch {
      setError("Scoring service is currently unavailable. You can continue in demo mode.");
      hasError = true;
    } finally {
      if (!hasError) setStatus("idle");
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label htmlFor="resume" className="text-sm font-semibold tracking-tight text-white">
        Resume PDF
      </label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (status !== "uploading") inputRef.current?.click();
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`cursor-pointer rounded-xl border border-dashed p-8 text-center transition-all ${
          status === "dragging"
            ? "border-white/40 bg-white/5 shadow-lg shadow-white/5"
            : "border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
        } ${status === "uploading" ? "pointer-events-none opacity-50" : ""}`}
      >
        <input
          ref={inputRef}
          id="resume"
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          disabled={status === "uploading"}
          className="hidden"
        />

        <div className="mb-3 text-zinc-600">
          <svg className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="text-sm tracking-tight text-zinc-300">
          {file ? file.name : "Click to upload or drag and drop"}
        </p>
        <p className="mt-1 text-xs tracking-tight text-zinc-600">PDF only, one file at a time</p>
      </div>

      <button
        type="submit"
        disabled={status === "uploading"}
        className="rounded-lg bg-white px-5 py-3 text-sm font-bold tracking-tight text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "uploading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Scoring...
          </span>
        ) : (
          "Upload and Score"
        )}
      </button>

      {status === "error" && errorMessage && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm tracking-tight text-red-300">
          {errorMessage}
        </div>
      )}
    </form>
  );
}
```

---

### `frontend/src/components/ScoreCard.tsx`

Displays the score result after uploading. Shows a total score with an animated counter, a gradient progress bar, and a breakdown of 6 categories (Skills, Experience, Projects, Education, Impact, Formatting) each with their own animated bars and color-coded status dots (white = good, zinc-400 = warn, zinc-600 = bad).

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export type ScoreResult = {
  filename: string;
  total_score: number;
  categories: {
    skills: number;
    experience: number;
    projects: number;
    education: number;
    impact: number;
    formatting: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
};

type Props = {
  result: ScoreResult;
};

type BreakdownItem = {
  label: string;
  value: number;
  max: number;
  status: "good" | "warn" | "bad";
};

function buildBreakdown(categories: ScoreResult["categories"]): BreakdownItem[] {
  const items: { label: string; value: number; max: number }[] = [
    { label: "Skills", value: categories.skills, max: 20 },
    { label: "Experience", value: categories.experience, max: 20 },
    { label: "Projects", value: categories.projects, max: 20 },
    { label: "Education", value: categories.education, max: 20 },
    { label: "Impact", value: categories.impact, max: 10 },
    { label: "Formatting", value: categories.formatting, max: 10 },
  ];

  return items.map((item) => {
    const ratio = item.value / item.max;
    const status = ratio >= 0.7 ? "good" : ratio >= 0.45 ? "warn" : "bad";
    return {
      ...item,
      value: Math.max(0, Math.min(item.max, item.value)),
      status,
    };
  });
}

const statusDot = {
  good: "bg-white",
  warn: "bg-zinc-400",
  bad: "bg-zinc-600",
} as const;

const statusBar = {
  good: "bg-white",
  warn: "bg-zinc-400",
  bad: "bg-zinc-600",
} as const;

export default function ScoreCard({ result }: Props) {
  const total = Math.max(0, Math.min(100, result.total_score));
  const [displayScore, setDisplayScore] = useState(0);
  const [barsReady, setBarsReady] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setDisplayScore(0);
    setBarsReady(false);

    const timeout = setTimeout(() => {
      setBarsReady(true);
      const duration = 900;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayScore(Math.round(eased * total));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 80);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [total]);

  const breakdown = buildBreakdown(result.categories);

  return (
    <section className="mt-6 grid gap-4">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold tracking-tight text-white">Your LaunchPad Score</h2>
        <p className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
          {displayScore}
          <span className="text-base font-medium text-zinc-600">/100</span>
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-white"
          style={{
            width: barsReady ? `${total}%` : "0%",
            transition: "width 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      <div className="space-y-2">
        {breakdown.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
            style={{
              animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.08}s both`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${statusDot[item.status]}`} />
              <span className="text-sm tracking-tight text-zinc-300">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1 w-16 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full ${statusBar[item.status]}`}
                  style={{
                    width: barsReady ? `${(item.value / item.max) * 100}%` : "0%",
                    transition: `width 700ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + index * 100}ms`,
                  }}
                />
              </div>
              <span className="w-10 text-right text-xs tracking-tight text-zinc-500 tabular-nums">
                {item.value}/{item.max}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed tracking-tight text-zinc-400">{result.summary}</p>

      <p className="text-xs tracking-tight text-zinc-600">
        Tip: strengthen role-specific keywords to improve ATS relevance.
      </p>
    </section>
  );
}
```

---

### `frontend/src/components/RecruiterShowcase.tsx`

An animated showcase section titled "See Your Resume Through a Recruiter Lens". Contains a mock resume preview card with shimmer-animated placeholder lines and a scan line animation. Three floating info cards appear on scroll using IntersectionObserver. Uses scoped `<style jsx>` for the float-card reveal transitions.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function RecruiterShowcase() {
  const showcaseRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = showcaseRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative rounded-2xl border border-white/[0.08] p-1">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <div ref={showcaseRef} className="showcase group relative rounded-xl border border-white/5 bg-black p-6 text-center sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          See Your Resume Through a Recruiter Lens
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm tracking-tight text-zinc-500 sm:text-base">
          A preview-first review layer highlights fit, structure, and role alignment before your
          resume reaches a hiring team.
        </p>

        <div className="relative mx-auto mt-8 max-w-3xl" style={{ minHeight: "320px" }}>
          <div className="preview relative mx-auto w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-black/60 p-5 text-left backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-tight text-zinc-400">
                Candidate Preview
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold tracking-tight text-black">
                82 Match
              </span>
            </div>

            {[94, 72, 48, 94, 72, 48].map((w, i) => (
              <div
                key={i}
                className={`mb-2 h-2 rounded-full ${i === 3 ? "mt-4" : ""}`}
                style={{
                  width: `${w}%`,
                  background: "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.12) 100%)",
                  backgroundSize: "200% auto",
                  animation: "shimmer 3.5s ease-in-out infinite",
                }}
              />
            ))}

            <div
              className="pointer-events-none absolute top-0 left-0 h-full w-[45%]"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                animation: "scan 4.5s ease-in-out 1.2s infinite",
              }}
            />
          </div>

          <div className="float-card absolute top-2 left-0 w-48 rounded-xl border border-white/10 bg-black/80 p-3 text-left shadow-xl backdrop-blur-md max-lg:static max-lg:mt-3 max-lg:w-full">
            <span className="mb-2 inline-block h-2.5 w-2.5 rounded-full bg-white" />
            <h3 className="mb-1 text-sm font-semibold tracking-tight text-white">Top Skills Detected</h3>
            <p className="text-xs leading-relaxed tracking-tight text-zinc-500">
              Product strategy, cross-functional execution, stakeholder updates.
            </p>
          </div>

          <div className="float-card absolute top-28 right-0 w-48 rounded-xl border border-white/10 bg-black/80 p-3 text-left shadow-xl backdrop-blur-md max-lg:static max-lg:mt-3 max-lg:w-full" style={{ transitionDelay: "100ms" }}>
            <span className="mb-2 inline-block h-2.5 w-2.5 rounded-full bg-white" />
            <h3 className="mb-1 text-sm font-semibold tracking-tight text-white">ATS Readability</h3>
            <p className="text-xs leading-relaxed tracking-tight text-zinc-500">
              Section hierarchy and keyword signals are clearly parsed.
            </p>
          </div>

          <div className="float-card absolute right-12 bottom-1 w-52 rounded-xl border border-white/10 bg-black/80 p-3 text-left shadow-xl backdrop-blur-md max-lg:static max-lg:mt-3 max-lg:w-full" style={{ transitionDelay: "200ms" }}>
            <h4 className="mb-2 text-sm font-semibold tracking-tight text-white">Need stronger impact?</h4>
            <button
              type="button"
              className="w-full rounded-lg bg-white px-3 py-2 text-xs font-bold tracking-tight text-black transition-all hover:bg-zinc-200"
            >
              Generate stronger bullets
            </button>
          </div>
        </div>

        <style jsx>{`
          .float-card {
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 420ms ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease;
          }
          .showcase.in-view .float-card {
            opacity: 1;
            transform: translateY(0);
          }
          .showcase.in-view .float-card:hover {
            transform: translateY(-4px);
            border-color: rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </div>
    </div>
  );
}
```

---

### `frontend/src/components/Faq.tsx`

FAQ accordion section with 5 questions. Only one item open at a time. Uses a "+" icon that rotates 45 degrees to become an "x" when expanded. Smooth max-height transition for open/close.

```tsx
"use client";

import { useState } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const items = [
  {
    q: "How accurate is the ATS score?",
    a: "The score estimates ATS readiness using structure, keyword relevance, and clarity signals. It is directional, not a hiring guarantee.",
  },
  {
    q: "Do you store my resume data?",
    a: "Uploaded resumes are processed for analysis, and you can choose to remove saved data from your workspace at any time.",
  },
  {
    q: "Can I target a specific role?",
    a: "Yes. You can tune wording and keyword focus for a role so the feedback emphasizes role-fit signals recruiters usually scan for.",
  },
  {
    q: "What file formats are supported?",
    a: "The analyzer currently supports PDF uploads to preserve layout consistency and improve parsing reliability.",
  },
  {
    q: "How fast is the analysis?",
    a: "Most resumes return a scored breakdown and summary in seconds, depending on file complexity and API availability.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="relative rounded-2xl border border-white/[0.08] p-1">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <section className="relative rounded-xl border border-white/5 bg-black p-6 sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Frequently asked questions
        </h2>

        <div className="mt-6 space-y-3">
          {items.map((item, index) => {
            const expanded = openIndex === index;
            return (
              <article
                key={item.q}
                className={`overflow-hidden rounded-xl border transition-colors ${
                  expanded ? "border-white/15 bg-white/[0.03]" : "border-white/5 bg-transparent hover:border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(expanded ? null : index)}
                  aria-expanded={expanded}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold tracking-tight text-white">{item.q}</span>
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-lg text-zinc-500 transition-transform duration-300"
                    style={{
                      transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    +
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: expanded ? "200px" : "0",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed tracking-tight text-zinc-500">
                    {item.a}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
```

---

### `frontend/src/components/Footer.tsx`

Simple footer with the LaunchPad brand, a tagline, nav links (Product, Pricing, Privacy, Contact), and a copyright line.

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-8 pb-10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-white">
            Launch<span className="text-zinc-500">Pad</span>
          </p>
          <p className="mt-1 text-sm tracking-tight text-zinc-600">
            AI resume feedback built for fast, recruiter-ready iteration.
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {["Product", "Pricing", "Privacy", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="rounded-md px-3 py-1 text-sm tracking-tight text-zinc-600 transition-colors hover:text-zinc-300"
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-2 sm:flex-row">
        <p className="text-xs tracking-tight text-zinc-700">&copy; 2026 LaunchPad Resume AI</p>
        <p className="text-xs tracking-tight text-zinc-700">Built for confident applications.</p>
      </div>
    </footer>
  );
}
```

---

### `frontend/src/app/page.tsx`

The main landing page. Composes all sections: Navbar, HeroSection (with shader background), "How it works" 3-step cards with GlowingEffect borders, the ResumeUploader upload section, RecruiterShowcase, FAQ, a CTA section, and Footer. All wrapped in a `max-w-5xl` container with dividers between sections.

```tsx
"use client";

import { useState } from "react";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import RecruiterShowcase from "../components/RecruiterShowcase";
import ResumeUploader from "../components/ResumeUploader";
import ScoreCard, { ScoreResult } from "../components/ScoreCard";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function HomePage() {
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [, setError] = useState<string>("");

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <HeroSection />

      <div className="relative z-10 mx-auto max-w-5xl px-5 divide-y divide-white/[0.06]">
        {/* How it works */}
        <section className="py-10">
          <span className="mb-3 block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            How it works
          </span>
          <h2 className="mb-10 max-w-md text-2xl font-bold tracking-tight text-white sm:text-3xl">
            From upload to recruiter-ready in three steps
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload resume",
                detail: "Drop in your PDF and run an instant ATS-style check.",
              },
              {
                step: "02",
                title: "Review score",
                detail: "See strengths, gaps, and role-fit issues recruiters scan first.",
              },
              {
                step: "03",
                title: "Apply fixes",
                detail: "Use guided recommendations to improve clarity and impact fast.",
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-white/[0.08] p-1">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={3}
                />
                <div className="relative rounded-xl border border-white/5 bg-black p-6">
                  <span className="mb-4 block text-4xl font-extrabold tracking-tight text-zinc-800">
                    {item.step}
                  </span>
                  <h3 className="mb-2 text-sm font-semibold tracking-tight text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed tracking-tight text-zinc-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upload section */}
        <section id="upload" className="py-10">
          <div className="relative rounded-2xl border border-white/[0.08] p-1">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <div className="relative rounded-xl border border-white/5 bg-black p-6 sm:p-8">
              <ResumeUploader
                onResult={(next) => {
                  setResult(next);
                  setError("");
                }}
                onError={(message) => {
                  setResult(null);
                  setError(message);
                }}
              />
              {result && <ScoreCard result={result} />}
            </div>
          </div>
        </section>

        {/* Recruiter showcase */}
        <section className="py-10">
          <RecruiterShowcase />
        </section>

        {/* FAQ */}
        <section className="py-10">
          <Faq />
        </section>

        {/* CTA */}
        <section className="py-10">
          <div className="relative rounded-2xl border border-white/[0.08] p-1">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={3}
            />
            <div className="relative rounded-xl border border-white/5 bg-black bg-gradient-to-br from-white/[0.03] to-transparent p-10 text-center sm:p-14">
              <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
                Ready to ship applications faster
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Make your next resume your strongest one
              </h2>
              <p className="mx-auto mt-3 max-w-lg tracking-tight text-zinc-500">
                Generate clearer bullet points, improve ATS readability, and send resumes with
                confidence.
              </p>
              <a
                href="#upload"
                className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-bold tracking-tight text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/20"
              >
                Start free resume review
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
```

---

### `frontend/src/app/score/page.tsx`

This is the full score results page users are navigated to after uploading a resume. It's a large file with multiple sub-components all in one file:

- **ScoreRing**: SVG radial progress ring with animated counter
- **OverviewTab**: Profile card, score ring, quick stats grid, highlights
- **BreakdownTab**: Score ring + category bars side-by-side, strengths and weaknesses cards
- **ResumeDetailsTab**: Sub-tabbed view (Summary, Experience, Skills, Education) showing parsed resume data
- **ScorePage**: Main page with 3 top-level tabs (Overview, Score Breakdown, Resume Details)

All data comes from the ScoreContext. If no data exists, shows a "No results yet" message with a back link.

```tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useScore } from "@/context/ScoreContext";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Tab = "overview" | "breakdown" | "resume";

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "breakdown", label: "Score Breakdown" },
  { id: "resume", label: "Resume Details" },
];

function useAnimatedNumber(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

function ScoreRing({ score, size = 180 }: { score: number; size?: number }) {
  const displayScore = useAnimatedNumber(score);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#71717a" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold tracking-tight text-white tabular-nums">
          {displayScore}
        </span>
        <span className="text-xs tracking-tight text-zinc-500">/100</span>
      </div>
    </div>
  );
}

function OverviewTab() {
  const { data } = useScore();
  if (!data) return null;

  const profile = data.structured_resume;
  const quickStats = [
    { label: "Skills", value: data.skills_score, max: 25 },
    { label: "Experience", value: data.experience_score, max: 25 },
    { label: "Projects", value: data.projects_score, max: 20 },
    { label: "Formatting", value: data.formatting_score, max: 10 },
  ];

  return (
    <div className="grid gap-4" style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                {(profile?.name?.[0] ?? data.filename?.[0] ?? "?").toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white">
                  {profile?.name || "Candidate"}
                </h3>
                <p className="text-xs tracking-tight text-zinc-500">
                  {profile?.email || data.analysis?.email || "—"}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs tracking-tight text-zinc-400">
              {profile?.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600">Phone</span>
                  <span>{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-zinc-600">File</span>
                <span>{data.filename}</span>
              </div>
            </div>

            {profile?.skills && profile.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {profile.skills.slice(0, 8).map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs tracking-tight text-zinc-400"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 8 && (
                  <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs tracking-tight text-zinc-500">
                    +{profile.skills.length - 8}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative flex flex-col items-center justify-center rounded-xl border border-white/5 bg-black p-6">
            <span className="mb-4 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              LaunchPad Score
            </span>
            <ScoreRing score={data.score} />
            <p className="mt-4 text-center text-sm tracking-tight text-zinc-400">
              {data.score >= 80
                ? "Strong resume — recruiter-ready."
                : data.score >= 60
                  ? "Good foundation — a few improvements will push it higher."
                  : "Needs work — focus on the breakdown to improve."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickStats.map((stat, i) => (
          <div
            key={stat.label}
            className="relative rounded-2xl border border-white/[0.08] p-1"
            style={{ animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.06}s both` }}
          >
            <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
            <div className="relative rounded-xl border border-white/5 bg-black p-4 text-center">
              <p className="text-2xl font-extrabold tracking-tight text-white tabular-nums">
                {stat.value}<span className="text-sm font-medium text-zinc-600">/{stat.max}</span>
              </p>
              <p className="mt-1 text-xs tracking-tight text-zinc-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {data.highlights && data.highlights.length > 0 && (
        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <h3 className="mb-3 text-sm font-semibold tracking-tight text-white">Highlights</h3>
            <div className="space-y-2">
              {data.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm tracking-tight text-zinc-400">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/40" />
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BreakdownTab() {
  const { data } = useScore();
  if (!data) return null;

  const categories = [
    { label: "Skills", value: data.skills_score, max: 25 },
    { label: "Experience", value: data.experience_score, max: 25 },
    { label: "Projects", value: data.projects_score, max: 20 },
    { label: "Education", value: data.education_score, max: 10 },
    { label: "Impact", value: data.impact_score, max: 10 },
    { label: "Formatting", value: data.formatting_score, max: 10 },
  ];

  return (
    <div className="grid gap-4" style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative flex flex-col items-center justify-center rounded-xl border border-white/5 bg-black p-8">
            <ScoreRing score={data.score} size={160} />
            <p className="mt-3 text-xs tracking-tight text-zinc-500">{data.filename}</p>
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-white">Category Scores</h3>
            <div className="space-y-3">
              {categories.map((cat, i) => {
                const ratio = cat.value / cat.max;
                const barColor = ratio >= 0.7 ? "bg-white" : ratio >= 0.45 ? "bg-zinc-400" : "bg-zinc-600";
                const dotColor = ratio >= 0.7 ? "bg-white" : ratio >= 0.45 ? "bg-zinc-400" : "bg-zinc-600";

                return (
                  <div
                    key={cat.label}
                    style={{ animation: `fade-up 0.4s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.07}s both` }}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                        <span className="text-sm tracking-tight text-zinc-300">{cat.label}</span>
                      </div>
                      <span className="text-xs tracking-tight text-zinc-500 tabular-nums">
                        {cat.value}/{cat.max}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{
                          width: `${ratio * 100}%`,
                          transition: `width 800ms cubic-bezier(0.16, 1, 0.3, 1) ${150 + i * 80}ms`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-white">Strengths</h3>
            {data.strengths && data.strengths.length > 0 ? (
              <div className="space-y-2.5">
                {data.strengths.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                    style={{ animation: `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.06}s both` }}
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                      +
                    </span>
                    <span className="text-sm leading-relaxed tracking-tight text-zinc-300">{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm tracking-tight text-zinc-600">No strengths data available.</p>
            )}
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/[0.08] p-1">
          <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
          <div className="relative rounded-xl border border-white/5 bg-black p-6">
            <h3 className="mb-4 text-sm font-semibold tracking-tight text-white">Areas to Improve</h3>
            {data.weaknesses && data.weaknesses.length > 0 ? (
              <div className="space-y-2.5">
                {data.weaknesses.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
                    style={{ animation: `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.06}s both` }}
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400">
                      !
                    </span>
                    <span className="text-sm leading-relaxed tracking-tight text-zinc-300">{w}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm tracking-tight text-zinc-600">No improvement data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type ResumeSubTab = "summary" | "experience" | "skills" | "education";

const resumeSubTabs: { id: ResumeSubTab; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
];

function ResumeDetailsTab() {
  const { data } = useScore();
  const [subTab, setSubTab] = useState<ResumeSubTab>("summary");

  if (!data) return null;

  const profile = data.structured_resume;

  return (
    <div style={{ animation: "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="relative rounded-2xl border border-white/[0.08] p-1">
        <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
        <div className="relative rounded-xl border border-white/5 bg-black p-6">
          <div className="mb-6 flex gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
            {resumeSubTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id)}
                className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-xs font-semibold tracking-tight transition-all ${
                  subTab === t.id
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ animation: "fade-in 0.3s ease both" }} key={subTab}>
            {subTab === "summary" && <SummarySubTab />}
            {subTab === "experience" && <ExperienceSubTab />}
            {subTab === "skills" && <SkillsSubTab />}
            {subTab === "education" && <EducationSubTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummarySubTab() {
  const { data } = useScore();
  if (!data) return null;
  const profile = data.structured_resume;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-white">
          {profile?.name || "Candidate"}
        </h3>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs tracking-tight text-zinc-500">
          {(profile?.email || data.analysis?.email) && (
            <span>{profile?.email || data.analysis?.email}</span>
          )}
          {(profile?.phone || data.analysis?.phone) && (
            <span>{profile?.phone || data.analysis?.phone}</span>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-white/[0.06]" />

      <div>
        <p className="text-sm leading-relaxed tracking-tight text-zinc-400">
          {data.summary}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Skills", count: profile?.skills?.length ?? 0 },
          { label: "Experience", count: Array.isArray(profile?.experience) ? profile.experience.length : 0 },
          { label: "Education", count: Array.isArray(profile?.education) ? profile.education.length : 0 },
          { label: "Certifications", count: Array.isArray(profile?.certification) ? profile.certification.length : 0 },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-center">
            <p className="text-lg font-bold tracking-tight text-white tabular-nums">{item.count}</p>
            <p className="text-xs tracking-tight text-zinc-500">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceSubTab() {
  const { data } = useScore();
  if (!data) return null;
  const entries = data.structured_resume?.experience;

  if (!Array.isArray(entries) || entries.length === 0) {
    return <p className="text-sm tracking-tight text-zinc-600">No experience data parsed.</p>;
  }

  return (
    <div className="space-y-3">
      {(entries as Record<string, unknown>[]).map((entry, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
          style={{ animation: `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
        >
          <h4 className="text-sm font-semibold tracking-tight text-white">
            {String(entry.title || entry.role || entry.position || "Role")}
          </h4>
          <p className="mt-0.5 text-xs tracking-tight text-zinc-500">
            {String(entry.company || entry.organization || "")}
            {entry.duration || entry.dates || entry.date
              ? ` · ${String(entry.duration || entry.dates || entry.date)}`
              : ""}
          </p>
          {entry.description ? (
            <p className="mt-2 text-sm leading-relaxed tracking-tight text-zinc-400">
              {String(entry.description)}
            </p>
          ) : null}
          {Array.isArray(entry.responsibilities) && (
            <ul className="mt-2 space-y-1">
              {(entry.responsibilities as string[]).map((r, j) => (
                <li key={j} className="flex items-start gap-2 text-sm tracking-tight text-zinc-400">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-600" />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillsSubTab() {
  const { data } = useScore();
  if (!data) return null;

  const aiSkills = data.structured_resume?.skills ?? [];
  const detectedSkills = data.analysis?.skills ?? [];

  const allSkills = Array.from(
    new Set([...aiSkills, ...detectedSkills].map((s) => String(s)))
  );

  if (allSkills.length === 0) {
    return <p className="text-sm tracking-tight text-zinc-600">No skills data parsed.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {allSkills.map((skill, i) => (
          <span
            key={skill}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm tracking-tight text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            style={{ animation: `fade-up 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.03}s both` }}
          >
            {skill}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs tracking-tight text-zinc-600">
        {allSkills.length} skill{allSkills.length !== 1 ? "s" : ""} detected across AI parsing and keyword analysis.
      </p>
    </div>
  );
}

function EducationSubTab() {
  const { data } = useScore();
  if (!data) return null;

  const entries = data.structured_resume?.education;
  const certs = data.structured_resume?.certification;

  return (
    <div className="space-y-4">
      {Array.isArray(entries) && entries.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Education</h4>
          {(entries as Record<string, unknown>[]).map((entry, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
              style={{ animation: `fade-up 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
            >
              <h4 className="text-sm font-semibold tracking-tight text-white">
                {String(entry.degree || entry.qualification || entry.title || "Degree")}
              </h4>
              <p className="mt-0.5 text-xs tracking-tight text-zinc-500">
                {String(entry.institution || entry.school || entry.university || "")}
                {entry.year || entry.dates || entry.date
                  ? ` · ${String(entry.year || entry.dates || entry.date)}`
                  : ""}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm tracking-tight text-zinc-600">No education data parsed.</p>
      )}

      {Array.isArray(certs) && certs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Certifications</h4>
          <div className="flex flex-wrap gap-2">
            {certs.map((cert, i) => (
              <span
                key={i}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm tracking-tight text-zinc-300"
              >
                {typeof cert === "string" ? cert : String((cert as Record<string, unknown>).name || cert)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScorePage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { data } = useScore();

  if (!data) {
    return (
      <main className="relative min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">No results yet</h1>
            <p className="mt-2 text-sm tracking-tight text-zinc-500">
              Upload a resume first to see your score.
            </p>
            <a
              href="/"
              className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-bold tracking-tight text-black transition-all hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/20"
            >
              Go back
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />

      <div className="relative z-10 mx-auto max-w-5xl px-5 pt-20 pb-10">
        <div className="mb-6" style={{ animation: "fade-down 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
          <span className="mb-2 block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Resume Analysis
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Your Results
          </h1>
        </div>

        <div
          className="mb-8 flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1"
          style={{ animation: "fade-down 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold tracking-tight transition-all ${
                activeTab === tab.id
                  ? "bg-white text-black shadow-sm shadow-white/10"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div key={activeTab}>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "breakdown" && <BreakdownTab />}
          {activeTab === "resume" && <ResumeDetailsTab />}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm tracking-tight text-zinc-500 transition-colors hover:text-white"
          >
            &larr; Upload another resume
          </a>
        </div>

        <div className="mt-6">
          <Footer />
        </div>
      </div>
    </main>
  );
}
```

---

## Step 6: Create public assets

### `frontend/public/.nojekyll`
Create an empty file (needed for GitHub Pages deployment):
```
```

### `frontend/public/favicon.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="393 78 654 654" preserveAspectRatio="xMidYMid meet">
  <defs>
    <g/>
    <clipPath id="fav-a">
      <path d="M 31 0.519531 L 218 0.519531 L 218 219 L 31 219 Z M 31 0.519531 " clip-rule="nonzero"/>
    </clipPath>
    <clipPath id="fav-b">
      <rect x="0" width="250" y="0" height="250"/>
    </clipPath>
    <clipPath id="fav-c">
      <path d="M 0.441406 1 L 215 1 L 215 216 L 0.441406 216 Z M 0.441406 1 " clip-rule="nonzero"/>
    </clipPath>
    <clipPath id="fav-d">
      <rect x="0" width="246" y="0" height="246"/>
    </clipPath>
  </defs>
  <rect x="393" y="78" width="654" height="654" fill="#0E110E" rx="110"/>
  <path stroke-linecap="butt" transform="matrix(0.75, 0, 0, 0.75, 495.266405, 93.048942)" fill="none" stroke-linejoin="miter" d="M -0.00104041 26.502454 L 599.290656 26.502454 " stroke="#b5d261" stroke-width="53" stroke-opacity="1" stroke-miterlimit="4"/>
  <path stroke-linecap="butt" transform="matrix(0.75, 0, 0, 0.75, 495.266405, 676.553074)" fill="none" stroke-linejoin="miter" d="M -0.00104041 26.502153 L 599.290656 26.502153 " stroke="#ffffff" stroke-width="53" stroke-opacity="1" stroke-miterlimit="4"/>
  <path stroke-linecap="butt" transform="matrix(0, -0.75, 0.75, 0, 455.515687, 677.200306)" fill="none" stroke-linejoin="miter" d="M 0.00144957 26.499918 L 727.017111 26.499918 " stroke="#b5d261" stroke-width="53" stroke-opacity="1" stroke-miterlimit="4"/>
  <path stroke-linecap="butt" transform="matrix(0, -0.75, 0.75, 0, 944.732839, 677.200306)" fill="none" stroke-linejoin="miter" d="M 0.00144957 26.50205 L 727.017111 26.50205 " stroke="#ffffff" stroke-width="53" stroke-opacity="1" stroke-miterlimit="4"/>
  <g transform="matrix(1, 0, 0, 1, 493, 173)">
    <g clip-path="url(#fav-b)">
      <g clip-path="url(#fav-a)">
        <g fill="#ffffff" fill-opacity="1">
          <g transform="translate(0.766407, 249.064118)">
            <g>
              <path d="M 31.03125 -31.03125 L 31.03125 -248.21875 L 93.078125 -248.21875 L 93.078125 -62.0625 L 217.1875 -62.0625 L 217.1875 -31.03125 Z M 31.03125 -31.03125 "/>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
  <g transform="matrix(1, 0, 0, 1, 715, 418)">
    <g clip-path="url(#fav-d)">
      <g clip-path="url(#fav-c)">
        <g fill="#b5d261" fill-opacity="1">
          <g transform="translate(0.49997, 245.774541)">
            <g>
              <path d="M 0 -30.578125 L 0 -244.578125 L 183.4375 -244.578125 L 183.4375 -214 L 214 -214 L 214 -122.28125 L 183.4375 -122.28125 L 183.4375 -91.71875 L 61.140625 -91.71875 L 61.140625 -30.578125 Z M 61.140625 -122.28125 L 152.859375 -122.28125 L 152.859375 -214 L 61.140625 -214 Z M 61.140625 -122.28125 "/>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>
```

### `frontend/public/logo.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="440 78 560 654" preserveAspectRatio="xMidYMid meet">
  <defs>
    <g/>
    <clipPath id="lp-a">
      <path d="M 31 0.519531 L 218 0.519531 L 218 219 L 31 219 Z M 31 0.519531 " clip-rule="nonzero"/>
    </clipPath>
    <clipPath id="lp-b">
      <rect x="0" width="250" y="0" height="250"/>
    </clipPath>
    <clipPath id="lp-c">
      <path d="M 0.441406 1 L 215 1 L 215 216 L 0.441406 216 Z M 0.441406 1 " clip-rule="nonzero"/>
    </clipPath>
    <clipPath id="lp-d">
      <rect x="0" width="246" y="0" height="246"/>
    </clipPath>
  </defs>
  <path stroke-linecap="butt" transform="matrix(0.75, 0, 0, 0.75, 495.266405, 93.048942)" fill="none" stroke-linejoin="miter" d="M -0.00104041 26.502454 L 599.290656 26.502454 " stroke="#b5d261" stroke-width="53" stroke-opacity="1" stroke-miterlimit="4"/>
  <path stroke-linecap="butt" transform="matrix(0.75, 0, 0, 0.75, 495.266405, 676.553074)" fill="none" stroke-linejoin="miter" d="M -0.00104041 26.502153 L 599.290656 26.502153 " stroke="#ffffff" stroke-width="53" stroke-opacity="1" stroke-miterlimit="4"/>
  <path stroke-linecap="butt" transform="matrix(0, -0.75, 0.75, 0, 455.515687, 677.200306)" fill="none" stroke-linejoin="miter" d="M 0.00144957 26.499918 L 727.017111 26.499918 " stroke="#b5d261" stroke-width="53" stroke-opacity="1" stroke-miterlimit="4"/>
  <path stroke-linecap="butt" transform="matrix(0, -0.75, 0.75, 0, 944.732839, 677.200306)" fill="none" stroke-linejoin="miter" d="M 0.00144957 26.50205 L 727.017111 26.50205 " stroke="#ffffff" stroke-width="53" stroke-opacity="1" stroke-miterlimit="4"/>
  <g transform="matrix(1, 0, 0, 1, 493, 173)">
    <g clip-path="url(#lp-b)">
      <g clip-path="url(#lp-a)">
        <g fill="#ffffff" fill-opacity="1">
          <g transform="translate(0.766407, 249.064118)">
            <g>
              <path d="M 31.03125 -31.03125 L 31.03125 -248.21875 L 93.078125 -248.21875 L 93.078125 -62.0625 L 217.1875 -62.0625 L 217.1875 -31.03125 Z M 31.03125 -31.03125 "/>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
  <g transform="matrix(1, 0, 0, 1, 715, 418)">
    <g clip-path="url(#lp-d)">
      <g clip-path="url(#lp-c)">
        <g fill="#b5d261" fill-opacity="1">
          <g transform="translate(0.49997, 245.774541)">
            <g>
              <path d="M 0 -30.578125 L 0 -244.578125 L 183.4375 -244.578125 L 183.4375 -214 L 214 -214 L 214 -122.28125 L 183.4375 -122.28125 L 183.4375 -91.71875 L 61.140625 -91.71875 L 61.140625 -30.578125 Z M 61.140625 -122.28125 L 152.859375 -122.28125 L 152.859375 -214 L 61.140625 -214 Z M 61.140625 -122.28125 "/>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>
```

## Step 7: Verify the build

```bash
cd frontend
npm run build
```

This should complete with `output: "export"` generating a static site in `frontend/out/`.

Then test locally:
```bash
npm run dev
```

Visit http://localhost:3000 — you should see:
1. A pulsating shader animation background in the hero
2. A floating score card on the right cycling through random scores
3. "How it works" section with 3 glowing cards
4. A PDF upload section
5. A recruiter showcase section with floating cards that appear on scroll
6. An FAQ accordion
7. A CTA section and footer

Visit http://localhost:3000/score — you should see the full score results page with mock data (tabs: Overview, Score Breakdown, Resume Details).

## Environment Variables

The frontend reads `NEXT_PUBLIC_API_BASE_URL` which defaults to `http://localhost:8000`. Set this to your backend URL if different.

## Key Design Decisions

- **Color palette**: Pure black (#000000) background, white text, zinc-400/500/600 for secondary text. No bright accent colors in the UI.
- **Font**: DM Sans from Google Fonts, weights 400-800.
- **Animation easing**: `cubic-bezier(0.16, 1, 0.3, 1)` used everywhere for a snappy, premium feel.
- **Card pattern**: Every card uses a double-border pattern — outer `rounded-2xl border border-white/[0.08] p-1` with `GlowingEffect` inside, then inner `rounded-xl border border-white/5 bg-black p-6`.
- **Static export**: `output: "export"` in next.config.mjs — no SSR, no API routes, pure static HTML/CSS/JS.
- **`style jsx`**: Used in RecruiterShowcase for scoped CSS animations (IntersectionObserver-triggered float-card reveals).
