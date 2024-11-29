import type {
  AppBskyFeedDescribeFeedGenerator,
  AppBskyFeedGetFeed,
  AppBskyFeedGetFeedGenerator,
  AppBskyFeedGetFeedGenerators,
  AppBskyFeedGetFeedSkeleton,
  AppBskyFeedGetTimeline,
  AppBskyFeedSendInteractions,
  AppBskyNS,
} from '@atproto/api'
import { Paginator } from './paginate'

export class Feed {
  /**
   * Creates a new instance of the Feed class.
   * @param instance The instance of the `AppBskyNS` class.
   */
  constructor(private instance: AppBskyNS) {}

  /**
   * Get a hydrated feed from an actor's selected feed generator. Implemented by App View.
   */
  async getFeed(
    params: AppBskyFeedGetFeed.QueryParams,
    options?: AppBskyFeedGetFeed.CallOptions,
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getFeed(
        { cursor, ...params },
        options,
      )

      return res.data
    })
  }

  /**
   * Get a view of the requesting account's home timeline. This is expected to be some form of reverse-chronological feed.
   */
  timeline(
    params: AppBskyFeedGetTimeline.QueryParams,
    options?: AppBskyFeedGetTimeline.CallOptions,
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getTimeline(
        { cursor, ...params },
        options,
      )

      return res.data
    })
  }

  /**
   * Send information about interactions with feed items back to the feed generator that served them.
   */
  async sendInteractions(
    data?: AppBskyFeedSendInteractions.InputSchema,
    options?: AppBskyFeedSendInteractions.CallOptions,
  ) {
    const res = await this.instance.feed.sendInteractions(data, options)

    return res.data
  }

  generator() {
    return new FeedGenerator(this.instance)
  }
}

class FeedGenerator {
  constructor(private instance: AppBskyNS) {}

  /**
   * Get information about a feed generator, including policies and offered feed URIs. Does not require auth; implemented by Feed Generator services (not App View).
   */
  async describe(options?: AppBskyFeedDescribeFeedGenerator.CallOptions) {
    const res = await this.instance.feed.describeFeedGenerator({}, options)

    return res.data
  }

  /**
   * Get information about a feed generator. Implemented by AppView.
   */
  feed(
    feed: string,
    options?: AppBskyFeedGetFeedGenerator.CallOptions
  ): Promise<AppBskyFeedGetFeedGenerator.OutputSchema>
  /**
   * Get information about a list of feed generators.
   */
  feed(
    feeds: string[],
    options?: AppBskyFeedGetFeedGenerators.CallOptions
  ): Promise<AppBskyFeedGetFeedGenerators.OutputSchema['feeds']>

  async feed(
    feed: string | string[],
    options?:
      | AppBskyFeedGetFeedGenerator.CallOptions
      | AppBskyFeedGetFeedGenerators.CallOptions,
  ) {
    if (Array.isArray(feed)) {
      const res = await this.instance.feed.getFeedGenerators(
        { feeds: feed },
        options,
      )

      return res.data.feeds
    }

    const res = await this.instance.feed.getFeedGenerator({ feed }, options)

    return res.data
  }

  /**
   * Get a skeleton of a feed provided by a feed generator. Auth is optional, depending on provider requirements, and provides the DID of the requester. Implemented by Feed Generator Service.
   */
  skeleton(
    params: AppBskyFeedGetFeedSkeleton.QueryParams,
    options?: AppBskyFeedGetFeedSkeleton.CallOptions,
  ) {
    return new Paginator(async (cursor) => {
      const res = await this.instance.feed.getFeedSkeleton(
        { cursor, ...params },
        options,
      )

      return res.data
    })
  }
}
