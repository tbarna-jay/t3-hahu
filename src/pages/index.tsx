import { SignInButton, useUser } from '@clerk/nextjs';
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { type RouterOutputs, api } from '~/utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LoadingPage } from '~/components/Loading';
import React from 'react';

dayjs.extend(relativeTime);

const CreatPostWizard = () => {
  const { user } = useUser();
  const [input, setInput] = React.useState('');

  const ctx = api.useContext();

  const { mutate, isLoading } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput('');
      void ctx.posts.getAll.invalidate();
    },
  });

  if (!user) return null;

  if (isLoading) return <div>Posting...</div>;

  return (
    <div className="flex w-full gap-2">
      <Image width={30} height={30} className="h-12 w-12 rounded-full" alt="user profile image" src={user.imageUrl} />
      <input
        className="flex grow bg-transparent outline-none"
        placeholder="Irj vmit!"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button disabled={isLoading} onClick={() => mutate({ content: input })}>
        Post!
      </button>
    </div>
  );
};

type PostWithUser = RouterOutputs['posts']['getAll'][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex w-full gap-2 border-b border-gray-100 p-8">
      <Image
        width={30}
        height={30}
        className="h-12 w-12 rounded-full"
        alt="user profile image"
        src={author.profileImageUrl}
      />
      <div className="flex flex-col">
        <div>
          <span>{author.userName}</span> - <span>{dayjs(post.createdAt).fromNow()}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: isPostsLoading } = api.posts.getAll.useQuery();
  if (isPostsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong...</div>;

  return (
    <div>
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();

  if (!isUserLoaded) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x md:max-w-2xl">
          <div className="flex border-b border-gray-100 p-4">{isSignedIn ? <CreatPostWizard /> : <SignInButton />}</div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
