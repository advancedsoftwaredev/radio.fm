import { Song } from '@prisma/client';

const songs: Omit<Song, 'id'>[] = [
  {
    title: 'Vienna',
    description:
      "In 1977, Billy Joel released his legendary album titled The Stranger. Listen to Billy Joel perform 'Vienna'.",
    albumImageUrl: '/images/the-stranger.jpg',
    songMediaUrl: '/audio/vienna.mp3',
    artist: 'Billy Joel',
    length: 216,
    removed: false,
  },
  {
    title: 'Something So Strong',
    description:
      '"Something So Strong" is a rock song written by Neil Finn and Mitchell Froom and performed by the band Crowded House for their eponymous debut album (August 1986).',
    albumImageUrl: '/images/crowded-house-something-so-strong',
    songMediaUrl: '/audio/something-so-strong',
    artist: 'Crowded House',
    length: 174,
    removed: false,
  },
  {
    title: 'Thank You For The Music',
    description:
      '"Thank You for the Music" is a song by the Swedish pop group ABBA. It was originally featured on the group\'s fifth studio album, The Album (1977), and was released as a double-A sided single with "Eagle" in May 1978 in limited territories, namely Belgium, the Netherlands, Germany, France, Austria, Switzerland and Australia',
    albumImageUrl: '/images/abba-eagle.png',
    songMediaUrl: '/audio/thank-you-for-the-music.mp3',
    artist: 'ABBA',
    length: 228,
    removed: false,
  },
  {
    title: "Friday I'm In Love",
    description:
      '"Friday I\'m in Love" is a song by British rock band the Cure. Released as the second single from their ninth studio album, Wish (1992), in May 1992, the song was a worldwide hit, reaching number six in the UK and number 18 in the United States, where it also topped the Modern Rock Tracks chart.',
    albumImageUrl: '/images/the-cure-friday.jpg',
    songMediaUrl: '/audio/friday-im-in-love.mp3',
    artist: 'The Cure',
    length: 210,
    removed: false,
  },
];

export default songs;
