import React, { createContext, useContext, useState, useEffect } from 'react';
import * as staticAcademicData from '../data/academicSite';
import { defaultFypProjects as staticFypProjects } from '../data/fypProjects';

const AcademicDataContext = createContext({
  siteData: {
    ...staticAcademicData,
    fypProjects: staticFypProjects,
  },
  loading: false,
  error: null,
  refresh: () => {},
});

export function AcademicDataProvider({ children, initialData = null }) {
  const [siteData, setSiteData] = useState(
    initialData || {
      ...staticAcademicData,
      fypProjects: staticFypProjects,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/academic/site-data');
      if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSiteData(json.data);
      }
    } catch (err) {
      console.warn('Could not fetch live academic data, using fallback:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AcademicDataContext.Provider value={{ siteData, loading, error, refresh: fetchData }}>
      {children}
    </AcademicDataContext.Provider>
  );
}

export function useAcademicData() {
  return useContext(AcademicDataContext);
}

export default AcademicDataContext;
