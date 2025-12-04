import { NavLink } from 'react-router-dom';
import {useState} from 'react';

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

    return (
        <>
            <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
                <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    {/* Hamburger menu at left, only visible on mobile */}
                    <button
              className="md:hidden text-slate-100 focus:outline-none mr-2"
              aria-label="Open mobile menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
              <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-600">
                      <img
                          src={`${import.meta.env.BASE_URL}images/droidmeda_welding.png`}
                          alt="DroidMeda"
                          className="h-full w-full object-cover object-center"
                      />
                  </div>
              </div>
              {/* Desktop menu */}
              <ul className="hidden md:flex gap-4 text-sm">
              {navItems.map((item) => (
                  <li key={item.to}>
                      <NavLink
                          to={item.to}
                          end={item.to === '/'}
                          className={({isActive}) =>
                              [
                                  'px-2 py-1 transition-colors',
                                  isActive ? 'text-teal-300' : 'text-slate-300 hover:text-teal-200',
                              ].join(' ')
                          }
                      >
                          {item.label}
                      </NavLink>
                  </li>
              ))}
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
                      className={`fixed top-0 left-0 bottom-0 w-64 z-40 shadow-lg bg-slate-950
                        transition-transform transition-opacity ease-in-out duration-800
                        ${mobileOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none'}`}
                  >
                      <div className="flex items-center px-4 py-3 border-b border-slate-800">
                          <button
                              aria-label="Close menu"
                              className="text-slate-100 p-1"
                              onClick={() => setMobileOpen(false)}
                          >
                              <svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                   strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
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
                                          isActive ? 'text-teal-300 bg-slate-900' : 'text-slate-300 hover:bg-slate-900 hover:text-teal-200',
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
