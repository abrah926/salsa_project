import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/navigation/bottom-nav";
import Home from "@/pages/home";
import Events from "@/pages/events";
import EventDetails from "@/pages/event-details";
import CreateEvent from "@/pages/create-event";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

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
        <Router />
        <BottomNav />
      </main>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
