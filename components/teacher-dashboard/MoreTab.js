import { X } from "lucide-react";
import { moreTools, moreToolDetails } from "./data";

export function MoreTab({ onOpenToolModal }) {
  return (
    <section className="mt-4">
      <article className="rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm text-slate-500">More tools</p>
        <h2 className="mt-1 text-xl font-semibold">Teacher utility modules</h2>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {moreTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.key}
                type="button"
                onClick={() => onOpenToolModal(tool.key)}
                className="aspect-square rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-[#fff8dc]"
              >
                <Icon className="h-5 w-5 text-[#b88600]" />
                <p className="mt-3 text-sm font-semibold text-slate-900">{tool.title}</p>
                <p className="mt-1 text-xs text-slate-600">{tool.subtitle}</p>
              </button>
            );
          })}
        </div>
      </article>
    </section>
  );
}

export function ToolModal({ activeTool, onClose }) {
  if (!activeTool) return null;

  const details = moreToolDetails[activeTool];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">{details?.title || "Tool"}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Close tool popup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          {details?.summary || "This tool is ready for your classroom workflow."}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-[#f2b705] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d9a300]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
