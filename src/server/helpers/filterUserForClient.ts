import { type User } from '@clerk/nextjs/server';

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    userName: `${user.firstName || ''} ${user.lastName || ''}`,
    profileImageUrl: user.profileImageUrl,
  };
};
