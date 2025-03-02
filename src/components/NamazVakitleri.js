import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Sun, Moon, Clock, Cloud, Sunset, Sunrise } from 'lucide-react';
import cities from './cities'; // Şehir listemizi içe aktar

const NamazVakitleri = () => {
  const [times, setTimes] = useState(null);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [selectedCity, setSelectedCity] = useState('elazig'); // Varsayılan şehir Elazığ
  const [loading, setLoading] = useState(false); // Yükleniyor durumu

  const fetchPrayerTimes = async () => {
    setLoading(true); // Yükleniyor durumunu başlat
    try {
      const response = await axios.get(`https://api.collectapi.com/pray/all?data.city=${selectedCity}`, {
        headers: {
          Authorization: process.env.REACT_APP_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      setTimes(response.data.result);
      setError(null);
    } catch (err) {
      setError('Veriler alınamadı. Lütfen tekrar deneyin.');
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false); // Yükleniyor durumunu bitir
    }
  };

  const updateCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const timeString = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    setCurrentTime(timeString);
  };

  // Şehir değiştiğinde, namaz vakitlerini yeniden al
  useEffect(() => {
    fetchPrayerTimes();
  }, [selectedCity]); // selectedCity değiştiğinde API'ye yeniden istek atılacak

  useEffect(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000); // Her saniye saati güncelle
    return () => clearInterval(interval);
  }, []);

  const getIcon = (vakit) => {
    switch (vakit) {
      case 'İmsak':
        return <Moon className="text-blue-600" size={40} />;
      case 'Güneş':
        return <Sunrise className="text-yellow-500" size={40} />;
      case 'Öğle':
        return <Sun className="text-orange-400" size={40} />;
      case 'İkindi':
        return <Cloud className="text-gray-500" size={40} />;
      case 'Akşam':
        return <Sunset className="text-purple-600" size={40} />;
      case 'Yatsı':
        return <Moon className="text-indigo-500" size={40} />;
      default:
        return <Clock size={40} />;
    }
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-teal-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-teal-700 mb-8">Namaz Vakitleri</h1>
      <div className="mb-6 text-center">
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="p-2 border border-teal-300 rounded-md"
        >
          {cities.map((city) => (
            <option key={city.value} value={city.value}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Yükleniyor göstergesi */}
      {loading && <p className="text-teal-600 text-center">Namaz vakitleri yükleniyor...</p>}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {times && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {times.map((time) => (
            <Card
              key={time.vakit}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg border border-teal-200"
            >
              {getIcon(time.vakit)}
              <CardContent className="text-center mt-4">
                <h2 className="text-xl font-semibold text-teal-600">{time.vakit}</h2>
                <p className="text-lg mt-2 text-teal-800">{time.saat}</p>
                {currentTime && currentTime === time.saat && (
                  <p className="text-sm text-green-500 mt-2">Şu an bu vakitteyiz!</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentTime && (
        <div className="mt-6 text-center text-teal-700 text-xl font-semibold">
          <p>Mevcut Saat: {currentTime}</p>
        </div>
      )}
    </div>
  );
};

export default NamazVakitleri;
