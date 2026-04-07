import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'preview', 'public', 'llm');
const PKG = '@smworks-cz/ui-kit';

mkdirSync(OUT, { recursive: true });

// ─── Component definitions ──────────────────────────────────────────────────

const components = [
  {
    id: 'button',
    name: 'Button',
    category: 'Forms',
    description: 'Button for primary actions, secondary operations, and outline variants. Supports icons, loading state, and can render as a link.',
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'outline'", default: "'primary'", desc: 'Visual style of the button.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
      { name: 'icon', type: 'ReactNode', desc: 'Optional icon (SVG or component).' },
      { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", desc: 'Icon position relative to text.' },
      { name: 'loading', type: 'boolean', default: 'false', desc: 'Shows spinner and disables interaction.' },
      { name: 'fullWidth', type: 'boolean', default: 'false', desc: 'Stretches button to full container width.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables interaction.' },
      { name: 'href', type: 'string', desc: 'If provided, renders as <a> instead of <button>.' },
      { name: 'children', type: 'ReactNode', desc: 'Button text content.' },
    ],
    usage: `<Button variant="primary" onClick={handleClick}>Save</Button>
<Button variant="outline" icon={<PlusIcon size={16} />}>Add</Button>
<Button loading>Processing...</Button>
<Button href="/about">Link button</Button>`,
    notes: ['Renders as `<a>` when `href` is provided, otherwise `<button>`', 'Icon-only mode (square) when no children provided', 'Uses `@phosphor-icons/react` for icons'],
  },
  {
    id: 'input',
    name: 'Input',
    category: 'Forms',
    description: 'Text input with icon support, loading state, validation, clear button, and password toggle.',
    props: [
      { name: 'label', type: 'string', desc: 'Label text above the input (uppercase styled).' },
      { name: 'icon', type: 'ReactNode', desc: 'Icon inside the field.' },
      { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", desc: 'Icon position.' },
      { name: 'error', type: 'boolean | string', default: 'false', desc: 'Error state. String displays error message below.' },
      { name: 'helperText', type: 'string', desc: 'Helper text below input.' },
      { name: 'loading', type: 'boolean', default: 'false', desc: 'Shows spinner, makes read-only.' },
      { name: 'clearable', type: 'boolean', default: 'false', desc: 'Shows clear button.' },
      { name: 'passwordToggle', type: 'boolean', desc: 'Shows eye icon for password visibility. Auto-enabled for type="password".' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
      { name: 'fullWidth', type: 'boolean', default: 'false', desc: 'Stretches to full width.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables input.' },
    ],
    usage: `<Input label="Email" placeholder="you@example.com" />
<Input icon={<MagnifyingGlassIcon size={16} />} placeholder="Search..." />
<Input type="password" label="Password" />
<Input error="This field is required" />
<Input loading clearable />`,
    notes: ['Extends native `<input>` HTML attributes', 'Password toggle auto-enabled for type="password"', 'Forward ref supported'],
  },
  {
    id: 'select',
    name: 'Select',
    category: 'Forms',
    description: 'Dropdown select with search, multi-select, clear, and keyboard navigation.',
    props: [
      { name: 'options', type: 'SelectOption[]', required: true, desc: 'Array of { value: string; label?: string; disabled?: boolean }.' },
      { name: 'value', type: 'string | string[] | null', desc: 'Current value (string for single, array for multiple).' },
      { name: 'onChange', type: '(value: any) => void', desc: 'Change callback.' },
      { name: 'multiple', type: 'boolean', default: 'false', desc: 'Enable multi-select.' },
      { name: 'searchable', type: 'boolean', default: 'false', desc: 'Show search/filter input in dropdown.' },
      { name: 'clearable', type: 'boolean', default: 'false', desc: 'Show clear button.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable select.' },
      { name: 'loading', type: 'boolean', default: 'false', desc: 'Show spinner instead of chevron.' },
      { name: 'error', type: 'boolean | string', desc: 'Error state or message.' },
      { name: 'placeholder', type: 'string', default: "'Vyberte…'", desc: 'Placeholder text.' },
    ],
    usage: `<Select
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ]}
  value={value}
  onChange={setValue}
  searchable
  clearable
/>`,
    notes: ['Portal-based dropdown for proper stacking', 'Keyboard navigation (arrows, enter, escape)', 'Multi-select shows tags for selected values'],
  },
  {
    id: 'datepicker',
    name: 'DatePicker',
    category: 'Forms',
    description: 'Date picker with calendar popup. Supports single and range mode with optional time selection.',
    props: [
      { name: 'mode', type: "'single' | 'range'", default: "'single'", desc: 'Selection mode.' },
      { name: 'showTime', type: 'boolean', default: 'false', desc: 'Add time selection.' },
      { name: 'value', type: 'Date | null | [Date, Date]', desc: 'Current value.' },
      { name: 'onChange', type: '(value: any) => void', desc: 'Change callback.' },
      { name: 'label', type: 'string', desc: 'Label text.' },
      { name: 'error', type: 'boolean | string', desc: 'Error state.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable interaction.' },
      { name: 'clearable', type: 'boolean', default: 'false', desc: 'Clear button.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
      { name: 'minDate', type: 'Date', desc: 'Minimum allowed date.' },
      { name: 'maxDate', type: 'Date', desc: 'Maximum allowed date.' },
    ],
    usage: `<DatePicker label="Date" value={date} onChange={setDate} />
<DatePicker mode="range" value={[start, end]} onChange={setRange} />
<DatePicker showTime label="Date & Time" />`,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'Forms',
    description: 'Checkbox with indeterminate state, error messages, and size variants.',
    props: [
      { name: 'checked', type: 'boolean', default: 'false', desc: 'Checked state.' },
      { name: 'onChange', type: '(checked: boolean) => void', desc: 'Change callback.' },
      { name: 'label', type: 'string', desc: 'Label text.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable interaction.' },
      { name: 'error', type: 'boolean | string', desc: 'Error state or message.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
      { name: 'indeterminate', type: 'boolean', default: 'false', desc: 'Show dash instead of checkmark.' },
    ],
    usage: `<Checkbox label="I agree" checked={agreed} onChange={setAgreed} />
<Checkbox indeterminate label="Select all" />`,
  },
  {
    id: 'radio',
    name: 'RadioGroup',
    category: 'Forms',
    description: 'Radio button group for selecting one option from a list.',
    props: [
      { name: 'value', type: 'string', desc: 'Currently selected value.' },
      { name: 'onChange', type: '(value: string) => void', desc: 'Change callback.' },
      { name: 'options', type: '{ value: string; label: string; disabled?: boolean }[]', required: true, desc: 'List of options.' },
      { name: 'label', type: 'string', desc: 'Group label.' },
      { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", desc: 'Layout direction.' },
      { name: 'error', type: 'boolean | string', desc: 'Error state.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
    ],
    usage: `<RadioGroup
  label="Notification method"
  options={[
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'push', label: 'Push' },
  ]}
  value={method}
  onChange={setMethod}
/>`,
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'Forms',
    description: 'Toggle switch with smooth animation.',
    props: [
      { name: 'checked', type: 'boolean', default: 'false', desc: 'Toggle state.' },
      { name: 'onChange', type: '(checked: boolean) => void', desc: 'Change callback.' },
      { name: 'label', type: 'string', desc: 'Label text.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable interaction.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
    ],
    usage: `<Switch label="Dark mode" checked={dark} onChange={setDark} />`,
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'Forms',
    description: 'Multi-line text input with character counter, auto-height, and resize options.',
    props: [
      { name: 'label', type: 'string', desc: 'Label text.' },
      { name: 'error', type: 'boolean | string', desc: 'Error state.' },
      { name: 'helperText', type: 'string', desc: 'Helper text below.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
      { name: 'rows', type: 'number', default: '4', desc: 'Visible rows.' },
      { name: 'maxLength', type: 'number', desc: 'Max characters (shows counter).' },
      { name: 'resize', type: "'none' | 'vertical' | 'both'", default: "'vertical'", desc: 'Resize mode.' },
      { name: 'autoHeight', type: 'boolean', default: 'false', desc: 'Auto-grow to fit content.' },
      { name: 'minRows', type: 'number', default: '1', desc: 'Min rows (with autoHeight).' },
      { name: 'maxRows', type: 'number', desc: 'Max rows before scrolling (with autoHeight).' },
    ],
    usage: `<Textarea label="Description" placeholder="Write..." maxLength={500} />
<Textarea autoHeight minRows={2} maxRows={10} />`,
  },
  {
    id: 'slider',
    name: 'Slider',
    category: 'Forms',
    description: 'Range slider for selecting numeric values. Supports range mode.',
    props: [
      { name: 'value', type: 'number | [number, number]', required: true, desc: 'Current value.' },
      { name: 'onChange', type: '(value) => void', desc: 'Change callback.' },
      { name: 'min', type: 'number', default: '0', desc: 'Minimum value.' },
      { name: 'max', type: 'number', default: '100', desc: 'Maximum value.' },
      { name: 'step', type: 'number', default: '1', desc: 'Step size.' },
      { name: 'label', type: 'string', desc: 'Label text.' },
      { name: 'showValue', type: 'boolean', default: 'false', desc: 'Show current value.' },
      { name: 'range', type: 'boolean', default: 'false', desc: 'Range mode (min-max).' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
    ],
    usage: `<Slider value={50} onChange={setValue} label="Volume" showValue />
<Slider value={[20, 80]} onChange={setRange} range />`,
  },
  {
    id: 'fileupload',
    name: 'FileUpload',
    category: 'Forms',
    description: 'File upload with drag & drop zone or compact input-style variant.',
    props: [
      { name: 'variant', type: "'dropzone' | 'button'", default: "'dropzone'", desc: 'Visual variant — large zone or compact input.' },
      { name: 'onFiles', type: '(files: File[]) => void', desc: 'Callback with selected files.' },
      { name: 'accept', type: 'string', desc: "Allowed file types (e.g. 'image/*,.pdf')." },
      { name: 'multiple', type: 'boolean', default: 'false', desc: 'Allow multiple files.' },
      { name: 'maxSize', type: 'number', desc: 'Max file size in bytes.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable upload.' },
      { name: 'label', type: 'string', desc: 'Label text.' },
      { name: 'error', type: 'boolean | string', desc: 'Error state.' },
    ],
    usage: `<FileUpload label="Documents" accept="image/*,.pdf" multiple onFiles={handleFiles} />
<FileUpload variant="button" label="Avatar" accept="image/*" />`,
  },
  {
    id: 'segmentedcontrol',
    name: 'SegmentedControl',
    category: 'Forms',
    description: 'Segmented toggle for choosing between a few options. Animated sliding indicator.',
    props: [
      { name: 'data', type: "(string | { value, label?, disabled? })[]", required: true, desc: 'Segment data. Strings auto-convert.' },
      { name: 'value', type: 'string', required: true, desc: 'Currently selected value.' },
      { name: 'onChange', type: '(value: string) => void', required: true, desc: 'Change callback.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
      { name: 'fullWidth', type: 'boolean', default: 'false', desc: 'Stretch to container width.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: 'Orientation.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable all segments.' },
    ],
    usage: `<SegmentedControl data={['List', 'Grid', 'Table']} value={view} onChange={setView} />
<SegmentedControl
  data={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ]}
  value={plan}
  onChange={setPlan}
/>`,
  },
  // ── Data display ──────────────────────────────────────────────────────
  {
    id: 'table',
    name: 'Table',
    category: 'Data Display',
    description: 'Data table with sorting, loading state, and custom cell rendering.',
    props: [
      { name: 'columns', type: 'TableColumn[]', required: true, desc: 'Column definitions: { key, header, sortable?, width?, render? }.' },
      { name: 'data', type: 'any[]', required: true, desc: 'Data rows.' },
      { name: 'loading', type: 'boolean', default: 'false', desc: 'Show skeleton rows.' },
      { name: 'emptyText', type: 'string', default: "'Žádná data'", desc: 'Empty state text.' },
      { name: 'onSort', type: '(key, direction) => void', desc: 'Sort callback.' },
      { name: 'striped', type: 'boolean', default: 'false', desc: 'Alternating row colors.' },
      { name: 'hoverable', type: 'boolean', default: 'true', desc: 'Row hover highlight.' },
    ],
    usage: `<Table
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status', render: (val) => <Badge label={val} /> },
  ]}
  data={users}
  onSort={(key, dir) => sort(key, dir)}
/>`,
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Data Display',
    description: 'Content card for grouping related information.',
    props: [
      { name: 'title', type: 'string', desc: 'Card heading.' },
      { name: 'subtitle', type: 'string', desc: 'Secondary subheading.' },
      { name: 'header', type: 'ReactNode', desc: 'Custom header (overrides title/subtitle).' },
      { name: 'footer', type: 'ReactNode', desc: 'Footer content (separated by divider).' },
      { name: 'children', type: 'ReactNode', desc: 'Card body.' },
      { name: 'hoverable', type: 'boolean', default: 'false', desc: 'Lift on hover.' },
      { name: 'bordered', type: 'boolean', default: 'true', desc: 'Show border.' },
      { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", desc: 'Inner spacing.' },
    ],
    usage: `<Card title="Project" subtitle="Details" footer={<Button>Save</Button>}>
  <p>Card body content</p>
</Card>`,
  },
  {
    id: 'accordion',
    name: 'Accordion / AccordionItem',
    category: 'Data Display',
    description: 'Collapsible content sections.',
    props: [
      { name: 'multiple', type: 'boolean', default: 'false', desc: 'Allow multiple open items (Accordion).' },
      { name: 'title', type: 'string', required: true, desc: 'Item title (AccordionItem).' },
      { name: 'children', type: 'ReactNode', required: true, desc: 'Item content (AccordionItem).' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', desc: 'Start expanded (AccordionItem).' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable toggle (AccordionItem).' },
    ],
    usage: `<Accordion>
  <AccordionItem title="Section 1">Content 1</AccordionItem>
  <AccordionItem title="Section 2" defaultOpen>Content 2</AccordionItem>
</Accordion>`,
  },
  {
    id: 'tabs',
    name: 'Tabs / Tab / TabPanel',
    category: 'Data Display',
    description: 'Tabbed content switcher with underline and pills variants.',
    props: [
      { name: 'value', type: 'string', required: true, desc: 'Active tab value (Tabs).' },
      { name: 'onChange', type: '(value: string) => void', required: true, desc: 'Tab change callback (Tabs).' },
      { name: 'variant', type: "'underline' | 'pills'", default: "'underline'", desc: 'Tab style (Tabs).' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size (Tabs).' },
      { name: 'fullWidth', type: 'boolean', default: 'false', desc: 'Stretch tabs (Tabs).' },
    ],
    usage: `<Tabs value={tab} onChange={setTab}>
  <Tab value="general" label="General" />
  <Tab value="settings" label="Settings" />
  <TabPanel value="general">General content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>`,
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'Data Display',
    description: 'Hover tooltip bubble.',
    props: [
      { name: 'content', type: 'string | ReactNode', required: true, desc: 'Tooltip content.' },
      { name: 'children', type: 'ReactElement', required: true, desc: 'Trigger element.' },
      { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", desc: 'Position.' },
      { name: 'delay', type: 'number', default: '200', desc: 'Show delay in ms.' },
    ],
    usage: `<Tooltip content="Delete this item" position="top">
  <Button variant="outline">Delete</Button>
</Tooltip>`,
  },
  {
    id: 'popover',
    name: 'Popover',
    category: 'Data Display',
    description: 'Floating panel with arbitrary content, triggered by click or hover.',
    props: [
      { name: 'content', type: 'ReactNode', required: true, desc: 'Popover content.' },
      { name: 'children', type: 'ReactElement', required: true, desc: 'Trigger element.' },
      { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", desc: 'Position.' },
      { name: 'trigger', type: "'click' | 'hover'", default: "'click'", desc: 'Trigger type.' },
    ],
    usage: `<Popover content={<div>Popover content here</div>} trigger="click">
  <Button>Open popover</Button>
</Popover>`,
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    category: 'Data Display',
    description: 'Loading placeholder with shimmer animation.',
    props: [
      { name: 'variant', type: "'text' | 'circle' | 'rect'", default: "'text'", desc: 'Shape.' },
      { name: 'width', type: "number | string", default: "'100%'", desc: 'Width.' },
      { name: 'height', type: 'number | string', desc: 'Height.' },
      { name: 'lines', type: 'number', default: '1', desc: 'Number of lines (text variant).' },
      { name: 'animate', type: 'boolean', default: 'true', desc: 'Shimmer animation.' },
    ],
    usage: `<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={48} height={48} />
<Skeleton variant="rect" width="100%" height={200} />`,
  },
  {
    id: 'emptystate',
    name: 'EmptyState',
    category: 'Data Display',
    description: 'Empty state with icon, title, description, and optional action.',
    props: [
      { name: 'title', type: 'string', required: true, desc: 'Main heading.' },
      { name: 'description', type: 'string', desc: 'Description text.' },
      { name: 'icon', type: 'ReactNode', desc: 'Illustration icon.' },
      { name: 'action', type: 'ReactNode', desc: 'Action button.' },
    ],
    usage: `<EmptyState
  icon={<TrayIcon size={48} />}
  title="No data"
  description="Nothing here yet."
  action={<Button>Add item</Button>}
/>`,
  },
  {
    id: 'stat',
    name: 'Stat',
    category: 'Data Display',
    description: 'Statistical value display with trend indicator.',
    props: [
      { name: 'label', type: 'string', required: true, desc: 'Stat label.' },
      { name: 'value', type: 'string | number', required: true, desc: 'Main value.' },
      { name: 'change', type: 'number', desc: 'Percentage change.' },
      { name: 'changeLabel', type: 'string', desc: 'Change description text.' },
      { name: 'trend', type: "'up' | 'down' | 'neutral'", default: "'neutral'", desc: 'Trend direction.' },
      { name: 'icon', type: 'ReactNode', desc: 'Icon.' },
    ],
    usage: `<Stat label="Revenue" value="€52,400" change={8.2} trend="up" />`,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'Data Display',
    description: 'User avatar displaying initials.',
    props: [
      { name: 'initials', type: 'string', required: true, desc: '1-2 letters (auto-uppercase).' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", desc: 'Size (sm: 40px, md: 70px, lg: 96px).' },
      { name: 'borderRadius', type: 'string | number', default: "'8px'", desc: 'Corner rounding.' },
    ],
    usage: `<Avatar initials="JD" size="md" />
<Avatar initials="A" size={32} borderRadius="50%" />`,
  },
  {
    id: 'tag',
    name: 'Tag / Badge',
    category: 'Data Display',
    description: 'Tag for categorization. Badge for status labels.',
    props: [
      { name: 'label', type: 'string', required: true, desc: 'Tag/Badge text.' },
      { name: 'onRemove', type: '() => void', desc: 'Remove callback — shows ✕ button (Tag only).' },
    ],
    usage: `<Tag label="React" onRemove={() => remove('react')} />
<Badge label="NEW" />`,
    notes: ['Badge text is automatically uppercased', 'Tag and Badge are separate exports from the same module'],
  },
  // ── Navigation ────────────────────────────────────────────────────────
  {
    id: 'modal',
    name: 'Modal',
    category: 'Navigation',
    description: 'Modal dialog with overlay, focus trap, and glass effect.',
    props: [
      { name: 'open', type: 'boolean', required: true, desc: 'Controls visibility.' },
      { name: 'onClose', type: '() => void', required: true, desc: 'Close callback.' },
      { name: 'title', type: 'string', desc: 'Header title.' },
      { name: 'children', type: 'ReactNode', required: true, desc: 'Body content.' },
      { name: 'footer', type: 'ReactNode', desc: 'Footer content (buttons).' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'fullscreen'", default: "'md'", desc: 'Size preset.' },
      { name: 'closeOnOverlay', type: 'boolean', default: 'true', desc: 'Close on overlay click.' },
      { name: 'closeOnEscape', type: 'boolean', default: 'true', desc: 'Close on Escape key.' },
      { name: 'showClose', type: 'boolean', default: 'true', desc: 'Show close button (×).' },
    ],
    usage: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Confirm">
  <p>Are you sure?</p>
</Modal>`,
    notes: ['Renders via React portal to document.body', 'Includes focus trap and body scroll lock', 'Glass effect with backdrop-filter: blur(32px)'],
  },
  {
    id: 'drawer',
    name: 'Drawer',
    category: 'Navigation',
    description: 'Side panel that slides in from left or right.',
    props: [
      { name: 'open', type: 'boolean', required: true, desc: 'Controls visibility.' },
      { name: 'onClose', type: '() => void', required: true, desc: 'Close callback.' },
      { name: 'position', type: "'left' | 'right'", default: "'right'", desc: 'Slide direction.' },
      { name: 'title', type: 'string', desc: 'Header title.' },
      { name: 'children', type: 'ReactNode', required: true, desc: 'Body content.' },
      { name: 'footer', type: 'ReactNode', desc: 'Footer content.' },
      { name: 'width', type: 'string | number', default: '400', desc: 'Panel width.' },
      { name: 'showClose', type: 'boolean', default: 'true', desc: 'Show close button.' },
      { name: 'closeOnOverlay', type: 'boolean', default: 'true', desc: 'Close on overlay click.' },
    ],
    usage: `<Drawer open={open} onClose={() => setOpen(false)} title="Details">
  <p>Drawer content</p>
</Drawer>`,
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'Navigation',
    description: 'Breadcrumb navigation showing page hierarchy.',
    props: [
      { name: 'items', type: '{ label: string; href?: string }[]', required: true, desc: 'Navigation items.' },
      { name: 'separator', type: 'ReactNode', default: "'/'", desc: 'Separator between items.' },
    ],
    usage: `<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Current' },
]} />`,
  },
  {
    id: 'pagination',
    name: 'Pagination',
    category: 'Navigation',
    description: 'Page navigation with smart page reduction.',
    props: [
      { name: 'page', type: 'number', required: true, desc: 'Current page (1-indexed).' },
      { name: 'totalPages', type: 'number', required: true, desc: 'Total pages.' },
      { name: 'onChange', type: '(page: number) => void', required: true, desc: 'Page change callback.' },
      { name: 'siblings', type: 'number', default: '1', desc: 'Pages around current.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size preset.' },
    ],
    usage: `<Pagination page={page} totalPages={20} onChange={setPage} />`,
  },
  {
    id: 'stepper',
    name: 'Stepper',
    category: 'Navigation',
    description: 'Step wizard for multi-step processes.',
    props: [
      { name: 'steps', type: '{ label: string; description?: string }[]', required: true, desc: 'Step definitions.' },
      { name: 'activeStep', type: 'number', required: true, desc: 'Active step index (0-based).' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: 'Orientation.' },
      { name: 'clickable', type: "boolean | 'completed'", default: 'false', desc: 'Allow clicking steps.' },
      { name: 'onStepClick', type: '(index: number) => void', desc: 'Step click callback.' },
    ],
    usage: `<Stepper
  steps={[
    { label: 'Account', description: 'Create account' },
    { label: 'Profile', description: 'Fill details' },
    { label: 'Done' },
  ]}
  activeStep={1}
/>`,
  },
  {
    id: 'dropdownmenu',
    name: 'DropdownMenu',
    category: 'Navigation',
    description: 'Dropdown action menu with keyboard navigation.',
    props: [
      { name: 'trigger', type: 'ReactNode', required: true, desc: 'Trigger element.' },
      { name: 'items', type: 'DropdownMenuItem[]', required: true, desc: 'Menu items: { label, icon?, onClick?, disabled?, danger?, divider? }.' },
      { name: 'position', type: "'bottom-left' | 'bottom-right'", default: "'bottom-left'", desc: 'Menu position.' },
    ],
    usage: `<DropdownMenu
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { label: 'Edit', icon: <PencilSimpleIcon size={16} />, onClick: handleEdit },
    { label: 'Copy', onClick: handleCopy },
    { divider: true, label: '' },
    { label: 'Delete', danger: true, onClick: handleDelete },
  ]}
/>`,
  },
  {
    id: 'link',
    name: 'Link',
    category: 'Navigation',
    description: 'Styled anchor link with icon support.',
    props: [
      { name: 'variant', type: "'default' | 'danger'", default: "'default'", desc: 'Color variant.' },
      { name: 'icon', type: 'ReactNode', desc: 'Icon.' },
      { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", desc: 'Icon position.' },
      { name: 'href', type: 'string', desc: 'URL.' },
    ],
    usage: `<Link href="/about">About us</Link>
<Link href="/delete" variant="danger">Delete account</Link>`,
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    category: 'Navigation',
    description: 'Command palette / search overlay. Controlled component — filtering is done by the consumer.',
    props: [
      { name: 'open', type: 'boolean', required: true, desc: 'Controls visibility.' },
      { name: 'onClose', type: '() => void', required: true, desc: 'Close callback.' },
      { name: 'value', type: 'string', required: true, desc: 'Search input value (controlled).' },
      { name: 'onChange', type: '(value: string) => void', required: true, desc: 'Input change callback.' },
      { name: 'results', type: 'SpotlightItem[]', required: true, desc: 'Pre-filtered results: { id, label, description?, category, icon?, onSelect }.' },
      { name: 'placeholder', type: 'string', default: "'Hledat...'", desc: 'Input placeholder.' },
    ],
    usage: `const [open, setOpen] = useState(false);
const [query, setQuery] = useState('');
const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

<Spotlight
  open={open}
  onClose={() => { setOpen(false); setQuery(''); }}
  value={query}
  onChange={setQuery}
  results={filtered}
/>`,
    notes: ['Consumer handles all filtering logic', 'Results grouped by category automatically', 'Keyboard: arrows navigate, enter selects, escape closes'],
  },
  // ── Feedback ──────────────────────────────────────────────────────────
  {
    id: 'toast',
    name: 'Toast (useToast)',
    category: 'Feedback',
    description: 'Toast notifications with auto-dismiss and stack animation. Requires ToasterProvider.',
    props: [
      { name: 'variant', type: "'info' | 'success' | 'error'", default: "'info'", desc: 'Notification type.' },
      { name: 'title', type: 'string', required: true, desc: 'Notification title.' },
      { name: 'content', type: 'string', desc: 'Optional description.' },
      { name: 'icon', type: 'ReactNode', desc: 'Custom icon.' },
      { name: 'duration', type: 'number', default: '4000', desc: 'Auto-dismiss in ms (0 = permanent).' },
    ],
    usage: `// 1. Wrap app in ToasterProvider
<ToasterProvider position="bottom-right" duration={4000}>
  <App />
</ToasterProvider>

// 2. Use the hook
const { toast, dismiss } = useToast();
toast({ variant: 'success', title: 'Saved!', content: 'Changes saved.' });

// Manual dismiss
const id = toast({ title: 'Loading...', duration: 0 });
dismiss(id);`,
    notes: ['ToasterProvider must wrap the app', 'toast() returns an ID for manual dismiss', 'duration prop on ToasterProvider sets global default'],
  },
  {
    id: 'alert',
    name: 'Alert',
    category: 'Feedback',
    description: 'Informational banner with variant colors and optional close button.',
    props: [
      { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", desc: 'Visual variant.' },
      { name: 'title', type: 'string', required: true, desc: 'Alert heading.' },
      { name: 'children', type: 'ReactNode', desc: 'Description below title.' },
      { name: 'icon', type: 'ReactNode', desc: 'Custom icon (replaces default).' },
      { name: 'closable', type: 'boolean', default: 'false', desc: 'Show close button.' },
      { name: 'onClose', type: '() => void', desc: 'Close callback.' },
    ],
    usage: `<Alert variant="success" title="Saved">Changes were saved successfully.</Alert>
<Alert variant="error" title="Error" closable onClose={handleClose}>Something went wrong.</Alert>`,
  },
  {
    id: 'progress',
    name: 'ProgressBar / ProgressCircle',
    category: 'Feedback',
    description: 'Progress indicator as bar or circle.',
    props: [
      { name: 'value', type: 'number', required: true, desc: 'Value 0-100.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Size (ProgressBar).' },
      { name: 'color', type: 'string', default: "'#E8612D'", desc: 'Bar/circle color.' },
      { name: 'showValue', type: 'boolean', default: 'false', desc: 'Show percentage.' },
      { name: 'label', type: 'string', desc: 'Label text.' },
      { name: 'striped', type: 'boolean', default: 'false', desc: 'Striped effect (ProgressBar).' },
      { name: 'animated', type: 'boolean', default: 'false', desc: 'Animate stripes (ProgressBar).' },
    ],
    usage: `<ProgressBar value={65} showValue label="Upload" />
<ProgressCircle value={75} showValue />`,
  },
  {
    id: 'spinner',
    name: 'Spinner',
    category: 'Feedback',
    description: 'Rotating loading indicator.',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", desc: 'Size (sm: 16px, md: 24px, lg: 40px).' },
      { name: 'color', type: 'string', desc: 'Color (default: currentColor).' },
      { name: 'label', type: 'string', default: "'Načítání'", desc: 'ARIA label.' },
    ],
    usage: `<Spinner size="md" />
<Spinner size={32} color="#FC4F00" />`,
  },
  // ── Utility ───────────────────────────────────────────────────────────
  {
    id: 'divider',
    name: 'Divider',
    category: 'Utility',
    description: 'Separator line with optional text.',
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: 'Orientation.' },
      { name: 'label', type: 'string', desc: 'Optional text (horizontal only).' },
    ],
    usage: `<Divider />
<Divider label="or" />`,
  },
  {
    id: 'stack',
    name: 'Stack',
    category: 'Utility',
    description: 'Flex layout container for easy element alignment.',
    props: [
      { name: 'direction', type: "'row' | 'column'", default: "'column'", desc: 'Layout direction.' },
      { name: 'gap', type: 'number | string', default: '8', desc: 'Gap between items.' },
      { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", default: "'stretch'", desc: 'Align items.' },
      { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around'", default: "'start'", desc: 'Justify content.' },
      { name: 'wrap', type: 'boolean', default: 'false', desc: 'Flex wrap.' },
      { name: 'fullWidth', type: 'boolean', default: 'false', desc: 'Full width.' },
    ],
    usage: `<Stack direction="row" gap={16} align="center">
  <Button>Cancel</Button>
  <Button variant="primary">Save</Button>
</Stack>`,
  },
  {
    id: 'container',
    name: 'Container',
    category: 'Utility',
    description: 'Wrapper container with max-width and centering.',
    props: [
      { name: 'maxWidth', type: "'sm' | 'md' | 'lg' | 'xl' | number", default: "'lg'", desc: 'Max width.' },
      { name: 'padding', type: 'number | string', default: '16', desc: 'Padding.' },
      { name: 'centered', type: 'boolean', default: 'true', desc: 'Center on page.' },
    ],
    usage: `<Container maxWidth="lg">
  <h1>Page content</h1>
</Container>`,
  },
  {
    id: 'draglist',
    name: 'DragList',
    category: 'Utility',
    description: 'Drag & drop sortable list. Supports flat and tree mode with custom rendering.',
    props: [
      { name: 'items', type: 'DragListItem[]', required: true, desc: 'Items: { id, label, icon?, children?, expanded?, data? }.' },
      { name: 'onReorder', type: '(items) => void', required: true, desc: 'Reorder callback.' },
      { name: 'renderItem', type: '(item, dragProps) => ReactNode', desc: 'Custom render with drag handle props.' },
      { name: 'allowNesting', type: 'boolean', default: 'false', desc: 'Enable tree mode.' },
      { name: 'maxDepth', type: 'number', default: '3', desc: 'Max nesting depth.' },
      { name: 'dragMode', type: "'full' | 'handle'", default: "'full'", desc: 'Full card or handle-only drag.' },
    ],
    usage: `<DragList
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
/>`,
    notes: ['renderItem receives handleProps for custom drag handle placement', 'allowNesting enables tree mode — drag to center of card to nest', 'Collapsed nodes auto-expand on hover during drag'],
  },
];

// ── Hooks ────────────────────────────────────────────────────────────────

const hooks = [
  {
    id: 'usetheme',
    name: 'useTheme',
    description: 'Hook to detect current theme. Returns "light" or "dark". Reacts to changes automatically.',
    returns: "'light' | 'dark'",
    usage: `import { useTheme } from '${PKG}';

const theme = useTheme(); // 'light' | 'dark'

// Inline tokens pattern (recommended)
const tokens = {
  dark: { bg: '#1a1a1a', text: '#fff' },
  light: { bg: '#fff', text: '#1a1a1a' },
} as const;
const t = tokens[useTheme()];`,
    notes: [
      'Reads data-theme attribute from <html> or <body>',
      'Falls back to prefers-color-scheme media query',
      'Default: "light"',
      'Uses MutationObserver + matchMedia listener for reactivity',
    ],
  },
  {
    id: 'usetoast',
    name: 'useToast',
    description: 'Hook for triggering toast notifications. Returns { toast, dismiss }. Requires ToasterProvider.',
    returns: '{ toast: (options) => string, dismiss: (id) => void }',
    usage: `import { useToast } from '${PKG}';

const { toast, dismiss } = useToast();

// Fire notification
toast({ variant: 'success', title: 'Saved!' });

// Permanent toast with manual dismiss
const id = toast({ title: 'Loading...', duration: 0 });
await doWork();
dismiss(id);`,
    notes: ['Must be called inside <ToasterProvider>', 'toast() returns an ID string', 'duration: 0 creates permanent toast'],
  },
];

// ─── Generate markdown ──────────────────────────────────────────────────────

function propsTable(props) {
  if (!props || props.length === 0) return '';
  let md = '## Props\n\n';
  md += '| Prop | Type | Default | Required | Description |\n';
  md += '|------|------|---------|----------|-------------|\n';
  for (const p of props) {
    const req = p.required ? 'Yes' : '';
    const def = p.default || '—';
    md += `| \`${p.name}\` | \`${p.type}\` | ${def} | ${req} | ${p.desc} |\n`;
  }
  return md;
}

function componentDoc(c) {
  let md = `# ${c.name}\n\n`;
  md += `${c.description}\n\n`;
  md += `**Import:** \`import { ${c.name.split(' / ')[0]} } from '${PKG}'\`\n\n`;
  md += propsTable(c.props);
  if (c.usage) {
    md += `\n## Usage\n\n\`\`\`tsx\n${c.usage}\n\`\`\`\n`;
  }
  if (c.notes) {
    md += `\n## Notes\n\n${c.notes.map(n => `- ${n}`).join('\n')}\n`;
  }
  return md;
}

function hookDoc(h) {
  let md = `# ${h.name}\n\n`;
  md += `${h.description}\n\n`;
  md += `**Import:** \`import { ${h.name} } from '${PKG}'\`\n\n`;
  md += `**Returns:** \`${h.returns}\`\n\n`;
  md += `## Usage\n\n\`\`\`tsx\n${h.usage}\n\`\`\`\n`;
  if (h.notes) {
    md += `\n## Notes\n\n${h.notes.map(n => `- ${n}`).join('\n')}\n`;
  }
  return md;
}

// ─── Write files ────────────────────────────────────────────────────────────

// Per-component files
for (const c of components) {
  writeFileSync(join(OUT, `${c.id}.md`), componentDoc(c));
}
for (const h of hooks) {
  writeFileSync(join(OUT, `${h.id}.md`), hookDoc(h));
}

// Design system
const designSystemSrc = join(__dirname, '..', 'preview', 'DESIGN_SYSTEM.md');
const designSystem = readFileSync(designSystemSrc, 'utf-8');
writeFileSync(join(OUT, 'design-system.md'), designSystem);

// all.md
let all = `# SMWORKS UI KIT — LLM Documentation\n\n`;
all += `Package: \`${PKG}\`\n\n`;
all += `Peer dependencies: \`react >= 18\`, \`react-dom >= 18\`, \`@phosphor-icons/react >= 2.1.0\`\n\n`;
all += `Theme: Set \`data-theme="dark"\` or \`data-theme="light"\` on \`<body>\`. Use \`useTheme()\` hook to read.\n\n`;
all += `Icons: Use \`@phosphor-icons/react\` with Icon suffix (e.g. \`PlusIcon\`, \`XIcon\`).\n\n`;
all += `---\n\n`;

const categories = [...new Set(components.map(c => c.category))];
for (const cat of categories) {
  all += `# ${cat}\n\n`;
  for (const c of components.filter(x => x.category === cat)) {
    all += componentDoc(c) + '\n---\n\n';
  }
}

all += `# Hooks\n\n`;
for (const h of hooks) {
  all += hookDoc(h) + '\n---\n\n';
}

writeFileSync(join(OUT, 'all.md'), all);

// index.md
let index = `# SMWORKS UI KIT — LLM Docs Index\n\n`;
index += `For complete documentation in one file: [all.md](all.md)\n\n`;
index += `## Components\n\n`;
for (const cat of categories) {
  index += `### ${cat}\n\n`;
  for (const c of components.filter(x => x.category === cat)) {
    index += `- [${c.name}](${c.id}.md)\n`;
  }
  index += '\n';
}
index += `## Hooks\n\n`;
for (const h of hooks) {
  index += `- [${h.name}](${h.id}.md)\n`;
}
index += `\n## Design System\n\n- [Design Tokens & Patterns](design-system.md)\n`;

writeFileSync(join(OUT, 'index.md'), index);

const totalFiles = components.length + hooks.length + 3; // + all.md, index.md, design-system.md
console.log(`Generated ${totalFiles} LLM doc files in preview/public/llm/`);
