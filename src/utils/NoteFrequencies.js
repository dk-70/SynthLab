// Basic MIDI note to Frequency conversion
// A4 = 440Hz = MIDI 69

export const getFrequency = (note) => {
    return 440 * Math.pow(2, (note - 69) / 12);
};

export const NOTES = [
    { note: 'C', key: 'a', midi: 60, type: 'white' },
    { note: 'C#', key: 'w', midi: 61, type: 'black' },
    { note: 'D', key: 's', midi: 62, type: 'white' },
    { note: 'D#', key: 'e', midi: 63, type: 'black' },
    { note: 'E', key: 'd', midi: 64, type: 'white' },
    { note: 'F', key: 'f', midi: 65, type: 'white' },
    { note: 'F#', key: 't', midi: 66, type: 'black' },
    { note: 'G', key: 'g', midi: 67, type: 'white' },
    { note: 'G#', key: 'z', midi: 68, type: 'black' },
    { note: 'A', key: 'h', midi: 69, type: 'white' },
    { note: 'A#', key: 'u', midi: 70, type: 'black' },
    { note: 'B', key: 'j', midi: 71, type: 'white' },
    { note: 'C2', key: 'k', midi: 72, type: 'white' },
    { note: 'C#2', key: 'o', midi: 73, type: 'black' },
    { note: 'D2', key: 'l', midi: 74, type: 'white' },
];
