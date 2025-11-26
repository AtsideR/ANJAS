import React, { useState, useContext } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { DataContext } from '../contexts/DataContext'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function AddItem() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const initialType = params.get('type') === 'jastip' ? 'jastip' : 'anjem'
  const [type, setType] = useState(initialType)
  const navigate = useNavigate()

  // anjem fields
  const [nama, setNama] = useState('')
  const [lokasiJangkauan, setLokasiJangkauan] = useState('')
  const [nomorTelepon, setNomorTelepon] = useState('')
  // allow selecting multiple waktu (pagi/siang/sore/malam)
  const [waktuSiap, setWaktuSiap] = useState(['pagi'])
  const [tipeKendaraan, setTipeKendaraan] = useState('motor')
  // allow selecting multiple hari
  const [hariSiap, setHariSiap] = useState(['senin'])

  // jastip fields
  const [lokasiJastip, setLokasiJastip] = useState('')
  const [waktuTunggu, setWaktuTunggu] = useState('12:00:00')
  const [nomorHp, setNomorHp] = useState('')

  // (removed display/countdown field `tampil_menit` — not supported by API)

  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})
  

  const resetFields = () => {
    setNama('')
    setLokasiJangkauan('')
    setNomorTelepon('')
    setWaktuSiap(['pagi'])
    setTipeKendaraan('motor')
    setHariSiap(['senin'])
    setLokasiJastip('')
    setWaktuTunggu('12:00:00')
    setNomorHp('')
  }

  const { addAnjem, addJastip } = useContext(DataContext)

  const validate = () => {
    const e = {}
    if (!nama || nama.trim().length < 2) e.nama = 'Nama minimal 2 karakter'
    if (type === 'anjem') {
      if (!lokasiJangkauan) e.lokasiJangkauan = 'Lokasi jangkauan wajib diisi'
      if (!nomorTelepon) e.nomorTelepon = 'Nomor telepon wajib diisi'
      if (!waktuSiap || (Array.isArray(waktuSiap) && waktuSiap.length === 0)) e.waktuSiap = 'Pilih minimal satu waktu siap'
      if (!hariSiap || (Array.isArray(hariSiap) && hariSiap.length === 0)) e.hariSiap = 'Pilih minimal satu hari siap'
    } else {
      if (!lokasiJastip) e.lokasiJastip = 'Lokasi jastip wajib diisi'
      if (!nomorHp) e.nomorHp = 'Nomor HP wajib diisi'
    }
    // no client-side display-duration validation — server doesn't support this column
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')

    try {
      if (type === 'anjem') {
        const payload = {
          nama: nama || 'Anon',
          lokasi_jangkauan: lokasiJangkauan,
          nomor_telepon: nomorTelepon,
          // send as comma-separated string to match existing single-column APIs
          waktu_siap: Array.isArray(waktuSiap) ? waktuSiap.join(',') : String(waktuSiap),
          tipe_kendaraan: tipeKendaraan,
          hari_siap: Array.isArray(hariSiap) ? hariSiap.join(',') : String(hariSiap),
        }
        await addAnjem(payload)
        setStatus({ ok: true, message: 'Antar jemput berhasil ditambahkan.' })
        resetFields()
        setTimeout(() => navigate('/anjem'), 800)
      } else {
        const payload = {
          nama: nama || 'Anon',
          lokasi_jastip: lokasiJastip,
          waktu_tunggu: waktuTunggu,
          nomor_hp: nomorHp,
        }
        await addJastip(payload)
        setStatus({ ok: true, message: 'Jasa titip berhasil ditambahkan.' })
        resetFields()
        setTimeout(() => navigate('/jastip'), 800)
      }
    } catch (err) {
      setStatus({ ok: false, message: err.message || 'Gagal mengirim data' })
    }
  }
  

  return (
    <div>
      <h2>Tambah Data</h2>
      <form onSubmit={submit} className="card" style={{ maxWidth: 820 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{type === 'anjem' ? 'Tambah Antar Jemput' : 'Tambah Jasa Titip'}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/"><button type="button" style={{ background: '#eef2ff', color: '#0f172a' }}><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Kembali</button></Link>
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="field">
          <label> Tipe </label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="anjem">Antar Jemput</option>
            <option value="jastip">Jasa Titip</option>
          </select>
        </div>

        <div className="form-grid" style={{ marginTop: 12 }}>
          <div className="field">
            <label>Nama</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama penyedia" />
            {errors.nama && <div className="alert alert-error">{errors.nama}</div>}
          </div>

          {type === 'anjem' ? (
            <div className="field">
              <label>Lokasi Jangkauan</label>
              <input value={lokasiJangkauan} onChange={(e) => setLokasiJangkauan(e.target.value)} placeholder="Contoh: Gondang" />
              {errors.lokasiJangkauan && <div className="alert alert-error">{errors.lokasiJangkauan}</div>}
            </div>
          ) : (
            <div className="field">
              <label>Lokasi Jastip</label>
              <input value={lokasiJastip} onChange={(e) => setLokasiJastip(e.target.value)} placeholder="Contoh: Mall XYZ" />
              {errors.lokasiJastip && <div className="alert alert-error">{errors.lokasiJastip}</div>}
            </div>
          )}
        </div>

        <div className="form-grid" style={{ marginTop: 6 }}>
          {type === 'anjem' ? (
            <>
              <div className="field">
                <label>Nomor Telepon</label>
                <input value={nomorTelepon} onChange={(e) => setNomorTelepon(e.target.value)} placeholder="0812xxxx" />
                {errors.nomorTelepon && <div className="alert alert-error">{errors.nomorTelepon}</div>}
              </div>

              <div className="field">
                <label>Waktu Siap (pilih satu atau lebih)</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['pagi', 'siang', 'sore', 'malam'].map((w) => (
                    <label key={w} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={Array.isArray(waktuSiap) ? waktuSiap.includes(w) : waktuSiap === w}
                        onChange={() => {
                          setWaktuSiap((prev) => (Array.isArray(prev) ? (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]) : [w]))
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{w}</span>
                    </label>
                  ))}
                </div>
                {errors.waktuSiap && <div className="alert alert-error">{errors.waktuSiap}</div>}
              </div>

              <div className="field">
                <label>Tipe Kendaraan</label>
                <select value={tipeKendaraan} onChange={(e) => setTipeKendaraan(e.target.value)}>
                  <option value="motor">Motor</option>
                  <option value="mobil">Mobil</option>
                </select>
              </div>

              <div className="field">
                <label>Hari Siap (pilih satu atau lebih)</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].map((d) => (
                    <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={Array.isArray(hariSiap) ? hariSiap.includes(d) : hariSiap === d}
                        onChange={() => {
                          setHariSiap((prev) => (Array.isArray(prev) ? (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]) : [d]))
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{d}</span>
                    </label>
                  ))}
                </div>
                {errors.hariSiap && <div className="alert alert-error">{errors.hariSiap}</div>}
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label>Waktu Tunggu (HH:MM)</label>
                <input value={waktuTunggu} onChange={(e) => setWaktuTunggu(e.target.value)} placeholder="12:00" />
              </div>

              <div className="field">
                <label>Nomor HP</label>
                <input value={nomorHp} onChange={(e) => setNomorHp(e.target.value)} placeholder="0812xxxx" />
                {errors.nomorHp && <div className="alert alert-error">{errors.nomorHp}</div>}
              </div>
            </>
          )}
        </div>

          {/* removed unsupported `tampil_menit` field to match API schema */}

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button type="submit">{status === 'loading' ? 'Mengirim...' : 'Kirim'}</button>
          <Link to="/"><button type="button" style={{ background: '#e6eefc', color: '#0f172a', boxShadow: 'none' }}>
            <ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Batal
          </button></Link>
        </div>

        {status && status.ok && (
          <div className="alert alert-success" style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <CheckCircle size={18} /> {status.message}
          </div>
        )}
        {status && status.ok === false && (
          <div className="alert alert-error" style={{ marginTop: 12 }}>{status.message}</div>
        )}
      </form>
    </div>
  )
}
