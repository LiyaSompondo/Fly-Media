import { Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import Dashboard from "./Pages/Dashboard";
import Upload from "./components/FileUpload";
import Calendar from "./components/Calendar";

function App() {
  return (
    <Routes>
      {/* Default route → AuthPage */}
      <Route path="/*" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/calendar" element={<Calendar />} />
    </Routes>
  );
}

export default App;
