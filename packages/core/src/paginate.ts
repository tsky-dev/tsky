type CursorResponse = {
  cursor?: string;
  [key: string]: unknown;
};

/**
 * A paginator for fetching data from a cursor-based API.
 * @template T The type of the cursor response.
 */
export class Paginator<T extends CursorResponse> {
  readonly values: T[] = [];

  /**
   * Creates a new instance of the Paginator class.
   * @param onNext The function to call to get the next page of data.
   * @param defaultValues The default values to start with.
   */
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

  /**
   * Clone this paginator.
   * @returns A new paginator with the same values.
   */
  clone() {
    return new Paginator(this.onNext, this.values);
  }

  /**
   * Get the data for the next page.
   * @returns The data for the next page. If there is no more data, returns `null`.
   */
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
