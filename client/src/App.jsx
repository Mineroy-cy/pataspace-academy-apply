import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import ApplicationWizard from './pages/application/ApplicationWizard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/apply" element={<ApplicationWizard />} />
        </Routes>
      </Layout>
      <Toaster position="bottom-center" toastOptions={{ className: 'font-sans' }} />
    </>
  );
}

export default App;
