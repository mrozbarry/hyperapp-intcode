import app from './app';

import './styles/body.sass';
import './styles/typography.sass';
import './styles/layout.sass';

app(
  document.querySelector('hyperapp-entry'),
  window.location,
);

