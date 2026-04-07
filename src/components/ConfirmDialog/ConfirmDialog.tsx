import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Modal } from '../Modal';

// ─── Design tokens ──────────────────────────────────────────────────────────

const tokens = {
  dark: {
    titleText: '#ffffff',
    descriptionText: '#eaeaea',
    cancelBg: 'transparent',
    cancelHover: 'rgba(255,255,255,0.08)',
    cancelBorder: 'rgba(255,255,255,0.15)',
    cancelText: '#eaeaea',
    confirmBg: '#FC4F00',
    confirmHover: '#FF6D2A',
    confirmText: '#ffffff',
    dangerBg: '#EF3838',
    dangerHover: '#ff5252',
    dangerText: '#ffffff',
  },
  light: {
    titleText: '#1a1a1a',
    descriptionText: '#333333',
    cancelBg: 'transparent',
    cancelHover: 'rgba(0,0,0,0.05)',
    cancelBorder: 'rgba(0,0,0,0.12)',
    cancelText: '#333333',
    confirmBg: '#FC4F00',
    confirmHover: '#FF6D2A',
    confirmText: '#ffffff',
    dangerBg: '#EF3838',
    dangerHover: '#ff5252',
    dangerText: '#ffffff',
  },
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ConfirmDialogProps {
  /** Řídí zobrazení potvrzovacího dialogu. */
  open: boolean;
  /** Voláno při potvrzení akce. */
  onConfirm: () => void;
  /** Voláno při zrušení (zavření) dialogu. */
  onCancel: () => void;
  /** Titulek dialogu. */
  title: string;
  /** Volitelný popis akce. */
  description?: string;
  /** Text potvrzovacího tlačítka. @default 'Potvrdit' */
  confirmLabel?: string;
  /** Text zrušovacího tlačítka. @default 'Zrušit' */
  cancelLabel?: string;
  /** Varianta dialogu – 'danger' zvýrazní potvrzovací tlačítko červeně. @default 'default' */
  variant?: 'default' | 'danger';
  /** Stav načítání potvrzovacího tlačítka. @default false */
  loading?: boolean;
  /** Další inline styly. */
  style?: React.CSSProperties;
  /** Dodatečná CSS třída. */
  className?: string;
}

// ─── ConfirmDialog ──────────────────────────────────────────────────────────

/**
 * Předpřipravený modální dialog pro potvrzení akce.
 *
 * Interně používá komponentu `Modal`. Podporuje standardní a danger variantu
 * s volitelným stavem načítání.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   open={isOpen}
 *   onConfirm={handleDelete}
 *   onCancel={() => setOpen(false)}
 *   title="Smazat položku?"
 *   description="Tato akce je nevratná."
 *   variant="danger"
 * />
 * ```
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = 'Potvrdit',
  cancelLabel = 'Zrušit',
  variant = 'default',
  loading = false,
  style,
  className,
}) => {
  const theme = useTheme();
  const t = tokens[theme];

  const [cancelHovered, setCancelHovered] = useState(false);
  const [confirmHovered, setConfirmHovered] = useState(false);

  const isDanger = variant === 'danger';
  const confirmBg = isDanger
    ? confirmHovered ? t.dangerHover : t.dangerBg
    : confirmHovered ? t.confirmHover : t.confirmBg;
  const confirmTextColor = isDanger ? t.dangerText : t.confirmText;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      className={className}
      style={style}
      footer={
        <>
          {/* Tlačítko Zrušit */}
          <button
            type="button"
            onClick={onCancel}
            onMouseEnter={() => setCancelHovered(true)}
            onMouseLeave={() => setCancelHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              background: cancelHovered ? t.cancelHover : t.cancelBg,
              border: `1px solid ${t.cancelBorder}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: t.cancelText,
              lineHeight: 'normal',
              transition: 'background-color 0.12s ease',
            }}
          >
            {cancelLabel}
          </button>

          {/* Tlačítko Potvrdit */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            onMouseEnter={() => setConfirmHovered(true)}
            onMouseLeave={() => setConfirmHovered(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              background: confirmBg,
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Zalando Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: confirmTextColor,
              lineHeight: 'normal',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.12s ease, opacity 0.12s ease',
            }}
          >
            {loading ? 'Zpracovávám...' : confirmLabel}
          </button>
        </>
      }
    >
      {description && (
        <p
          style={{
            margin: 0,
            fontFamily: "'Zalando Sans', sans-serif",
            fontSize: '14px',
            lineHeight: '1.6',
            color: t.descriptionText,
          }}
        >
          {description}
        </p>
      )}
    </Modal>
  );
};

ConfirmDialog.displayName = 'ConfirmDialog';
