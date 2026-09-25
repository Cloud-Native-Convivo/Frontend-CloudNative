import { sileo, type SileoOptions } from "sileo";
import { play, type SoundName } from "cuelume";

function safePlay(sound: SoundName) {
  try {
    if (typeof window !== "undefined") {
      play(sound);
    }
  } catch {
    // AudioContext puede estar restringido antes de interacción del usuario o en tests
  }
}

export const notify = {
  success: (opts: SileoOptions, sound: SoundName = "success"): string => {
    safePlay(sound);
    return sileo.success(opts);
  },

  error: (opts: SileoOptions, sound: SoundName = "error"): string => {
    safePlay(sound);
    return sileo.error(opts);
  },

  warning: (opts: SileoOptions, sound: SoundName = "droplet"): string => {
    safePlay(sound);
    return sileo.warning(opts);
  },

  info: (opts: SileoOptions, sound: SoundName = "chime"): string => {
    safePlay(sound);
    return sileo.info(opts);
  },

  dismiss: (id: string): void => {
    sileo.dismiss(id);
  },

  clear: (): void => {
    sileo.clear();
  },
};
