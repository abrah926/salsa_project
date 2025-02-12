import { Suspense, lazy, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/navigation/bottom-nav";
import Events from "@/pages/events";  // Direct import for Events page
import EventDetails from "@/pages/event-details";
import Home from "@/pages/home";
import fetchEvents from "@/hooks/useEvents";

// Create QueryClient instance outside of component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
    },
  },
});

// Lazy load other pages
const Calendar = lazy(() => import("@/pages/calendar"));
const CreateEvent = lazy(() => import("@/pages/create-event"));
const Contact = lazy(() => import("@/pages/contact"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/events" component={Events} />
        <Route path="/events/:id" component={EventDetails} />
        <Route path="/create" component={CreateEvent} />
        <Route path="/contact" component={Contact} />
        <Route path="/calendar" component={Calendar} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  useEffect(() => {
    // Prefetch events
    queryClient.prefetchQuery({
      queryKey: ["events"],
      queryFn: fetchEvents
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen pb-16">
        <Router />
        <BottomNav />
      </main>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
