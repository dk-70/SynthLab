import React, { useState, useEffect } from 'react';
import audioEngine from '../audio/AudioEngine';
import Knob from './Knob';

const Filter = () => {
    const [cutoff, setCutoff] = useState(2000);
    const [resonance, setResonance] = useState(1);
    const [type, setType] = useState('lowpass');

    useEffect(() => {
        audioEngine.setFilter({ frequency: cutoff, Q: resonance, type });
    }, [cutoff, resonance, type]);

    return (
        <div className="module filter-module">
            <div className="module-header">
                <h3>VCF</h3>
                <div className="status-led active"></div>
            </div>

            <div className="controls-row" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="knob-group">
                    <Knob
                        label="Cutoff"
                        value={cutoff}
                        min={20}
                        max={10000}
                        onChange={setCutoff}
                        size={60}
                    />
                </div>
                <div className="knob-group">
                    <Knob
                        label="Res"
                        value={resonance}
                        min={0}
                        max={20}
                        onChange={setResonance}
                        size={45}
                        color="#00d1ff"
                    />
                </div>

                <div className="vertical-group">
                    <label className="mini-label">Type</label>
                    <div className="type-buttons-stack">
                        {['lowpass', 'highpass', 'bandpass'].map(t => (
                            <button
                                key={t}
                                className={type === t ? 'active' : ''}
                                onClick={() => setType(t)}
                            >
                                {t.substring(0, 2).toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
