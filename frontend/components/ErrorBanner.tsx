type ErrorBannerProps = {
  message: string;
  requestId?: string;
  onDismiss?: () => void;
};

export default function ErrorBanner({
  message,
  requestId,
  onDismiss,
}: ErrorBannerProps) {
  return (
    <div
      className="bg-red-50 border border-red-300 text-red-900 rounded-lg p-4 flex items-start gap-3"
      role="alert"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-red-900">Error</p>
        <p className="text-sm mt-0.5 text-red-900">{message}</p>
        {requestId && (
          <p className="text-xs mt-2 text-red-800 font-mono">
            Request ID: {requestId}
          </p>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-red-800 hover:text-red-900 px-2 py-1 rounded font-medium"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
