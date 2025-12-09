import React, { useState, useEffect } from 'react';
import audioEngine from '../audio/AudioEngine';
import Knob from './Knob';

const LFO = () => {
    const [rate, setRate] = useState(5);
    const [depth, setDepth] = useState(0);
    const [type, setType] = useState('sine');
    const [target, setTarget] = useState('none');

    useEffect(() => {
        audioEngine.setLFO({ rate, depth, type, target });
    }, [rate, depth, type, target]);

    return (
        <div className="module lfo-module">
            <div className="module-header">
                <h3>LFO</h3>
                <div
                    className={`status-led ${depth > 0 ? 'active pulsing' : ''}`}
                    style={{ animationDuration: `${1 / rate}s` }}
                ></div>
            </div>

            <div className="controls-row" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div className="vertical-group">
                    <label className="mini-label">Target</label>
                    <div className="type-buttons-stack">
                        {['none', 'pitch', 'filter'].map(t => (
                            <button
                                key={t}
                                className={target === t ? 'active' : ''}
                                onClick={() => setTarget(t)}
                            >
                                {t.substring(0, 3).toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="knob-group">
                    <Knob
                        label="Rate"
                        value={rate}
                        min={0.1}
                        max={20}
                        onChange={setRate}
                        size={50}
                    />
                </div>
                <div className="knob-group">
                    <Knob
                        label="Depth"
                        value={depth}
                        min={0}
                        max={1}
                        onChange={setDepth}
                        size={50}
                        color="#00d1ff"
                    />
                </div>

                <div className="vertical-group">
                    <label className="mini-label">Wave</label>
                    <div className="type-buttons-stack">
                        {['sine', 'sqr', 'saw'].map(t => {
                            // helper to map short names
                            const val = t === 'sqr' ? 'square' : t === 'saw' ? 'sawtooth' : t;
                            return (
                                <button
                                    key={t}
                                    className={type === val ? 'active' : ''}
                                    onClick={() => setType(val)}
                                >
                                    {t.toUpperCase()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LFO;
