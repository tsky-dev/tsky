import type { AppBskyFeedDefs, Typed } from '@tsky/lexicons';
import { BasicActorProfile } from '~/actor';
import type { Client } from '~/agent/client';
import { Post } from '~/post';

export class FeedViewPost implements AppBskyFeedDefs.FeedViewPost {
  post: AppBskyFeedDefs.PostView;
  feedContext?: string | undefined;
  reason?:
    | Typed<AppBskyFeedDefs.ReasonPin, string>
    | Typed<AppBskyFeedDefs.ReasonRepost, string>
    | undefined;
  reply?: AppBskyFeedDefs.ReplyRef | undefined;
  $type?: string | undefined;

  constructor(
    private client: Client,
    payload: AppBskyFeedDefs.FeedViewPost,
  ) {
    this.$type = payload.$type;
    this.feedContext = payload.feedContext;
    this.reason = payload.reason;
    this.post = new Post(this.client, payload.post);

    if (payload.reply) {
      this.reply = {
        ...payload.reply,
        grandparentAuthor: payload.reply.grandparentAuthor
          ? new BasicActorProfile(this.client, payload.reply.grandparentAuthor)
          : undefined,
      };
    }
  }
}
