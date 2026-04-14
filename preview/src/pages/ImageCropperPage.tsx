import React, { useState } from 'react';
import { ImageCropper, Button } from '../../../src';
import { PageLayout, H1, H2, Paragraph, Playground, PropsTable, VariantShowcase } from './shared';
import type { PlaygroundControl, PropDef } from './shared';

const DEMO_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop';

const controls: PlaygroundControl[] = [
  { type: 'select', prop: 'shape', label: 'Tvar', options: ['rect', 'circle'], defaultValue: 'rect' },
  { type: 'boolean', prop: 'locked', label: 'Poměr 1:1', defaultValue: false },
];

const propDefs: PropDef[] = [
  { name: 'src', type: 'string | File', required: true, description: 'Zdroj obrázku — URL nebo File objekt.' },
  { name: 'onCrop', type: '(result: Blob) => void', required: true, description: 'Callback s oříznutým výsledkem.' },
  { name: 'onCancel', type: '() => void', description: 'Callback při zrušení.' },
  { name: 'aspectRatio', type: 'number', description: 'Poměr stran (šířka/výška). Undefined = volný.' },
  { name: 'minWidth', type: 'number', defaultValue: '50', description: 'Minimální šířka ořezu v px.' },
  { name: 'minHeight', type: 'number', defaultValue: '50', description: 'Minimální výška ořezu v px.' },
  { name: 'shape', type: "'rect' | 'circle'", defaultValue: "'rect'", description: 'Tvar ořezu.' },
];

const CropperDemo: React.FC<{ shape: any; locked: boolean }> = ({ shape, locked }) => {
  const [result, setResult] = useState<string | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: 500 }}>
      <ImageCropper
        src={DEMO_IMAGE}
        shape={shape}
        aspectRatio={locked || shape === 'circle' ? 1 : undefined}
        onCrop={(blob) => {
          const url = URL.createObjectURL(blob);
          setResult(url);
        }}
        onCancel={() => setResult(null)}
      />
      {result && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Zalando Sans', sans-serif", fontSize: '12px', opacity: 0.6, margin: '0 0 8px' }}>Výsledek:</p>
          <img
            src={result}
            alt="Cropped"
            style={{ maxWidth: 200, maxHeight: 200, borderRadius: shape === 'circle' ? '50%' : '8px', border: '1px solid rgba(128,128,128,0.2)' }}
          />
        </div>
      )}
    </div>
  );
};

export const ImageCropperPage: React.FC = () => (
  <PageLayout>
    <H1>ImageCropper</H1>
    <Paragraph large>
      Ořezávací nástroj pro obrázky. Podporuje přetahování, změnu velikosti ořezové
      oblasti, poměr stran, kruhový tvar a export do Blob.
    </Paragraph>

    <Playground
      controls={controls}
      render={(props) => <CropperDemo shape={props.shape} locked={props.locked as boolean} />}
    />

    <H2>Props</H2>
    <PropsTable props={propDefs} />
  </PageLayout>
);
