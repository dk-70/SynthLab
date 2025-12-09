import React, { useState, useEffect } from 'react';
import audioEngine from '../audio/AudioEngine';
import Fader from './Fader';

const Envelope = () => {
    const [adsr, setAdsr] = useState({
        attack: 0.1,
        decay: 0.2,
        sustain: 0.5,
        release: 0.5
    });

    useEffect(() => {
        audioEngine.setEnvelope(adsr);
    }, [adsr]);

    const updateVal = (key, val) => {
        setAdsr(prev => ({ ...prev, [key]: Number(val) }));
    };

    return (
        <div className="module envelope-module">
            <div className="module-header">
                <h3>VCA Envelope</h3>
            </div>

            <div className="adsr-faders">
                <Fader
                    label="A"
                    value={adsr.attack}
                    min={0.01} max={2}
                    onChange={(v) => updateVal('attack', v)}
                />
                <Fader
                    label="D"
                    value={adsr.decay}
                    min={0.01} max={2}
                    onChange={(v) => updateVal('decay', v)}
                />
                <Fader
                    label="S"
                    value={adsr.sustain}
                    min={0} max={1}
                    onChange={(v) => updateVal('sustain', v)}
                />
                <Fader
                    label="R"
                    value={adsr.release}
                    min={0.01} max={5}
                    onChange={(v) => updateVal('release', v)}
                />
            </div>
        </div>
    );
};

export default Envelope;
