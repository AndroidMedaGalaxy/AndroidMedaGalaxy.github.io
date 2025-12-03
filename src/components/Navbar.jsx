import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/experience', label: 'Experience' },
  { to: '/articles', label: 'Articles' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg overflow-hidden border border-slate-600">
            <img
              src="/images/droidmeda_welding.png"
              alt="DroidMeda"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-100">
            Rituraj Sambherao
          </span>
        </div>
        <ul className="flex gap-4 text-sm">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
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
  );
}
