export default function Footer() {
  return (
    <footer className="border-t border-white/5 pt-8 pb-10">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-white">
            Launch<span className="text-zinc-500">Pad</span>
          </p>
          <p className="mt-1 text-sm tracking-tight text-zinc-600">
            Job search and application tracking, powered by AI.
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
        <p className="text-xs tracking-tight text-zinc-700">&copy; 2026 LaunchPadAI</p>
        <p className="text-xs tracking-tight text-zinc-700">Built for confident career moves.</p>
      </div>
    </footer>
  );
}
