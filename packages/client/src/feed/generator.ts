import type {
  AppBskyActorDefs,
  AppBskyFeedDefs,
  AppBskyFeedGetFeedGenerator,
  AppBskyFeedGetFeedGenerators,
  AppBskyFeedGetFeedSkeleton,
  AppBskyRichtextFacet,
  ComAtprotoLabelDefs,
} from '@tsky/lexicons';
import { BasicActorProfile } from '~/actor';
import type { Client } from '~/agent/client';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class FeedGenerator {
  constructor(private client: Client) {}

  /**
   * Get information about a feed generator, including policies and offered feed URIs. Does not require auth; implemented by Feed Generator services (not App View).
   */
  async describe(options: RPCOptions = {}) {
    const res = await this.client.get(
      'app.bsky.feed.describeFeedGenerator',
      options,
    );

    return res.data;
  }

  /**
   * Get information about a feed generator. Implemented by AppView.
   */
  feed(
    feed: string,
    options: RPCOptions,
  ): Promise<AppBskyFeedGetFeedGenerator.Output>;
  /**
   * Get information about a list of feed generators.
   */
  feed(
    feeds: string[],
    options: RPCOptions,
  ): Promise<AppBskyFeedGetFeedGenerators.Output['feeds']>;

  async feed(feed: string | string[], options: RPCOptions) {
    if (Array.isArray(feed)) {
      const res = await this.client.get('app.bsky.feed.getFeedGenerators', {
        params: {
          feeds: feed,
        },
        ...options,
      });

      return res.data.feeds;
    }

    const res = await this.client.get('app.bsky.feed.getFeedGenerator', {
      params: { feed },
      ...options,
    });

    return res.data;
  }

  /**
   * Get a skeleton of a feed provided by a feed generator. Auth is optional, depending on provider requirements, and provides the DID of the requester. Implemented by Feed Generator Service.
   */
  skeleton(
    params: AppBskyFeedGetFeedSkeleton.Params,
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getFeedSkeleton', {
        params: { cursor, ...params },
        ...options,
      });

      return res.data;
    });
  }
}

export class FeedGeneratorView implements AppBskyFeedDefs.GeneratorView {
  cid!: string;
  creator: AppBskyActorDefs.ProfileView;
  did!: `did:${string}`;
  displayName!: string;
  indexedAt!: string;
  uri!: string;
  acceptsInteractions?: boolean | undefined;
  avatar?: string | undefined;
  contentMode?:
    | (string & {})
    | 'app.bsky.feed.defs#contentModeUnspecified'
    | 'app.bsky.feed.defs#contentModeVideo'
    | undefined;
  description?: string | undefined;
  descriptionFacets?: AppBskyRichtextFacet.Main[] | undefined;
  labels?: ComAtprotoLabelDefs.Label[] | undefined;
  likeCount?: number | undefined;
  viewer?: AppBskyFeedDefs.GeneratorViewerState | undefined;
  $type?: string | undefined;

  constructor(
    private client: Client,
    payload: AppBskyFeedDefs.GeneratorView,
  ) {
    Object.assign(this, payload);
    this.creator = new BasicActorProfile(this.client, payload.creator);
  }
}
