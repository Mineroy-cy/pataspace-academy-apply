import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';

const Landing = lazy(() => import('./pages/Landing'));
const ApplicationWizard = lazy(() => import('./pages/application/ApplicationWizard'));

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="rounded-xl border border-white/10 bg-brand-card px-5 py-3 text-sm text-white/70">Loading page...</div>
  </div>
);

function App() {
  return (
    <>
      <Layout>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/apply" element={<ApplicationWizard />} />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
    </>
  );
}

export default App;
