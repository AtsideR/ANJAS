import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DataContext } from '../contexts/DataContext'
import { MapPin, Phone, Clock, Box } from 'lucide-react'

export default function JastipList() {
  const { jastip: data, loading, error } = useContext(DataContext)
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const toWaNumber = (raw) => {
    if (!raw) return ''
    const s = String(raw).trim()
    const onlyDigits = s.replace(/[^+0-9]/g, '')
    if (onlyDigits.startsWith('+')) {
      return onlyDigits.replace(/^\+/, '')
    }
    const digits = onlyDigits.replace(/\D/g, '')
    if (digits.startsWith('0')) return '62' + digits.slice(1)
    return digits
  }

  return (
    <div className="app-shell">
      <div className="card header-row">
        <h2>Daftar Jasa Titip</h2>
        <button onClick={() => navigate('/add?type=jastip')}>Tambah</button>
      </div>

      <div style={{ marginTop: 12 }} className="card">
        {loading?.jastip && <p className="muted">Memuat...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="list">
          {(!data || data.length === 0) && !loading?.jastip ? <p className="muted">Tidak ada data.</p> : null}
          {data && data.map((item) => (
            <div className="list-item" key={item.id} onClick={() => setSelected(item)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setSelected(item) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.nama}</div>
                  <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <MapPin size={14} /> {item.lokasi_jastip}
                  </div>
                </div>
                <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Box size={14} /> {item.waktu_tunggu}
                </div>
              </div>
              <div className="muted" style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                <Phone size={14} /> {item.nomor_hp}
                <Clock size={14} /> {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
          ))}

          {selected && (
            <div className="modal-overlay" onClick={() => setSelected(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{ fontWeight: 800 }}>{selected.nama}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {selected.nomor_hp && (
                      <a href={`https://wa.me/${toWaNumber(selected.nomor_hp)}`} target="_blank" rel="noreferrer">
                        <button type="button" style={{ background: '#25D366', color: '#042A1F' }}>Chat WA</button>
                      </a>
                    )}
                    <button onClick={() => setSelected(null)}>Tutup</button>
                  </div>
                </div>
                <div className="modal-body">
                  <div style={{ marginBottom: 8 }}><strong>Lokasi jastip:</strong> {selected.lokasi_jastip}</div>
                  <div style={{ marginBottom: 8 }}><strong>Waktu tunggu:</strong> {selected.waktu_tunggu}</div>
                  <div style={{ marginBottom: 8 }}><strong>Nomor HP:</strong> {selected.nomor_hp}</div>
                  <div style={{ marginTop: 12 }} className="muted">Dibuat: {new Date(selected.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
