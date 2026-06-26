import React from 'react';
import { useEliteStore } from './store/useEliteStore';
import Sidebar from './components/layouts/Sidebar';
import Topbar from './components/layouts/Topbar';

// Page Imports
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import BIMViewer from './pages/BIMViewer';
import Budgets from './pages/Budgets';
import Planning from './pages/Planning';
import Personnel from './pages/Personnel';
import Inspections from './pages/Inspections';
import Documental from './pages/Documental';
import AIAssistant from './pages/AIAssistant';
import ExecutiveReports from './pages/ExecutiveReports';
import GISMap from './pages/GISMap';
import Config from './pages/Config';
import Standards from './pages/Standards';

export default function App() {
  const { isAuthenticated, currentPage } = useEliteStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  // Router dispatcher based on store state
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Projects />;
      case 'bim':
        return <BIMViewer />;
      case 'budgets':
        return <Budgets />;
      case 'planning':
        return <Planning />;
      case 'personnel':
        return <Personnel />;
      case 'inspections':
        return <Inspections />;
      case 'docs':
        return <Documental />;
      case 'ai':
        return <AIAssistant />;
      case 'reports':
        return <ExecutiveReports />;
      case 'map':
        return <GISMap />;
      case 'config':
        return <Config />;
      case 'standards':
        return <Standards />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-carbon-900 text-smoke">
      {/* Dynamic Collapsible Sidebar Layout */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Responsive Top Navigation */}
        <Topbar />

        {/* Scrollable Container Mount */}
        <main className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.05),transparent_60%)]">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
