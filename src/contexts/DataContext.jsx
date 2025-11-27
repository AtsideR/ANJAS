import React, { createContext, useCallback, useEffect, useState } from 'react'

// 1. PASTIKAN ADA HTTPS://
const BASE_URL = 'https://api-anjas.vercel.app';

export const DataContext = createContext({})

// ... (Kode cache & helper biarkan sama) ...
const ANJEM_KEY = 'anjem_cache_v1'
const JASTIP_KEY = 'jastip_cache_v1'
const SITE_KEY = 'site_cache_v1'

function readCache(k) {
  try {
    const raw = localStorage.getItem(k)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCache(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch {}
}

export function DataProvider({ children }) {
  const [anjem, setAnjem] = useState(() => readCache(ANJEM_KEY) || [])
  const [jastip, setJastip] = useState(() => readCache(JASTIP_KEY) || [])
  const [site, setSite] = useState(() => readCache(SITE_KEY) || { title: 'Project-Anjas' })
  
  const [loading, setLoading] = useState({ anjem: false, jastip: false })
  const [error, setError] = useState(null)

  // --- PERBAIKAN FETCH GET ---
  const fetchAnjem = useCallback(async () => {
    setLoading(prev => ({ ...prev, anjem: true }))
    try {
      // COBA TAMBAHKAN '/api' JIKA LANGSUNG '/anjem' GAGAL
      // Kemungkinan endpoint aslinya adalah: https://api-anjas.vercel.app/api/anjem
      const res = await fetch(`${BASE_URL}/api/anjem`) 
      
      if (!res.ok) throw new Error(`Gagal ambil data Anjem: ${res.status}`)
      
      const json = await res.json()
      const data = json.data || json

      if (Array.isArray(data)) {
        setAnjem(data)
        writeCache(ANJEM_KEY, data)
      }
    } catch (e) {
      console.error("Error Fetch Anjem:", e)
      setError(e.message)
    } finally {
      setLoading(prev => ({ ...prev, anjem: false }))
    }
  }, [])

  const fetchJastip = useCallback(async () => {
    setLoading(prev => ({ ...prev, jastip: true }))
    try {
      // COBA TAMBAHKAN '/api' DISINI JUGA
      const res = await fetch(`${BASE_URL}/api/jastip`)
      
      if (!res.ok) throw new Error(`Gagal ambil data Jastip: ${res.status}`)

      const json = await res.json()
      const data = json.data || json

      if (Array.isArray(data)) {
        setJastip(data)
        writeCache(JASTIP_KEY, data)
      }
    } catch (e) {
      console.error("Error Fetch Jastip:", e)
      setError(e.message)
    } finally {
      setLoading(prev => ({ ...prev, jastip: false }))
    }
  }, [])

  const fetchSite = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/site-info`) // Tambah /api juga
      if (res.ok) {
        const s = await res.json()
        if (s) { setSite(s); writeCache(SITE_KEY, s) }
      }
    } catch (e) {}
  }, [])

  useEffect(() => {
    fetchSite()
    fetchAnjem() 
    fetchJastip()
  }, [fetchAnjem, fetchJastip, fetchSite])

  // --- FUNGSI POST (PASTIKAN PAKE /api JUGA JIKA POST BERHASIL DENGAN /api) ---
  const addAnjem = useCallback(async (payload) => {
    try {
      // Jika sebelumnya POST berhasil, cek URL mana yang dipakai? 
      // Kita samakan pakai /api dulu.
      const res = await fetch(`${BASE_URL}/api/anjem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        const json = await res.json()
        const resData = json.data || json || {}
        
        const newItem = { 
            ...payload, 
            id: resData.id ?? Date.now(), 
            created_at: resData.created_at ?? new Date().toISOString() 
        }
        
        setAnjem(prev => { 
            const next = [newItem, ...prev]; 
            writeCache(ANJEM_KEY, next); 
            return next 
        })
        return newItem
      }
    } catch (e) {
      console.error("Error adding anjem:", e)
      throw e
    }
    return null
  }, [])

  const addJastip = useCallback(async (payload) => {
    try {
      const res = await fetch(`${BASE_URL}/api/jastip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const json = await res.json()
        const resData = json.data || json || {}

        const newItem = { 
            ...payload, 
            id: resData.id ?? Date.now(), 
            created_at: resData.created_at ?? new Date().toISOString() 
        }

        setJastip(prev => { 
            const next = [newItem, ...prev]; 
            writeCache(JASTIP_KEY, next); 
            return next 
        })
        return newItem
      }
    } catch (e) {
      console.error("Error adding jastip:", e)
      throw e
    }
    return null
  }, [])

  const value = {
    anjem, jastip, site, loading, error,
    refreshAnjem: fetchAnjem,
    refreshJastip: fetchJastip,
    refreshSite: fetchSite,
    addAnjem, addJastip,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export default DataContext