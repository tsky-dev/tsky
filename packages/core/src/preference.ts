import type {
  AppBskyActorGetPreferences,
  AppBskyActorPutPreferences,
  AppBskyNS,
} from '@atproto/api';

export class Preferences {
  /**
   * Creates a new instance of the Preferences class.
   * @param instance The instance of the `AppBskyNS` class.
   */
  constructor(private instance: AppBskyNS) {}

  /**
   * Get private preferences attached to the current account. Expected use is synchronization between multiple devices, and import/export during account migration. Requires auth.
   * @param options Additional options.
   * @returns The private preferences attached to the account.
   */
  async get(options?: AppBskyActorGetPreferences.CallOptions) {
    const res = await this.instance.actor.getPreferences(undefined, options);

    return res.data.preferences;
  }

  /**
   * Set the private preferences attached to the account.
   * @param preferences The preferences to set.
   * @param options Additional options.
   * @returns An empty promise
   */
  async set(
    preferences: AppBskyActorPutPreferences.InputSchema['preferences'],
    options?: AppBskyActorPutPreferences.CallOptions
  ) {
    await this.instance.actor.putPreferences({ preferences }, options);
  }
}
