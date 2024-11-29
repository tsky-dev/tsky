type CursorResponse = {
  cursor?: string;
  [key: string]: unknown;
};

export class Paginator<T extends CursorResponse> {
  readonly values: T[] = [];

  constructor(
    private onNext: (cursor?: string) => Promise<T>,
    defaultValues?: T[]
  ) {
    if (defaultValues) {
      this.values = defaultValues;
    }

    // TODO: Should we call this here to get the first value?
    // this.next();
  }

  clone() {
    return new Paginator(this.onNext, this.values);
  }

  async next() {
    const hasValues = this.values.length > 0;

    const cursor = hasValues
      ? this.values[this.values.length - 1].cursor
      : undefined;

    // When we are at the end of the list
    if (hasValues && !cursor) return null;

    const data = await this.onNext(cursor);

    this.values.push(data);

    return data;
  }
}
