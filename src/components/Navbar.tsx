import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SITE_NAME, SITE_NAME_ZH } from '../data';
import { NAV_LINKS } from './navLinks';
import { MenuIcon, XIcon } from './Icons';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const cls = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive ? 'bg-accent/10 text-accent' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="text-xl font-bold tracking-tight text-white">
            {SITE_NAME.slice(0, 4)}
            <span className="text-gradient">{SITE_NAME.slice(4)}</span>
          </span>
          <span className="hidden text-xs text-slate-500 sm:inline">{SITE_NAME_ZH}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={cls}>{l.label}</NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 hover:bg-white/5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          {open ? <XIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-line bg-bg/95 px-4 py-3 md:hidden">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={cls} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
