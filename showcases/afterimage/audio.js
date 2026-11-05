// Three original album previews, synthesized live with Web Audio. No audio files.
// The AudioContext is created on the first deliberate press, so nothing autoplays.
const SIDES = [
  { bpm: 84, root: 146.83, chords: [[0, 3, 7, 10], [-4, 0, 3, 7], [-7, -4, 0, 3], [-2, 2, 5, 9]], pattern: [0, 2, 1, 3, 2, 1, 3, 2], pluck: .17, pad: .05, bass: .14, cutoff: 2600, echo: .46 },
  { bpm: 96, root: 196, chords: [[0, 4, 7, 11], [5, 9, 12, 16], [-3, 0, 4, 7], [2, 5, 9, 12]], pattern: [3, 0, 2, null, 1, 3, null, 2], pluck: .1, pad: .085, bass: .08, cutoff: 4200, echo: .6 },
  { bpm: 58, root: 110, chords: [[0, 7, 12, 15], [-4, 3, 8, 12], [-2, 5, 10, 14], [-5, 2, 7, 10]], pattern: [0, null, null, 2, null, null, 1, null], pluck: .08, pad: .12, bass: .17, cutoff: 1100, echo: .35 },
];
const hz = (root, semitones) => root * 2 ** (semitones / 12);

export function createAlbumAudio() {
  let context, master, analyser, compressor, chain, bus, echo, bins;
  let timer = 0, side = 0, step = 0, nextTime = 0, playing = false, request = 0;

  function build() {
    context = new (window.AudioContext || window.webkitAudioContext)();
    master = context.createGain();
    master.gain.value = 0;
    compressor = context.createDynamicsCompressor();
    analyser = context.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = .72;
    bins = new Uint8Array(analyser.frequencyBinCount);
    compressor.connect(analyser);
    analyser.connect(master);
    master.connect(context.destination);
  }

  // Each take gets its own bus and echo, so old notes can never bleed into a new side.
  function openChain() {
    closeChain();
    const output = context.createGain();
    bus = context.createGain();
    echo = context.createDelay(1.5);
    const feedback = context.createGain();
    feedback.gain.value = .42;
    bus.connect(output);
    bus.connect(echo);
    echo.connect(feedback);
    feedback.connect(echo);
    echo.connect(output);
    output.connect(compressor);
    chain = { output, feedback };
  }
  function closeChain() {
    if (!chain) return;
    const { output, feedback } = chain;
    chain = null;
    output.gain.setTargetAtTime(0, context.currentTime, .06);
    feedback.gain.setTargetAtTime(0, context.currentTime, .06);
    setTimeout(() => output.disconnect(), 500);
  }

  function voice({ type, frequency, start, length, peak, attack, cutoff, detune = 0 }) {
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(.0001, start + length);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(bus);
    oscillator.start(start);
    oscillator.stop(start + length + .05);
  }

  function schedule(time, index) {
    const patch = SIDES[side];
    const beat = 60 / patch.bpm / 2;
    const chord = patch.chords[Math.floor(index / 16) % patch.chords.length];
    const note = patch.pattern[index % patch.pattern.length];
    if (note !== null) {
      const octave = index % 16 > 11 ? 24 : 12;
      voice({ type: 'triangle', frequency: hz(patch.root, chord[note] + octave), start: time, length: beat * 3.5, peak: patch.pluck, attack: .008, cutoff: patch.cutoff });
    }
    if (index % 4 === 0) voice({ type: 'sine', frequency: hz(patch.root, chord[0] - 12), start: time, length: beat * 3.8, peak: patch.bass, attack: .02, cutoff: 500 });
    if (index % 16 === 0) {
      for (const semitones of chord) {
        for (const detune of [-7, 7]) voice({ type: 'sawtooth', frequency: hz(patch.root, semitones), start: time, length: beat * 17, peak: patch.pad / 2, attack: beat * 4, cutoff: patch.cutoff * .45, detune });
      }
    }
  }

  function tick() {
    const beat = 60 / SIDES[side].bpm / 2;
    // A throttled tab must skip the beats it missed, not play them all at once.
    while (nextTime < context.currentTime - .05) {
      nextTime += beat;
      step += 1;
    }
    while (nextTime < context.currentTime + .25) {
      schedule(nextTime, step);
      nextTime += beat;
      step += 1;
    }
  }

  function configure() {
    const patch = SIDES[side];
    echo.delayTime.setTargetAtTime(60 / patch.bpm * .75, context.currentTime, .05);
    bus.gain.setTargetAtTime(patch.echo + .55, context.currentTime, .05);
  }

  return {
    get playing() { return playing; },
    async play(index = side) {
      if (!window.AudioContext && !window.webkitAudioContext) return false;
      if (!context) build();
      side = index;
      const current = ++request;
      await context.resume();
      // A stop or newer press during the wait wins. setSide already updated the side.
      if (current !== request) return false;
      openChain();
      configure();
      step = 0;
      nextTime = context.currentTime + .06;
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(.72, context.currentTime, .25);
      clearInterval(timer);
      tick();
      timer = setInterval(tick, 60);
      playing = true;
      return true;
    },
    setSide(index) {
      side = index;
      if (!playing) return;
      openChain();
      configure();
      step = 0;
      nextTime = context.currentTime + .06;
    },
    stop() {
      request += 1;
      if (!context) return;
      clearInterval(timer);
      playing = false;
      closeChain();
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(0, context.currentTime, .18);
    },
    /** Loudness from 0 to 1, weighted to the bass and low mids that carry the pulse. */
    level() {
      if (!analyser || !playing) return 0;
      analyser.getByteFrequencyData(bins);
      const count = Math.min(24, bins.length);
      let sum = 0;
      for (let i = 0; i < count; i++) sum += bins[i];
      return Math.min(1, sum / count / 190);
    },
    destroy() {
      clearInterval(timer);
      playing = false;
      context?.close();
    },
  };
}
