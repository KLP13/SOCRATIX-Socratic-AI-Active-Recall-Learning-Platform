import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SocratixNavbar from "./SocratixNavbar";
import { useMastery } from "../src/context/MasteryContext";

interface QuizQuestion {
  id: number;
  questionNumber: number;
  totalQuestions: number;
  category: string;
  questionText: string;
  options: { id: string; label: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionNumber: 1,
    totalQuestions: 3,
    category: "CONCEPTUAL UNDERSTANDING",
    questionText:
      "A BST node with two children is removed. Which node can replace it and keep the ordering invariant valid?",
    options: [
      { id: "A", label: "A", text: "Its left child" },
      { id: "B", label: "B", text: "The smallest node in its right subtree (In-order successor)" },
      { id: "C", label: "C", text: "Any leaf in the tree" },
      { id: "D", label: "D", text: "The root of the tree" },
    ],
    correctOptionId: "B",
    explanation:
      "The in-order successor is guaranteed to be strictly greater than all nodes in the left subtree, and strictly less than all remaining nodes in the right subtree.",
  },
  {
    id: 2,
    questionNumber: 2,
    totalQuestions: 3,
    category: "EDGE-CASE PREDICTION",
    questionText:
      "When we extract the in-order successor to replace the deleted node, what if that successor has its own right child?",
    options: [
      { id: "A", label: "A", text: "It cannot have a right child, so this case never occurs." },
      { id: "B", label: "B", text: "Link its right child directly to the successor's former parent." },
      { id: "C", label: "C", text: "Delete that child along with the successor." },
      { id: "D", label: "D", text: "Convert the entire tree into an array and rebuild it." },
    ],
    correctOptionId: "B",
    explanation:
      "By definition of being the minimum in the right subtree, the successor CANNOT have a left child, but it CAN have a right child. We safely adopt that right child to the successor's parent.",
  },
  {
    id: 3,
    questionNumber: 3,
    totalQuestions: 3,
    category: "CONCEPTUAL TRANSFER",
    questionText:
      "Instead of the in-order successor from the right subtree, what symmetrical alternative could also safely replace the deleted node?",
    options: [
      { id: "A", label: "A", text: "The largest node in its left subtree (In-order predecessor)" },
      { id: "B", label: "B", text: "The root of the left subtree without modification" },
      { id: "C", label: "C", text: "The grand-child of the right child" },
      { id: "D", label: "D", text: "A freshly instantiated empty node" },
    ],
    correctOptionId: "A",
    explanation:
      "The in-order predecessor is the maximum value in the left subtree, which is also guaranteed to preserve both left and right BST inequalities.",
  },
];

