import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

interface CacheFile<T> {
  time: number;
  data: T;
}

export class Cache<T extends Object> {
  public readonly name: string;
  public timeout: number;
  private getter: () => Promise<T>;

  private get filename() {
    return `./cache/${this.name}.json`;
  }

  constructor({
    name,
    timeout,
    getter,
  }: {
    name: string;
    timeout: number;
    getter: () => Promise<T>;
  }) {
    this.name = name;
    this.timeout = timeout;
    this.getter = getter;
  }

  async clear() {
    return new Promise<void>(resolve => {
      if (existsSync(this.filename)) {
        unlinkSync(this.filename);
      }
      resolve();
    });
  }

  async read(): Promise<T> {
    const exists = existsSync(this.filename);

    // it's all new
    if (!exists) {
      return this.getNewData();
    }

    const { time, data }: CacheFile<T> = JSON.parse(
      readFileSync(this.filename).toString(),
    );
    const timeSinceWrite = new Date().getTime() - time;

    // it's too old
    if (timeSinceWrite > this.timeout) {
      return this.getNewData();
    }

    // it's fresh
    return data;
  }

  private async getNewData(): Promise<T> {
    const data = await this.getter();
    const time = new Date().getTime();
    const cache: CacheFile<T> = { time, data };
    writeFileSync(this.filename, JSON.stringify(cache, null, 2));
    return data;
  }
}
