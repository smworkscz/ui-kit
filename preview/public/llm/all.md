# SMWORKS UI KIT — LLM Documentation

Package: `@smworks-cz/ui-kit`

Peer dependencies: `react >= 18`, `react-dom >= 18`, `@phosphor-icons/react >= 2.1.0`

Theme: Set `data-theme="dark"` or `data-theme="light"` on `<body>`. Use `useTheme()` hook to read.

Icons: Use `@phosphor-icons/react` with Icon suffix (e.g. `PlusIcon`, `XIcon`).

---

# Forms

# Button

Button for primary actions, secondary operations, and outline variants. Supports icons, loading state, and can render as a link.

**Import:** `import { Button } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'primary' | 'secondary' | 'outline'` | 'primary' |  | Visual style of the button. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `icon` | `ReactNode` | — |  | Optional icon (SVG or component). |
| `iconPosition` | `'left' | 'right'` | 'left' |  | Icon position relative to text. |
| `loading` | `boolean` | false |  | Shows spinner and disables interaction. |
| `fullWidth` | `boolean` | false |  | Stretches button to full container width. |
| `disabled` | `boolean` | false |  | Disables interaction. |
| `href` | `string` | — |  | If provided, renders as <a> instead of <button>. |
| `children` | `ReactNode` | — |  | Button text content. |

## Usage

```tsx
<Button variant="primary" onClick={handleClick}>Save</Button>
<Button variant="outline" icon={<PlusIcon size={16} />}>Add</Button>
<Button loading>Processing...</Button>
<Button href="/about">Link button</Button>
```

## Notes

- Renders as `<a>` when `href` is provided, otherwise `<button>`
- Icon-only mode (square) when no children provided
- Uses `@phosphor-icons/react` for icons

---

# Input

Text input with icon support, loading state, validation, clear button, and password toggle.

**Import:** `import { Input } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | — |  | Label text above the input (uppercase styled). |
| `icon` | `ReactNode` | — |  | Icon inside the field. |
| `iconPosition` | `'left' | 'right'` | 'left' |  | Icon position. |
| `error` | `boolean | string` | false |  | Error state. String displays error message below. |
| `helperText` | `string` | — |  | Helper text below input. |
| `loading` | `boolean` | false |  | Shows spinner, makes read-only. |
| `clearable` | `boolean` | false |  | Shows clear button. |
| `passwordToggle` | `boolean` | — |  | Shows eye icon for password visibility. Auto-enabled for type="password". |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `fullWidth` | `boolean` | false |  | Stretches to full width. |
| `disabled` | `boolean` | false |  | Disables input. |

## Usage

```tsx
<Input label="Email" placeholder="you@example.com" />
<Input icon={<MagnifyingGlassIcon size={16} />} placeholder="Search..." />
<Input type="password" label="Password" />
<Input error="This field is required" />
<Input loading clearable />
```

## Notes

- Extends native `<input>` HTML attributes
- Password toggle auto-enabled for type="password"
- Forward ref supported

---

# Select

Dropdown select with search, multi-select, clear, and keyboard navigation.

**Import:** `import { Select } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `options` | `SelectOption[]` | — | Yes | Array of { value: string; label?: string; disabled?: boolean }. |
| `value` | `string | string[] | null` | — |  | Current value (string for single, array for multiple). |
| `onChange` | `(value: any) => void` | — |  | Change callback. |
| `multiple` | `boolean` | false |  | Enable multi-select. |
| `searchable` | `boolean` | false |  | Show search/filter input in dropdown. |
| `clearable` | `boolean` | false |  | Show clear button. |
| `disabled` | `boolean` | false |  | Disable select. |
| `loading` | `boolean` | false |  | Show spinner instead of chevron. |
| `error` | `boolean | string` | — |  | Error state or message. |
| `placeholder` | `string` | 'Vyberte…' |  | Placeholder text. |

## Usage

```tsx
<Select
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ]}
  value={value}
  onChange={setValue}
  searchable
  clearable
/>
```

## Notes

- Portal-based dropdown for proper stacking
- Keyboard navigation (arrows, enter, escape)
- Multi-select shows tags for selected values

---

# DatePicker

