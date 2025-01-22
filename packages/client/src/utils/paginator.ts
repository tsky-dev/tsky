interface CursorResponse {
  cursor?: string;
}

export class Paginator<T extends CursorResponse> {
  readonly values: T[] = [];

  private constructor(
    private onNext: (cursor?: string) => Promise<T>,
    defaultValues?: T[],
  ) {
    if (defaultValues) {
      this.values = defaultValues;
    }
  }

  static async init<T extends CursorResponse>(
    onNext: (cursor?: string) => Promise<T>,
    defaultValues?: T[],
  ): Promise<Paginator<T>> {
    const paginator = new Paginator<T>(onNext, defaultValues);

    // load the first page
    await paginator.next();

    return paginator;
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
