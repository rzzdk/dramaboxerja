import { DramaCard } from "@/components/drama/DramaCard";
import type { UseQueryResult } from "@tanstack/react-query";

interface DramaItem {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount?: number;
}

interface ColumnCategory {
  title: string;
  bookList: DramaItem[];
}

interface ColumnListResponse {
  columnVOList: ColumnCategory[];
}

interface HorizontalSectionProps {
  title: string;
  query: UseQueryResult<ColumnListResponse, unknown>;
  emptyMessage: string;
}

export const HorizontalSection = ({ title, query, emptyMessage }: HorizontalSectionProps) => {
  const categories = query.data?.columnVOList ?? [];

  return (
    <section className="space-y-3">
      <div className="container flex items-center justify-between gap-2 px-4 sm:px-0">
        <h2 className="text-base font-semibold tracking-tight sm:text-lg">{title}</h2>
        {query.isLoading && <span className="text-[11px] text-muted-foreground">Memuat...</span>}
      </div>

      {query.isError && (
        <div className="container px-4 sm:px-0">
          <p className="text-xs text-destructive">Gagal memuat deretan drama untuk bagian ini.</p>
        </div>
      )}

      {!query.isLoading && !query.isError && categories.length === 0 && (
        <div className="container px-4 sm:px-0">
          <p className="text-xs text-muted-foreground">{emptyMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.title} className="space-y-2">
            <div className="container px-4 sm:px-0">
              <h3 className="text-sm font-medium text-muted-foreground">{category.title}</h3>
            </div>
            <div className="no-scrollbar overflow-x-auto">
              <div className="container flex gap-3 px-4 pb-1 pt-1 sm:px-0">
                {query.isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="w-32 shrink-0 space-y-2">
                        <div className="aspect-[2/3] w-full animate-pulse rounded-xl bg-muted" />
                        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                      </div>
                    ))
                  : category.bookList.map((item) => (
                      <div key={item.bookId} className="w-32 shrink-0">
                        <DramaCard drama={item} />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
