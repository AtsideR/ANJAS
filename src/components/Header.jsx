import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Truck, Package, User, PlusCircle } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()

  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand">
          <img src="https://ppb-mod-5-kel-23.vercel.app/assets/LOGORN-BxI8C0zb.png" alt="logo" className="logo" />
          <div className="brand-text">
            <div className="brand-title">Project-Anjas</div>
            <div className="muted">Antar Jemput & Jasa Titip</div>
          </div>
        </div>

        <nav className="nav-links" role="navigation">
          <NavLink to="/" className={linkClass}>Beranda</NavLink>
          <NavLink to="/anjem" className={linkClass}>Antar Jemput</NavLink>
          <NavLink to="/jastip" className={linkClass}>Jasa Titip</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
        </nav>

        <div className="header-actions">
          <button className="cta-button" onClick={() => navigate('/add')}>
            <PlusCircle size={16} style={{ marginRight: 8 }} />
            Tambah
          </button>
        </div>
      </div>

      {/* mobile bottom nav removed — single top header used for all sizes */}
    </header>
  )
}
