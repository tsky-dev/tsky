import type {
  AppBskyActorDefs,
  AppBskyGraphDefs,
  AppBskyRichtextFacet,
  ComAtprotoLabelDefs,
} from '@tsky/lexicons';
import { ActorProfile, BasicActorProfile } from '~/actor';
import type { Client } from '~/agent/client';
import { Post } from '~/post';
import type { RPCOptions } from '~/types';
import { Paginator } from '~/utils';

export class List {
  constructor(
    private client: Client,
    public uri: string,
  ) {}

  /**
   * Gets a 'view' (with additional context) of a specified list.
   */
  about(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.graph.getList', {
        params: {
          cursor,
          list: this.uri,
          limit,
        },
        ...options,
      });

      return {
        ...res.data,
        items: res.data.items.map((item) => ({
          ...item,
          subject: new ActorProfile(this.client, item.subject),
        })),
        list: new ListView(this.client, res.data.list),
      };
    });
  }

  /**
   * Get a feed of recent posts from a list (posts and reposts from any actors on the list). Does not require auth.
   */
  feed(limit?: number, options?: RPCOptions) {
    return Paginator.init(async (cursor) => {
      const res = await this.client.get('app.bsky.feed.getListFeed', {
        params: {
          cursor,
          list: this.uri,
          limit,
        },
        ...options,
      });

      return {
        ...res.data,
        feed: res.data.feed.map((item) => ({
          ...item,
          post: new Post(this.client, item.post),
          reply: item.reply
            ? {
                ...item.reply,
                grandparentAuthor: item.reply.grandparentAuthor
                  ? new BasicActorProfile(
                      this.client,
                      item.reply.grandparentAuthor,
                    )
                  : undefined,
              }
            : undefined,
        })),
      };
    });
  }
}

export class ListBasicView
  extends List
  implements AppBskyGraphDefs.ListViewBasic
{
  cid!: string;
  name!: string;
  purpose!: AppBskyGraphDefs.ListPurpose;
  avatar?: string | undefined;
  indexedAt?: string | undefined;
  labels?: ComAtprotoLabelDefs.Label[] | undefined;
  listItemCount?: number | undefined;
  viewer?: AppBskyGraphDefs.ListViewerState | undefined;
  $type?: string | undefined;

  constructor(client: Client, payload: AppBskyGraphDefs.ListViewBasic) {
    super(client, payload.uri);
    Object.assign(this, payload);
  }
}

export class ListView
  extends ListBasicView
  implements AppBskyGraphDefs.ListView
{
  override indexedAt: string;
  creator: AppBskyActorDefs.ProfileView;
  description?: string | undefined;
  descriptionFacets?: AppBskyRichtextFacet.Main[] | undefined;

  constructor(client: Client, payload: AppBskyGraphDefs.ListView) {
    super(client, payload);
    this.indexedAt = payload.indexedAt;
    this.creator = new ActorProfile(client, payload.creator);
  }
}
