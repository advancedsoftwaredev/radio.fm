import { makeTestClient } from '../apiInterface/tests';
import { prisma } from '../prisma';
import { insertSongs } from '../testSetup/data/songs';
import { initializeDatabaseTesting } from '../utils/databaseTest';

initializeDatabaseTesting();

describe('user', () => {
  const client = makeTestClient();
  const credentials = { username: 'user', password: 'password' };

  beforeAll(async () => {
    await insertSongs();
  });

  beforeEach(async () => {
    await prisma.likedSong.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    await client.auth.register(credentials);
  });

  it('change-password successfully changes user password', async () => {
    const newPassword = 'password1234';
    await client.user.changePassword({ password: newPassword });
    const user = await client.auth.login({ username: credentials.username, password: newPassword });
    expect(user.role).toBe('USER');
  });

  it("change-username successfully changes user's username", async () => {
    const newUsername = 'username';
    await client.user.changeUsername({ username: newUsername });
    const user = await client.auth.login({ username: newUsername, password: credentials.password });
    expect(user.role).toBe('USER');
  });

  it('change-username fails if username already exists', async () => {
    const otherUser = { username: 'username', password: 'password' };
    await client.auth.register(otherUser);
    await client.auth.login(credentials);
    let error: any = null;
    try {
      await client.user.changeUsername({ username: otherUser.username });
    } catch (e: any) {
      error = e;
    }
    expect(error?.status).toBe(400);
  });

  it("delete-account successfully deletes the user's account", async () => {
    await client.user.deleteAccount();
    let error: any = null;
    try {
      await client.auth.login(credentials);
    } catch (e: any) {
      error = e;
    }
    expect(error?.status).toBe(400);
  });

  it('liked-songs successfully returns all liked songs', async () => {
    const songs = await prisma.song.findMany({});
    const user = await client.auth.getSelf();

    await Promise.all(
      songs.map((song) => prisma.likedSong.create({ data: { userId: user.id ?? '', songId: song.id } }))
    );

    const likedSongs = await client.user.getLikedSongs();
    expect(likedSongs).toHaveLength(songs.length);
  });

  it("like-song successfully adds song to user's liked songs", async () => {
    const song = await prisma.song.findFirst();
    await client.user.likeSong({ songId: song?.id ?? '' });

    const likesSong = await client.user.likesSong({ songId: song?.id ?? '' });

    expect(likesSong.liked).toBeTruthy();

    let error: any = null;
    try {
      await client.user.likeSong({ songId: song?.id ?? '' });
    } catch (e: any) {
      error = e;
    }

    expect(error?.status).toBe(400);
  });

  it("unlike-song successfully removes song from user's liked songs", async () => {
    const song = await prisma.song.findFirst();
    await client.user.likeSong({ songId: song?.id ?? '' });
    let likesSong = await client.user.likesSong({ songId: song?.id ?? '' });

    expect(likesSong.liked).toBeTruthy();

    await client.user.unlikeSong({ songId: song?.id ?? '' });
    likesSong = await client.user.likesSong({ songId: song?.id ?? '' });

    expect(likesSong.liked).toBeFalsy();

    let error: any = null;
    try {
      await client.user.unlikeSong({ songId: song?.id ?? '' });
    } catch (e: any) {
      error = e;
    }

    expect(error?.status).toBe(400);
  });
});
