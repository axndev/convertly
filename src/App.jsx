import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import ConversionPage from '@/pages/ConversionPage';
import FormatPage from '@/pages/FormatPage';
import CompressPage from '@/pages/CompressPage';
import GenericImageConverter from '@/pages/GenericImageConverter';
import FormatsDirectory from '@/pages/FormatsDirectory';
import ToolsIndex from '@/pages/ToolsIndex';
import AboutPage from '@/pages/AboutPage';
import { TOOL_ROUTES } from '@/pages/tools/registry';
import { CONVERSIONS, FORMAT_PAGES } from '@/lib/conversions';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/image-converter" element={<GenericImageConverter />} />
        <Route path="/image-compressor" element={<CompressPage />} />
        <Route path="/jpg-compressor" element={<CompressPage target="jpg" />} />
        <Route path="/webp-compressor" element={<CompressPage target="webp" />} />
        <Route path="/formats" element={<FormatsDirectory />} />
        <Route path="/tools" element={<ToolsIndex />} />
        <Route path="/about" element={<AboutPage />} />
        {FORMAT_PAGES.map((page) => (
          <Route key={page.slug} path={`/${page.slug}`} element={<FormatPage page={page} />} />
        ))}
        {CONVERSIONS.map((conversion) => (
          <Route key={conversion.slug} path={`/${conversion.slug}`} element={<ConversionPage conversion={conversion} />} />
        ))}
        {TOOL_ROUTES.map((tool) => (
          <Route key={tool.slug} path={`/${tool.slug}`} element={tool.element} />
        ))}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App