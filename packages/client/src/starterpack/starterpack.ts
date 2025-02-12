import type {
  AppBskyActorDefs,
  AppBskyFeedDefs,
  AppBskyGraphDefs,
  ComAtprotoLabelDefs,
} from '@tsky/lexicons';
import { BasicActorProfile } from '~/actor';
import type { Client } from '~/agent/client';

class Starterpack {
  cid: string;
  creator: AppBskyActorDefs.ProfileViewBasic;
  indexedAt: string;
  record: unknown;
  uri: string;
  joinedAllTimeCount?: number | undefined;
  joinedWeekCount?: number | undefined;
  labels?: ComAtprotoLabelDefs.Label[] | undefined;
  $type?: string | undefined;

  constructor(
    private client: Client,
    payload: AppBskyGraphDefs.StarterPackView,
  ) {
    Object.assign(this, payload);
    this.creator = new BasicActorProfile(this.client, payload.creator);
  }
}

export class BasicStarterPack
  extends Starterpack
  implements AppBskyGraphDefs.StarterPackViewBasic
{
  listItemCount?: number | undefined;
}

export class StarterPack
  extends Starterpack
  implements AppBskyGraphDefs.StarterPackView
{
  feeds?: AppBskyFeedDefs.GeneratorView[];
  list?: AppBskyGraphDefs.ListViewBasic;
  listItemsSample?: AppBskyGraphDefs.ListItemView[];
}
