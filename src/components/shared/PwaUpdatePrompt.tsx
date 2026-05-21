import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const PREVIEW_FLAG = 'pwaPreview';

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: unknown) {
      console.error('PWA registration error', error);
    },
  });
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get(PREVIEW_FLAG) === '1') setPreview(true);
  }, []);

  if (!needRefresh && !preview) return null;

  return (
    <div
      role="status"
      className="toast toast-bottom toast-center z-50"
    >
      <div className="alert alert-info shadow-lg">
        <span>{preview && !needRefresh ? 'New version available. (preview)' : 'New version available.'}</span>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => {
              setNeedRefresh(false);
              setPreview(false);
            }}
          >
            Dismiss
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => {
              if (needRefresh) {
                void updateServiceWorker(true);
              } else {
                setPreview(false);
              }
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
