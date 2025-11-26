import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../contexts/DataContext';
import { MapPin, Phone, Truck, Clock } from 'lucide-react';

export default function AnjemList() {
  const { anjem: data, loading, error } = useContext(DataContext);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const toWaNumber = (raw) => {
    if (!raw) return ''
    const s = String(raw).trim()
    // remove non-digit characters but keep leading + for detection
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
        <h2>Daftar Antar Jemput</h2>
        <button onClick={() => navigate('/add?type=anjem')}>Tambah</button>
      </div>

      <div style={{ marginTop: 12 }} className="card">
        {loading?.anjem && <p className="muted">Memuat...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="list">
          {(!data || data.length === 0) && !loading?.anjem ? (
            <p className="muted">Tidak ada data.</p>
          ) : null}

          {data && data.map((item) => (
            <div className="list-item" key={item.id} onClick={() => setSelected(item)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setSelected(item) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.nama}</div>
                  <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <MapPin size={14} /> {item.lokasi_jangkauan}
                  </div>
                </div>
                <div className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Truck size={14} /> {item.tipe_kendaraan}
                </div>
              </div>
              <div className="muted" style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                <Phone size={14} /> {item.nomor_telepon}
                <Clock size={14} /> {item.waktu_siap} • {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
          ))}

          {/* Modal detail */}
          {selected && (
            <div className="modal-overlay" onClick={() => setSelected(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div style={{ fontWeight: 800 }}>{selected.nama}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {selected.nomor_telepon && (
                        <a href={`https://wa.me/${toWaNumber(selected.nomor_telepon)}`} target="_blank" rel="noreferrer">
                          <button type="button" style={{ background: '#25D366', color: '#042A1F' }}>Chat WA</button>
                        </a>
                      )}
                      <button onClick={() => setSelected(null)}>Tutup</button>
                    </div>
                </div>
                <div className="modal-body">
                  <div style={{ marginBottom: 8 }}><strong>Lokasi jangkauan:</strong> {selected.lokasi_jangkauan}</div>
                  <div style={{ marginBottom: 8 }}><strong>Nomor telepon:</strong> {selected.nomor_telepon}</div>
                  <div style={{ marginBottom: 8 }}><strong>Waktu siap:</strong> {selected.waktu_siap}</div>
                  <div style={{ marginBottom: 8 }}><strong>Tipe kendaraan:</strong> {selected.tipe_kendaraan}</div>
                  <div style={{ marginBottom: 8 }}><strong>Hari siap:</strong> {selected.hari_siap}</div>
                  <div style={{ marginTop: 12 }} className="muted">Dibuat: {new Date(selected.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
