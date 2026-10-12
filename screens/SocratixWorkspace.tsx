import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SocratixNavbar from "./SocratixNavbar";
import { useMastery } from "../src/context/MasteryContext";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  isBreakthrough?: boolean;
}

export const SocratixWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { activeBreakthrough, triggerBreakthrough, nodes } = useMastery();

  const initialCode = `function remove(node, key) {
  if (!node) return null;
  if (key < node.key) node.left = remove(node.left, key);
  else if (key > node.key) node.right = remove(node.right, key);
  else { 
    // Buggy line: student just wipes out the node
    node = null; 
  }
  return node;
}`;

  const [code, setCode] = useState(initialCode);
  const [inputText, setInputText] = useState("");
  const [activeNudge, setActiveNudge] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "Welcome to your active diagnostic session! Notice line 6: `else { node = null; }`. What happens to the left and right subtrees hanging under that node when you simply set it to null?",
    },
    {
      id: "2",
      sender: "user",
      text: "They get cut off from the tree?",
    },
    {
      id: "3",
      sender: "ai",
      text: "Exactly right! They are orphaned. Now think: if a node has TWO children and we delete it, which node in the remaining tree can safely take its place without breaking the BST property?",
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    const lower = userText.toLowerCase();

    setTimeout(() => {
      let aiReply = "Interesting approach. Reflect on the BST invariant: every node in the left subtree must be smaller, and every node in the right subtree must be larger.";
      let breakthrough = false;

      // Anti-Vending Machine Check (FR-1.1)
      if (
        lower.includes("give me the answer") ||
        lower.includes("write the code") ||
        lower.includes("solve this for me") ||
        lower.includes("give me the code")
      ) {
        aiReply =
          "🛡️ Socratix Guardrail: I won't hand you raw answers, but I'll guide you to write it yourself! Let's take it one step: if we can't just delete a node with two children, what node from its right subtree could replace it?";
      }
      // Breakthrough detection
      else if (
        lower.includes("successor") ||
        lower.includes("smallest in right") ||
        lower.includes("min of right") ||
        lower.includes("minimum node in the right") ||
        lower.includes("inorder successor") ||
        lower.includes("in-order successor")
      ) {
        aiReply =
          "🎯 BINGO! That is the critical breakthrough! The in-order successor (smallest node in the right subtree) is guaranteed to be larger than everything in the left, and smaller than everything else in the right subtree.";
        breakthrough = true;
        triggerBreakthrough();
      }
      // Partial reasoning
      else if (lower.includes("relink") || lower.includes("replace") || lower.includes("swap")) {
        aiReply =
          "You're on the right track! We must replace it with another existing node. But WHICH specific node will preserve the binary search ordering for both left and right branches?";
      } else if (lower.includes("leaf") || lower.includes("root")) {
        aiReply =
          "If we pick an arbitrary leaf or root, we risk violating the BST rule (left < root < right). Look closely at the right subtree—which single element there is closest in value to the deleted node?";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiReply,
          isBreakthrough: breakthrough,
        },
      ]);
      setIsTyping(false);
    }, 650);
  };

  const handleNudgeClick = (level: number) => {
    setActiveNudge(level);
    let nudgeContent = "";
    if (level === 1) {
      nudgeContent =
        "Level 1 (Guiding Question): Think about the smallest element in the right subtree. How does its value compare to all items in both left and right?";
    } else if (level === 2) {
      nudgeContent =
        "Level 2 (Counter-Example): Suppose root is 50, left is 30, right is 70. If we delete 50 by nulling it, both 30 and 70 are lost forever. If we replace 50 with 70, what happens if 70 had its own left child?";
    } else {
      nudgeContent =
        "Level 3 (Structural Outline): Case 1: Leaf node (return null). Case 2: One child (return that non-null child). Case 3: Two children (find the in-order successor, copy its key, recursively delete the successor from the right subtree).";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "ai",
        text: `💡 ${nudgeContent}`,
      },
    ]);
  };

  const handleSimulateBreakthrough = () => {
    setInputText("We can replace it with the in-order successor (smallest node in right subtree)!");
    setTimeout(() => {
      const btn = document.getElementById("send-btn");
      if (btn) btn.click();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans">
      <SocratixNavbar />

      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Top Breadcrumb & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>DATA STRUCTURES</span>
              <span>/</span>
              <span>TREES</span>
              <span>/</span>
              <span className="text-blue-600 font-bold">DIAGNOSTIC WORKSPACE</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-extrabold text-slate-900">
              Binary Search Tree: Node Deletion
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3.5 py-1 text-xs font-semibold border ${
                nodes.bst.status === "mastery"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
            >
              {nodes.bst.status === "mastery" ? "Mastered 🟢" : "Under scaffolding 🟡"}
            </span>

            {/* Quick Pitch Demo Button */}
            <button
              type="button"
              onClick={handleSimulateBreakthrough}
              title="Click to auto-simulate the student breakthrough for judge demo"
              className="rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition active:scale-95 cursor-pointer"
            >
              ⚡ Demo Breakthrough
            </button>
          </div>
        </div>

        {/* Breakthrough Celebration Banner */}
        {activeBreakthrough && (
          <div className="mt-6 animate-fadeIn rounded-2xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎉</span>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950">
                    Aha! Breakthrough Unlocked!
                  </h3>
                  <p className="mt-1 text-sm text-emerald-800 max-w-2xl leading-relaxed">
                    You discovered that replacing a 2-child node with its <strong>in-order successor</strong> maintains both left and right BST constraints! Now lock in long-term retention by taking the adaptive recall quiz.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/quiz")}
                className="whitespace-nowrap rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Take Active-Recall Quiz (3 Qs)</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* 2-Column Split Workspace */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column: Problem & Scratchpad */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div>
              {/* Problem Statement */}
              <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    PROBLEM CONSTRAINTS
                  </h3>
                  <span className="text-xs font-medium text-slate-500">Medium • CS 201</span>
                </div>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed font-normal">
                  Implement the removal of a node with a given key while preserving the strict Binary Search Tree invariant: for every node, all left descendants are smaller, and all right descendants are larger.
                </p>
              </div>

              {/* Code Editor Header */}
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  YOUR SCRATCHPAD (JAVASCRIPT / C++)
                </h3>
                <span className="text-xs font-mono text-slate-400">Lines: 10</span>
              </div>

              {/* Code Editor Box */}
              <div className="rounded-xl border border-slate-800 bg-[#16181f] p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={10}
                  className="w-full bg-transparent text-slate-100 font-mono text-xs outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Scratchpad Action Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        sender: "user",
                        text: "I analyzed my scratchpad code against boundary conditions.",
                      },
                      {
                        id: (Date.now() + 1).toString(),
                        sender: "ai",
                        text: "Look at line 6: `node = null`. If the deleted node had 2 children, this deletes both subtrees completely! Can you identify which node should take its spot instead?",
                      },
                    ]);
                  }}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-95 cursor-pointer"
                >
                  Test My Thinking
                </button>
                <button
                  type="button"
                  onClick={() => setCode(initialCode)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Reset Code
                </button>
              </div>

              <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                Socratic Guardrail Active 🛡️
              </span>
            </div>
          </div>

          {/* Right Column: Socratic Dialogue Stream */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div>
              {/* Top Anti-Vending Guardrail Banner */}
              <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-xs font-medium text-amber-900 mb-5">
                <div className="flex items-center gap-2">
                  <span>🛡️</span>
                  <span><strong>Socratic Rule:</strong> Direct answers are withheld to provoke active recall.</span>
                </div>
                <span className="text-[11px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Anti-Cheating
                </span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {messages.map((msg) =>
                  msg.sender === "ai" ? (
                    <div key={msg.id} className="flex justify-start">
                      <div
                        className={`max-w-xl rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                          msg.isBreakthrough
                            ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-medium"
                            : "border border-slate-200 bg-slate-50/80 text-slate-800"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-md rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-950 font-medium shadow-xs">
                        {msg.text}
                      </div>
                    </div>
                  )
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 italic flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                      Socratix is formulating a diagnostic question...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Controls: Progressive Nudges & Input */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
              {/* Tiered Hints (Section 4 & 6 of Spec) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    TIERED HINTS (PROGRESSIVE SCAFFOLDING)
                  </span>
                  <span className="text-[11px] text-slate-400">Ask only when stuck</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleNudgeClick(1)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      activeNudge === 1
                        ? "bg-blue-600 text-white shadow-xs"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    1. Guiding Question
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNudgeClick(2)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      activeNudge === 2
                        ? "bg-blue-600 text-white shadow-xs"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    2. Counter-Example
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNudgeClick(3)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      activeNudge === 3
                        ? "bg-blue-600 text-white shadow-xs"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    3. Structural Outline
                  </button>
                </div>
              </div>

              {/* Chat Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2.5 pt-1"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Explain your deduction (e.g. 'We need the in-order successor')..."
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
                <button
                  id="send-btn"
                  type="submit"
                  disabled={!inputText.trim()}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SocratixWorkspace;
