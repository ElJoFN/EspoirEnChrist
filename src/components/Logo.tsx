import React, { useEffect, useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const PRIMARY_LOGO_SRC = '/assets/aistudio/Logo_653519cb.jpeg';
const FALLBACK_LOGO_SRC = '/logo.jpeg';
const LEGACY_PUBLIC_SRC = '/public/assets/aistudio/Logo_653519cb.jpeg';

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const [processedSrc, setProcessedSrc] = useState<string>(PRIMARY_LOGO_SRC);
  const [isProcessed, setIsProcessed] = useState<boolean>(false);

  // Process image on client canvas to transparently strip white corners
  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    // Try primary path first
    img.src = PRIMARY_LOGO_SRC;

    img.onload = () => {
      if (!isMounted) return;
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 600;

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        // Radius of circular logo badge
        const radius = Math.min(centerX, centerY) - 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const pixelIndex = i / 4;
          const x = pixelIndex % canvas.width;
          const y = Math.floor(pixelIndex / canvas.width);
          
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // If outside circular badge OR if pixel is white/near-white corner background
          if (dist > radius - 2) {
            data[i + 3] = 0; // Make transparent
          } else if (dist > radius - 10 && r > 230 && g > 230 && b > 230) {
            // Anti-aliased outer edge white pixels
            data[i + 3] = Math.max(0, Math.floor((radius - dist) * 25.5));
          } else if (r > 245 && g > 245 && b > 245 && dist > radius * 0.94) {
            // Corner white background
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        if (isMounted) {
          setProcessedSrc(dataUrl);
          setIsProcessed(true);
        }
      } catch (err) {
        // Fallback gracefully without throwing
        if (isMounted) {
          setProcessedSrc(PRIMARY_LOGO_SRC);
        }
      }
    };

    img.onerror = () => {
      // If primary path fails, try fallback logo.jpeg
      if (img.src !== window.location.origin + FALLBACK_LOGO_SRC) {
        img.src = FALLBACK_LOGO_SRC;
      }
    };

    return () => {
      isMounted = false;
    };
  }, []);

  const dimensions = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-11 h-11 sm:w-13 sm:h-13',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative ${dimensions} shrink-0 group`}>
        {/* Main logo image badge - cleanly cropped with zero outer yellow ring */}
        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105 bg-slate-900">
          <img
            src={processedSrc}
            alt="Logo Espoir en Christ"
            className="w-full h-full object-cover rounded-full"
            onError={() => {
              if (processedSrc === PRIMARY_LOGO_SRC) {
                setProcessedSrc(FALLBACK_LOGO_SRC);
              } else if (processedSrc === FALLBACK_LOGO_SRC) {
                setProcessedSrc(LEGACY_PUBLIC_SRC);
              }
            }}
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-serif font-bold tracking-tight text-slate-900 dark:text-white ${textSizes} leading-none`}>
            Espoir en Christ
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400/90 leading-tight mt-0.5">
            Foi · Amour · Lumière
          </span>
        </div>
      )}
    </div>
  );
};
