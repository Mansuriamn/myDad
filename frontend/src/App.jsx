import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.238.84:4000';

export default function App() {
  const [dt, setDt] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/post`, {
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        setDt(response.data);
        localStorage.setItem('cachedJokes', JSON.stringify(response.data));
        setError(null);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      const cachedData = localStorage.getItem('cachedJokes');
      
      if (cachedData && dt.length === 0) {
        setDt(JSON.parse(cachedData));
        setError('Unable to fetch new data. Showing cached data.');
      } else if (!cachedData && dt.length === 0) {
        setError('No data available. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem('cachedJokes');
    if (cachedData) {
      try {
        setDt(JSON.parse(cachedData));
      } catch (e) {
        console.error('Error parsing cached data:', e);
        localStorage.removeItem('cachedJokes');
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
      fetchData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setError('You are currently offline. Showing cached data.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      fetchData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleNextJoke = () => {
    if (dt.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % dt.length);
  };

  if (loading && dt.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}
      {!isOnline && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4 rounded">
          You are currently offline
        </div>
      )}

      {dt.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{dt[currentIndex].title}</h2>
          <p className="text-gray-700 mb-6">{dt[currentIndex].body}</p>
          <button 
            onClick={handleNextJoke} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            disabled={dt.length === 0}
          >
            Next joke 😂
          </button>
        </div>
      ) : (
        <div className="text-center p-4">
          <p>No jokes available</p>
        </div>
      )}
    </div>
  );
}