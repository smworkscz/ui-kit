import React, { useCallback, useId, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

// ─── Design tokens ───────────────────────────────────────────────────────────

const tokens = {
  dark: {
    border: 'rgba(255,255,255,0.3)',
    borderDrag: '#FC4F00',
    borderError: '#EF3838',
    background: 'rgba(3,3,3,0.75)',
    backgroundDrag: 'rgba(252,79,0,0.08)',
    backgroundDisabled: 'rgba(3,3,3,0.4)',
    text: '#ffffff',
    textSecondary: '#ACACAC',
    label: '#ffffff',
    helperText: '#ACACAC',
    fileText: '#ffffff',
    fileBg: 'rgba(255,255,255,0.05)',
    removeColor: '#ACACAC',
    removeHover: '#EF3838',
  },
  light: {
    border: 'rgba(0,0,0,0.2)',
    borderDrag: '#FC4F00',
    borderError: '#EF3838',
    background: 'rgba(255,255,255,0.85)',
    backgroundDrag: 'rgba(252,79,0,0.05)',
    backgroundDisabled: 'rgba(240,240,240,0.6)',
    text: '#1a1a1a',
    textSecondary: '#888888',
    label: '#1a1a1a',
    helperText: '#888888',
    fileText: '#1a1a1a',
    fileBg: 'rgba(0,0,0,0.03)',
    removeColor: '#888888',
    removeHover: '#EF3838',
  },
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UploadedFile {
  /** Objekt nativního souboru. */
  file: File;
  /** Unikátní ID pro klíč. */
  id: string;
}

export interface FileUploadProps {
  /** Callback volaný při přidání souborů. Vrací pole nativních `File` objektů. */
  onFiles?: (files: File[]) => void;
  /**
   * Povolené typy souborů (atribut `accept`).
   * @example 'image/*,.pdf'
   */
  accept?: string;
  /** Povolit výběr více souborů najednou. */
  multiple?: boolean;
  /** Maximální velikost souboru v bajtech. */
  maxSize?: number;
  /** Deaktivuje zónu pro nahrávání. */
  disabled?: boolean;
  /** Popisek nad zónou. */
  label?: string;
  /** Nápovědný text pod zónou. */
  helperText?: string;
  /**
   * Chybový stav. Při řetězci se zobrazí chybová zpráva.
   */
  error?: boolean | string;
  /** Dodatečná CSS třída. */
  className?: string;
  /** Další inline styly. */
  style?: React.CSSProperties;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

let fileIdCounter = 0;

// ─── Icons ───────────────────────────────────────────────────────────────────

const FileIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 2v6h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UploadIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path
      d="M28 20v5.333A2.667 2.667 0 0125.333 28H6.667A2.667 2.667 0 014 25.333V20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M22.667 10.667L16 4l-6.667 6.667" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 4v16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RemoveIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ─── FileUpload ──────────────────────────────────────────────────────────────

/**
 * Zóna pro nahrávání souborů dle SM-UI design systému.
 *
 * Podporuje přetažení (drag & drop), výběr kliknutím,
 * seznam nahraných souborů s možností odebrání a validaci velikosti.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   label="Přílohy"
 *   accept="image/*,.pdf"
 *   multiple
 *   maxSize={5 * 1024 * 1024}
 *   onFiles={(files) => console.log(files)}
 * />
 * ```
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  onFiles,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  label,
  helperText,
  error,
  className,
  style,
}) => {
  const theme = useTheme();
  const t = tokens[theme];
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const hasError = Boolean(error) || Boolean(sizeError);
  const errorMessage = typeof error === 'string' ? error : sizeError ?? undefined;

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const arr = Array.from(fileList);
      setSizeError(null);

      if (maxSize) {
        const oversized = arr.find((f) => f.size > maxSize);
        if (oversized) {
          setSizeError(
            `Soubor „${oversized.name}" překračuje maximální velikost ${formatFileSize(maxSize)}.`
          );
          return;
        }
      }

      const newFiles: UploadedFile[] = arr.map((file) => ({
        file,
        id: `file-${++fileIdCounter}`,
      }));

      const updated = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updated);
      onFiles?.(updated.map((f) => f.file));
    },
    [files, maxSize, multiple, onFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [disabled, processFiles]
  );

  const handleRemove = useCallback(
    (fileId: string) => {
      const updated = files.filter((f) => f.id !== fileId);
      setFiles(updated);
      onFiles?.(updated.map((f) => f.file));
    },
    [files, onFiles]
  );

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans Expanded', sans-serif",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: 'normal',
    textTransform: 'uppercase',
    color: t.label,
    userSelect: 'none',
  };

  const zoneStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '24px',
    border: `2px dashed ${hasError ? t.borderError : dragging ? t.borderDrag : t.border}`,
    borderRadius: '8px',
    backgroundColor: dragging ? t.backgroundDrag : disabled ? t.backgroundDisabled : t.background,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'border-color 0.15s ease, background-color 0.15s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const bottomTextStyle: React.CSSProperties = {
    fontFamily: "'Zalando Sans', sans-serif",
    fontSize: '12px',
    lineHeight: 'normal',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        ...style,
      }}
      className={className}
    >
      {label && <span style={labelStyle}>{label}</span>}

      <div
        style={zoneStyle}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              processFiles(e.target.files);
            }
            e.target.value = '';
          }}
          style={{ display: 'none' }}
        />
        <UploadIcon color={t.textSecondary} />
        <span
          style={{
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            color: t.textSecondary,
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          Přetáhněte soubory nebo klikněte
        </span>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {files.map((f) => (
            <div
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                borderRadius: '6px',
                backgroundColor: t.fileBg,
              }}
            >
              <FileIcon color={t.textSecondary} />
              <span
                style={{
                  flex: 1,
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '13px',
                  color: t.fileText,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.file.name}
              </span>
              <span
                style={{
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: '12px',
                  color: t.textSecondary,
                  flexShrink: 0,
                }}
              >
                {formatFileSize(f.file.size)}
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Odebrat ${f.file.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(f.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleRemove(f.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '2px',
                  flexShrink: 0,
                }}
              >
                <RemoveIcon color={t.removeColor} />
              </span>
            </div>
          ))}
        </div>
      )}

      {errorMessage && (
        <span style={{ ...bottomTextStyle, color: t.borderError }}>
          {errorMessage}
        </span>
      )}
      {!errorMessage && helperText && (
        <span style={{ ...bottomTextStyle, color: t.helperText }}>
          {helperText}
        </span>
      )}
    </div>
  );
};

FileUpload.displayName = 'FileUpload';
