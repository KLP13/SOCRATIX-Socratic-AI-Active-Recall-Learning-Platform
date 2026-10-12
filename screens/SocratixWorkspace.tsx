import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SocratixNavbar from "./SocratixNavbar";
import { useMastery } from "../src/context/MasteryContext";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  isBreakthrough?: boolean;
}

interface WorkspaceTopic {
  id: string;
  icon: string;
  tabLabel: string;
  category: string;
  title: string;
  difficulty: string;
  courseTag: string;
  problemPrompt: string;
  codeLanguage: string;
  initialCode: string;
  initialMessages: ChatMessage[];
  nudge1: string;
  nudge2: string;
  nudge3: string;
  breakthroughKeywords: string[];
  breakthroughResponse: string;
  breakthroughBannerDesc: string;
  breakthroughSimulateText: string;
  edgeCasePrompt: string;
  edgeCaseResponse: string;
}

const TOPICS: Record<string, WorkspaceTopic> = {
  bst: {
    id: "bst",
    icon: "🌳",
    tabLabel: "BST Deletion",
    category: "DATA STRUCTURES / TREES",
    title: "Binary Search Tree: Node Deletion",
    difficulty: "Medium",
    courseTag: "CS 201",
    problemPrompt:
      "Implement the removal of a node with a given key while preserving the strict Binary Search Tree invariant: for every node, all left descendants are smaller, and all right descendants are larger. Handle leaf, one-child, and two-child cases.",
    codeLanguage: "JAVASCRIPT / C++",
    initialCode: `function remove(node, key) {
  if (!node) return null;
  if (key < node.key) node.left = remove(node.left, key);
  else if (key > node.key) node.right = remove(node.right, key);
  else { 
    // Buggy line: student just wipes out the node
    node = null; 
  }
  return node;
}`,
    initialMessages: [
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
    ],
    nudge1:
      "Level 1 (Guiding Question): Think about the smallest element in the right subtree. How does its value compare to all items in both left and right?",
    nudge2:
      "Level 2 (Counter-Example): Suppose root is 50, left is 30, right is 70. If we delete 50 by nulling it, both 30 and 70 are lost forever. If we replace 50 with 70, what happens if 70 had its own left child?",
    nudge3:
      "Level 3 (Structural Outline): Case 1: Leaf node (return null). Case 2: One child (return that non-null child). Case 3: Two children (find the in-order successor, copy its key, recursively delete the successor from the right subtree).",
    breakthroughKeywords: [
      "successor",
      "smallest in right",
      "min of right",
      "minimum node in the right",
      "inorder successor",
      "in-order successor",
    ],
    breakthroughResponse:
      "🎯 BINGO! That is the critical breakthrough! The in-order successor (smallest node in the right subtree) is guaranteed to be larger than everything in the left, and smaller than everything else in the right subtree.",
    breakthroughBannerDesc:
      "You discovered that replacing a 2-child node with its in-order successor maintains both left and right BST constraints! Now lock in long-term retention by taking the adaptive recall quiz.",
    breakthroughSimulateText:
      "We can replace it with the in-order successor (smallest node in right subtree)!",
    edgeCasePrompt: "I tested my code against edge cases (e.g. deleting root with two children).",
    edgeCaseResponse:
      "Look at line 6: `node = null`. If the deleted node had 2 children, this deletes both subtrees completely! Can you identify which node should take its spot instead?",
  },
  calculus: {
    id: "calculus",
    icon: "📐",
    tabLabel: "Product Rule",
    category: "CALCULUS / DIFFERENTIAL EQUATIONS",
    title: "Derivatives: Rates of Change for Products",
    difficulty: "Core",
    courseTag: "MATH 101",
    problemPrompt:
      "Find the derivative of f(x) = x² · sin(x). Identify why multiplying independent derivatives directly (d/dx(x²) · d/dx(sin x)) is mathematically invalid from first principles.",
    codeLanguage: "MATHEMATICAL SCRATCHPAD (LATEX / JS)",
    initialCode: `// Student Scratchpad:
// Function: f(x) = u(x) * v(x)
// Let u(x) = x^2,  v(x) = sin(x)
// Compute derivatives of each part:
// u'(x) = 2x
// v'(x) = cos(x)

// Common Misconception:
// f'(x) = u'(x) * v'(x) = 2x * cos(x) // INCORRECT!`,
    initialMessages: [
      {
        id: "1",
        sender: "ai",
        text: "Examine your scratchpad: `f'(x) = 2x * cos(x)`. If a rectangle has width u and height v, its area is u · v. When both width and height increase at the same time, does the area expand only along one corner?",
      },
      {
        id: "2",
        sender: "user",
        text: "No, both the horizontal strip and vertical strip expand simultaneously.",
      },
      {
        id: "3",
        sender: "ai",
        text: "Spot on! So what is the total change in area: Δ(u·v)? How does each dimension contribute to the overall rate?",
      },
    ],
    nudge1:
      "Level 1 (Guiding Question): When you calculate the differential d(u·v), remember that each factor takes turns changing while the other stays momentarily fixed.",
    nudge2:
      "Level 2 (Counter-Example): Let u = x and v = x. Then f(x) = x². Power rule says f'(x) = 2x. But if you multiply derivatives u' · v', you get 1 · 1 = 1, which contradicts 2x!",
    nudge3:
      "Level 3 (Structural Outline): Product Rule Formula: (u·v)' = u'·v + u·v'. For f(x) = x²·sin(x): f'(x) = (2x)·sin(x) + (x²)·cos(x).",
    breakthroughKeywords: [
      "product rule",
      "u'v + uv'",
      "u'v",
      "uv'",
      "area expansion",
      "one factor at a time",
      "takes turns",
      "2x*sin(x) + x^2*cos(x)",
    ],
    breakthroughResponse:
      "🎯 BRILLIANT MATHEMATICAL DEDUCTION! You derived the Product Rule from first principles! Only one factor expands at a time: (u·v)' = u'v + uv'.",
    breakthroughBannerDesc:
      "You deduced why multiplying derivatives directly fails and proved the geometric product rule u'v + uv'!",
    breakthroughSimulateText:
      "The change in area includes two strips: u'·v + u·v', so the derivative is 2x*sin(x) + x^2*cos(x)!",
    edgeCasePrompt: "What if one factor is a constant like f(x) = 5 * sin(x)?",
    edgeCaseResponse:
      "Notice that if u=5 (constant), u'=0. The formula u'v + uv' becomes 0·v + 5·v' = 5·cos(x), proving the constant multiple rule is just a special case of the product rule!",
  },
  system_design: {
    id: "system_design",
    icon: "⚡",
    tabLabel: "System Scaling",
    category: "DISTRIBUTED SYSTEMS / ARCHITECTURE",
    title: "Read Scaling for 10M Concurrent Users",
    difficulty: "Advanced",
    courseTag: "SYS 401",
    problemPrompt:
      "Your web service experiences 10M daily active users reading user feeds. The single Postgres DB is CPU-peaked at 99%. Propose an architecture to scale read queries while avoiding replication lag stale reads and primary write saturation.",
    codeLanguage: "INFRASTRUCTURE SCHEMA / TS",
    initialCode: `// Architecture Proposal
export const SystemArchitecture = {
  database: "AWS RDS PostgreSQL (1 Primary)",
  scalingMethod: "Deploy 25 Read Replicas",
  cachingLayer: "None (Direct DB queries)",
  writeHandling: "All writes to Primary instance",
  observedIssue: "Replication lag reaches 12 seconds under load!",
};`,
    initialMessages: [
      {
        id: "1",
        sender: "ai",
        text: "You configured 25 Postgres read replicas with no cache. When 100k users write new posts simultaneously, what happens to network bandwidth on the primary instance as it streams WAL logs to 25 replicas?",
      },
      {
        id: "2",
        sender: "user",
        text: "The primary will choke trying to replicate WAL logs to 25 destinations.",
      },
      {
        id: "3",
        sender: "ai",
        text: "Exactly right! Furthermore, replication lag will serve stale posts. If 90% of requests are reading the exact same hot posts, what in-memory tier could prevent queries from hitting the DB at all?",
      },
    ],
    nudge1:
      "Level 1 (Guiding Question): If memory is 1000x faster than disk, where should high-frequency read results live before querying SQL tables?",
    nudge2:
      "Level 2 (Counter-Example): Adding more replicas increases write amplification and cost without solving hot-key contention. A single viral tweet will still hammer every replica simultaneously.",
    nudge3:
      "Level 3 (Structural Outline): Cache-Aside Pattern with Redis: (1) Application queries Redis cluster. (2) On cache HIT, return in sub-2ms. (3) On cache MISS, query Postgres read replica, write to Redis with a TTL. (4) Invalidate key on write.",
    breakthroughKeywords: [
      "redis",
      "cache",
      "cache-aside",
      "in-memory",
      "cache layer",
      "memcached",
      "ttl",
      "in-memory cache",
    ],
    breakthroughResponse:
      "🎯 ARCHITECTURAL MASTERY UNLOCKED! Introducing an in-memory distributed cache (like Redis) absorbs 95%+ of read traffic, collapses DB load, and prevents replica sync bottlenecks.",
    breakthroughBannerDesc:
      "You correctly identified the write-amplification bottleneck and designed a Cache-Aside distributed layer with Redis!",
    breakthroughSimulateText:
      "We should implement the Cache-Aside pattern using an in-memory Redis cluster with TTLs to offload 95% of reads!",
    edgeCasePrompt: "What happens when a cached key expires during a viral spike (Cache Stampede)?",
    edgeCaseResponse:
      "Excellent edge case! A Cache Stampede occurs when thousands of requests miss simultaneously. To mitigate this, we use mutual exclusion locks (mutex) or probabilistic early expiration (XFetch)!",
  },
};

