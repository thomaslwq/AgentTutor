import { Navigate, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AppProvider } from "@/store/AppContext";
import { Layout } from "@/components/Layout";
import TutorSelectPage from "@/pages/TutorSelectPage/TutorSelectPage";
import CoursesPage from "@/pages/CoursesPage/CoursesPage";
import LearningPage from "@/pages/LearningPage/LearningPage";
import WalletPage from "@/pages/WalletPage/WalletPage";
import PlatformPage from "@/pages/PlatformPage/PlatformPage";
import CommunityPage from "@/pages/CommunityPage/CommunityPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<TutorSelectPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="learning/:courseId" element={<LearningPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="platform" element={<PlatformPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="curriculum" element={<Navigate to="/courses" replace />} />
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
    </AppProvider>
  );
}