Date picker with calendar popup. Supports single and range mode with optional time selection.

**Import:** `import { DatePicker } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `mode` | `'single' | 'range'` | 'single' |  | Selection mode. |
| `showTime` | `boolean` | false |  | Add time selection. |
| `value` | `Date | null | [Date, Date]` | — |  | Current value. |
| `onChange` | `(value: any) => void` | — |  | Change callback. |
| `label` | `string` | — |  | Label text. |
| `error` | `boolean | string` | — |  | Error state. |
| `disabled` | `boolean` | false |  | Disable interaction. |
| `clearable` | `boolean` | false |  | Clear button. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `minDate` | `Date` | — |  | Minimum allowed date. |
| `maxDate` | `Date` | — |  | Maximum allowed date. |

## Usage

```tsx
<DatePicker label="Date" value={date} onChange={setDate} />
<DatePicker mode="range" value={[start, end]} onChange={setRange} />
<DatePicker showTime label="Date & Time" />
```

---

# Checkbox

Checkbox with indeterminate state, error messages, and size variants.

**Import:** `import { Checkbox } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `checked` | `boolean` | false |  | Checked state. |
| `onChange` | `(checked: boolean) => void` | — |  | Change callback. |
| `label` | `string` | — |  | Label text. |
| `disabled` | `boolean` | false |  | Disable interaction. |
| `error` | `boolean | string` | — |  | Error state or message. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `indeterminate` | `boolean` | false |  | Show dash instead of checkmark. |

## Usage

```tsx
<Checkbox label="I agree" checked={agreed} onChange={setAgreed} />
<Checkbox indeterminate label="Select all" />
```

---

# RadioGroup

Radio button group for selecting one option from a list.

**Import:** `import { RadioGroup } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `string` | — |  | Currently selected value. |
| `onChange` | `(value: string) => void` | — |  | Change callback. |
| `options` | `{ value: string; label: string; disabled?: boolean }[]` | — | Yes | List of options. |
| `label` | `string` | — |  | Group label. |
| `direction` | `'vertical' | 'horizontal'` | 'vertical' |  | Layout direction. |
| `error` | `boolean | string` | — |  | Error state. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<RadioGroup
  label="Notification method"
  options={[
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push' },
  ]}
  value={method}
  onChange={setMethod}
/>
```

---

# Switch

Toggle switch with smooth animation.

**Import:** `import { Switch } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `checked` | `boolean` | false |  | Toggle state. |
| `onChange` | `(checked: boolean) => void` | — |  | Change callback. |
| `label` | `string` | — |  | Label text. |
| `disabled` | `boolean` | false |  | Disable interaction. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<Switch label="Dark mode" checked={dark} onChange={setDark} />
```

---

# Textarea

Multi-line text input with character counter, auto-height, and resize options.

**Import:** `import { Textarea } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | — |  | Label text. |
| `error` | `boolean | string` | — |  | Error state. |
| `helperText` | `string` | — |  | Helper text below. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `rows` | `number` | 4 |  | Visible rows. |
| `maxLength` | `number` | — |  | Max characters (shows counter). |
| `resize` | `'none' | 'vertical' | 'both'` | 'vertical' |  | Resize mode. |
| `autoHeight` | `boolean` | false |  | Auto-grow to fit content. |
| `minRows` | `number` | 1 |  | Min rows (with autoHeight). |
| `maxRows` | `number` | — |  | Max rows before scrolling (with autoHeight). |

## Usage

```tsx
<Textarea label="Description" placeholder="Write..." maxLength={500} />
<Textarea autoHeight minRows={2} maxRows={10} />
```

---

# Slider

Range slider for selecting numeric values. Supports range mode.

**Import:** `import { Slider } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number | [number, number]` | — | Yes | Current value. |
| `onChange` | `(value) => void` | — |  | Change callback. |
| `min` | `number` | 0 |  | Minimum value. |
| `max` | `number` | 100 |  | Maximum value. |
| `step` | `number` | 1 |  | Step size. |
| `label` | `string` | — |  | Label text. |
| `showValue` | `boolean` | false |  | Show current value. |
| `range` | `boolean` | false |  | Range mode (min-max). |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<Slider value={50} onChange={setValue} label="Volume" showValue />
<Slider value={[20, 80]} onChange={setRange} range />
```

