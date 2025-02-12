import { Suspense, lazy, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/navigation/bottom-nav";
import Events from "@/pages/events";  // Direct import for Events page
import EventDetails from "@/pages/event-details";
import Home from "@/pages/home";
import fetchEvents from "@/hooks/useEvents";

// Lazy load other pages
const Calendar = lazy(() => import("@/pages/calendar"));
const CreateEvent = lazy(() => import("@/pages/create-event"));
const Contact = lazy(() => import("@/pages/contact"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Create a new QueryClient instance
const queryClient = new QueryClient();

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
  const queryClient = useQueryClient();

  // Prefetch events when app loads
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["events"],
      queryFn: fetchEvents
    });
  }, [queryClient]);

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
