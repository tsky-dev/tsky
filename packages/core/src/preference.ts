import type {
  AppBskyActorGetPreferences,
  AppBskyActorPutPreferences,
  AppBskyNS,
} from "@atproto/api";

export class Preferences {
  constructor(private instance: AppBskyNS) {}

  /**
   * Get private preferences attached to the current account. Expected use is synchronization between multiple devices, and import/export during account migration. Requires auth.
   */
  async get(options?: AppBskyActorGetPreferences.CallOptions) {
    const res = await this.instance.actor.getPreferences(undefined, options);

    return res.data.preferences;
  }

  /**
   * Set the private preferences attached to the account.
   */
  async set(
    preferences: AppBskyActorPutPreferences.InputSchema["preferences"],
    options?: AppBskyActorPutPreferences.CallOptions
  ) {
    await this.instance.actor.putPreferences({ preferences }, options);
  }
}
