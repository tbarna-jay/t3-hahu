import { SignInButton, useUser } from '@clerk/nextjs';
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { type RouterOutputs, api } from '~/utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LoadingPage, LoadingSpinner } from '~/components/Loading';
import React from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

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
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.log(errorMessage, e.data);
      if (errorMessage) {
        return toast.error(errorMessage.join(', '));
      }
      toast.error('Failed to post. Please try again later!');
    },
  });

  const send = () => mutate({ content: input });

  if (!user) return null;

  return (
    <div className="flex w-full gap-2">
      <Image width={30} height={30} className="h-12 w-12 rounded-full" alt="user profile image" src={user.imageUrl} />
      <input
        className="flex grow bg-transparent outline-none"
        placeholder="Irj vmit!"
        value={input}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            send();
          }
        }}
        onChange={(e) => setInput(e.target.value)}
      />
      {input !== '' && !isLoading && (
        <button disabled={isLoading} onClick={send}>
          Post!
        </button>
      )}
      {!!isLoading && <LoadingSpinner />}
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
          <Link href={`/${author.id}`}>
            <span>{author.userName}</span>
          </Link>{' '}
          -{' '}
          <Link href={`/post/${post.id}`}>
            <span>{dayjs(post.createdAt).fromNow()}</span>
          </Link>
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
    <main className="flex h-screen justify-center ">
      <div className="h-full w-full overflow-y-scroll border-x md:max-w-2xl">
        <div className="flex border-b border-gray-100 p-4">{isSignedIn ? <CreatPostWizard /> : <SignInButton />}</div>
        <Feed />
      </div>
    </main>
  );
};

export default Home;
