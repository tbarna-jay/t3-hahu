import { type NextPage } from 'next';
import Head from 'next/head';
import { api } from '~/utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LoadingPage } from '~/components/Loading';
import React from 'react';

dayjs.extend(relativeTime);

const ProfilePage: NextPage = ({}) => {
  const { data, isLoading } = api.user.getById.useQuery({ id: 'user_2QqmMYh0Hk1vdQGgtVXxnIoeP2R' });

  if (isLoading) return <LoadingPage />;
  if (!data) return <div>404</div>;
  console.log('data', data);
  return (
    <>
      <Head>
        <title>Profile page</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <h1>Profile view</h1>
      </main>
    </>
  );
};

export default ProfilePage;