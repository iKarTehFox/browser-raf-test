export const menu = {
    startButton: document.getElementById('startButton') as HTMLButtonElement,
    uploadForm: document.getElementById('uploadForm') as HTMLDivElement,
    progressContainer: document.getElementById('progress') as HTMLDivElement,
    resultsContainer: document.getElementById('results') as HTMLDivElement,
    spinner: document.getElementById('testSpinner') as HTMLDivElement,
    browserInfo: document.getElementById('browserInfo') as HTMLDivElement,
    osInfo: document.getElementById('osInfo') as HTMLDivElement,
    userAgentInfo: document.getElementById('userAgentInfo') as HTMLDivElement,
    exportButton: document.getElementById('exportButton') as HTMLButtonElement,
    liveStats: document.getElementById('liveStats') as HTMLDivElement,
    currentFps: document.getElementById('currentFps') as HTMLSpanElement,
    avgFrameTime: document.getElementById('avgFrameTime') as HTMLSpanElement,
    testHeader: document.getElementById('testHeader') as HTMLDivElement,
};

export const progressBar = {
    raf: document.getElementById('rafProgress') as HTMLDivElement
};

export const results = {
    avgFps: document.getElementById('avgFps') as HTMLTableCellElement,
    minFps: document.getElementById('minFps') as HTMLTableCellElement,
    maxFps: document.getElementById('maxFps') as HTMLTableCellElement,
    fpsStability: document.getElementById('fpsStability') as HTMLTableCellElement,
    avgFrameTimeResult: document.getElementById('avgFrameTimeResult') as HTMLTableCellElement,
    minFrameTime: document.getElementById('minFrameTime') as HTMLTableCellElement,
    maxFrameTime: document.getElementById('maxFrameTime') as HTMLTableCellElement,
    frameTimeStdDev: document.getElementById('frameTimeStdDev') as HTMLTableCellElement,
    frameTimeChart: document.getElementById('frameTimeChart') as HTMLCanvasElement
};
