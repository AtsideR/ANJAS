import React from 'react'

export default function Profile() {
  return (
    <div className="app-shell">
      <div className="card header-row">
        <div>
          <h2>Profil</h2>
          <div className="muted">Informasi anggota dan deskripsi singkat proyek</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }} className="page-grid">
        <div>
          <div className="card">
            <h3>Anggota</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <div className="field"><strong>Nama:</strong> <span>[Redista Rakha Izza]</span></div>
              <div className="field"><strong>NIM:</strong> <span>[21120123130085]</span></div>
              <div className="field"><strong>Kelompok:</strong> <span>[23]</span></div>
            </div>
          </div>

          <div style={{ marginTop: 12 }} className="card">
            <h3>Tentang Proyek</h3>
            <p className="muted">
              Proyek ini adalah antarmuka frontend sederhana yang terhubung ke API publik
              <code>https://api-anjas.vercel.app/</code>. Fitur utama:
            </p>
            <ul>
              <li>Dashboard menampilkan entri terbaru untuk antar jemput dan jasa titip.</li>
              <li>Halaman daftar lengkap dan form untuk menambah data.</li>
              <li>Tata letak modern, responsif, dan mudah dikembangkan.</li>
            </ul>
          </div>
        </div>

        <aside className="sidebar">
          <div className="card">
            <h4>Catatan</h4>
            <p className="muted">Projek ini merupakan projek tugas akhir dari mata kuliah praktikum pemrograman perangkat bergerak.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