---

# FileUpload

File upload with drag & drop zone or compact input-style variant.

**Import:** `import { FileUpload } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'dropzone' | 'button'` | 'dropzone' |  | Visual variant — large zone or compact input. |
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
```

---

# SegmentedControl

Segmented toggle for choosing between a few options. Animated sliding indicator.

**Import:** `import { SegmentedControl } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `data` | `(string | { value, label?, disabled? })[]` | — | Yes | Segment data. Strings auto-convert. |
| `value` | `string` | — | Yes | Currently selected value. |
| `onChange` | `(value: string) => void` | — | Yes | Change callback. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |
| `fullWidth` | `boolean` | false |  | Stretch to container width. |
| `orientation` | `'horizontal' | 'vertical'` | 'horizontal' |  | Orientation. |
| `disabled` | `boolean` | false |  | Disable all segments. |

## Usage

```tsx
<SegmentedControl data={['List', 'Grid', 'Table']} value={view} onChange={setView} />
<SegmentedControl
  data={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ]}
  value={plan}
  onChange={setPlan}
/>
```

---

# Data Display

# Table

Data table with sorting, loading state, and custom cell rendering.

**Import:** `import { Table } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `columns` | `TableColumn[]` | — | Yes | Column definitions: { key, header, sortable?, width?, render? }. |
| `data` | `any[]` | — | Yes | Data rows. |
| `loading` | `boolean` | false |  | Show skeleton rows. |
| `emptyText` | `string` | 'Žádná data' |  | Empty state text. |
| `onSort` | `(key, direction) => void` | — |  | Sort callback. |
| `striped` | `boolean` | false |  | Alternating row colors. |
| `hoverable` | `boolean` | true |  | Row hover highlight. |

## Usage

```tsx
<Table
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status', render: (val) => <Badge label={val} /> },
  ]}
  data={users}
  onSort={(key, dir) => sort(key, dir)}
/>
```

---

# Card

Content card for grouping related information.

**Import:** `import { Card } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | `string` | — |  | Card heading. |
| `subtitle` | `string` | — |  | Secondary subheading. |
| `header` | `ReactNode` | — |  | Custom header (overrides title/subtitle). |
| `footer` | `ReactNode` | — |  | Footer content (separated by divider). |
| `children` | `ReactNode` | — |  | Card body. |
| `hoverable` | `boolean` | false |  | Lift on hover. |
| `bordered` | `boolean` | true |  | Show border. |
| `padding` | `'none' | 'sm' | 'md' | 'lg'` | 'md' |  | Inner spacing. |

## Usage

```tsx
<Card title="Project" subtitle="Details" footer={<Button>Save</Button>}>
  <p>Card body content</p>
</Card>
```

---

# Accordion / AccordionItem

Collapsible content sections.

**Import:** `import { Accordion } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `multiple` | `boolean` | false |  | Allow multiple open items (Accordion). |
| `title` | `string` | — | Yes | Item title (AccordionItem). |
| `children` | `ReactNode` | — | Yes | Item content (AccordionItem). |
| `defaultOpen` | `boolean` | false |  | Start expanded (AccordionItem). |
| `disabled` | `boolean` | false |  | Disable toggle (AccordionItem). |

## Usage

```tsx
<Accordion>
  <AccordionItem title="Section 1">Content 1</AccordionItem>
  <AccordionItem title="Section 2" defaultOpen>Content 2</AccordionItem>
</Accordion>
```

---

# Tabs / Tab / TabPanel

Tabbed content switcher with underline and pills variants.

**Import:** `import { Tabs } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `string` | — | Yes | Active tab value (Tabs). |
| `onChange` | `(value: string) => void` | — | Yes | Tab change callback (Tabs). |
| `variant` | `'underline' | 'pills'` | 'underline' |  | Tab style (Tabs). |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size (Tabs). |
| `fullWidth` | `boolean` | false |  | Stretch tabs (Tabs). |

## Usage

