
import { Navigate, Route, Routes } from "react-router-dom";
import { Feed } from "./pages/Feed";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Profile } from "./pages/Profile";
import { FollowList } from "./pages/FollowList";
import { Search } from "./pages/Search";
import { Notifications } from "./pages/Notifications";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/users/:username" element={<Profile />} />
        <Route path="/users/:username/followers" element={<FollowList type="followers" />} />
        <Route path="/users/:username/following" element={<FollowList type="following" />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
