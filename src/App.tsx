import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import SuccessStories from "./pages/SuccessStories";
import Apply from "./pages/Apply";
import BookSession from "./pages/BookSession";
import Onboarding from "./pages/Onboarding";
import Linguaskill from "./pages/Linguaskill";
import ComingSoon from "./pages/destinations/ComingSoon";
import DestinationsIndex from "./pages/destinations/DestinationsIndex";
import Malaysia from "./pages/destinations/Malaysia";
import Romania from "./pages/destinations/Romania";
import Georgia from "./pages/destinations/Georgia";
import China from "./pages/destinations/China";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="destinations" element={<DestinationsIndex />} />
        <Route path="destinations/malaysia" element={<Malaysia />} />
        <Route path="destinations/romania" element={<Romania />} />
        <Route path="destinations/georgia" element={<Georgia />} />
        <Route path="destinations/china" element={<China />} />
        <Route path="success-stories" element={<SuccessStories />} />
        <Route path="about" element={<About />} />
        <Route path="apply" element={<Apply />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="book-session" element={<BookSession />} />
        <Route path="linguaskill" element={<Linguaskill />} />
        <Route path="destinations/:slug" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}
