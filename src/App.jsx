import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Experience from './pages/Experience.jsx';
import Articles from './pages/Articles.jsx';
import Contact from './pages/Contact.jsx';

export default function App() {
  const basename = import.meta.env.BASE_URL || '/personal-site/';

  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