export const SocratixQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { completeQuiz, quizCompleted, quizScore, nodes } = useMastery();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  const [finished, setFinished] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const currentQ = QUESTIONS[currentIndex];
  const selectedId = selectedAnswers[currentQ.id];
  const isChecked = checkedQuestions[currentQ.id] || false;
  const isCorrect = isChecked && selectedId === currentQ.correctOptionId;

  const handleSelect = (optionId: string) => {
    if (isChecked) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleCheckAnswer = () => {
    if (!selectedId) return;
    setCheckedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      QUESTIONS.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctOptionId) {
          correctCount += 1;
        }
      });
      setFinalScore(correctCount);
      setFinished(true);
      completeQuiz(correctCount, QUESTIONS.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setCheckedQuestions({});
    setFinished(false);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans">
      <SocratixNavbar />

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>ACTIVE RECALL</span>
              <span>/</span>
              <span className="text-blue-600 font-bold">SPACED MASTERY VERIFICATION</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-extrabold text-slate-900">
              Mastery Verification Quiz: BST Deletion
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
              3-Question Diagnostic
            </span>
          </div>
        </div>

        {finished ? (
          /* Completion Screen with Score, XP, and Mastery Unlock */
          <div className="mx-auto max-w-3xl rounded-2xl border-2 border-emerald-500 bg-white p-8 sm:p-10 shadow-lg text-center animate-fadeIn">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl shadow-inner">
              🏆
            </div>

            <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
              Active Recall Verified
            </span>

            <h2 className="mt-3 font-serif text-3xl font-extrabold text-slate-900">
              {finalScore >= 2 ? "Conceptual Mastery Unlocked!" : "Quiz Review Completed"}
            </h2>

            <p className="mt-2 text-base text-slate-600 max-w-lg mx-auto">
              You correctly reasoned through {finalScore} of {QUESTIONS.length} conceptual and edge-case transfer questions.
            </p>

            {/* Reward Box */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs font-bold text-slate-400 uppercase">SCORE</span>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {Math.round((finalScore / QUESTIONS.length) * 100)}%
                </p>
                <p className="text-xs text-slate-500">{finalScore} / {QUESTIONS.length} correct</p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                <span className="text-xs font-bold text-amber-700 uppercase">XP REWARD</span>
                <p className="mt-1 text-2xl font-black text-amber-900">+50 XP</p>
                <p className="text-xs text-amber-700 font-medium">Added to student profile</p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                <span className="text-xs font-bold text-emerald-700 uppercase">TREE STATUS</span>
                <p className="mt-1 text-lg font-black text-emerald-950 flex items-center gap-1.5">
                  <span>🟢</span>
                  <span>Mastered</span>
                </p>
                <p className="text-xs text-emerald-700 font-medium">Updated from 🔴 Misconception</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/mastery")}
                className="w-full sm:w-auto rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95 cursor-pointer"
              >
                Inspect Updated Knowledge Tree →
              </button>

              <button
                type="button"
                onClick={() => navigate("/educator")}
                className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                View Class Misconception Heatmap
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="text-xs text-slate-500 hover:text-slate-800 underline py-2 cursor-pointer"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        ) : (
          /* Active Question View */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Interactive Question Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-8 flex flex-col justify-between">
              <div>
                {/* Question Header & Progress Bar */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                      QUESTION {currentQ.questionNumber} OF {currentQ.totalQuestions}
                    </span>
                    <div className="h-2 w-32 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${(currentQ.questionNumber / currentQ.totalQuestions) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 uppercase">
                    {currentQ.category}
                  </span>
                </div>

                {/* Question Text */}
                <h2 className="mt-6 font-serif text-2xl font-bold text-slate-900 leading-snug">
                  {currentQ.questionText}
                </h2>

                {/* Options List */}
                <div className="mt-6 space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = selectedId === opt.id;
                    const isOptionCorrect = isChecked && opt.id === currentQ.correctOptionId;
                    const isOptionWrong = isChecked && isSelected && opt.id !== currentQ.correctOptionId;

                    let cardClass = "border-slate-200 bg-white hover:border-slate-300 text-slate-800";
                    if (isSelected && !isChecked) {
                      cardClass = "border-blue-600 bg-blue-50/50 text-blue-950 ring-1 ring-blue-600";
                    }
                    if (isOptionCorrect) {
                      cardClass = "border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500";
                    } else if (isOptionWrong) {
                      cardClass = "border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-500";
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelect(opt.id)}
                        disabled={isChecked}
                        className={`w-full rounded-xl border p-4 text-left transition flex items-center justify-between cursor-pointer ${cardClass}`}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="text-sm font-medium leading-relaxed">
                            {opt.text}
                          </span>
                        </div>

                        {isChecked && opt.id === currentQ.correctOptionId && (
                          <span className="text-emerald-600 font-bold text-sm">✓ Correct</span>
                        )}
                        {isChecked && isSelected && opt.id !== currentQ.correctOptionId && (
                          <span className="text-rose-600 font-bold text-sm">✗ Incorrect</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card upon checking */}
                {isChecked && (
                  <div
                    className={`mt-6 rounded-xl border p-4 text-sm leading-relaxed ${
                      isCorrect
                        ? "border-emerald-200 bg-emerald-50/70 text-emerald-950"
                        : "border-amber-200 bg-amber-50/70 text-amber-950"
                    }`}
                  >
                    <p className="font-bold text-xs uppercase tracking-wider mb-1">
                      {isCorrect ? "🎯 Correct Reasoning" : "💡 Pedagogical Insight"}
                    </p>
                    <p>{currentQ.explanation}</p>
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <span className="text-xs text-slate-500">
                  {isChecked ? "Response evaluated" : "Select an option to evaluate"}
                </span>

                <div className="flex items-center gap-3">
                  {!isChecked ? (
                    <button
                      type="button"
                      onClick={handleCheckAnswer}
                      disabled={!selectedId}
                      className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{currentIndex === QUESTIONS.length - 1 ? "Finish Quiz & Verify" : "Next Question"}</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Why Active Recall Works */}
            <div className="space-y-6 lg:col-span-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4">
                  THE PEDAGOGICAL METHOD
                </h3>
                <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <p className="font-bold text-slate-900 mb-1">1. Socratic Inquiry</p>
                    <p>Instead of ChatGPT feeding you lines of code, Socratix guided you to isolate the bug yourself.</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <p className="font-bold text-slate-900 mb-1">2. Active Retrieval</p>
                    <p>Testing your newly formed mental model immediately after the breakthrough stops the "forgetting curve".</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                    <p className="font-bold text-slate-900 mb-1">3. Mastery Tree Propagation</p>
                    <p>Passing this quiz permanently unlocks prerequisite nodes and clears teacher alert flags.</p>
                  </div>
                </div>
              </div>

              {/* Current Tree Node Status Widget */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Target Concept</h4>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      nodes.bst.status === "mastery"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {nodes.bst.status === "mastery" ? "Mastered" : "Misconception"}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">BST Node Deletion</p>
                <p className="text-xs text-slate-500 mt-1">
                  {nodes.bst.status === "mastery"
                    ? "In-order successor concept verified!"
                    : "Pass this quiz with ≥66% to resolve misconception"}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SocratixQuiz;
