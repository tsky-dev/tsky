import type {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyEmbedVideo,
  AppBskyFeedDefs,
  AppBskyFeedGetLikes,
  AppBskyFeedGetPostThread,
  AppBskyFeedGetQuotes,
  AppBskyFeedGetRepostedBy,
  ComAtprotoLabelDefs,
  Typed,
} from '@tsky/lexicons';
import { BasicActorProfile } from '~/actor';
import type { Client } from '~/agent/client';
import type { RPCOptions } from '~/types';
import { Paginator, parseAtUri } from '~/utils';

export class Post implements AppBskyFeedDefs.PostView {
  uri: string;
  author: BasicActorProfile;
  cid: string;
  indexedAt: string;
  record: unknown;
  embed?:
    | Typed<AppBskyEmbedExternal.View, string>
    | Typed<AppBskyEmbedImages.View, string>
    | Typed<AppBskyEmbedRecord.View, string>
    | Typed<AppBskyEmbedRecordWithMedia.View, string>
    | Typed<AppBskyEmbedVideo.View, string>;
  labels?: ComAtprotoLabelDefs.Label[];
  likeCount?: number;
  quoteCount?: number;
  replyCount?: number;
  repostCount?: number;
  threadgate?: AppBskyFeedDefs.ThreadgateView;
  viewer?: AppBskyFeedDefs.ViewerState;
  $type?: string;

  constructor(
    private client: Client,
    payload: AppBskyFeedDefs.PostView,
  ) {
    Object.assign(this, payload);
    this.author = new BasicActorProfile(this.client, payload.author);
    this.cid = ''; // TODO: temporary type fix
    this.uri = ''; // TODO: temporary type fix
    this.indexedAt = ''; // TODO: temporary type fix
  }

  isOfCurrentUser() {
    const { host: repo } = parseAtUri(this.uri);
    return repo !== this.client.crenditials.session?.did;
  }

  remove(options: RPCOptions = {}) {
    this.client.deleteRecord(this.uri, options);
  }

  // TODO: method for liking, unliking, reposting, un-reposting, quoting, etc.

  /**
   * Get posts in a thread. Does not require auth, but additional metadata and filtering will be applied for authed requests.
   */
  async threads(
    params: Omit<AppBskyFeedGetPostThread.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    const res = await this.client.get('app.bsky.feed.getPostThread', {
      params: { uri: this.uri, ...params },
      ...options,
    });

    return res.data;
  }

  /**
   * Get like records which reference a subject (by AT-URI and CID).
   */
  likes(
    params: Omit<AppBskyFeedGetLikes.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getLikes', {
        params: { cursor, uri: this.uri, ...params },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Get a list of quotes for a given post.
   */
  quotes(
    params: Omit<AppBskyFeedGetQuotes.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getQuotes', {
        params: { cursor, uri: this.uri, ...params },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Get a list of reposts for a given post.
   */
  repostedBy(
    params: Omit<AppBskyFeedGetRepostedBy.Params, 'uri'> = {},
    options: RPCOptions = {},
  ) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getRepostedBy', {
        params: { cursor, uri: this.uri, ...params },
        ...options,
      });

      return res.data;
    });
  }

  /**
   * Gets post views for a specified list of posts (by AT-URI). This is sometimes referred to as 'hydrating' a 'feed skeleton'.
   */
  static async getMany(
    client: Client,
    posts: string[],
    options: RPCOptions = {},
  ) {
    const res = await client.get('app.bsky.feed.getPosts', {
      params: { uris: posts },
      ...options,
    });

    return res.data.posts;
  }
}
