import React from 'react';

export default function ForecastCard({ date, temp_max, temp_min, icon }) {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { weekday: 'long' });
    };

    return (
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
            <img src={icon} alt="Weather Icon" className="w-12 h-12 mb-2" />
            <p className="text-lg font-semibold">{formatDate(date)}</p>
            <p className="text-lg">{temp_max}°C / {temp_min}°C</p>
        </div>
    );
}