```tsx
<Tabs value={tab} onChange={setTab}>
  <Tab value="general" label="General" />
  <Tab value="settings" label="Settings" />
  <TabPanel value="general">General content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>
```

---

# Tooltip

Hover tooltip bubble.

**Import:** `import { Tooltip } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `content` | `string | ReactNode` | — | Yes | Tooltip content. |
| `children` | `ReactElement` | — | Yes | Trigger element. |
| `position` | `'top' | 'bottom' | 'left' | 'right'` | 'top' |  | Position. |
| `delay` | `number` | 200 |  | Show delay in ms. |

## Usage

```tsx
<Tooltip content="Delete this item" position="top">
  <Button variant="outline">Delete</Button>
</Tooltip>
```

---

# Popover

Floating panel with arbitrary content, triggered by click or hover.

**Import:** `import { Popover } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `content` | `ReactNode` | — | Yes | Popover content. |
| `children` | `ReactElement` | — | Yes | Trigger element. |
| `position` | `'top' | 'bottom' | 'left' | 'right'` | 'bottom' |  | Position. |
| `trigger` | `'click' | 'hover'` | 'click' |  | Trigger type. |

## Usage

```tsx
<Popover content={<div>Popover content here</div>} trigger="click">
  <Button>Open popover</Button>
</Popover>
```

---

# Skeleton

Loading placeholder with shimmer animation.

**Import:** `import { Skeleton } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'text' | 'circle' | 'rect'` | 'text' |  | Shape. |
| `width` | `number | string` | '100%' |  | Width. |
| `height` | `number | string` | — |  | Height. |
| `lines` | `number` | 1 |  | Number of lines (text variant). |
| `animate` | `boolean` | true |  | Shimmer animation. |

## Usage

```tsx
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={48} height={48} />
<Skeleton variant="rect" width="100%" height={200} />
```

---

# EmptyState

Empty state with icon, title, description, and optional action.

**Import:** `import { EmptyState } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | `string` | — | Yes | Main heading. |
| `description` | `string` | — |  | Description text. |
| `icon` | `ReactNode` | — |  | Illustration icon. |
| `action` | `ReactNode` | — |  | Action button. |

## Usage

```tsx
<EmptyState
  icon={<TrayIcon size={48} />}
  title="No data"
  description="Nothing here yet."
  action={<Button>Add item</Button>}
/>
```

---

# Stat

Statistical value display with trend indicator.

**Import:** `import { Stat } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | — | Yes | Stat label. |
| `value` | `string | number` | — | Yes | Main value. |
| `change` | `number` | — |  | Percentage change. |
| `changeLabel` | `string` | — |  | Change description text. |
| `trend` | `'up' | 'down' | 'neutral'` | 'neutral' |  | Trend direction. |
| `icon` | `ReactNode` | — |  | Icon. |

## Usage

```tsx
<Stat label="Revenue" value="€52,400" change={8.2} trend="up" />
```

---

# Avatar

User avatar displaying initials.

**Import:** `import { Avatar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `initials` | `string` | — | Yes | 1-2 letters (auto-uppercase). |
| `size` | `'sm' | 'md' | 'lg' | number` | 'md' |  | Size (sm: 40px, md: 70px, lg: 96px). |
| `borderRadius` | `string | number` | '8px' |  | Corner rounding. |

## Usage

```tsx
<Avatar initials="JD" size="md" />
<Avatar initials="A" size={32} borderRadius="50%" />
```

---

# Tag / Badge

Tag for categorization. Badge for status labels.

**Import:** `import { Tag } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | — | Yes | Tag/Badge text. |
| `onRemove` | `() => void` | — |  | Remove callback — shows ✕ button (Tag only). |

## Usage

```tsx
<Tag label="React" onRemove={() => remove('react')} />
<Badge label="NEW" />
```

## Notes

- Badge text is automatically uppercased
- Tag and Badge are separate exports from the same module

---

# Navigation

# Modal

Modal dialog with overlay, focus trap, and glass effect.

