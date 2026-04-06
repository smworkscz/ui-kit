import React, { useState, useMemo } from 'react';
import { useTheme, Select, Switch, Input as LibInput } from '../../../src';
import type { SelectOption } from '../../../src';

// ─── Page layout ────────────────────────────────────────────────────────────

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 48px 80px' }}>
    {children}
  </div>
);

// ─── Typography ─────────────────────────────────────────────────────────────

export const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1
    style={{
      fontFamily: "'Zalando Sans Expanded', sans-serif",
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 12,
      lineHeight: 1.2,
    }}
  >
    {children}
  </h1>
);

export const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    style={{
      fontFamily: "'Zalando Sans Expanded', sans-serif",
      fontSize: 18,
      fontWeight: 600,
      marginTop: 36,
      marginBottom: 12,
      lineHeight: 1.3,
    }}
  >
    {children}
  </h2>
);

export const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3
    style={{
      fontFamily: "'Zalando Sans', sans-serif",
      fontSize: 15,
      fontWeight: 600,
      marginTop: 24,
      marginBottom: 8,
      lineHeight: 1.4,
    }}
  >
    {children}
  </h3>
);

export const Paragraph: React.FC<{ children: React.ReactNode; large?: boolean }> = ({ children, large }) => (
  <p
    style={{
      fontFamily: "'Zalando Sans', sans-serif",
      fontSize: large ? 15 : 14,
      fontWeight: 400,
      lineHeight: 1.7,
      opacity: 0.7,
      marginBottom: 16,
    }}
  >
    {children}
  </p>
);

// ─── Code block ─────────────────────────────────────────────────────────────

export const CodeBlock: React.FC<{ children: string; language?: string }> = ({ children }) => {
  const theme = useTheme();

  return (
    <pre
      style={{
        fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontSize: 13,
        lineHeight: 1.6,
        padding: '16px 20px',
        borderRadius: 10,
        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        overflowX: 'auto',
        marginTop: 8,
        marginBottom: 16,
      }}
    >
      <code>{children}</code>
    </pre>
  );
};

// ─── Inline code ────────────────────────────────────────────────────────────

export const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  return (
    <code
      style={{
        fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontSize: 12.5,
        padding: '2px 6px',
        borderRadius: 4,
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      }}
    >
      {children}
    </code>
  );
};

// ─── Info box ───────────────────────────────────────────────────────────────

export const InfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        padding: '14px 18px',
        borderRadius: 10,
        borderLeft: '3px solid #FC4F00',
        backgroundColor: theme === 'dark' ? 'rgba(252,79,0,0.06)' : 'rgba(252,79,0,0.04)',
        fontSize: 14,
        lineHeight: 1.6,
        marginBottom: 20,
        opacity: 0.85,
      }}
    >
      {children}
    </div>
  );
};

// ─── Playground control types ───────────────────────────────────────────────

export type PlaygroundControl =
  | { type: 'select'; prop: string; label: string; options: string[]; defaultValue: string }
  | { type: 'boolean'; prop: string; label: string; defaultValue: boolean }
  | { type: 'text'; prop: string; label: string; defaultValue: string };

// ─── Playground ─────────────────────────────────────────────────────────────

interface PlaygroundProps {
  controls: PlaygroundControl[];
  render: (props: Record<string, any>) => React.ReactNode;
}

export const Playground: React.FC<PlaygroundProps> = ({ controls, render }) => {
  const theme = useTheme();

  const defaults = useMemo(() => {
    const d: Record<string, any> = {};
    controls.forEach((c) => { d[c.prop] = c.defaultValue; });
    return d;
  }, [controls]);

  const [values, setValues] = useState<Record<string, any>>(defaults);

  const set = (prop: string, val: any) =>
    setValues((prev) => ({ ...prev, [prop]: val }));

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        borderRadius: 12,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
        overflow: 'hidden',
        marginTop: 8,
        marginBottom: 32,
      }}
    >
      {/* Preview area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 32px',
          minHeight: 180,
        }}
      >
        {render(values)}
      </div>

      {/* Controls */}
      <div
        style={{
          width: 240,
          flexShrink: 0,
          padding: '16px 18px',
          borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
          backgroundColor: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontFamily: "'Zalando Sans Expanded', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
            marginBottom: 14,
          }}
        >
          Props
        </div>
        {controls.map((ctrl) => (
          <PlaygroundControlItem
            key={ctrl.prop}
            control={ctrl}
            value={values[ctrl.prop]}
            onChange={(val) => set(ctrl.prop, val)}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Playground control item ────────────────────────────────────────────────

const PlaygroundControlItem: React.FC<{
  control: PlaygroundControl;
  value: any;
  onChange: (val: any) => void;
}> = ({ control, value, onChange }) => {
  if (control.type === 'boolean') {
    return (
      <div style={{ marginBottom: 10 }}>
        <Switch
          checked={value}
          onChange={onChange}
          label={control.label}
          size="sm"
        />
      </div>
    );
  }

  if (control.type === 'select') {
    const options: SelectOption[] = control.options.map((opt) => ({ value: opt }));
    return (
      <div style={{ marginBottom: 10 }}>
        <Select
          options={options}
          value={value}
          onChange={onChange}
          placeholder={control.label}
          style={{ fontSize: 12 }}
        />
      </div>
    );
  }

  // text
  return (
    <div style={{ marginBottom: 10 }}>
      <LibInput
        size="sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={control.label}
      />
    </div>
  );
};

// ─── Props table ────────────────────────────────────────────────────────────

export interface PropDef {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export const PropsTable: React.FC<{ props: PropDef[] }> = ({ props: propDefs }) => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const headerBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const cellStyle: React.CSSProperties = {
    padding: '10px 12px',
    borderBottom: `1px solid ${borderColor}`,
    fontSize: 13,
    verticalAlign: 'top',
  };

  return (
    <div style={{ overflowX: 'auto', marginTop: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            {['Prop', 'Typ', 'Výchozí', 'Popis'].map((h) => (
              <th
                key={h}
                style={{
                  ...cellStyle,
                  borderBottom: `1px solid ${headerBorder}`,
                  fontFamily: "'Zalando Sans', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  opacity: 0.5,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {propDefs.map((p) => (
            <tr key={p.name}>
              <td style={cellStyle}>
                <code
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: 12,
                    color: '#FC4F00',
                    fontWeight: 500,
                  }}
                >
                  {p.name}
                  {p.required && <span style={{ color: '#EF3838' }}>*</span>}
                </code>
              </td>
              <td style={cellStyle}>
                <code
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: 11.5,
                    padding: '2px 5px',
                    borderRadius: 4,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.type}
                </code>
              </td>
              <td style={{ ...cellStyle, opacity: p.defaultValue ? 0.7 : 0.3, fontFamily: "'SF Mono', monospace", fontSize: 12 }}>
                {p.defaultValue ?? '—'}
              </td>
              <td style={{ ...cellStyle, opacity: 0.7, lineHeight: 1.5 }}>
                {p.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Variant showcase ───────────────────────────────────────────────────────

export const VariantShowcase: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontFamily: "'Zalando Sans', sans-serif",
          fontSize: 12,
          fontWeight: 500,
          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)',
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {children}
      </div>
    </div>
  );
};
