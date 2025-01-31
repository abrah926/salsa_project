import { Switch, Route } from "wouter";
import { queryClient } from "@/components/queryClient";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/navigation/bottom-nav";
import Home from "@/pages/home";
import Events from "@/pages/events";
import EventDetails from "@/pages/event-details";
import CreateEvent from "@/pages/create-event";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import ErrorPage from "@/pages/error-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventDetails} />
      <Route path="/create" component={CreateEvent} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen pb-16">
        <ErrorBoundary fallback={<ErrorPage />}>
          <Router />
          <BottomNav />
        </ErrorBoundary>
      </main>
      <Toaster />
    </QueryClientProvider>
  );
}

function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return fallback;
  }

  return children;
}

export default App;
