type PaginationProps = {
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  onNext: () => void;
  onPrev: () => void;
};

export const Pagination = ({
  currentPage,
  hasMore,
  loading,
  onNext,
  onPrev,
}: PaginationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-base-300 bg-base-100">
      <div className="flex h-20 items-center justify-center gap-4 py-6">
        <button
          onClick={onPrev}
          disabled={currentPage === 0 || loading}
          className={`btn btn-sm h-10 min-w-24 ${
            currentPage === 0 || loading ? 'btn-disabled' : 'btn-primary'
          }`}
          aria-label="前のページへ"
        >
          ← 前へ
        </button>
        <span className="flex h-10 min-w-fit items-center rounded-lg bg-base-200 px-4 py-2 text-sm font-medium">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="loading loading-spinner loading-xs"></span>
              読み込み中...
            </span>
          ) : (
            `ページ ${currentPage + 1}`
          )}
        </span>
        <button
          onClick={onNext}
          disabled={!hasMore || loading}
          className={`btn btn-sm h-10 min-w-24 ${
            !hasMore || loading ? 'btn-disabled' : 'btn-primary'
          }`}
          aria-label="次のページへ"
        >
          次へ →
        </button>
      </div>
    </div>
  );
};
