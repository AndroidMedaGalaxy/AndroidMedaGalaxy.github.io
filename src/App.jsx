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
import { ThemeProvider } from './context/ThemeContext.jsx';

function AppInner() {
    const location = useLocation();
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            <Navbar/>
            <div className="pt-[57px]">{/* Padding to compensate for fixed navbar */}
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/experience" element={<Experience/>}/>
                <Route path="/articles" element={<Articles/>}/>
                <Route path="/projects" element={<Projects/>}/>
                <Route path="/interests" element={<Interests/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Routes>
            </div>
            <Footer/>
            <MascotFloating/>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AppInner/>
            </ThemeProvider>
        </BrowserRouter>
    );
}
