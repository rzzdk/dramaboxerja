import { Link } from "react-router-dom";

export interface DramaCardProps {
  drama: {
    bookId: string;
    bookName: string;
    coverWap: string;
    chapterCount?: number;
  };
}

export const DramaCard = ({ drama }: DramaCardProps) => {
  return (
    <Link
      to={`/drama/${drama.bookId}`}
      className="group flex flex-col gap-2 rounded-xl border border-border/70 bg-card/80 p-1 shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="overflow-hidden rounded-lg bg-muted">
        <img
          src={drama.coverWap}
          alt={drama.bookName}
          loading="lazy"
          className="aspect-[2/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="px-1 pb-1">
        <h3 className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
          {drama.bookName}
        </h3>
        {drama.chapterCount !== undefined && (
          <p className="mt-1 text-[11px] text-muted-foreground">{drama.chapterCount} eps</p>
        )}
      </div>
    </Link>
  );
};
