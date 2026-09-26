// Splits items across `count` marquee tracks (alternating: 1st → track 1, 2nd → track 2, …) and
// repeats each track's items until it has at least `min`, so short lists still fill the track.
// Returns [[{ item, repeat }], …]; `repeat: true` marks padding copies (hidden from screen readers
// and from the reduced-motion static grid).
export function marqueeTracks(items = [], count = 2, min = 6) {
  const tracks = Array.from({ length: count }, () => []);
  items.forEach((item, i) => tracks[i % count].push(item));
  return tracks.map((track) => {
    const out = track.map((item) => ({ item, repeat: false }));
    for (let i = 0; track.length && out.length < min; i++) {
      out.push({ item: track[i % track.length], repeat: true });
    }
    return out;
  });
}
