import { Howl } from 'howler';

let howl: Howl | null = null;
let activeUrl: string | null = null;
let playbackError = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function bindHowlEvents(instance: Howl) {
  instance.on('play', () => {
    playbackError = false;
    emit();
  });
  instance.on('pause', emit);
  instance.on('stop', emit);
  instance.on('end', emit);
  instance.on('loaderror', () => {
    playbackError = true;
    emit();
  });
  instance.on('playerror', () => {
    playbackError = true;
    emit();
  });
}

function getHowl(url: string): Howl {
  if (howl && activeUrl === url) return howl;

  howl?.unload();
  activeUrl = url;
  howl = new Howl({
    src: [url],
    html5: true,
    format: ['mp3'],
    loop: true,
    volume: 0.85,
  });
  bindHowlEvents(howl);
  return howl;
}

export function subscribeRadioPlayer(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function playRadioStream(url: string) {
  const instance = getHowl(url);
  if (!instance.playing()) instance.play();
}

export function pauseRadioStream() {
  howl?.pause();
}

export function isRadioStreamPlaying() {
  return howl?.playing() ?? false;
}

export function hasRadioStreamError() {
  return playbackError;
}
