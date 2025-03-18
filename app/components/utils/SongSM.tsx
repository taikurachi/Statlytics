import { SongType } from "@/app/types/types";
import Image from "next/image";
import Link from "next/link";
import truncateText from "@/app/utilsFn/truncateText";
type SongSMProps = {
  song: SongType;
  index: number;
};

export default function SongSM({ song, index }: SongSMProps) {
  return (
    <Link href={`songs/${song.id}`}>
      <div className="flex gap-4 justify-start items-center hover:bg-slate-50 w-full">
        <span className="w-5">{index + 1}</span>
        <Image
          src={song.album.images[2].url}
          alt={`${song.album.name} album image`}
          width={50}
          height={50}
        />
        <div>
          <p className="font-medium text-lg">{truncateText(song.name, 15)}</p>
          <p>
            {truncateText(
              song.artists.map((artist) => artist.name).join(", "),
              15
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