export const SocratixWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { topicId: paramTopicId } = useParams<{ topicId?: string }>();
  const { activeBreakthrough, triggerBreakthrough, nodes } = useMastery();

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    paramTopicId && TOPICS[paramTopicId] ? paramTopicId : "bst"
  );

  const topic = TOPICS[selectedTopicId] || TOPICS.bst;

  const [code, setCode] = useState<string>(topic.initialCode);
  const [inputText, setInputText] = useState<string>("");
  const [activeNudge, setActiveNudge] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(topic.initialMessages);
  const [topicBreakthrough, setTopicBreakthrough] = useState<boolean>(false);

  // Sync state when switching topics
  useEffect(() => {
    setCode(topic.initialCode);
    setMessages(topic.initialMessages);
    setInputText("");
    setActiveNudge(1);
    setTopicBreakthrough(false);
  }, [selectedTopicId]);

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
      let aiReply = "Interesting approach. What fundamental principle or constraint governs this specific scenario?";
      let isHit = false;

      // Anti-Vending Machine Check (FR-1.1)
      if (
        lower.includes("give me the answer") ||
        lower.includes("write the code") ||
        lower.includes("solve this for me") ||
        lower.includes("give me the code") ||
        lower.includes("just tell me")
      ) {
        aiReply = `🛡️ Socratix Guardrail: I won't hand you raw answers, but I'll guide you to deduce it yourself! Before writing code, what is the core bottleneck or constraint in this ${topic.tabLabel} problem?`;
      }
      // Check for topic-specific breakthrough keywords
      else if (topic.breakthroughKeywords.some((kw) => lower.includes(kw))) {
        aiReply = topic.breakthroughResponse;
        isHit = true;
        setTopicBreakthrough(true);
        triggerBreakthrough();
      }
      // Partial reasoning
      else if (
        lower.includes("relink") ||
        lower.includes("replace") ||
        lower.includes("formula") ||
        lower.includes("scale")
      ) {
        aiReply =
          "You're in the right conceptual territory! Dig one layer deeper: what specific mathematical or architectural invariant must never be broken?";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiReply,
          isBreakthrough: isHit,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleNudgeClick = (level: number) => {
    setActiveNudge(level);
    let nudgeText = topic.nudge1;
    if (level === 2) nudgeText = topic.nudge2;
    if (level === 3) nudgeText = topic.nudge3;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "ai",
        text: `💡 ${nudgeText}`,
      },
    ]);
  };

  const handleSimulateBreakthrough = () => {
    setInputText(topic.breakthroughSimulateText);
    setTimeout(() => {
      const btn = document.getElementById("send-btn");
      if (btn) btn.click();
    }, 100);
  };

  const handleTestThinking = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: topic.edgeCasePrompt,
      },
      {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: topic.edgeCaseResponse,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans">
      <SocratixNavbar />

      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Topic Selector Tabs (Multi-Topic Switcher) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
              SELECT LAB TOPIC:
            </span>
            {Object.values(TOPICS).map((t) => {
              const isSelected = selectedTopicId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTopicId(t.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.tabLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
              Course: {topic.courseTag}
            </span>
            <button
              type="button"
              onClick={handleSimulateBreakthrough}
              title="Click to auto-simulate the student breakthrough for judge demo"
              className="rounded-xl border border-blue-200 bg-blue-50/90 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition active:scale-95 cursor-pointer shadow-xs"
            >
              ⚡ Demo Breakthrough
            </button>
          </div>
        </div>

        {/* Top Breadcrumb & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>{topic.category}</span>
              <span>/</span>
              <span className="text-blue-600 font-bold">ACTIVE DIAGNOSTIC WORKSPACE</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-extrabold text-slate-900">
              {topic.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3.5 py-1 text-xs font-semibold border ${
                selectedTopicId === "bst" && nodes.bst.status === "mastery"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
            >
              {selectedTopicId === "bst" && nodes.bst.status === "mastery"
                ? "Mastered 🟢"
                : "Diagnostic Mode 🟡"}
            </span>
          </div>
        </div>

        {/* Breakthrough Celebration Banner */}
        {(topicBreakthrough || (selectedTopicId === "bst" && activeBreakthrough)) && (
          <div className="mt-6 rounded-2xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-6 shadow-md animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🎉</span>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950">
                    Aha! Breakthrough Unlocked for {topic.tabLabel}!
                  </h3>
                  <p className="mt-1 text-sm text-emerald-800 max-w-2xl leading-relaxed">
                    {topic.breakthroughBannerDesc}
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
                  <span className="text-xs font-semibold text-slate-500">
                    Difficulty: {topic.difficulty}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed font-normal">
                  {topic.problemPrompt}
                </p>
              </div>

              {/* Code Editor Header */}
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  STUDENT SCRATCHPAD ({topic.codeLanguage})
                </h3>
                <span className="text-xs font-mono text-slate-400">Interactive</span>
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
                  onClick={handleTestThinking}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-95 cursor-pointer"
                >
                  Test My Thinking
                </button>
                <button
                  type="button"
                  onClick={() => setCode(topic.initialCode)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Reset Scratchpad
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
                  <span><strong>Socratic Rule:</strong> Answers withheld to provoke active deduction.</span>
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
                      Socratix is formulating a diagnostic inquiry...
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
                  placeholder="Explain your deduction or proposal..."
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                />
                <button
                  id="send-btn"
                  type="submit"
                  disabled={!inputText.trim()}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
