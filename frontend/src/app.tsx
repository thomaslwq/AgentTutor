import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage/DashboardPage";
import CurriculumPage from "@/pages/CurriculumPage/CurriculumPage";
import PlatformPage from "@/pages/PlatformPage/PlatformPage";
import CommunityPage from "@/pages/CommunityPage/CommunityPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="curriculum" element={<CurriculumPage />} />
          <Route path="platform" element={<PlatformPage />} />
          <Route path="community" element={<CommunityPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "rounded-xl !bg-card !text-foreground !border !border-border/40 shadow-md",
          },
        }}
      />
    </>
  );
}
