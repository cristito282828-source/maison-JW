'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes('welcome-toast=2')) {
      toast('🎉 ¡Bienvenido!', {
        id: 'welcome-toast',
        duration: 10000, // 10 segundos
        onDismiss: () => {
          document.cookie = 'welcome-toast=2; max-age=31536000; path=/';
        },
        description: (
          <>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 🤖
          </>
        )
      });
    }
  }, []);

  return null;
}
