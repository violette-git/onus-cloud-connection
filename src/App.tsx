import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { MusicianProfile } from "./pages/MusicianProfile";
import { MessageThread } from "./pages/MessageThread";
import { Comments } from "./pages/Comments";
import { AuthProvider } from "@/contexts/AuthContext";

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/musicians/:id" element={<MusicianProfile />} />
          <Route path="/messages/:id" element={<MessageThread />} />
          <Route path="/comments/:type/:id" element={<Comments />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};
