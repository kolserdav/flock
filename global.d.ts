declare module "./flock-rs" {
  export class Flock {
      constructor(path: string);
      lock(): Promise<void>;
      unlock(): Promise<void>;
  }
}