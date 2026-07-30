import { Suspense, lazy } from "react";
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
// Split out: the catalogue carries ~470 records of data, which measured at
// +173KB on the main bundle. Nobody landing on the homepage should pay for it.
const Universities = lazy(() => import("./pages/catalogue/Universities"));
const UniversityDetail = lazy(() => import("./pages/catalogue/UniversityDetail"));
const Courses = lazy(() => import("./pages/catalogue/Courses"));
const CourseDetail = lazy(() => import("./pages/catalogue/CourseDetail"));

/** Reserves roughly a screen so the header doesn't jump when the chunk lands. */
function RouteFallback() {
  return <div className="min-h-[70vh]" aria-busy="true" />;
}
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
        <Route
          path="universities"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Universities />
            </Suspense>
          }
        />
        <Route
          path="universities/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <UniversityDetail />
            </Suspense>
          }
        />
        <Route
          path="courses"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Courses />
            </Suspense>
          }
        />
        <Route
          path="courses/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <CourseDetail />
            </Suspense>
          }
        />
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
