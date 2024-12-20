declare module "./flock-rs.node" {
  export class Flock {
      constructor(path: string);
      lock(): Promise<void>;
      unlock(): Promise<void>;
  }
}