import React from 'react';
import { NOTES } from '../utils/NoteFrequencies';

const Keyboard = ({ activeNotes, onNoteOn, onNoteOff, octave, setOctave }) => {

    return (
        <div className="keyboard-container">
            <div className="octave-controls">
                <button onClick={() => setOctave(o => o - 1)} disabled={octave <= 0}>- OCT</button>
                <span>PCT: {octave}</span>
                <button onClick={() => setOctave(o => o + 1)} disabled={octave >= 6}>+ OCT</button>
            </div>

            <div className="piano-keys">
                {NOTES.map((note) => {
                    // Calculate actual MIDI note including octave shift
                    // Base notes are Octave 3 (A=440 is MIDI 69)
                    // We assume NOTES array is one octave range relative to C3 or similar
                    // Let's assume NOTES are just keys, and octave shifts the pitch sent.
                    // But for display, we want to show which key is pressed.

                    const isActive = activeNotes.has(note.key); // Check if the Computer Key is pressed

                    return (
                        <div
                            key={note.note}
                            className={`key ${note.type} ${isActive ? 'active' : ''}`}
                            onMouseDown={() => onNoteOn(note.key)}
                            onMouseUp={() => onNoteOff(note.key)}
                            onMouseLeave={() => isActive && onNoteOff(note.key)}
                        >
                            <span className="key-label">{note.key.toUpperCase()}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Keyboard;
