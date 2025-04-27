// Bootstrap and SCSS
import * as bootstrap from 'bootstrap';
import './scss/styles.scss';

// TS
import './global';
import './utils/file-handler';
import { init } from './global';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    init();
});
