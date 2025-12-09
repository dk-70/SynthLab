import React, { useState, useEffect, useCallback } from 'react';
import Oscillator from './components/Oscillator';
import Visualizer from './components/Visualizer';
import Filter from './components/Filter';
import Envelope from './components/Envelope';
import LFO from './components/LFO';
import Keyboard from './components/Keyboard';
import audioEngine from './audio/AudioEngine';
import { NOTES, getFrequency } from './utils/NoteFrequencies';
import './App.css';

function App() {
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [octave, setOctave] = useState(3);

  const playNote = useCallback((key) => {
    const noteDef = NOTES.find(n => n.key === key);
    if (!noteDef) return;

    // Shift MIDI note by octave
    // Base octave in NOTES is roughly C3-D4 (we assume 3 for now)
    // Actually our NOTES array is just 1.5 octave range. 
    // Let's just calculate frequency based on base Midi + (octave - 3) * 12
    const currentMidi = noteDef.midi + (octave - 3) * 12;
    const freq = getFrequency(currentMidi);

    audioEngine.noteOn(currentMidi, freq);

    setActiveNotes(prev => new Set(prev).add(key));
  }, [octave]);

  const stopNote = useCallback((key) => {
    const noteDef = NOTES.find(n => n.key === key);
    if (!noteDef) return;

    const currentMidi = noteDef.midi + (octave - 3) * 12;
    audioEngine.noteOff(currentMidi);

    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, [octave]);

  // Handle Keyboard Events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      if (NOTES.find(n => n.key === key)) {
        playNote(key);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (NOTES.find(n => n.key === key)) {
        stopNote(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playNote, stopNote]);

  return (
    <div className="synth-lab">

      <main className="rack-mount">
        <div className="rack-branding">
          <span>SYNTHLAB</span> <span className="version">v0.5</span>
        </div>

        <section className="display-unit">
          <Visualizer />
        </section>

        <section className="control-deck">
          <div className="module-row">
            <Oscillator />
            <Filter />
          </div>
          <div className="module-row">
            <Envelope />
            <LFO />
          </div>
          <div className="module-row">
            <Keyboard
              activeNotes={activeNotes}
              onNoteOn={playNote}
              onNoteOff={stopNote}
              octave={octave}
              setOctave={setOctave}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
