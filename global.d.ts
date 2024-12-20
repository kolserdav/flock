declare module "./flock-rs.node" {
  export class Flock {
      constructor(path: string);
      flock(): Promise<void>;
      unlock(): Promise<void>;
  }
}