**Import:** `import { Modal } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Controls visibility. |
| `onClose` | `() => void` | — | Yes | Close callback. |
| `title` | `string` | — |  | Header title. |
| `children` | `ReactNode` | — | Yes | Body content. |
| `footer` | `ReactNode` | — |  | Footer content (buttons). |
| `size` | `'sm' | 'md' | 'lg' | 'fullscreen'` | 'md' |  | Size preset. |
| `closeOnOverlay` | `boolean` | true |  | Close on overlay click. |
| `closeOnEscape` | `boolean` | true |  | Close on Escape key. |
| `showClose` | `boolean` | true |  | Show close button (×). |

## Usage

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Confirm">
  <p>Are you sure?</p>
</Modal>
```

## Notes

- Renders via React portal to document.body
- Includes focus trap and body scroll lock
- Glass effect with backdrop-filter: blur(32px)

---

# Drawer

Side panel that slides in from left or right.

**Import:** `import { Drawer } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Controls visibility. |
| `onClose` | `() => void` | — | Yes | Close callback. |
| `position` | `'left' | 'right'` | 'right' |  | Slide direction. |
| `title` | `string` | — |  | Header title. |
| `children` | `ReactNode` | — | Yes | Body content. |
| `footer` | `ReactNode` | — |  | Footer content. |
| `width` | `string | number` | 400 |  | Panel width. |
| `showClose` | `boolean` | true |  | Show close button. |
| `closeOnOverlay` | `boolean` | true |  | Close on overlay click. |

## Usage

```tsx
<Drawer open={open} onClose={() => setOpen(false)} title="Details">
  <p>Drawer content</p>
</Drawer>
```

---

# Breadcrumb

Breadcrumb navigation showing page hierarchy.

**Import:** `import { Breadcrumb } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `items` | `{ label: string; href?: string }[]` | — | Yes | Navigation items. |
| `separator` | `ReactNode` | '/' |  | Separator between items. |

## Usage

```tsx
<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Current' },
]} />
```

---

# Pagination

Page navigation with smart page reduction.

**Import:** `import { Pagination } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `page` | `number` | — | Yes | Current page (1-indexed). |
| `totalPages` | `number` | — | Yes | Total pages. |
| `onChange` | `(page: number) => void` | — | Yes | Page change callback. |
| `siblings` | `number` | 1 |  | Pages around current. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size preset. |

## Usage

```tsx
<Pagination page={page} totalPages={20} onChange={setPage} />
```

---

# Stepper

Step wizard for multi-step processes.

**Import:** `import { Stepper } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `steps` | `{ label: string; description?: string }[]` | — | Yes | Step definitions. |
| `activeStep` | `number` | — | Yes | Active step index (0-based). |
| `orientation` | `'horizontal' | 'vertical'` | 'horizontal' |  | Orientation. |
| `clickable` | `boolean | 'completed'` | false |  | Allow clicking steps. |
| `onStepClick` | `(index: number) => void` | — |  | Step click callback. |

## Usage

```tsx
<Stepper
  steps={[
    { label: 'Account', description: 'Create account' },
    { label: 'Profile', description: 'Fill details' },
    { label: 'Done' },
  ]}
  activeStep={1}
/>
```

---

# DropdownMenu

Dropdown action menu with keyboard navigation.

**Import:** `import { DropdownMenu } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `trigger` | `ReactNode` | — | Yes | Trigger element. |
| `items` | `DropdownMenuItem[]` | — | Yes | Menu items: { label, icon?, onClick?, disabled?, danger?, divider? }. |
| `position` | `'bottom-left' | 'bottom-right'` | 'bottom-left' |  | Menu position. |

## Usage

```tsx
<DropdownMenu
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { label: 'Edit', icon: <PencilSimpleIcon size={16} />, onClick: handleEdit },
    { label: 'Copy', onClick: handleCopy },
    { divider: true, label: '' },
    { label: 'Delete', danger: true, onClick: handleDelete },
  ]}
