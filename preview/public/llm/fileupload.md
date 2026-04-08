# FileUpload

File upload with drag & drop zone, compact input-style, or primary button variant.

**Import:** `import { FileUpload } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'dropzone' | 'button'` | 'dropzone' |  | Visual variant — large zone or compact button. |
| `buttonStyle` | `'default' | 'primary'` | 'default' |  | Button variant style — neutral input or primary orange button. |
| `showFileList` | `boolean` | true |  | Show uploaded file list below component. |
| `onFiles` | `(files: File[]) => void` | — |  | Callback with selected files. |
| `accept` | `string` | — |  | Allowed file types (e.g. 'image/*,.pdf'). |
| `multiple` | `boolean` | false |  | Allow multiple files. |
| `maxSize` | `number` | — |  | Max file size in bytes. |
| `disabled` | `boolean` | false |  | Disable upload. |
| `label` | `string` | — |  | Label text. |
| `error` | `boolean | string` | — |  | Error state. |

## Usage

```tsx
<FileUpload label="Documents" accept="image/*,.pdf" multiple onFiles={handleFiles} />
<FileUpload variant="button" label="Avatar" accept="image/*" />
<FileUpload variant="button" buttonStyle="primary" label="Upload" showFileList={false} />
```
