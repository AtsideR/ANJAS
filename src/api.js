// Minimal API helper for Project-Anjas

// 1. Ambil URL dan HAPUS slash di akhir agar aman
const ENV_URL = import.meta.env.VITE_API_URL || 'https://api-anjas.vercel.app';
const BASE_URL = ENV_URL.replace(/\/$/, ''); // Hapus '/' di ujung jika ada

async function safeFetch(url, opts = {}) {
  const res = await fetch(url, opts)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`${res.status} ${res.statusText}${text ? ' - ' + text : ''}`)
    err.status = res.status
    throw err
  }
  try {
    return await res.json()
  } catch {
    return null
  }
}

export async function getSiteInfo() {
  try {
    return await safeFetch(BASE_URL + '/api/site-info') // Pastikan pakai /api jika backend butuh
  } catch {
    return { title: 'Project-Anjas', tagline: 'Antar Jemput & Jasa Titip' }
  }
}

export async function getAnjem() {
  // BASE_URL sudah bersih, jadi aman ditambah /api/anjem
  return safeFetch(BASE_URL + '/api/anjem')
}

export async function getJastip() {
  return safeFetch(BASE_URL + '/api/jastip')
}

export async function postAnjem(payload) {
  return safeFetch(BASE_URL + 'api/anjem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function postJastip(payload) {
  return safeFetch(BASE_URL + '/api/jastip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export default { getSiteInfo, getAnjem, getJastip, postAnjem, postJastip }