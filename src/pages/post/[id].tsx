import { useUser } from '@clerk/nextjs';
import { type NextPage } from 'next';
import Head from 'next/head';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LoadingPage } from '~/components/Loading';
import React from 'react';

dayjs.extend(relativeTime);

const SinglePostPage: NextPage = () => {
  const { isLoaded: isUserLoaded } = useUser();

  if (!isUserLoaded) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <h1>Single Post page</h1>
      </main>
    </>
  );
};

export default SinglePostPage;
