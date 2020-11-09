export default class Deferred<T> {
    public promise: Promise<T>;
    public rejector!: (v?: T) => void;
    public resolver!: ((v?: T) => void);

    constructor() {
      this.promise = new Promise((resolve, reject)=> {
        this.rejector = reject
        this.resolver = resolve
      })
    }
  }
  