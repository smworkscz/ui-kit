import { create } from 'storybook/theming';

export default create({
  base: 'dark',

  // Brand
  brandTitle: 'SMWORKS',
  brandUrl: '/',
  brandImage: 'logo-text.svg',
  brandTarget: '_self',

  // Fonts
  fontBase: "'Zalando Sans', sans-serif",
  fontCode: 'monospace',

  // Base colors
  colorPrimary: '#E8612D',
  colorSecondary: '#E8612D',

  // UI
  appBg: '#1a1a1a',
  appContentBg: '#1a1a1a',
  appPreviewBg: '#1a1a1a',
  appBorderColor: '#333333',
  appBorderRadius: 6,

  // Text
  textColor: '#eaeaea',
  textInverseColor: '#1a1a1a',
  textMutedColor: '#999999',

  // Toolbar
  barTextColor: '#999999',
  barSelectedColor: '#E8612D',
  barHoverColor: '#eaeaea',
  barBg: '#1a1a1a',

  // Inputs
  inputBg: '#1a1a1a',
  inputBorder: '#333333',
  inputTextColor: '#eaeaea',
  inputBorderRadius: 4,
});
