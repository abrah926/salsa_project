import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "@/components/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/navigation/bottom-nav";
import Home from "@/pages/home";  // Keep Home eager loaded

// Lazy load non-critical pages
const Events = lazy(() => import("@/pages/events"));
const EventDetails = lazy(() => import("@/pages/event-details"));
const CreateEvent = lazy(() => import("@/pages/create-event"));
const Contact = lazy(() => import("@/pages/contact"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Suspense>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/events" component={Events} />
        <Route path="/events/:id" component={EventDetails} />
        <Route path="/create" component={CreateEvent} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
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
