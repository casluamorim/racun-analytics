import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Solutions from "./pages/Solutions";
import Schedule from "./pages/Schedule";
import Dashboard from "./pages/portal/Dashboard";
import Integrations from "./pages/portal/Integrations";
import CRM from "./pages/portal/CRM";
import Reports from "./pages/portal/Reports";
import Settings from "./pages/portal/Settings";
import MetaIntegration from "./pages/portal/MetaIntegration";

function Router() {
  // Public and private routes
  return (
    <Switch>
      {/* Public routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/recursos"} component={Resources} />
      <Route path={"/solucoes"} component={Solutions} />
      <Route path={"/agendar"} component={Schedule} />

      {/* Portal routes */}
      <Route path={"/portal/dashboard"} component={Dashboard} />
      <Route path={"/portal/integrations"} component={Integrations} />
      <Route path={"/portal/integrations/meta"} component={MetaIntegration} />
      <Route path={"/portal/crm"} component={CRM} />
      <Route path={"/portal/reports"} component={Reports} />
      <Route path={"/portal/settings"} component={Settings} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
