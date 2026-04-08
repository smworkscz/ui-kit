import React, { useCallback, useId, useRef, useState } from 'react';
import { FileText as FileTextIcon, UploadSimple as UploadSimpleIcon, Folder as FolderIcon, X as XIcon } from '@phosphor-icons/react';
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

export type FileUploadVariant = 'dropzone' | 'button';

export interface FileUploadProps {
  /**
   * Vizuální varianta.
   * - `'dropzone'` — velká zóna s drag & drop (výchozí)
   * - `'button'`   — kompaktní vstup ve stylu tlačítka/inputu
   * @default 'dropzone'
   */
  variant?: FileUploadVariant;
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
  /**
   * Styl tlačítka u button varianty.
   * - `'default'` — neutrální vstupní pole
   * - `'primary'` — oranžové tlačítko jako primární Button
   * @default 'default'
   */
  buttonStyle?: 'default' | 'primary';
  /**
   * Zda zobrazit seznam nahraných souborů pod komponentou.
   * @default true
   */
  showFileList?: boolean;
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
  variant = 'dropzone',
  onFiles,
  accept,
  multiple = false,
  maxSize,
  disabled = false,
  label,
  helperText,
  error,
  buttonStyle = 'default',
  showFileList = true,
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

      {/* Skrytý input */}
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

      {variant === 'dropzone' ? (
        /* ── Dropzone varianta ──────────────────────────────────────────── */
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
          <UploadSimpleIcon size={32} color={t.textSecondary} />
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
      ) : (
        /* ── Button varianta ─────────────────────────────────────────────── */
        buttonStyle === 'primary' ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && inputRef.current?.click()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid transparent',
            backgroundColor: '#FC4F00',
            color: '#ffffff',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 'normal',
            transition: 'background-color 0.15s ease',
            boxSizing: 'border-box',
            outline: 'none',
            maxWidth: '100%',
          }}
          onMouseEnter={(e) => {
            if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = '#FF6D2A';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#FC4F00';
          }}
        >
          <UploadSimpleIcon size={16} color="#ffffff" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {files.length === 0
              ? 'Nahrát soubor'
              : files.length === 1
                ? files[0].file.name
                : `${files.length} souborů`}
          </span>
        </button>
        ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: `1px solid ${hasError ? t.borderError : t.border}`,
            backgroundColor: disabled ? t.backgroundDisabled : t.background,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              (e.currentTarget as HTMLElement).style.borderColor = hasError ? t.borderError : theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = hasError ? t.borderError : t.border;
          }}
        >
          {/* Ikona souboru nebo upload */}
          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: t.textSecondary }}>
            {files.length > 0 ? <FileTextIcon size={18} color={t.textSecondary} /> : <UploadSimpleIcon size={18} color={t.textSecondary} />}
          </span>

          {/* Text */}
          <span
            style={{
              flex: 1,
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '14px',
              color: files.length > 0 ? t.text : t.textSecondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {files.length === 0
              ? 'Vyberte soubor...'
              : files.length === 1
                ? files[0].file.name
                : `${files.length} souborů`}
          </span>

          {/* Velikost souboru */}
          {files.length === 1 && (
            <span style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', color: t.textSecondary, flexShrink: 0 }}>
              {formatFileSize(files[0].file.size)}
            </span>
          )}

          {/* Browse ikona */}
          <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: t.textSecondary }}>
            <FolderIcon size={16} color={t.textSecondary} />
          </span>
        </div>
        )
      )}

      {/* File list */}
      {showFileList && files.length > 0 && (
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
              <FileTextIcon size={24} color={t.textSecondary} />
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
                <XIcon size={14} color={t.removeColor} />
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
