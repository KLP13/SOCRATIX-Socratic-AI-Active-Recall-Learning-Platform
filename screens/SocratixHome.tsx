import React, { useState } from "react";
import { Link } from "react-router-dom";
import SocratixNavbar from "./SocratixNavbar";

interface DemoScenario {
  id: string;
  label: string;
  typical: {
    userPrompt: string;
    code: string;
    footer: string;
  };
  socratix: {
    studentMessage1: string;
    aiQuestion: string;
    studentMessage2: string;
    footer: string;
  };
}

const DEMOS: DemoScenario[] = [
  {
    id: "dsa",
    label: "Data Structures demo",
    typical: {
      userPrompt: "Write binary tree deletion code.",
      code: `function remove(root, key) {
  if (!root) return null;
  if (key < root.key) root.left = remove(root.left, key);
  /* ...complete solution... */
}`,
      footer: "Copy. Paste. Nothing learned.",
    },
    socratix: {
      studentMessage1: "I just set the node to null when the key matches.",
      aiQuestion:
        "What happens to that node's two children once it is null? Sketch a tree and trace it.",
      studentMessage2: "They get cut off. So I need to relink them somehow.",
      footer: "The student finds the breakthrough, not the AI.",
    },
  },
  {
    id: "calc",
    label: "Calculus demo",
    typical: {
      userPrompt: "Find the derivative of f(x) = x^2 * sin(x).",
      code: `f'(x) = 2x*sin(x) + x^2*cos(x)
/* Step 1: d/dx(x^2)*sin(x) = 2x*sin(x)
   Step 2: x^2*d/dx(sin(x)) = x^2*cos(x)
   Step 3: add together */`,
      footer: "Copy. Paste. Nothing learned.",
    },
    socratix: {
      studentMessage1: "Is the derivative just 2x * cos(x)? I multiplied derivatives.",
      aiQuestion:
        "If you multiply rates of change directly, what does the product rule say about change in area?",
      studentMessage2: "Oh! Only one factor changes at a time: u'v + uv'.",
      footer: "The student discovers the rule from first principles.",
    },
  },
  {
    id: "system",
    label: "System Design demo",
    typical: {
      userPrompt: "How do I prevent database read bottlenecks with 10M users?",
      code: `class CacheCluster {
  // Put Redis cluster in front of Postgres
  // Configure read replicas with replication lag sync
}`,
      footer: "Copy. Paste. Nothing learned.",
    },
    socratix: {
      studentMessage1: "I will just spin up 20 Postgres instances with read replicas.",
      aiQuestion:
        "When 100k users write simultaneously, what happens to consistency across 20 replicas?",
      studentMessage2: "Replication lag will serve stale data. I need an in-memory cache layer first.",
      footer: "The student understands the architectural trade-off.",
    },
  },
];

export const SocratixHome: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoScenario>(DEMOS[0]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans">
      <SocratixNavbar />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:py-16">
        {/* Category Tag */}
        <div className="mb-4">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            SOCRATIC AI / ACTIVE RECALL
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl max-w-4xl leading-tight">
          Stop Copying Answers. Start <br />
          Mastering Concepts.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-3xl text-lg text-slate-600 leading-relaxed">
          Socratix is the tutor that refuses to hand you the solution. It finds your exact
          misconception and asks the one question that gets you there.
        </p>

        {/* Demo Selector Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {DEMOS.map((demo) => {
            const isSelected = activeDemo.id === demo.id;
            return (
              <button
                key={demo.id}
                type="button"
                onClick={() => setActiveDemo(demo)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-blue-500/20"
                    : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                {demo.label}
              </button>
            );
          })}

          <Link
            to={`/learn/${activeDemo.id === "dsa" ? "bst" : activeDemo.id === "calc" ? "calculus" : "system_design"}`}
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition cursor-pointer"
          >
            Open Interactive Workspace ({activeDemo.label.replace(" demo", "")}) →
          </Link>
        </div>

        {/* Side-by-Side Comparison Sandbox */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Card: Typical AI chat */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-6">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Typical AI chat
                </h3>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Answer dumped
                </span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-md rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-800">
                    {activeDemo.typical.userPrompt}
                  </div>
                </div>

                {/* AI Dumped Code Box */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-800 overflow-x-auto leading-relaxed">
                  <pre>{activeDemo.typical.code}</pre>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-8 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">{activeDemo.typical.footer}</p>
            </div>
          </div>

          {/* Right Card: Socratix */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-blue-600 bg-white p-7 shadow-lg shadow-blue-500/5 transition hover:shadow-xl">
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-6">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Socratix
                </h3>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Misconception caught
                </span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-4">
                {/* User Message 1 */}
                <div className="flex justify-end">
                  <div className="max-w-md rounded-2xl bg-indigo-50/80 border border-indigo-100 px-4 py-3 text-sm text-indigo-950 font-medium">
                    {activeDemo.socratix.studentMessage1}
                  </div>
                </div>

                {/* AI Socratic Response */}
                <div className="flex justify-start">
                  <div className="max-w-lg rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-800 leading-relaxed shadow-sm">
                    {activeDemo.socratix.aiQuestion}
                  </div>
                </div>

                {/* User Breakthrough Message */}
                <div className="flex justify-end">
                  <div className="max-w-md rounded-2xl bg-indigo-50/80 border border-indigo-100 px-4 py-3 text-sm text-indigo-950 font-medium">
                    {activeDemo.socratix.studentMessage2}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-8 border-t border-slate-100 pt-4">
              <p className="text-sm font-medium text-slate-600">
                {activeDemo.socratix.footer}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SocratixHome;
