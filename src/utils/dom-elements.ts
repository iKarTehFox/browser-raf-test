import { getElement } from './dom-selectors';

export const menu = {
    startButton: getElement<HTMLButtonElement>('startButton'),
    uploadForm: getElement<HTMLDivElement>('uploadForm'),
    progressContainer: getElement<HTMLDivElement>('progress'),
    resultsContainer: getElement<HTMLDivElement>('results'),
    spinner: getElement<HTMLDivElement>('testSpinner'),
    browserInfo: getElement<HTMLDivElement>('browserInfo'),
    osInfo: getElement<HTMLDivElement>('osInfo'),
    userAgentInfo: getElement<HTMLDivElement>('userAgentInfo'),
    exportButton: getElement<HTMLButtonElement>('exportButton'),
    liveStats: getElement<HTMLDivElement>('liveStats'),
    currentFps: getElement<HTMLSpanElement>('currentFps'),
    avgFrameTime: getElement<HTMLSpanElement>('avgFrameTime'),
    testHeader: getElement<HTMLDivElement>('testHeader'),
    exportCsvButton: getElement<HTMLButtonElement>('exportCSVButton'),
};

export const progressBar = {
    raf: getElement<HTMLDivElement>('rafProgress')
};

export const results = {
    avgFps: getElement<HTMLTableCellElement>('avgFps'),
    minFps: getElement<HTMLTableCellElement>('minFps'),
    maxFps: getElement<HTMLTableCellElement>('maxFps'),
    fpsStability: getElement<HTMLTableCellElement>('fpsStability'),
    avgFrameTimeResult: getElement<HTMLTableCellElement>('avgFrameTimeResult'),
    minFrameTime: getElement<HTMLTableCellElement>('minFrameTime'),
    maxFrameTime: getElement<HTMLTableCellElement>('maxFrameTime'),
    frameTimeStdDev: getElement<HTMLTableCellElement>('frameTimeStdDev'),
    frameTimeChart: getElement<HTMLCanvasElement>('frameTimeChart')
};