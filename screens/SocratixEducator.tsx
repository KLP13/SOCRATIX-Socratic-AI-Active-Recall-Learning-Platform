import React, { useState } from "react";
import SocratixNavbar from "./SocratixNavbar";
import { useMastery } from "../src/context/MasteryContext";

interface HeatmapRow {
  topic: string;
  wk1: number;
  wk2: number;
  wk3: number;
  wk4: number;
  wk5: number;
  wk6: number;
}

interface AlertItem {
  id: string;
  learnerId: string;
  reason: string;
  severity: "at_risk" | "watch" | "resolved";
  assigned?: boolean;
}

export const SocratixEducator: React.FC = () => {
  const { nodes } = useMastery();
  const isBstMastered = nodes.bst.status === "mastery";

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      learnerId: "Alex (Current Demo Learner)",
      reason: "Repeatedly deleted 2-child BST nodes without in-order successor relinking",
      severity: isBstMastered ? "resolved" : "at_risk",
    },
    {
      id: "2",
      learnerId: "Learner 0377",
      reason: "Repeated Pointers errors before Trees topic introduction",
      severity: "at_risk",
    },
    {
      id: "3",
      learnerId: "Learner 0519",
      reason: "Skipped two prerequisite spaced-recall quizzes",
      severity: "watch",
    },
  ]);

  const [exportMessage, setExportMessage] = useState(false);

  const handleAssignDrill = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, assigned: true } : a))
    );
  };

  const handleExport = () => {
    setExportMessage(true);
    setTimeout(() => setExportMessage(false), 2500);
  };

  // Helper to color heatmap intensity
  const getHeatBg = (pct: number) => {
    if (pct >= 70) return "bg-rose-200 text-rose-950 font-bold";
    if (pct >= 50) return "bg-rose-100 text-rose-900 font-semibold";
    if (pct >= 30) return "bg-rose-50 text-rose-800 font-medium";
    if (pct >= 20) return "bg-amber-50/70 text-amber-900";
    return "bg-slate-50 text-slate-700";
  };

  const heatmapData: HeatmapRow[] = [
    { topic: "Pointers", wk1: 12, wk2: 10, wk3: 9, wk4: 8, wk5: 8, wk6: 7 },
    { topic: "Linked Lists", wk1: 20, wk2: 24, wk3: 18, wk4: 15, wk5: 14, wk6: 12 },
    { topic: "Recursion", wk1: 35, wk2: 48, wk3: 55, wk4: 52, wk5: 46, wk6: 44 },
    { topic: "Trees", wk1: 30, wk2: 42, wk3: 58, wk4: 64, wk5: 60, wk6: 57 },
    { 
      topic: "BST Deletion", 
      wk1: 40, 
      wk2: 52, 
      wk3: 66, 
      wk4: 78, 
      wk5: 72, 
      // Reflect recent mastery resolution
      wk6: isBstMastered ? 48 : 70 
    },
    { topic: "Graphs", wk1: 18, wk2: 22, wk3: 30, wk4: 41, wk5: 44, wk6: 47 },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans">
      <SocratixNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        {/* Header & Course Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>INSTITUTIONAL ANALYTICS</span>
              <span>/</span>
              <span className="text-blue-600 font-bold">PROFESSOR DASHBOARD</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-extrabold text-slate-900">
              CS201 Data Structures & Algorithms
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {exportMessage && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                PDF Analytics Exported ✓
              </span>
            )}
            <button
              type="button"
              onClick={handleExport}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer shadow-sm active:scale-95"
            >
              Export Syllabus Report
            </button>
          </div>
        </div>

        {/* Live Mastery Impact Notification */}
        {isBstMastered && (
          <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xl">📈</span>
              <p className="text-xs text-emerald-950 font-medium">
                <strong>Live Synchronized Telemetry:</strong> Learner Alex just solved BST Deletion via Socratic dialogue and verified retention with 100% on the recall quiz. Week 6 class struggle rate dropped to <strong>48%</strong>!
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full whitespace-nowrap">
              Updated Real-Time
            </span>
          </div>
        )}

        {/* 2-Column Split: Heatmap & At-Risk Alerts */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Misconception Heatmap */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-8 overflow-x-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  CLASSROOM MISCONCEPTION HEATMAP: % OF LEARNERS STRUGGLING
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Aggregated from 184 active Socratic tutoring sessions</p>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Spring 2026 Cohort
              </span>
            </div>

            {/* Heatmap Table */}
            <table className="w-full text-left text-sm border-separate border-spacing-y-1.5">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase">
                  <th className="py-2 pr-4 font-semibold text-slate-500">Topic</th>
                  <th className="py-2 px-3 text-center">WK 1</th>
                  <th className="py-2 px-3 text-center">WK 2</th>
                  <th className="py-2 px-3 text-center">WK 3</th>
                  <th className="py-2 px-3 text-center">WK 4</th>
                  <th className="py-2 px-3 text-center">WK 5</th>
                  <th className="py-2 px-3 text-center">WK 6</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.topic} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 pr-4 font-semibold text-slate-800 whitespace-nowrap flex items-center gap-2">
                      <span>{row.topic}</span>
                      {row.topic === "BST Deletion" && isBstMastered && (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Improving ↓
                        </span>
                      )}
                    </td>
                    {[row.wk1, row.wk2, row.wk3, row.wk4, row.wk5, row.wk6].map(
                      (val, idx) => (
                        <td key={idx} className="py-2 px-1 text-center">
                          <div
                            className={`mx-auto rounded-lg py-2 px-2.5 text-xs transition ${getHeatBg(
                              val
                            )}`}
                          >
                            {val}%
                          </div>
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Suggested Lecture Talking Points (Section 6, Page 5) */}
            <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs text-indigo-950">
              <span className="font-bold uppercase tracking-wider block text-indigo-900 mb-1">
                🤖 AI Curriculum Feedback for Prof. Mehta:
              </span>
              <p className="leading-relaxed">
                "64% of CS201 students repeatedly assume deleting a node simply means reassigning the pointer to null, ignoring orphaned subtrees. <strong>Recommended Lecture Talking Point:</strong> Spend 10 minutes at the start of next Tuesday's lecture contrasting 1-child vs 2-child replacement using physical tree blocks."
              </p>
            </div>
          </div>

          {/* Right Column: At-Risk Alerts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  AT-RISK INTERVENTIONS
                </h3>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  Early Warning
                </span>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {alert.learnerId}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            alert.severity === "resolved"
                              ? "bg-emerald-100 text-emerald-800"
                              : alert.severity === "at_risk"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {alert.severity === "resolved"
                            ? "Resolved ✓"
                            : alert.severity === "at_risk"
                            ? "At risk"
                            : "Watch"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 leading-snug">
                        {alert.reason}
                      </p>
                    </div>

                    <div className="ml-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAssignDrill(alert.id)}
                        disabled={alert.assigned || alert.severity === "resolved"}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                          alert.severity === "resolved"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 cursor-default"
                            : alert.assigned
                            ? "bg-blue-50 border-blue-300 text-blue-800 cursor-default"
                            : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 active:scale-95"
                        }`}
                      >
                        {alert.severity === "resolved"
                          ? "Cleared"
                          : alert.assigned
                          ? "Assigned ✓"
                          : "Assign drill"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-400 font-medium">
                Connected to Student Socratic Reasoning Engine
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SocratixEducator;
