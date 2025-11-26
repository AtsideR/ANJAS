import React, { useEffect, useState, useContext } from 'react'
import { getSiteInfo } from '../api' // Pastikan path ini benar sesuai struktur folder Anda
import { DataContext } from '../contexts/DataContext'
import './Dashboard.css' // Jangan lupa import CSS baru ini

export default function Dashboard() {
  const [site, setSite] = useState({ name: 'API Anjas' })
  const { anjem, jastip } = useContext(DataContext)
  
  // Ambil 3 data terbaru agar tampilan tidak terlalu kosong
  const anjemLatest = anjem ? anjem.slice(0, 3) : []
  const jastipLatest = jastip ? jastip.slice(0, 3) : []

  useEffect(() => {
    // Dummy prevention jika getSiteInfo belum ada
    if (typeof getSiteInfo === 'function') {
        getSiteInfo().then((s) => s && setSite(s)).catch(() => {})
    }
  }, [])

  return (
    <div className="dashboard-wrapper">
      {/* HERO SECTION - Full Width */}
      <div className="card hero-card">
        <div className="hero-content">
            <img 
              src="https://ppb-mod-5-kel-23.vercel.app/assets/LOGORN-BxI8C0zb.png" 
              alt="logo" 
              className="hero-logo" 
            />
            <div className="hero-text">
                <h1 className="hero-title">{'ANJAS'}</h1>
                <h3 className="hero-subtitle">Antar Jemput & Jasa Titip</h3>
                <p className="muted">Sistem monitoring aktivitas antar jemput dan jasa titip terkini.</p>
            </div>
        </div>

      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="dashboard-grid">
        
        {/* KOLOM KIRI: Antar Jemput */}
        <div className="card grid-item">
            <div className="card-header">
                <h3>Antar Jemput (Terbaru)</h3>
                <span className="badge">Update</span>
            </div>
            
            {anjemLatest.length > 0 ? (
                <div className="list-container">
                    {anjemLatest.map((item, index) => (
                        <div key={index} className="list-item">
                            <div className="item-head">
                                <strong>{item.nama}</strong>
                                <span className="tag-location">{item.lokasi_jangkauan}</span>
                            </div>
                            <div className="muted item-details">
                                {item.tipe_kendaraan} • {item.hari_siap} • {item.waktu_siap}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="muted empty-state">Tidak ada data antar jemput.</p>
            )}
        </div>

        {/* KOLOM TENGAH: Jasa Titip */}
        <div className="card grid-item">
            <div className="card-header">
                <h3>Jasa Titip (Terbaru)</h3>
                <span className="badge">Baru</span>
            </div>

            {jastipLatest.length > 0 ? (
                <div className="list-container">
                    {jastipLatest.map((item, index) => (
                        <div key={index} className="list-item">
                            <div className="item-head">
                                <strong>{item.nama}</strong>
                                <span className="tag-location">{item.lokasi_jastip}</span>
                            </div>
                            <div className="muted item-details">
                                Waktu tunggu: {item.waktu_tunggu}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="muted empty-state">Tidak ada data jasa titip.</p>
            )}
        </div>

        {/* KOLOM KANAN: Sidebar / Info */}
        <aside className="card grid-item sidebar-card">
            <h4>Ringkasan</h4>
            <p className="muted">Halo, Selamat datang kembali!</p>
            <div className="stats-box">
                <div className="stat">
                    <span className="stat-num">{anjem ? anjem.length : 0}</span>
                    <span className="stat-label">Driver</span>
                </div>
                <div className="stat">
                    <span className="stat-num">{jastip ? jastip.length : 0}</span>
                    <span className="stat-label">Titipan</span>
                </div>
            </div>
            <p className="muted small-text mt-4">Gunakan tombol (+) di bawah/atas untuk menambah data.</p>
        </aside>

      </div>
    </div>
  )
}