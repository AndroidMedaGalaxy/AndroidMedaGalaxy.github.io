import { NavLink } from 'react-router-dom';
import {useState} from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/experience', label: 'Experience' },
    {to: '/projects', label: 'My Projects'},
    {to: '/interests', label: 'Interests'},
  { to: '/articles', label: 'Articles' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    return (
        <>
            <header className="sticky top-0 z-20 border-b border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur transition-colors">
                <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    {/* Hamburger menu at left, only visible on mobile */}
                    <button
              className="md:hidden text-slate-900 dark:text-slate-100 focus:outline-none mr-2"
              aria-label="Open mobile menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
              <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-400 dark:border-slate-600">
                      <img
                          src={`${import.meta.env.BASE_URL}images/droidmeda_welding.png`}
                          alt="DroidMeda"
                          className="h-full w-full object-cover object-center"
                      />
                  </div>
              </div>
              {/* Desktop menu */}
              <ul className="hidden md:flex gap-4 text-sm items-center">
              {navItems.map((item) => (
                  <li key={item.to}>
                      <NavLink
                          to={item.to}
                          end={item.to === '/'}
                          className={({isActive}) =>
                              [
                                  'px-2 py-1 transition-colors',
                                  isActive ? 'text-teal-500 dark:text-teal-300' : 'text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-200',
                              ].join(' ')
                          }
                      >
                          {item.label}
                      </NavLink>
                  </li>
              ))}
              <li>
                  <button
                      onClick={toggleTheme}
                      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Toggle theme"
                      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                      {isDark ? (
                          // Sun icon
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                          </svg>
                      ) : (
                          // Moon icon
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                          </svg>
                      )}
                  </button>
              </li>
            </ul>
          </nav>
        </header>
          {mobileOpen && (
              <>
                  {/* Backdrop */}
                  <div
                      className="fixed inset-0 bg-black/60 z-30"
                      onClick={() => setMobileOpen(false)}
                  ></div>
                  {/* Drawer: solid background, outside header */}
                  <div
                      className={`fixed top-0 left-0 bottom-0 w-64 z-40 shadow-lg bg-slate-100 dark:bg-slate-950
                        transition-transform transition-opacity ease-in-out duration-800
                        ${mobileOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'}`}
                  >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-300 dark:border-slate-800">
                          <button
                              aria-label="Close menu"
                              className="text-slate-900 dark:text-slate-100 p-1"
                              onClick={() => setMobileOpen(false)}
                          >
                              <svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                   strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                          </button>
                          <button
                              onClick={toggleTheme}
                              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                              aria-label="Toggle theme"
                          >
                              {isDark ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                  </svg>
                              ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                  </svg>
                              )}
                          </button>
                      </div>
                      <ul className="flex flex-col gap-2 p-4 text-base">
                          {navItems.map((item) => (
                              <li key={item.to}>
                                  <NavLink
                                      to={item.to}
                                      end={item.to === '/'}
                                      className={({isActive}) => [
                                          'block px-3 py-2 rounded transition-colors',
                                          isActive ? 'text-teal-500 dark:text-teal-300 bg-slate-200 dark:bg-slate-900' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-900 hover:text-teal-600 dark:hover:text-teal-200',
                                      ].join(' ')}
                                      onClick={() => setMobileOpen(false)}
                                  >
                                      {item.label}
                                  </NavLink>
                              </li>
                          ))}
                      </ul>
                  </div>
              </>
          )}
      </>
    );
}
