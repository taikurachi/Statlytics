import { cookies } from "next/headers"; // To access cookies on the server
import Image from "next/image";
import { fetchSongData } from "@/app/utilsFn/fetchSongData";
import { fetchArtistData } from "@/app/utilsFn/fetchArtistData";
import Header from "../utils/Header"; // Import Header component (can remain the same)
import Lyrics from "./Lyrics";
import Events from "./Events";
import { fetchColor } from "@/app/utilsFn/fetchColor";
import convertToRGB from "@/app/utilsFn/colorFn/convertToRGB";
import changeColor from "@/app/utilsFn/colorFn/changeColor";
import checkLuminance from "@/app/utilsFn/colorFn/checkLuminance";

import { ArtistType } from "@/app/types/types";
import getSongLength from "@/app/utilsFn/getSongLength";

// Server Component: Fetch data on the server side
export default async function SongPage({ id }: { id: string }) {
  if (!id) {
    return <div>Song ID is missing. Please check the URL.</div>;
  }
  // Get the token from the cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || ""; // Retrieve the token from cookies

  if (!token) {
    return <div>Token is missing. There has been an error.</div>;
  }

  // Fetch song data using the token
  const songData = await fetchSongData(id, token);

  // Fetch artist data
  const artistData = await fetchArtistData(
    songData.artists.map((artist: ArtistType) => artist.id),
    token
  );

  const { dominantColor } = await fetchColor(songData.album.images[0].url);

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${convertToRGB(
          dominantColor
        )}, ${convertToRGB(
          changeColor(
            dominantColor,
            checkLuminance(dominantColor) < 0.46 ? 50 : -100
          )
        )} )`,
      }}
      className="col-start-2 row-start-2 overflow-y-auto bg-[#121212] min-h-[calc(100vh-64px)] p-6 pl-8"
    >
      <main className="flex gap-10 max-w-[1800px] pr-8 pl-8">
        <div className="w-[140px] h-[140px] relative shadow-2xl">
          <Image
            className="rounded-sm"
            src={songData.album.images[0].url}
            alt={`${songData.album.name} album image`}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div>
          <h1 className="font-extrabold text-8xl mb-3 ">{songData.name}</h1>
          <div className="flex items-center gap-2">
            <div
              className="flex "
              style={{
                marginRight: artistData?.length
                  ? (artistData.length - 1) * -10
                  : 0,
              }}
            >
              {artistData?.map((artist, index) => (
                <div key={index} className="w-[30px] h-[30px] relative">
                  <Image
                    style={{ marginLeft: index * -10 }}
                    className="rounded-full inline-block"
                    src={artist.images[0].url}
                    layout="fill"
                    objectFit="contain"
                    alt={`${artist.name} image`}
                  />
                </div>
              ))}
            </div>
            <span>·</span>
            <p className="font-medium">
              {songData.artists
                .map((artist: ArtistType) => artist.name)
                .join("  ·  ")}
            </p>
            <span className="opacity-80">·</span>
            <p className="opacity-80">{songData.album.name}</p>
            <span className="opacity-80">·</span>
            <p className="opacity-80">
              {songData.album.release_date.slice(0, 4)}
            </p>
            <span className="opacity-80">·</span>
            <p className="opacity-80">{getSongLength(songData.duration_ms)}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
