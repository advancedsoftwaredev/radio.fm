import type { Song } from '@prisma/client';

type SongSeedType = Omit<Song, 'id' | 'removed' | 'length' | 'songMediaUrl' | 'albumImageUrl'> & {
  songDownloadUrl: string;
  albumImageDownloadUrl: string;
};

export const seedSongs: SongSeedType[] = [
  {
    title: 'Vienna',
    description:
      "In 1977, Billy Joel released his legendary album titled The Stranger. Listen to Billy Joel perform 'Vienna'.",
    albumImageDownloadUrl: 'https://static.arduano.io/asd/images/the-stranger.jpg',
    songDownloadUrl: 'https://static.arduano.io/asd/music/vienna.mp3',
    artist: 'Billy Joel',
  },
  {
    title: 'Something So Strong',
    description:
      '"Something So Strong" is a rock song written by Neil Finn and Mitchell Froom and performed by the band Crowded House for their eponymous debut album (August 1986).',
    albumImageDownloadUrl: 'https://static.arduano.io/asd/images/crowded-house-something-so-strong.jpg',
    songDownloadUrl: 'https://static.arduano.io/asd/music/something-so-strong.mp3',
    artist: 'Crowded House',
  },
  {
    title: 'Thank You For The Music',
    description:
      '"Thank You for the Music" is a song by the Swedish pop group ABBA. It was originally featured on the group\'s fifth studio album, The Album (1977), and was released as a double-A sided single with "Eagle" in May 1978 in limited territories, namely Belgium, the Netherlands, Germany, France, Austria, Switzerland and Australia',
    albumImageDownloadUrl: 'https://static.arduano.io/asd/images/abba-eagle.png',
    songDownloadUrl: 'https://static.arduano.io/asd/music/thank-you-for-the-music.mp3',
    artist: 'ABBA',
  },
  {
    title: "Friday I'm In Love",
    description:
      '"Friday I\'m in Love" is a song by British rock band the Cure. Released as the second single from their ninth studio album, Wish (1992), in May 1992, the song was a worldwide hit, reaching number six in the UK and number 18 in the United States, where it also topped the Modern Rock Tracks chart.',
    albumImageDownloadUrl: 'https://static.arduano.io/asd/images/the-cure-friday.jpg',
    songDownloadUrl: 'https://static.arduano.io/asd/music/friday-im-in-love.mp3',
    artist: 'The Cure',
  },
];
