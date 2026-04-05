import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../src/fonts/fonts.css';
import smworksTheme from './SMWORKSTheme';

const preview: Preview = {
  decorators: [
    (Story) => {
      useEffect(() => {
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#eaeaea';
        document.body.style.fontFamily = "'Zalando Sans', sans-serif";

        const styleId = 'sm-heading-font';
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Zalando Sans Expanded', sans-serif !important;
            }
          `;
          document.head.appendChild(style);
        }
      }, []);
      return <Story />;
    },
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Úvod', 'Formuláře', 'Zobrazení dat', 'Navigace', 'Feedback', 'Utility'],
      },
    },
    docs: {
      theme: smworksTheme,
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
