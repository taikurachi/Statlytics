import axios from "axios";
import { AlbumType, ArtistType } from "../types/types";
export const fetchFeaturedSongs = async (artistID: string, token: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/artists/${artistID}/albums`,
      {
        params: {
          include_groups: "appears_on",
          limit: 50,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const relevantAlbums = response.data.items.filter((album: AlbumType) => {
      const isVariousArtists = album.artists.some(
        (artist) => artist.name.toLowerCase() === "various artists"
      );
      const isSingle = album.album_type === "single";
      const isCompilation = album.album_type === "compilation";
      const hasGenericTitle =
        /relaxing|mood|sleep|chill|sad|happy|vibes|playlist|20\d\d/.test(
          album.name.toLowerCase()
        );
      return (
        !isVariousArtists && !isCompilation && !hasGenericTitle && !isSingle
      );
    });
    const limitedAlbums = relevantAlbums.slice(0, 6);
    const albumIDs = limitedAlbums.map((album: AlbumType) => album.id);
    const featuredSongs: { id: string; imageURL: string; name: string }[] = [];

    const albumsResponse = await axios.get(
      `https://api.spotify.com/v1/albums`,
      {
        params: {
          ids: albumIDs.join(","), // Comma-separated list of IDs
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    for (const album of albumsResponse.data.albums) {
      // Each album already includes its tracks, so we don't need separate API calls
      if (album.tracks && album.tracks.items) {
        // Find tracks that feature our artist
        const matchedTracks = album.tracks.items.filter(
          (track: { artists: ArtistType[] }) =>
            track.artists.some((artist: ArtistType) => artist.id === artistID)
        );

        // Add matched tracks to our result
        for (const track of matchedTracks) {
          featuredSongs.push({
            id: track.id,
            name: track.name,
            imageURL:
              album.images && album.images.length > 0
                ? album.images[0].url
                : "",
          });

          if (featuredSongs.length >= 6) break;
        }
      }

      if (featuredSongs.length >= 6) break;
    }

    return featuredSongs;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return [];
  }
};
