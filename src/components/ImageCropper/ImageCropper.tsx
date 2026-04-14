import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Crop as CropIcon, X as XIcon } from '@phosphor-icons/react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    overlayBg: 'rgba(0,0,0,0.6)',
    cropBorder: '#ffffff',
    handleBg: '#ffffff',
    handleBorder: 'rgba(0,0,0,0.3)',
    actionBarBg: 'rgba(24,24,24,0.95)',
    actionBarBorder: 'rgba(255,255,255,0.1)',
    buttonPrimary: '#FC4F00',
    buttonPrimaryHover: '#FF6D2A',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: 'transparent',
    buttonSecondaryBorder: 'rgba(255,255,255,0.3)',
    buttonSecondaryText: '#ffffff',
    buttonSecondaryHover: 'rgba(255,255,255,0.06)',
    text: '#ffffff',
    textSecondary: '#ACACAC',
    containerBg: 'rgba(3,3,3,0.75)',
    containerBorder: 'rgba(255,255,255,0.08)',
  },
  light: {
    overlayBg: 'rgba(0,0,0,0.4)',
    cropBorder: '#ffffff',
    handleBg: '#ffffff',
    handleBorder: 'rgba(0,0,0,0.2)',
    actionBarBg: 'rgba(255,255,255,0.95)',
    actionBarBorder: 'rgba(0,0,0,0.08)',
    buttonPrimary: '#FC4F00',
    buttonPrimaryHover: '#FF6D2A',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: 'transparent',
    buttonSecondaryBorder: 'rgba(0,0,0,0.2)',
    buttonSecondaryText: '#1a1a1a',
    buttonSecondaryHover: 'rgba(0,0,0,0.04)',
    text: '#1a1a1a',
    textSecondary: '#888888',
    containerBg: 'rgba(255,255,255,0.85)',
    containerBorder: 'rgba(0,0,0,0.08)',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type CropShape = 'rect' | 'circle';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageCropperProps {
  /** Zdroj obrázku — URL string nebo File objekt. */
  src: string | File;
  /** Callback s oříznutým výsledkem jako Blob. */
  onCrop: (result: Blob) => void;
  /** Callback při zrušení. */
  onCancel?: () => void;
  /** Poměr stran (šířka/výška). Undefined = volný. */
  aspectRatio?: number;
  /** Minimální šířka ořezu v px. @default 50 */
  minWidth?: number;
  /** Minimální výška ořezu v px. @default 50 */
  minHeight?: number;
  /** Tvar ořezu. @default 'rect' */
  shape?: CropShape;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const HANDLE_SIZE = 10;

type DragType = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ─── ImageCropper ────────────────────────────────────────────────────────────

/**
 * Ořezávání obrázku na canvasu.
 *
 * Umožňuje přetahování a změnu velikosti ořezové oblasti.
 * Podporuje obdélníkový a kruhový tvar, poměr stran a minimální rozměry.
 *
 * @example
 * ```tsx
 * <ImageCropper
 *   src={file}
 *   aspectRatio={1}
 *   shape="circle"
 *   onCrop={(blob) => uploadAvatar(blob)}
 *   onCancel={() => setShowCropper(false)}
 * />
 * ```
 */
export const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  onCrop,
  onCancel,
  aspectRatio,
  minWidth = 50,
  minHeight = 50,
  shape = 'rect',
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ natural: { w: 0, h: 0 }, display: { w: 0, h: 0 }, offset: { x: 0, y: 0 } });
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [dragState, setDragState] = useState<{ type: DragType; startX: number; startY: number; startCrop: CropArea } | null>(null);

  // Force circle to 1:1 aspect ratio
  const effectiveAspect = shape === 'circle' ? 1 : aspectRatio;

  // ── Load image ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (src instanceof File) {
      const url = URL.createObjectURL(src);
      setImageSrc(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageSrc(src);
    }
  }, [src]);

  // ── Calculate display dimensions ────────────────────────────────────────

  const recalcLayout = useCallback(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img || !img.naturalWidth) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    const scale = Math.min(cw / nw, ch / nh);
    const dw = nw * scale;
    const dh = nh * scale;
    const ox = (cw - dw) / 2;
    const oy = (ch - dh) / 2;

    setImageSize({ natural: { w: nw, h: nh }, display: { w: dw, h: dh }, offset: { x: ox, y: oy } });

    // Initialize crop to centered 80% or aspect-constrained
    const maxCropW = dw * 0.8;
    const maxCropH = dh * 0.8;
    let cropW: number, cropH: number;

    if (effectiveAspect) {
      if (maxCropW / effectiveAspect <= maxCropH) {
        cropW = maxCropW;
        cropH = maxCropW / effectiveAspect;
      } else {
        cropH = maxCropH;
        cropW = maxCropH * effectiveAspect;
      }
    } else {
      cropW = maxCropW;
      cropH = maxCropH;
    }

    cropW = Math.max(cropW, minWidth);
    cropH = Math.max(cropH, minHeight);

    setCrop({
      x: ox + (dw - cropW) / 2,
      y: oy + (dh - cropH) / 2,
      width: cropW,
      height: cropH,
    });
  }, [effectiveAspect, minWidth, minHeight]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    recalcLayout();
  };

  useEffect(() => {
    window.addEventListener('resize', recalcLayout);
    return () => window.removeEventListener('resize', recalcLayout);
  }, [recalcLayout]);

  // ── Drag logic ──────────────────────────────────────────────────────────

  const getClientPos = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    if (!dragState) return;

    const { display: { w: dw, h: dh }, offset: { x: ox, y: oy } } = imageSize;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const pos = getClientPos(e);
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const dx = pos.x - dragState.startX;
      const dy = pos.y - dragState.startY;
      const sc = dragState.startCrop;

      let newCrop = { ...sc };

      if (dragState.type === 'move') {
        newCrop.x = clamp(sc.x + dx, ox, ox + dw - sc.width);
        newCrop.y = clamp(sc.y + dy, oy, oy + dh - sc.height);
      } else {
        // Resize
        let nx = sc.x, ny = sc.y, nw2 = sc.width, nh2 = sc.height;
        const type = dragState.type;

        if (type.includes('e')) nw2 = Math.max(minWidth, sc.width + dx);
        if (type.includes('w')) { nw2 = Math.max(minWidth, sc.width - dx); nx = sc.x + sc.width - nw2; }
        if (type.includes('s')) nh2 = Math.max(minHeight, sc.height + dy);
        if (type.includes('n')) { nh2 = Math.max(minHeight, sc.height - dy); ny = sc.y + sc.height - nh2; }

        // Enforce aspect ratio
        if (effectiveAspect) {
          if (type === 'n' || type === 's') {
            nw2 = nh2 * effectiveAspect;
            nx = sc.x + (sc.width - nw2) / 2;
          } else if (type === 'e' || type === 'w') {
            nh2 = nw2 / effectiveAspect;
            ny = sc.y + (sc.height - nh2) / 2;
          } else {
            nh2 = nw2 / effectiveAspect;
            if (type.includes('n')) ny = sc.y + sc.height - nh2;
          }
        }

        // Clamp to image bounds
        nx = clamp(nx, ox, ox + dw - nw2);
        ny = clamp(ny, oy, oy + dh - nh2);
        nw2 = Math.min(nw2, ox + dw - nx);
        nh2 = Math.min(nh2, oy + dh - ny);

        newCrop = { x: nx, y: ny, width: nw2, height: nh2 };
      }

      setCrop(newCrop);
    };

    const handleEnd = () => setDragState(null);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [dragState, imageSize, effectiveAspect, minWidth, minHeight]);

  const startDrag = (type: DragType, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = 'touches' in e ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
    setDragState({ type, startX: pos.x, startY: pos.y, startCrop: { ...crop } });
  };

  // ── Crop action ─────────────────────────────────────────────────────────

  const handleCrop = useCallback(() => {
    const img = imgRef.current;
    if (!img || !imageSize.display.w) return;

    const scale = imageSize.natural.w / imageSize.display.w;
    const sx = (crop.x - imageSize.offset.x) * scale;
    const sy = (crop.y - imageSize.offset.y) * scale;
    const sw = crop.width * scale;
    const sh = crop.height * scale;

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(sw / 2, sh / 2, sw / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
    }, 'image/png');
  }, [crop, imageSize, shape, onCrop]);

  // ── Handle positions ────────────────────────────────────────────────────

  const handles: { type: DragType; cursor: string; style: React.CSSProperties }[] = useMemo(() => {
    const hs = HANDLE_SIZE;
    const half = hs / 2;
    return [
      { type: 'nw', cursor: 'nwse-resize', style: { left: -half, top: -half } },
      { type: 'ne', cursor: 'nesw-resize', style: { right: -half, top: -half } },
      { type: 'sw', cursor: 'nesw-resize', style: { left: -half, bottom: -half } },
      { type: 'se', cursor: 'nwse-resize', style: { right: -half, bottom: -half } },
      { type: 'n', cursor: 'ns-resize', style: { left: '50%', top: -half, marginLeft: -half } },
      { type: 's', cursor: 'ns-resize', style: { left: '50%', bottom: -half, marginLeft: -half } },
      { type: 'w', cursor: 'ew-resize', style: { left: -half, top: '50%', marginTop: -half } },
      { type: 'e', cursor: 'ew-resize', style: { right: -half, top: '50%', marginTop: -half } },
    ];
  }, []);

  // ── Button styles ───────────────────────────────────────────────────────

  const btnBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 20px',
    borderRadius: '8px',
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.12s ease',
    boxSizing: 'border-box',
    outline: 'none',
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: t.containerBg,
        border: `1px solid ${t.containerBorder}`,
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: "'Zalando Sans', sans-serif",
        ...style,
      }}
    >
      {/* Image area */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '300px',
          maxHeight: '500px',
          overflow: 'hidden',
          cursor: dragState ? (dragState.type === 'move' ? 'grabbing' : `${dragState.type}-resize`) : 'default',
          userSelect: 'none',
          backgroundColor: '#000',
        }}
      >
        {imageSrc && (
          <img
            ref={imgRef}
            src={imageSrc}
            crossOrigin="anonymous"
            onLoad={handleImageLoad}
            style={{
              position: 'absolute',
              top: imageSize.offset.y,
              left: imageSize.offset.x,
              width: imageSize.display.w || '100%',
              height: imageSize.display.h || '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
            }}
            alt=""
          />
        )}

        {imageLoaded && (
          <>
            {/* Dark overlay — 4 regions around crop */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: crop.y, backgroundColor: t.overlayBg, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: crop.y + crop.height, left: 0, right: 0, bottom: 0, backgroundColor: t.overlayBg, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: crop.y, left: 0, width: crop.x, height: crop.height, backgroundColor: t.overlayBg, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: crop.y, left: crop.x + crop.width, right: 0, height: crop.height, backgroundColor: t.overlayBg, pointerEvents: 'none' }} />

            {/* Crop area */}
            <div
              style={{
                position: 'absolute',
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
                border: `2px dashed ${t.cropBorder}`,
                borderRadius: shape === 'circle' ? '50%' : '0',
                cursor: 'grab',
                boxSizing: 'border-box',
              }}
              onMouseDown={(e) => startDrag('move', e)}
              onTouchStart={(e) => startDrag('move', e)}
            >
              {/* Grid lines */}
              <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />

              {/* Resize handles */}
              {handles.map((h) => (
                <div
                  key={h.type}
                  style={{
                    position: 'absolute',
                    width: HANDLE_SIZE,
                    height: HANDLE_SIZE,
                    backgroundColor: t.handleBg,
                    border: `1px solid ${t.handleBorder}`,
                    borderRadius: '2px',
                    cursor: h.cursor,
                    zIndex: 2,
                    ...h.style,
                  }}
                  onMouseDown={(e) => startDrag(h.type as DragType, e)}
                  onTouchStart={(e) => startDrag(h.type as DragType, e)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
          padding: '12px 16px',
          backgroundColor: t.actionBarBg,
          borderTop: `1px solid ${t.actionBarBorder}`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {onCancel && (
          <button
            type="button"
            style={{ ...btnBase, backgroundColor: t.buttonSecondaryBg, color: t.buttonSecondaryText, border: `1px solid ${t.buttonSecondaryBorder}` }}
            onClick={onCancel}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = t.buttonSecondaryHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = t.buttonSecondaryBg; }}
          >
            <XIcon size={14} />
            Zrušit
          </button>
        )}
        <button
          type="button"
          style={{ ...btnBase, backgroundColor: t.buttonPrimary, color: t.buttonPrimaryText, border: '1px solid transparent' }}
          onClick={handleCrop}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = t.buttonPrimaryHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = t.buttonPrimary; }}
        >
          <CropIcon size={14} />
          Oříznout
        </button>
      </div>
    </div>
  );
};

ImageCropper.displayName = 'ImageCropper';
