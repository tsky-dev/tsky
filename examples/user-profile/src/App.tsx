import { type ActorProfile, createAgent } from '@tsky/client';
import type { At } from '@tsky/lexicons';
import { useEffect, useState } from 'react';

async function getUserProfile(identity: string) {
  try {
    const agent = await createAgent({
      options: {
        service: 'https://public.api.bsky.app',
      },
    });

    let did = identity;

    if (!did.startsWith('did:')) {
      const _id = await agent.resolveDIDFromHandle(identity);
      did = _id.did;
    }

    const actor = await agent.actor(did as At.DID);

    return actor.profile();
  } catch (err) {
    console.error(err);
  }
}

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('tsky.dev');
  const [user, setUser] = useState<ActorProfile>();

  useEffect(() => {
    if (search) {
      setIsLoading(true);
      getUserProfile(search).then((user) => {
        setUser(user);
        setIsLoading(false);
      });
    }
  }, [search]);

  return (
    <main className="w-full h-screen bg-white text-black dark:bg-zinc-950 dark:text-white">
      <div className="max-w-lg mx-auto w-full py-6 space-y-6">
        <form
          action={(values) => {
            const value = values.get('search');

            if (value) {
              setSearch(value.toString());
            }
          }}
          className="flex gap-3 items-center"
        >
          <a
            href="https://github.com/tsky-dev/tsky"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/examples/user-profile/tsky-logo.png"
              alt="tsky logo"
              className="size-9 min-w-9 rounded"
            />
          </a>
          <input
            name="search"
            type="search"
            placeholder="Search Profile"
            className="w-full border appearance-none outline-none dark:text-zinc-100 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500 py-1.5 text-base hover:border-blue-500 dark:hover:border-blue-300 border-zinc-300 dark:border-zinc-700 focus-visible:ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 focus:border-blue-500 dark:focus:border-blue-300 ring-blue-300 dark:ring-blue-100 bg-transparent rounded-l-md rounded-r-md px-3"
          />
          <button
            type="submit"
            className="cursor-pointer whitespace-nowrap font-semibold h-max transition-all border select-none outline-none px-3 py-2 text-sm flex items-center justify-center rounded-md text-white dark:text-black focus-visible:ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 border-transparent bg-blue-500 hover:bg-blue-600 dark:bg-blue-300/90 dark:hover:bg-blue-400/80 ring-blue-300 dark:ring-blue-100"
          >
            Search
          </button>
        </form>
        {isLoading ? <LoadingSkeleton /> : user && <UserCard user={user} />}
      </div>
    </main>
  );
}

export default App;

function LoadingSkeleton() {
  return (
    <div className="max-w-lg mx-auto w-full h-96 animate-pulse rounded-md bg-zinc-400/20" />
  );
}

function UserCard({ user }: { user: ActorProfile }) {
  return (
    <div className="w-full rounded-xl ring-1 ring-transparent dark:ring-white/5 overflow-hidden drop-shadow-lg dark:drop-shadow-none">
      {user.banner ? (
        <img
          src={user.banner}
          alt="banner"
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="h-36 w-full bg-blue-500 dark:bg-blue-300" />
      )}
      <div className="bg-white dark:bg-zinc-900 p-4">
        <div className="flex items-end justify-between -mt-16">
          <div className="rounded-full size-28 border-[3px] border-white dark:border-zinc-900 overflow-hidden">
            <img
              src={user.avatar}
              alt="profile-pic"
              className="size-full object-cover"
            />
          </div>
          <a
            href={`https://bsky.app/profile/${user.handle}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full"
          >
            <button
              type="button"
              className="whitespace-nowrap cursor-pointer font-semibold h-max transition-all border select-none outline-none px-3 py-2 text-sm flex items-center justify-center rounded-full text-white dark:text-black focus-visible:ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 border-transparent bg-blue-500 hover:bg-blue-600 dark:bg-blue-300/90 dark:hover:bg-blue-400/80 ring-blue-300 dark:ring-blue-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="size-3.5 mr-1"
              >
                <title>Plus Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Follow
            </button>
          </a>
        </div>
        <h1 className="text-lg font-semibold mt-2">{user.displayName}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          @{user.handle}
        </p>
        <div className="mt-3 flex items-center gap-3 text-sm font-semibold">
          <p>
            {user.followersCount}
            <span className="font-normal text-zinc-500 dark:text-zinc-400">
              {' '}
              Followers
            </span>
          </p>
          <p>
            {user.followsCount}
            <span className="font-normal text-zinc-500 dark:text-zinc-400">
              {' '}
              Following
            </span>
          </p>
        </div>
        <p className="mt-4">{user.description}</p>
        <div className="flex items-end justify-between">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Made with Tsky
          </p>
          <a
            href="https://github.com/tsky-dev/tsky"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 320 286"
              className="size-8"
            >
              <title>Bluesky Icon</title>
              <path
                fill="rgb(10,122,255)"
                d="M69.364 19.146c36.687 27.806 76.147 84.186 90.636 114.439 14.489-30.253 53.948-86.633 90.636-114.439C277.107-.917 320-16.44 320 32.957c0 9.865-5.603 82.875-8.889 94.729-11.423 41.208-53.045 51.719-90.071 45.357 64.719 11.12 81.182 47.953 45.627 84.785-80 82.874-106.667-44.333-106.667-44.333s-26.667 127.207-106.667 44.333c-35.555-36.832-19.092-73.665 45.627-84.785-37.026 6.362-78.648-4.149-90.071-45.357C5.603 115.832 0 42.822 0 32.957 0-16.44 42.893-.917 69.364 19.147Z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