/>
```

---

# Link

Styled anchor link with icon support.

**Import:** `import { Link } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'default' | 'danger'` | 'default' |  | Color variant. |
| `icon` | `ReactNode` | — |  | Icon. |
| `iconPosition` | `'left' | 'right'` | 'left' |  | Icon position. |
| `href` | `string` | — |  | URL. |

## Usage

```tsx
<Link href="/about">About us</Link>
<Link href="/delete" variant="danger">Delete account</Link>
```

---

# Spotlight

Command palette / search overlay. Controlled component — filtering is done by the consumer.

**Import:** `import { Spotlight } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | Yes | Controls visibility. |
| `onClose` | `() => void` | — | Yes | Close callback. |
| `value` | `string` | — | Yes | Search input value (controlled). |
| `onChange` | `(value: string) => void` | — | Yes | Input change callback. |
| `results` | `SpotlightItem[]` | — | Yes | Pre-filtered results: { id, label, description?, category, icon?, onSelect }. |
| `placeholder` | `string` | 'Hledat...' |  | Input placeholder. |

## Usage

```tsx
const [open, setOpen] = useState(false);
const [query, setQuery] = useState('');
const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

<Spotlight
  open={open}
  onClose={() => { setOpen(false); setQuery(''); }}
  value={query}
  onChange={setQuery}
  results={filtered}
/>
```

## Notes

- Consumer handles all filtering logic
- Results grouped by category automatically
- Keyboard: arrows navigate, enter selects, escape closes

---

# Feedback

# Toast (useToast)

Toast notifications with auto-dismiss and stack animation. Requires ToasterProvider.

**Import:** `import { Toast (useToast) } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'info' | 'success' | 'error'` | 'info' |  | Notification type. |
| `title` | `string` | — | Yes | Notification title. |
| `content` | `string` | — |  | Optional description. |
| `icon` | `ReactNode` | — |  | Custom icon. |
| `duration` | `number` | 4000 |  | Auto-dismiss in ms (0 = permanent). |

## Usage

```tsx
// 1. Wrap app in ToasterProvider
<ToasterProvider position="bottom-right" duration={4000}>
  <App />
</ToasterProvider>

// 2. Use the hook
const { toast, dismiss } = useToast();
toast({ variant: 'success', title: 'Saved!', content: 'Changes saved.' });

// Manual dismiss
const id = toast({ title: 'Loading...', duration: 0 });
dismiss(id);
```

## Notes

- ToasterProvider must wrap the app
- toast() returns an ID for manual dismiss
- duration prop on ToasterProvider sets global default

---

# Alert

Informational banner with variant colors and optional close button.

**Import:** `import { Alert } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'info' | 'success' | 'warning' | 'error'` | 'info' |  | Visual variant. |
| `title` | `string` | — | Yes | Alert heading. |
| `children` | `ReactNode` | — |  | Description below title. |
| `icon` | `ReactNode` | — |  | Custom icon (replaces default). |
| `closable` | `boolean` | false |  | Show close button. |
| `onClose` | `() => void` | — |  | Close callback. |

## Usage

```tsx
<Alert variant="success" title="Saved">Changes were saved successfully.</Alert>
<Alert variant="error" title="Error" closable onClose={handleClose}>Something went wrong.</Alert>
```

---

# ProgressBar / ProgressCircle

Progress indicator as bar or circle.

**Import:** `import { ProgressBar } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number` | — | Yes | Value 0-100. |
| `size` | `'sm' | 'md' | 'lg'` | 'md' |  | Size (ProgressBar). |
| `color` | `string` | '#E8612D' |  | Bar/circle color. |
| `showValue` | `boolean` | false |  | Show percentage. |
| `label` | `string` | — |  | Label text. |
| `striped` | `boolean` | false |  | Striped effect (ProgressBar). |
| `animated` | `boolean` | false |  | Animate stripes (ProgressBar). |

## Usage

```tsx
<ProgressBar value={65} showValue label="Upload" />
<ProgressCircle value={75} showValue />
```

---

# Spinner

Rotating loading indicator.

**Import:** `import { Spinner } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `size` | `'sm' | 'md' | 'lg' | number` | 'md' |  | Size (sm: 16px, md: 24px, lg: 40px). |
| `color` | `string` | — |  | Color (default: currentColor). |
| `label` | `string` | 'Načítání' |  | ARIA label. |

## Usage

```tsx
<Spinner size="md" />
<Spinner size={32} color="#FC4F00" />
```

---

# Utility

# Divider

Separator line with optional text.

**Import:** `import { Divider } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `orientation` | `'horizontal' | 'vertical'` | 'horizontal' |  | Orientation. |
| `label` | `string` | — |  | Optional text (horizontal only). |

