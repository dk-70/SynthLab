import React, { useState, useEffect, useRef } from 'react';
import './Knob.css';

const Knob = ({ label, value, min, max, onChange, size = 60, color = '#00ff88' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startValue = useRef(0);

    // Map value to angle (-135 to 135 degrees)
    const angleRange = 270;
    const startAngle = -135;

    const pct = (value - min) / (max - min);
    const angle = startAngle + (pct * angleRange);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        startY.current = e.clientY;
        startValue.current = value;
        document.body.style.cursor = 'ns-resize'; // Visual feedback
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const deltaY = startY.current - e.clientY; // Up is positive
        const sensitivity = 200; // Pixels for full range
        const deltaVal = (deltaY / sensitivity) * (max - min);

        let newVal = startValue.current + deltaVal;
        newVal = Math.max(min, Math.min(max, newVal));

        onChange(newVal);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    // SVG Geometry
    const r = size / 2 - 5;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    // Arc length for 270 degrees
    const arcLength = circumference * (270 / 360);
    const dashOffset = arcLength - (pct * arcLength);

    return (
        <div className="knob-container">
            <div
                className="knob-interaction"
                onMouseDown={handleMouseDown}
                style={{ width: size, height: size }}
            >
                <svg width={size} height={size} style={{ transform: 'rotate(90deg)' }}> {/* Rotate so 0 is usually at 3 o'clock, we need 12 oclock base */}
                    {/* Background Track */}
                    <circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke="#333"
                        strokeWidth="4"
                        strokeDasharray={`${arcLength} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform={`rotate(135 ${cx} ${cy})`}
                    />
                    {/* Value Ring */}
                    <circle
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray={`${arcLength} ${circumference}`}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        transform={`rotate(135 ${cx} ${cy})`}
                        style={{ transition: isDragging ? 'none' : 'stroke-dashoffset 0.1s' }}
                    />
                </svg>

                {/* Indicator Dot */}
                <div
                    className="knob-indicator"
                    style={{
                        transform: `rotate(${angle}deg)`,
                        height: size,
                        width: size
                    }}
                >
                    <div className="dot"></div>
                </div>
            </div>
            <label className="knob-label">{label}</label>
            <div className="knob-value">{value.toFixed(1)}</div>
        </div>
    );
};

export default Knob;
