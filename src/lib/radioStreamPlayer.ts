import { Howl } from 'howler';

let howl: Howl | null = null;
let activeUrl: string | null = null;
let playbackError = false;
/** Solo true cuando el usuario pulsa play; evita reanudaciones automáticas del stream HTML5. */
let userWantsPlayback = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function bindHowlEvents(instance: Howl) {
  instance.on('play', () => {
    if (!userWantsPlayback) {
      instance.pause();
      emit();
      return;
    }
    playbackError = false;
    emit();
  });
  instance.on('pause', emit);
  instance.on('stop', emit);
  instance.on('end', () => {
    if (!userWantsPlayback) {
      emit();
      return;
    }
    playbackError = true;
    userWantsPlayback = false;
    emit();
  });
  instance.on('loaderror', () => {
    playbackError = true;
    userWantsPlayback = false;
    emit();
  });
  instance.on('playerror', () => {
    playbackError = true;
    userWantsPlayback = false;
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
    loop: false,
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
  userWantsPlayback = true;
  playbackError = false;
  const instance = getHowl(url);
  if (!instance.playing()) instance.play();
}

export function pauseRadioStream() {
  userWantsPlayback = false;
  howl?.pause();
  emit();
}

export function isRadioStreamPlaying() {
  return userWantsPlayback && (howl?.playing() ?? false);
}

export function hasRadioStreamError() {
  return playbackError;
}
