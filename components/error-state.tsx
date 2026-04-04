export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-red-500 font-medium mb-2">⚠ {message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 text-sm rounded bg-primary text-white hover:opacity-90"
        >
          Retry
        </button>
      )}
    </div>
  );
}
