import { useState } from 'react';
import { classNames } from '../utils';
import Button from './UI/Button';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Memories', route: '/' },
  { label: 'Book Appointment', route: '/booking' },
  { label: 'Custom Products', route: '/products' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (route: string) => {
    setOpen(false);
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-cream/85 px-5 py-3 shadow-[0_14px_46px_rgba(111,81,66,0.09)] backdrop-blur-xl sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <button onClick={() => go('/')} className="group flex items-center gap-3 rounded-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-petal text-lg text-cocoa premium-shadow transition group-hover:scale-105">♥</span>
          <span>
            <span className="block font-display text-lg font-semibold leading-none text-ink">Little Forever</span>
            <span className="mt-1 block font-body text-xs font-medium uppercase text-cocoa/60">Studio</span>
          </span>
        </button>

        <div className="hidden items-center gap-2 rounded-full bg-white/55 p-1 shadow-soft ring-1 ring-white/80 md:flex">
          {navItems.map((item) => (
            <button key={item.route} onClick={() => go(item.route)} className={classNames('rounded-full px-5 py-2.5 text-sm font-medium transition', window.location.pathname === item.route ? 'bg-ink text-cream shadow-soft' : 'text-cocoa hover:bg-white/80')}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <Button onClick={() => go('/booking')} className="px-5 py-2.5">Create Your Memory</Button>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="grid h-11 w-11 place-items-center rounded-full bg-white/75 text-cocoa shadow-soft ring-1 ring-white/80 md:hidden" aria-label="Toggle menu">
          <span className="text-xl">{open ? '×' : '☰'}</span>
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-3xl bg-white/90 p-2 shadow-soft ring-1 ring-white">
          {navItems.map((item) => (
            <button key={item.route} onClick={() => go(item.route)} className={classNames('block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition', window.location.pathname === item.route ? 'bg-petal text-ink' : 'text-cocoa hover:bg-cream')}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
