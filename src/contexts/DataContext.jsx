import React, { createContext, useCallback, useEffect, useState } from 'react'
import { getAnjem, getJastip, getSiteInfo, postAnjem, postJastip } from '../api'

export const DataContext = createContext({})

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

  const fetchAnjem = useCallback(async () => {
    try {
      const data = await getAnjem()
      if (Array.isArray(data)) {
        setAnjem(data)
        writeCache(ANJEM_KEY, data)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const fetchJastip = useCallback(async () => {
    try {
      const data = await getJastip()
      if (Array.isArray(data)) {
        setJastip(data)
        writeCache(JASTIP_KEY, data)
      }
    } catch (e) {}
  }, [])

  const fetchSite = useCallback(async () => {
    try {
      const s = await getSiteInfo()
      if (s) { setSite(s); writeCache(SITE_KEY, s) }
    } catch (e) {}
  }, [])

  useEffect(() => {
    fetchSite()
    if (!readCache(ANJEM_KEY) || (readCache(ANJEM_KEY) || []).length === 0) fetchAnjem()
    if (!readCache(JASTIP_KEY) || (readCache(JASTIP_KEY) || []).length === 0) fetchJastip()
  }, [fetchAnjem, fetchJastip, fetchSite])

  const addAnjem = useCallback(async (payload) => {
    const res = await postAnjem(payload)
    if (res) {
      const newItem = { ...payload, id: res.id ?? Date.now(), created_at: res.created_at ?? new Date().toISOString() }
      setAnjem(prev => { const next = [newItem, ...prev]; writeCache(ANJEM_KEY, next); return next })
      return newItem
    }
    return null
  }, [])

  const addJastip = useCallback(async (payload) => {
    const res = await postJastip(payload)
    if (res) {
      const newItem = { ...payload, id: res.id ?? Date.now(), created_at: res.created_at ?? new Date().toISOString() }
      setJastip(prev => { const next = [newItem, ...prev]; writeCache(JASTIP_KEY, next); return next })
      return newItem
    }
    return null
  }, [])

  const value = {
    anjem,
    jastip,
    site,
    refreshAnjem: fetchAnjem,
    refreshJastip: fetchJastip,
    refreshSite: fetchSite,
    addAnjem,
    addJastip,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export default DataContext
