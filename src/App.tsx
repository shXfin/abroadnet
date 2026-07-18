import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import SuccessStories from "./pages/SuccessStories";
import Apply from "./pages/Apply";
import BookSession from "./pages/BookSession";
import Malaysia from "./pages/destinations/Malaysia";
import Romania from "./pages/destinations/Romania";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="destinations/malaysia" element={<Malaysia />} />
        <Route path="destinations/romania" element={<Romania />} />
        <Route path="success-stories" element={<SuccessStories />} />
        <Route path="about" element={<About />} />
        <Route path="apply" element={<Apply />} />
        <Route path="book-session" element={<BookSession />} />
      </Route>
    </Routes>
  );
}
