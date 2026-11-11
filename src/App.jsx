import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { ToastProvider } from "@/context/ToastContext";
import AppRouter from "@/routes/AppRouter";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationsProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <AppRouter />
            </main>
            <Footer />
          </div>
        </NotificationsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
