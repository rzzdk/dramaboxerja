import { apiGet } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface DramaDetailResponse {
  bookId: string;
  bookName: string;
  coverWap: string;
  introduction?: string;
  tags?: string[];
  authorName?: string;
  status?: string;
  chapterCount?: number;
}

interface EpisodeItem {
  chapterId: string | number;
  chapterName: string;
}

interface EpisodeResponse {
  chapterList?: EpisodeItem[];
}

const DramaDetailPage = () => {
  const { bookId } = useParams<{ bookId: string }>();

  const detailQuery = useQuery<DramaDetailResponse>({
    queryKey: ["drama-detail", bookId],
    enabled: !!bookId,
    queryFn: () => apiGet<DramaDetailResponse>("/dramabox/detail", { bookId: bookId ?? "" }),
  });

  const episodeQuery = useQuery<EpisodeResponse>({
    queryKey: ["drama-episodes", bookId],
    enabled: !!bookId,
    queryFn: () => apiGet<EpisodeResponse>("/dramabox/allepisode", { bookId: bookId ?? "" }),
  });

  const episodes = episodeQuery.data?.chapterList ?? [];

  return (
    <div className="container py-6 space-y-6">
      {detailQuery.isLoading ? (
        <div className="grid gap-6 md:grid-cols-[auto,minmax(0,1fr)]">
          <div className="aspect-[2/3] w-40 animate-pulse rounded-xl bg-muted md:w-56" />
          <div className="space-y-3">
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      ) : detailQuery.isError || !detailQuery.data ? (
        <p className="text-sm text-destructive">Gagal memuat detail drama.</p>
      ) : (
        <section className="grid gap-6 md:grid-cols-[auto,minmax(0,1fr)]">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-lg">
            <img
              src={detailQuery.data.coverWap}
              alt={detailQuery.data.bookName}
              loading="lazy"
              className="aspect-[2/3] w-40 object-cover md:w-56"
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {detailQuery.data.bookName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {detailQuery.data.authorName && <span>Oleh {detailQuery.data.authorName}</span>}
                {detailQuery.data.status && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-muted" />
                    <span className="uppercase tracking-wide">{detailQuery.data.status}</span>
                  </>
                )}
                {detailQuery.data.chapterCount && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-muted" />
                    <span>{detailQuery.data.chapterCount} episode</span>
                  </>
                )}
              </div>
            </div>

            {detailQuery.data.tags && detailQuery.data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {detailQuery.data.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {detailQuery.data.introduction && (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {detailQuery.data.introduction}
              </p>
            )}

            <Button size="lg" className="mt-2" disabled={episodes.length === 0}>
              <Play className="mr-2 h-4 w-4" />
              Mulai dari Episode 1
            </Button>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-medium tracking-tight">Daftar Episode</h2>
        {episodeQuery.isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-9 w-full animate-pulse rounded bg-muted" />
            ))}
          </div>
        )}
        {episodeQuery.isError && (
          <p className="text-sm text-destructive">Gagal memuat daftar episode.</p>
        )}
        {!episodeQuery.isLoading && !episodeQuery.isError && episodes.length === 0 && (
          <p className="text-sm text-muted-foreground">Belum ada daftar episode untuk drama ini.</p>
        )}
        {episodes.length > 0 && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((ep) => (
              <button
                key={ep.chapterId}
                className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3 py-2 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="line-clamp-1">{ep.chapterName}</span>
                <Play className="ml-2 h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DramaDetailPage;
