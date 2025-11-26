import React, { useEffect, useState, useContext } from 'react'
import { getSiteInfo } from '../api'
import { DataContext } from '../contexts/DataContext'

export default function Dashboard() {
  const [site, setSite] = useState({ name: 'API Anjas' })
  const { anjem, jastip } = useContext(DataContext)
  const anjemLatest = anjem && anjem.length ? anjem[0] : null
  const jastipLatest = jastip && jastip.length ? jastip[0] : null

  useEffect(() => {
    getSiteInfo().then((s) => s && setSite(s)).catch(() => {})
  }, [])

  return (
    <div className="app-shell">
      <div className="card hero-card">
        <img src="https://ppb-mod-5-kel-23.vercel.app/assets/LOGORN-BxI8C0zb.png" alt="logo" style={{ width: 92, height: 92, borderRadius: 12, marginBottom: 12 }} />
        <h1 style={{ margin: 0, fontSize: '2.4rem', lineHeight: 1 }}>{'ANJAS'}</h1>
        <h3 style={{ marginTop: 6, marginBottom: 12, fontWeight: 500 }}>Antar Jemput & Jasa Titip</h3>
        <p className="muted">Sistem sederhana untuk menampilkan dan menambah entri antar jemput serta jasa titip.</p>

        <div style={{ marginTop: 18, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ height: 8, background: '#eef2ff', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg,#6366f1,#7c3aed)' }} />
          </div>
          <div className="muted" style={{ marginTop: 8, fontSize: 13 }}>Memuat aplikasi... 60%</div>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="page-grid">
        <div>
          <div className="card">
            <h3>Antar Jemput (Terbaru)</h3>
            {anjemLatest ? (
              <div className="list-item">
                <div><strong>{anjemLatest.nama}</strong> — <span className="muted">{anjemLatest.lokasi_jangkauan}</span></div>
                <div className="muted">{anjemLatest.tipe_kendaraan} • {anjemLatest.hari_siap} • {anjemLatest.waktu_siap}</div>
              </div>
            ) : (
              <p className="muted">Tidak ada data antar jemput.</p>
            )}
          </div>

          <div style={{ marginTop: 12 }} className="card">
            <h3>Jasa Titip (Terbaru)</h3>
            {jastipLatest ? (
              <div className="list-item">
                <div><strong>{jastipLatest.nama}</strong> — <span className="muted">{jastipLatest.lokasi_jastip}</span></div>
                <div className="muted">Waktu tunggu: {jastipLatest.waktu_tunggu}</div>
              </div>
            ) : (
              <p className="muted">Tidak ada data jasa titip.</p>
            )}
          </div>
        </div>

        <aside className="sidebar">
          <div className="card">
            <h4>Ringkasan</h4>
            <p className="muted">Gunakan menu untuk melihat daftar lengkap atau menambah data baru.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
