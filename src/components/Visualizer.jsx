import React, { useEffect, useRef } from 'react';
import audioEngine from '../audio/AudioEngine';

const Visualizer = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        const render = () => {
            const analyser = audioEngine.analyzerNode;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // Get Time Domain Data (Waveform)
            analyser.getByteTimeDomainData(dataArray);

            // Clear Canvas with a slight fade effect for "tails"
            ctx.fillStyle = 'rgba(20, 20, 26, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#00ff88'; // Neon Green
            ctx.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="visualizer-container">
            <canvas
                ref={canvasRef}
                width={800}
                height={300}
                style={{
                    width: '100%',
                    backgroundColor: '#14141a',
                    borderRadius: '12px',
                    boxShadow: '0 0 20px rgba(0, 255, 136, 0.1)',
                    border: '1px solid #333'
                }}
            />
        </div>
    );
};

export default Visualizer;
