import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MasteryProvider } from "./context/MasteryContext";
import SocratixHome from "../screens/SocratixHome";
import SocratixWorkspace from "../screens/SocratixWorkspace";
import SocratixMastery from "../screens/SocratixMastery";
import SocratixQuiz from "../screens/SocratixQuiz";
import SocratixEducator from "../screens/SocratixEducator";

export function App() {
  return (
    <MasteryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SocratixHome />} />
          <Route path="/socratix" element={<SocratixHome />} />
          <Route path="/workspace" element={<SocratixWorkspace />} />
          <Route path="/learn/:topicId" element={<SocratixWorkspace />} />
          <Route path="/mastery" element={<SocratixMastery />} />
          <Route path="/quiz" element={<SocratixQuiz />} />
          <Route path="/quiz/:sessionId" element={<SocratixQuiz />} />
          <Route path="/educator" element={<SocratixEducator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MasteryProvider>
  );
}

export default App;
