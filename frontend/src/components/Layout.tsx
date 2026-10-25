import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};
