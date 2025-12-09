class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.analyser = null;
    this.filter = null;
    this.lfo = null;
    this.lfoGain = null;

    // Map<midiNote, { osc, gain }>
    this.activeVoices = new Map();

    this.settings = {
      waveform: 'sine',
      detune: 0
    };

    this.envelope = {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.5,
      release: 0.5
    };

    this.lfoParams = {
      type: 'sine',
      rate: 5,
      depth: 0,
      target: 'none'
    };
  }

  initialize() {
    if (this.audioContext) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    // --- Master & Analysis ---
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.5;

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;

    // --- Filter ---
    this.filter = this.audioContext.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 2000;
    this.filter.Q.value = 1;

    // --- LFO ---
    this.lfo = this.audioContext.createOscillator();
    this.lfo.frequency.value = 5;
    this.lfoGain = this.audioContext.createGain();
    this.lfoGain.gain.value = 0;

    this.lfo.connect(this.lfoGain);
    this.lfo.start();

    // --- Graph ---
    this.filter.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    // Connect LFO to filter initially if needed
    if (this.lfoParams.target === 'filter') {
      this.lfoGain.connect(this.filterNode.frequency);
    }
  }

  get context() {
    if (!this.audioContext) this.initialize();
    return this.audioContext;
  }

  get master() {
    if (!this.masterGain) this.initialize();
    return this.masterGain;
  }

  get filterNode() {
    if (!this.filter) this.initialize();
    return this.filter;
  }

  get analyzerNode() {
    if (!this.analyser) this.initialize();
    return this.analyser;
  }

  async resume() {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  setEnvelope(params) {
    this.envelope = { ...this.envelope, ...params };
  }

  setFilter(params) {
    const f = this.filterNode;
    if (params.frequency !== undefined) f.frequency.setTargetAtTime(params.frequency, this.context.currentTime, 0.05);
    if (params.Q !== undefined) f.Q.setTargetAtTime(params.Q, this.context.currentTime, 0.05);
    if (params.type !== undefined) f.type = params.type;
  }

  setWaveform(type) {
    this.settings.waveform = type;
    // Update currently playing voices? Usually not needed for standard polysynth unless desired
    this.activeVoices.forEach(voice => {
      voice.osc.type = type;
    });
  }

  setLFO(params) {
    this.lfoParams = { ...this.lfoParams, ...params };
    if (!this.lfo) this.initialize();

    const { type, rate, depth, target } = this.lfoParams;
    const now = this.context.currentTime;

    if (params.type) this.lfo.type = type;
    if (params.rate) this.lfo.frequency.setTargetAtTime(rate, now, 0.05);

    // Re-route
    if (params.target !== undefined || params.depth !== undefined) {
      try { this.lfoGain.disconnect(); } catch (e) { } // Safe disconnect

      let gainValue = 0;

      if (target === 'pitch') {
        // Connect to all ACTIVE voices
        this.activeVoices.forEach(voice => {
          this.lfoGain.connect(voice.osc.detune);
        });
        gainValue = depth * 1200;
      }
      else if (target === 'filter') {
        this.lfoGain.connect(this.filterNode.frequency);
        gainValue = depth * 2000;
      }

      this.lfoGain.gain.setTargetAtTime(gainValue, now, 0.05);
    }
  }

  // POLYPHONIC Note On
  noteOn(note, frequency) {
    this.resume();

    // If note exists, stop it first (retrigger)
    if (this.activeVoices.has(note)) {
      this.noteOff(note);
    }

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = this.settings.waveform;
    osc.frequency.setValueAtTime(frequency, this.context.currentTime);

    // LFO Pitch Mod
    if (this.lfoParams.target === 'pitch') {
      this.lfoGain.connect(osc.detune);
    }

    osc.connect(gain);
    gain.connect(this.filterNode);

    const now = this.context.currentTime;
    const { attack, decay, sustain } = this.envelope;

    // ADSR Attack -> Sustain
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + attack);
    gain.gain.exponentialRampToValueAtTime(sustain || 0.001, now + attack + decay);

    osc.start(now);

    this.activeVoices.set(note, { osc, gain });
  }

  // POLYPHONIC Note Off
  noteOff(note) {
    const voice = this.activeVoices.get(note);
    if (voice) {
      const now = this.context.currentTime;
      const { release } = this.envelope;

      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
      voice.gain.gain.exponentialRampToValueAtTime(0.001, now + release);

      voice.osc.onended = () => {
        voice.osc.disconnect();
        voice.gain.disconnect();
      };

      voice.osc.stop(now + release + 0.1);

      this.activeVoices.delete(note);
    }
  }

  setVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
    }
  }
}

export default new AudioEngine();
