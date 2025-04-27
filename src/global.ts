import { menu } from './utils/dom-elements';
import { getSystemInfo } from './utils/system-info';
import { runRAFTest, testResults } from './utils/tests';
import { displayResults, exportData } from './utils/ui';
import { initFileHandlers } from './utils/file-handler';
import { Tooltip } from 'bootstrap';

// Start the RAF test
async function startTest(): Promise<void> {
    // Display system info
    const systemInfo = getSystemInfo();
    menu.browserInfo.textContent = systemInfo.browser;
    menu.osInfo.textContent = systemInfo.os;
    menu.userAgentInfo.textContent = systemInfo.userAgent;
    
    // Set visibility
    menu.startButton.classList.add('d-none');
    menu.uploadForm.classList.add('d-none');
    menu.progressContainer.classList.remove('d-none');
    menu.spinner.classList.replace('d-none', 'd-inline-block');

    try {
        await runRAFTest();
        displayResults();
    } catch (error) {
        console.error('Error running RAF test:', error);
        alert('An error occurred during the test. Please try again.');
        
        // Reset UI
        menu.startButton.classList.remove('d-none');
        menu.uploadForm.classList.remove('d-none');
        menu.progressContainer.classList.add('d-none');
        menu.spinner.classList.replace('d-inline-block', 'd-none');
    }
}

export function init(): void {
    // Initialize listeners
    menu.startButton.addEventListener('click', startTest);
    menu.exportButton.addEventListener('click', exportData);
    
    // Initialize file upload handlers
    initFileHandlers();

    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipTriggerElArray = Array.from(tooltipTriggerList);
    tooltipTriggerElArray.forEach(tooltipTriggerEl => {
        new Tooltip(tooltipTriggerEl);
    });
}
