'use client';

import { useEffect, useRef } from 'react';
import { apiClient, PreviewItem } from '@/lib/api';
import { ContentInput, PlatformType } from '@/lib/types';
import { useAppStore } from '@/lib/store';

const DEBOUNCE_MS = 600;

export function useDebouncedPreview() {
  const content = useAppStore((s) => s.content);
  const selectedPlatforms = useAppStore((s) => s.selectedPlatforms);
  const setPreviews = useAppStore((s) => s.setPreviews);
  const setIsPreviewLoading = useAppStore((s) => s.setIsPreviewLoading);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef(0);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (selectedPlatforms.length === 0) {
      setPreviews([]);
      setIsPreviewLoading(false);
      return;
    }

    if (!content.title && !content.content) {
      setPreviews([]);
      setIsPreviewLoading(false);
      return;
    }

    setIsPreviewLoading(true);
    const requestId = ++abortRef.current;

    timerRef.current = setTimeout(async () => {
      try {
        const data = await apiClient.getPreview(
          content as ContentInput,
          selectedPlatforms as PlatformType[]
        );
        if (requestId === abortRef.current) {
          setPreviews(data);
        }
      } catch {
        if (requestId === abortRef.current) {
          setPreviews([]);
        }
      } finally {
        if (requestId === abortRef.current) {
          setIsPreviewLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [content, selectedPlatforms, setPreviews, setIsPreviewLoading]);
}
