import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SocratixNavbar from "./SocratixNavbar";
import { useMastery, TreeNode } from "../src/context/MasteryContext";

export const SocratixMastery: React.FC = () => {
  const navigate = useNavigate();
  const { nodes, xp } = useMastery();

  const [selectedNode, setSelectedNode] = useState<TreeNode>(nodes.bst);

  // Sync selectedNode when nodes update
  useEffect(() => {
    if (selectedNode && nodes[selectedNode.id]) {
      setSelectedNode(nodes[selectedNode.id]);
    }
  }, [nodes]);

  const isBstMastered = nodes.bst.status === "mastery";

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans">
      <SocratixNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        {/* Header and Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>ACADEMIC PROGRESSION</span>
              <span>/</span>
              <span className="text-blue-600 font-bold">KNOWLEDGE GRAPH</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-extrabold text-slate-900">
              Interactive Concept Tree
            </h1>
          </div>

          {/* Legend Badges */}
          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              Verified mastery 🟢
            </span>
            <span className="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
              Under scaffolding 🟡
            </span>
            <span className="rounded-full bg-rose-100 px-3.5 py-1 text-xs font-semibold text-rose-800 border border-rose-200">
              Misconception 🔴
            </span>
          </div>
        </div>

        {/* Dynamic Notification Banner if BST was just mastered */}
        {isBstMastered && (
          <div className="mt-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50/90 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <p className="font-bold text-emerald-950 text-sm">
                  Active-Recall Goal Achieved!
                </p>
                <p className="text-xs text-emerald-800">
                  The BST Deletion node transitioned from <span className="font-bold text-rose-700">🔴 Misconception</span> to <span className="font-bold text-emerald-700">🟢 Verified Mastery</span>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/educator")}
              className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              See Educator Heatmap Impact →
            </button>
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Canvas: Syllabus Prerequisites */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-7 flex flex-col justify-between overflow-x-auto">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  SYLLABUS PREREQUISITES & TOPIC DEPENDENCY GRAPH
                </h3>
                <span className="text-xs text-slate-400">Click node to inspect</span>
              </div>

              {/* Interactive Node Graph */}
              <div className="relative min-w-[540px] h-[340px] py-4 select-none">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Pointers -> Linked Lists */}
                  <path d="M 125 150 C 145 150, 150 95, 170 95" fill="none" stroke="#10b981" strokeWidth="2.5" />
                  {/* Pointers -> Recursion */}
                  <path d="M 125 150 C 145 150, 150 215, 170 215" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
                  {/* Linked Lists -> Trees */}
                  <path d="M 285 95 C 310 95, 315 155, 335 155" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
                  {/* Recursion -> Trees */}
                  <path d="M 285 215 C 310 215, 315 155, 335 155" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
                  {/* Trees -> BST Deletion (Dynamic color based on mastery!) */}
                  <path
                    d="M 450 155 L 480 155"
                    fill="none"
                    stroke={isBstMastered ? "#10b981" : "#f43f5e"}
                    strokeWidth="3"
                    strokeDasharray={isBstMastered ? "none" : "4 4"}
                    className="transition-all duration-500"
                  />
                </svg>

                {/* Node: Pointers */}
                <button
                  type="button"
                  onClick={() => setSelectedNode(nodes.pointers)}
                  className={`absolute left-2 top-[120px] w-28 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                    selectedNode.id === "pointers" ? "ring-2 ring-emerald-500 shadow-md scale-105" : "hover:shadow-sm"
                  } bg-emerald-50/80 border-emerald-300 text-emerald-950`}
                >
                  <p className="text-xs font-bold">Pointers</p>
                  <p className="text-[10px] text-emerald-700 font-medium">Verified mastery 🟢</p>
                </button>

                {/* Node: Linked Lists */}
                <button
                  type="button"
                  onClick={() => setSelectedNode(nodes.linkedLists)}
                  className={`absolute left-[170px] top-[65px] w-28 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                    selectedNode.id === "linkedLists" ? "ring-2 ring-emerald-500 shadow-md scale-105" : "hover:shadow-sm"
                  } bg-emerald-50/80 border-emerald-300 text-emerald-950`}
                >
                  <p className="text-xs font-bold">Linked Lists</p>
                  <p className="text-[10px] text-emerald-700 font-medium">Verified mastery 🟢</p>
                </button>

                {/* Node: Recursion */}
                <button
                  type="button"
                  onClick={() => setSelectedNode(nodes.recursion)}
                  className={`absolute left-[170px] top-[185px] w-28 rounded-xl border border-dashed p-2.5 text-left transition cursor-pointer ${
                    selectedNode.id === "recursion" ? "ring-2 ring-amber-500 shadow-md scale-105" : "hover:shadow-sm"
                  } bg-amber-50/80 border-amber-300 text-amber-950`}
                >
                  <p className="text-xs font-bold">Recursion</p>
                  <p className="text-[10px] text-amber-700 font-medium">Under scaffolding 🟡</p>
                </button>

                {/* Node: Trees */}
                <button
                  type="button"
                  onClick={() => setSelectedNode(nodes.trees)}
                  className={`absolute left-[335px] top-[120px] w-28 rounded-xl border border-dashed p-2.5 text-left transition cursor-pointer ${
                    selectedNode.id === "trees" ? "ring-2 ring-amber-500 shadow-md scale-105" : "hover:shadow-sm"
                  } bg-amber-50/80 border-amber-300 text-amber-950`}
                >
                  <p className="text-xs font-bold">Trees</p>
                  <p className="text-[10px] text-amber-700 font-medium">Under scaffolding 🟡</p>
                </button>

                {/* Node: BST Deletion (Dynamic style!) */}
                <button
                  type="button"
                  onClick={() => setSelectedNode(nodes.bst)}
                  className={`absolute left-[480px] top-[120px] w-32 rounded-xl border p-2.5 text-left transition cursor-pointer ${
                    selectedNode.id === "bst"
                      ? isBstMastered
                        ? "ring-2 ring-emerald-500 shadow-md scale-105"
                        : "ring-2 ring-rose-500 shadow-md scale-105"
                      : "hover:shadow-sm"
                  } ${
                    isBstMastered
                      ? "bg-emerald-50/90 border-emerald-400 text-emerald-950 font-bold"
                      : "bg-rose-50/80 border-rose-300 text-rose-950"
                  }`}
                >
                  <p className="text-xs font-bold">BST Deletion</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      isBstMastered ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {isBstMastered ? "Verified mastery 🟢" : "Misconception 🔴"}
                  </p>
                </button>
              </div>
            </div>

            {/* Bottom info note */}
            <div className="mt-8 border-t border-slate-100 pt-4 text-xs text-slate-500">
              Interactive cognitive DAG. Red nodes represent recurring logical misconceptions detected in Socratic sessions.
            </div>
          </div>

          {/* Right Column: Node Details & Misconception Log */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-5">
            <div>
              {/* Selected Node Details */}
              <div className="pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    NODE INSPECTOR
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      selectedNode.status === "mastery"
                        ? "bg-emerald-100 text-emerald-800"
                        : selectedNode.status === "scaffolding"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {selectedNode.statusLabel}
                  </span>
                </div>

                <h2 className="mt-3 font-serif text-2xl font-bold text-slate-900">
                  {selectedNode.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Misconception Log Drawer */}
              <div className="mt-6">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3">
                  LOGGED MISCONCEPTIONS
                </h3>

                {selectedNode.id === "bst" ? (
                  !isBstMastered ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-950 leading-relaxed space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-rose-800">
                        <span>⚠️ Off-by-one / Pointer Orphan Bug</span>
                      </div>
                      <p>
                        "Student repeatedly sets deleted node reference to null instead of identifying the in-order successor to preserve binary search invariants."
                      </p>
                      <div className="pt-2 text-[11px] text-rose-700 font-medium">
                        Identified in: Workspace Diagnostic Session CS201
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950 leading-relaxed space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <span>✅ Misconception Successfully Cleared!</span>
                      </div>
                      <p>
                        Student successfully deduced that replacing a 2-child node with the minimum node in its right subtree preserves ordering. Passed 3-question active recall quiz with 100%.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                    No active misconceptions flagged for this topic node. All prerequisite checks passed.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
              {selectedNode.id === "bst" && !isBstMastered ? (
                <button
                  type="button"
                  onClick={() => navigate("/workspace")}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95 cursor-pointer text-center"
                >
                  Launch Socratic Drill to Clear Misconception →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/quiz")}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer text-center"
                >
                  Practice Spaced-Recall Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SocratixMastery;
