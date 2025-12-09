import React, { useState, useRef, useEffect } from 'react';
import './Fader.css';

const Fader = ({ value, min = 0, max = 1, step = 0.01, onChange, label }) => {
    const trackRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Calculate percent for display
    const range = max - min;
    const percent = ((value - min) / range) * 100;

    // Helper to calculate value from mouse Y position
    const calculateValue = (clientY) => {
        if (!trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        // Distance from bottom of track
        const distY = rect.bottom - clientY;
        const clampedDist = Math.max(0, Math.min(distY, rect.height));

        const pct = clampedDist / rect.height;
        let newValue = min + (pct * range);

        // Clamp to step
        if (step) {
            newValue = Math.round(newValue / step) * step;
        }

        // Clamp min/max
        newValue = Math.max(min, Math.min(max, newValue));

        return Number(newValue.toFixed(2));
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        const newVal = calculateValue(e.clientY);
        if (newVal !== undefined) onChange(newVal);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent text selection
            const newVal = calculateValue(e.clientY);
            if (newVal !== undefined) onChange(newVal);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, min, max, range, step, onChange]);

    return (
        <div className="fader-container">
            <div
                className="fader-track-area"
                ref={trackRef}
                onMouseDown={handleMouseDown}
            >
                <div className="fader-groove"></div>
                <div
                    className={`fader-cap ${isDragging ? 'active' : ''}`}
                    style={{ bottom: `${percent}%`, marginBottom: '-7px' }} // -7px to center cap on value
                ></div>
            </div>
            {label && <span className="fader-label">{label}</span>}
        </div>
    );
};

export default Fader;
