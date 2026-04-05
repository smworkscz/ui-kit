import { addons } from 'storybook/manager-api';
import smworksTheme from './SMWORKSTheme';

addons.setConfig({
  theme: smworksTheme,
  layoutCustomisations: {
    showPanel: () => false,
    showToolbar: () => false,
  },
});
