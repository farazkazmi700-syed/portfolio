import { useEffect, useReducer } from "react";
import { cvData } from "../content/cvData";

/**
 * Live overlay: when a sync backend is reachable (VITE_API_URL), the merged
 * LinkedIn profile served by GET /api/portfolio is deep-merged over the
 * bundled cvData at runtime. Without a backend everything falls back to the
 * bundled (auto-generated) content, so static deploys never break.
 */

function deepMerge(target, source) {
  if (!source || typeof source !== "object") return target;
  for (const [key, value] of Object.entries(source)) {
    if (value === null || value === undefined || key === "meta") continue;
    const current = target[key];

    if (Array.isArray(value)) {
      // The backend store always holds the full merged snapshot, so its
      // list sections (projects, education, ...) simply replace bundles.
      if (key !== "skills") {
        target[key] = value;
      }
    } else if (
      typeof value === "object" &&
      current &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      deepMerge(current, value);
    } else if (typeof value === "string" && value.length > 0) {
      // Don't overwrite non-empty manual fields with shorter empties.
      target[key] = value;
    }
  }
  return target;
}

export default function useLiveSync(enabled = true) {
  const [version, bump] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    if (!enabled) return;
    const base = import.meta.env?.VITE_API_URL;
    if (!base) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${base.replace(/\/$/, "")}/api/portfolio`);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && json?.ok && json?.data) {
          deepMerge(cvData, json.data);
          bump();
        }
      } catch {
        /* offline / no backend: silently keep bundled data */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return version;
}
