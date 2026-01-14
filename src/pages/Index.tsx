import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { HorizontalSection } from "@/components/drama/HorizontalSection";

interface DramaItem {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount?: number;
  introduction?: string;
}

interface ColumnCategory {
  title: string;
  bookList: DramaItem[];
}

interface ColumnListResponse {
  columnVOList: ColumnCategory[];
}

const Index = () => {
  const {
    data: hero,
    isLoading: heroLoading,
    isError: heroError,
  } = useQuery<DramaItem>({
    queryKey: ["hero-drama"],
    queryFn: () => apiGet<DramaItem>("/dramabox/randomdrama"),
  });

  const forYouQuery = useQuery<ColumnListResponse>({
    queryKey: ["foryou"],
    queryFn: () => apiGet<ColumnListResponse>("/dramabox/foryou"),
  });
  const trendingQuery = useQuery<ColumnListResponse>({
    queryKey: ["trending"],
    queryFn: () => apiGet<ColumnListResponse>("/dramabox/trending"),
  });
  const latestQuery = useQuery<ColumnListResponse>({
    queryKey: ["latest"],
    queryFn: () => apiGet<ColumnListResponse>("/dramabox/latest"),
  });
  const vipQuery = useQuery<ColumnListResponse>({
    queryKey: ["vip"],
    queryFn: () => apiGet<ColumnListResponse>("/dramabox/vip"),
  });

  return (
    <div className="pb-10">
      <section className="container mt-4 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-stretch">
          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/5 to-transparent" />
            {heroLoading && (
              <div className="aspect-video w-full animate-pulse bg-muted" />
            )}
            {heroError && !heroLoading && (
              <div className="aspect-video flex w-full items-center justify-center bg-muted text-sm text-muted-foreground">
                Gagal memuat rekomendasi utama.
              </div>
            )}
            {hero && !heroLoading && (
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={hero.coverWap}
                  alt={hero.bookName}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Rekomendasi Hari Ini
                  </p>
                  <h1 className="max-w-xl text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    {hero.bookName}
                  </h1>
                  {hero.introduction && (
                    <p className="mt-3 line-clamp-2 max-w-xl text-sm text-muted-foreground">
                      {hero.introduction}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button asChild size="lg" variant="default">
                      <Link to={`/drama/${hero.bookId}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Tonton Sekarang
                      </Link>
                    </Button>
                    {hero.chapterCount ? (
                      <p className="text-xs text-muted-foreground">
                        {hero.chapterCount} episode tersedia
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-lg">
            <h2 className="text-sm font-semibold tracking-tight">Lanjut Tonton</h2>
            <p className="text-xs text-muted-foreground">
              Segera hadir: sinkronisasi riwayat tonton dan daftar favorit Anda.
            </p>
            <div className="mt-2 flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-1/2 rounded-full bg-muted" />
              <div className="h-2 w-2/3 rounded-full bg-muted" />
              <div className="h-2 w-1/3 rounded-full bg-muted" />
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-8 space-y-8">
        <HorizontalSection
          title="Untuk Anda"
          query={forYouQuery}
          emptyMessage="Belum ada rekomendasi personal."
        />
        <HorizontalSection
          title="Sedang Trending"
          query={trendingQuery}
          emptyMessage="Tidak ada drama trending saat ini."
        />
        <HorizontalSection
          title="Drama Terbaru"
          query={latestQuery}
          emptyMessage="Belum ada rilisan terbaru."
        />
        <HorizontalSection
          title="VIP"
          query={vipQuery}
          emptyMessage="Konten VIP belum tersedia."
        />
      </section>
    </div>
  );
};

export default Index;
