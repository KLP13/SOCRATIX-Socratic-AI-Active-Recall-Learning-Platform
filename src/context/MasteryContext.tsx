import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";

export type NodeStatus = "mastery" | "scaffolding" | "misconception";

export interface TreeNode {
  id: string;
  name: string;
  status: NodeStatus;
  statusLabel: string;
  description: string;
  misconceptionDetail?: string;
}

export interface MasteryContextType {
  nodes: Record<string, TreeNode>;
  xp: number;
  streak: number;
  activeBreakthrough: boolean;
  quizCompleted: boolean;
  quizScore: { correct: number; total: number };
  triggerBreakthrough: () => void;
  completeQuiz: (correct: number, total: number) => void;
  resetDemo: () => void;
  fireConfetti: () => void;
}

const INITIAL_NODES: Record<string, TreeNode> = {
  pointers: {
    id: "pointers",
    name: "Pointers",
    status: "mastery",
    statusLabel: "Verified mastery",
    description: "Direct memory addresses and reference manipulation in heap and stack.",
  },
  linkedLists: {
    id: "linkedLists",
    name: "Linked Lists",
    status: "mastery",
    statusLabel: "Verified mastery",
    description: "Linear nodes referencing next/prev pointers in dynamic memory.",
  },
  recursion: {
    id: "recursion",
    name: "Recursion",
    status: "scaffolding",
    statusLabel: "Under scaffolding",
    description: "Self-referencing function execution requiring base conditions and call stack unwind.",
  },
  trees: {
    id: "trees",
    name: "Trees",
    status: "scaffolding",
    statusLabel: "Under scaffolding",
    description: "Hierarchical data structure with root, children, and balance invariants.",
  },
  bst: {
    id: "bst",
    name: "BST Deletion",
    status: "misconception",
    statusLabel: "Misconception",
    description: "Removes a node without relinking its children.",
    misconceptionDetail: "Repeatedly set deleted node to null without finding the in-order successor to preserve binary search ordering.",
  },
};

const MasteryContext = createContext<MasteryContextType | undefined>(undefined);

export const MasteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Record<string, TreeNode>>(() => {
    const saved = localStorage.getItem("socratix_nodes");
    return saved ? JSON.parse(saved) : INITIAL_NODES;
  });

  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem("socratix_xp");
    return saved ? Number(saved) : 320;
  });

  const [streak] = useState<number>(4);
  const [activeBreakthrough, setActiveBreakthrough] = useState<boolean>(() => {
    return localStorage.getItem("socratix_breakthrough") === "true";
  });

  const [quizCompleted, setQuizCompleted] = useState<boolean>(() => {
    return localStorage.getItem("socratix_quiz_completed") === "true";
  });

  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>(() => {
    const saved = localStorage.getItem("socratix_quiz_score");
    return saved ? JSON.parse(saved) : { correct: 0, total: 3 };
  });

  useEffect(() => {
    localStorage.setItem("socratix_nodes", JSON.stringify(nodes));
    localStorage.setItem("socratix_xp", xp.toString());
    localStorage.setItem("socratix_breakthrough", activeBreakthrough.toString());
    localStorage.setItem("socratix_quiz_completed", quizCompleted.toString());
    localStorage.setItem("socratix_quiz_score", JSON.stringify(quizScore));
  }, [nodes, xp, activeBreakthrough, quizCompleted, quizScore]);

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#10b981", "#f59e0b", "#6366f1"],
      });
    } catch {
      // Fallback gracefully if canvas is unavailable
    }
  };

  const triggerBreakthrough = () => {
    setActiveBreakthrough(true);
    fireConfetti();
  };

  const completeQuiz = (correct: number, total: number) => {
    setQuizScore({ correct, total });
    setQuizCompleted(true);
    const passed = correct / total >= 0.66;

    if (passed) {
      setNodes((prev) => ({
        ...prev,
        bst: {
          ...prev.bst,
          status: "mastery",
          statusLabel: "Verified mastery",
          description: "Mastered BST node deletion with 2-child in-order successor relinking.",
          misconceptionDetail: undefined,
        },
      }));
      setXp((prev) => prev + 50);
      fireConfetti();
    }
  };

  const resetDemo = () => {
    localStorage.removeItem("socratix_nodes");
    localStorage.removeItem("socratix_xp");
    localStorage.removeItem("socratix_breakthrough");
    localStorage.removeItem("socratix_quiz_completed");
    localStorage.removeItem("socratix_quiz_score");
    setNodes(INITIAL_NODES);
    setXp(320);
    setActiveBreakthrough(false);
    setQuizCompleted(false);
    setQuizScore({ correct: 0, total: 3 });
  };

  return (
    <MasteryContext.Provider
      value={{
        nodes,
        xp,
        streak,
        activeBreakthrough,
        quizCompleted,
        quizScore,
        triggerBreakthrough,
        completeQuiz,
        resetDemo,
        fireConfetti,
      }}
    >
      {children}
    </MasteryContext.Provider>
  );
};

export const useMastery = (): MasteryContextType => {
  const context = useContext(MasteryContext);
  if (!context) {
    throw new Error("useMastery must be used within a MasteryProvider");
  }
  return context;
};
