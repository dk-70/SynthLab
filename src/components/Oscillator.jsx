import React, { useState, useEffect } from 'react';
import audioEngine from '../audio/AudioEngine';
import Knob from './Knob';

const Oscillator = () => {
    const [waveform, setWaveform] = useState('sine');
    const [volume, setVolume] = useState(0.5);

    // Update engine when params change
    useEffect(() => {
        audioEngine.setWaveform(waveform);
    }, [waveform]);

    useEffect(() => {
        audioEngine.setVolume(volume);
    }, [volume]);

    return (
        <div className="module oscillator-module">
            <div className="module-header">
                <h3>OSC 1</h3>
                <div className="status-led active"></div>
            </div>

            <div className="controls-row" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="vertical-group">
                    <label className="mini-label">Shape</label>
                    <div className="waveform-grid">
                        {[
                            { id: 'sine', label: 'SIN' },
                            { id: 'square', label: 'SQR' },
                            { id: 'sawtooth', label: 'SAW' },
                            { id: 'triangle', label: 'TRI' }
                        ].map((w) => (
                            <button
                                key={w.id}
                                className={waveform === w.id ? 'active' : ''}
                                onClick={() => setWaveform(w.id)}
                            >
                                {w.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="knob-group">
                    <Knob
                        label="Level"
                        value={volume}
                        min={0}
                        max={1}
                        onChange={setVolume}
                        size={60}
                    />
                </div>
            </div>
        </div>
    );
};

export default Oscillator;

