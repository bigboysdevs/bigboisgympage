declare module 'howler' {
  export class Howl {
    constructor(options: Record<string, unknown>);
    play(): number;
    pause(): this;
    playing(): boolean;
    unload(): null;
    on(event: string, handler: () => void): this;
  }
}