## Usage

```tsx
<Divider />
<Divider label="or" />
```

---

# Stack

Flex layout container for easy element alignment.

**Import:** `import { Stack } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `direction` | `'row' | 'column'` | 'column' |  | Layout direction. |
| `gap` | `number | string` | 8 |  | Gap between items. |
| `align` | `'start' | 'center' | 'end' | 'stretch'` | 'stretch' |  | Align items. |
| `justify` | `'start' | 'center' | 'end' | 'between' | 'around'` | 'start' |  | Justify content. |
| `wrap` | `boolean` | false |  | Flex wrap. |
| `fullWidth` | `boolean` | false |  | Full width. |

## Usage

```tsx
<Stack direction="row" gap={16} align="center">
  <Button>Cancel</Button>
  <Button variant="primary">Save</Button>
</Stack>
```

---

# Container

Wrapper container with max-width and centering.

**Import:** `import { Container } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `maxWidth` | `'sm' | 'md' | 'lg' | 'xl' | number` | 'lg' |  | Max width. |
| `padding` | `number | string` | 16 |  | Padding. |
| `centered` | `boolean` | true |  | Center on page. |

## Usage

```tsx
<Container maxWidth="lg">
  <h1>Page content</h1>
</Container>
```

---

# DragList

Drag & drop sortable list. Supports flat and tree mode with custom rendering.

**Import:** `import { DragList } from '@smworks-cz/ui-kit'`

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `items` | `DragListItem[]` | — | Yes | Items: { id, label, icon?, children?, expanded?, data? }. |
| `onReorder` | `(items) => void` | — | Yes | Reorder callback. |
| `renderItem` | `(item, dragProps) => ReactNode` | — |  | Custom render with drag handle props. |
| `allowNesting` | `boolean` | false |  | Enable tree mode. |
| `maxDepth` | `number` | 3 |  | Max nesting depth. |
| `dragMode` | `'full' | 'handle'` | 'full' |  | Full card or handle-only drag. |

## Usage

```tsx
<DragList
  items={items}
  onReorder={setItems}
  allowNesting
  dragMode="handle"
  renderItem={(item, { handleProps }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span {...handleProps}><DotsSixVerticalIcon size={16} /></span>
      <span>{item.label}</span>
    </div>
  )}
/>
```

## Notes

- renderItem receives handleProps for custom drag handle placement
- allowNesting enables tree mode — drag to center of card to nest
- Collapsed nodes auto-expand on hover during drag

---

# Hooks

# useTheme

Hook to detect current theme. Returns "light" or "dark". Reacts to changes automatically.

**Import:** `import { useTheme } from '@smworks-cz/ui-kit'`

**Returns:** `'light' | 'dark'`

## Usage

```tsx
import { useTheme } from '@smworks-cz/ui-kit';

const theme = useTheme(); // 'light' | 'dark'

// Inline tokens pattern (recommended)
const tokens = {
  dark: { bg: '#1a1a1a', text: '#fff' },
  light: { bg: '#fff', text: '#1a1a1a' },
} as const;
const t = tokens[useTheme()];
```

## Notes

- Reads data-theme attribute from <html> or <body>
- Falls back to prefers-color-scheme media query
- Default: "light"
- Uses MutationObserver + matchMedia listener for reactivity

---

# useToast

Hook for triggering toast notifications. Returns { toast, dismiss }. Requires ToasterProvider.

**Import:** `import { useToast } from '@smworks-cz/ui-kit'`

**Returns:** `{ toast: (options) => string, dismiss: (id) => void }`

## Usage

```tsx
import { useToast } from '@smworks-cz/ui-kit';

const { toast, dismiss } = useToast();

// Fire notification
toast({ variant: 'success', title: 'Saved!' });

// Permanent toast with manual dismiss
const id = toast({ title: 'Loading...', duration: 0 });
await doWork();
dismiss(id);
```

## Notes

- Must be called inside <ToasterProvider>
- toast() returns an ID string
- duration: 0 creates permanent toast

---

