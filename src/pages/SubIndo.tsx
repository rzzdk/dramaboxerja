import { apiGet } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DramaCard } from "@/components/drama/DramaCard";

interface DubIndoItem {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount?: number;
}

interface DubIndoResponse {
  bookList?: DubIndoItem[];
  data?: {
    bookList?: DubIndoItem[];
  };
}

const SubIndoPage = () => {
  const [page, setPage] = useState(1);

  const query = useQuery<DubIndoResponse>({
    queryKey: ["dubindo", page],
    queryFn: async () => {
      try {
        return await apiGet<DubIndoResponse>("/dramabox/dubindo", {
          page,
          classify: "hot",
        });
      } catch (error) {
        return await apiGet<DubIndoResponse>("/dramabox/dubindo", {
          page,
        });
      }
    },
  });

  const data = query.data as DubIndoResponse | undefined;
  const items = data?.bookList ?? data?.data?.bookList ?? [];

  return (
    <div className="container py-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Drama Sub Indo</h1>
        <p className="text-sm text-muted-foreground">
          Koleksi drama dengan subtitle Bahasa Indonesia. Gunakan tombol di bawah untuk menjelajahi halaman
          berikutnya.
        </p>
      </header>

      {query.isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[2/3] w-full animate-pulse rounded-xl bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {query.isError && (
        <p className="text-sm text-destructive">Terjadi kesalahan saat memuat daftar drama Sub Indo.</p>
      )}

      {!query.isLoading && !query.isError && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {items.map((item) => (
              <DramaCard key={item.bookId} drama={item} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1 || query.isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Halaman Sebelumnya
            </Button>
            <span className="text-xs text-muted-foreground">Halaman {page}</span>
            <Button
              variant="default"
              size="sm"
              disabled={items.length === 0 || query.isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Halaman Berikutnya
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SubIndoPage;
