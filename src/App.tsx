import { HashRouter, Route, Routes } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CompareBar from './components/CompareBar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Robots from './pages/Robots';
import RobotDetail from './pages/RobotDetail';
import Compare from './pages/Compare';
import Models from './pages/Models';
import Contact from './pages/Contact';

export default function App() {
  return (
    <HashRouter>
      <CompareProvider>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/robots" element={<Robots />} />
              <Route path="/robots/:id" element={<RobotDetail />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/models" element={<Models />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <CompareBar />
      </CompareProvider>
    </HashRouter>
  );
}
