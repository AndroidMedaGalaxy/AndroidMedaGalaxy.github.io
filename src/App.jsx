import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Experience from './pages/Experience.jsx';
import Articles from './pages/Articles.jsx';
import Contact from './pages/Contact.jsx';
import Projects from './pages/Projects.jsx';
import Interests from './pages/Interests.jsx';
import MascotFloating from './components/MascotFloating.jsx';

function AppInner() {
    const basename = import.meta.env.BASE_URL || '/personal-site/';
    const location = useLocation();
    // Home mascot custom position: right edge of info (text) block + 10px. Approximate value, tune as needed.
    // If grid changes, update homeLeft accordingly.
    // E.g., base left column is max-w-5xl (80rem ~1280px), split 2fr:1.3fr, profile padding left 1rem (16px), info width ~width of first grid col.
    // We'll use homeLeft about 420px for typical screen + 10px gap => 430px. Tune visually.
    const mascotHomeProps = location.pathname === '/'
        ? {isOnHomePage: true, homeScale: 1.5, homeLeft: 430, homeTop: 80}
        : {isOnHomePage: false};
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/experience" element={<Experience/>}/>
                <Route path="/articles" element={<Articles/>}/>
                <Route path="/projects" element={<Projects/>}/>
                <Route path="/interests" element={<Interests/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Routes>
            <Footer/>
            <MascotFloating/>
        </div>
    );
}

export default function App() {
    const basename = import.meta.env.BASE_URL || '/personal-site/';
    return (
        <BrowserRouter basename={basename}>
            <AppInner/>
        </BrowserRouter>
    );
}
