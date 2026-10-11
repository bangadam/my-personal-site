import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next ? "#202020" : "#ffffff");
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (_) {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--foreground)]"
    >
      {mounted &&
        (dark ? (
          <Sun className="interaction-icon h-4 w-4" aria-hidden="true" />
        ) : (
          <Moon className="interaction-icon h-4 w-4" aria-hidden="true" />
        ))}
    </button>
  );
}
