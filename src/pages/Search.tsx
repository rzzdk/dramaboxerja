import { apiGet } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DramaCard } from "@/components/drama/DramaCard";

interface SearchSuggestionResponse extends Array<string> {}

interface SearchResultItem {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount?: number;
}

interface SearchResponse {
  bookList: SearchResultItem[];
}

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(handle);
  }, [query]);

  const suggestionsQuery = useQuery<SearchSuggestionResponse>({
    queryKey: ["search-suggestions"],
    queryFn: () => apiGet<SearchSuggestionResponse>("/dramabox/populersearch"),
  });

  const resultsQuery = useQuery<SearchResponse | SearchResultItem[]>({
    queryKey: ["search", debouncedQuery],
    enabled: debouncedQuery.length > 0,
    queryFn: () => apiGet<SearchResponse | SearchResultItem[]>("/dramabox/search", { query: debouncedQuery }),
  });

  const results: SearchResultItem[] = Array.isArray(resultsQuery.data)
    ? (resultsQuery.data as SearchResultItem[])
    : resultsQuery.data?.bookList ?? [];

  const showSuggestions = !debouncedQuery;

  return (
    <div className="container py-6 space-y-6">
      <div className="mx-auto max-w-2xl space-y-3">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Cari Drama</h1>
        <p className="text-sm text-muted-foreground">
          Temukan drama favorit Anda dengan kata kunci judul, aktor, atau genre.
        </p>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari drama..."
              className="pl-9"
            />
          </div>
          {query && (
            <Button variant="ghost" size="sm" onClick={() => setQuery("")}
            >
              Bersihkan
            </Button>
          )}
        </div>
      </div>

      {showSuggestions ? (
        <section className="mx-auto max-w-2xl space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Pencarian populer</h2>
          {suggestionsQuery.isLoading && <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />}
          {suggestionsQuery.isError && (
            <p className="text-xs text-destructive">Gagal memuat kata kunci populer.</p>
          )}
          {suggestionsQuery.data && (
            <div className="flex flex-wrap gap-2">
              {suggestionsQuery.data.map((term) => (
                <Button
                  key={term}
                  variant="secondary"
                  size="sm"
                  onClick={() => setQuery(term)}
                  className="rounded-full"
                >
                  {term}
                </Button>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="container space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Hasil untuk: <span className="font-semibold text-foreground">{debouncedQuery}</span>
            </h2>
            {resultsQuery.isLoading && (
              <span className="text-xs text-muted-foreground">Memuat hasil...</span>
            )}
          </div>
          {resultsQuery.isError && (
            <p className="text-sm text-destructive">Terjadi kesalahan saat memuat hasil pencarian.</p>
          )}
          {!resultsQuery.isLoading && results.length === 0 && !resultsQuery.isError && (
            <p className="text-sm text-muted-foreground">Tidak ada hasil ditemukan.</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {results.map((item) => (
              <DramaCard key={item.bookId} drama={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchPage;
