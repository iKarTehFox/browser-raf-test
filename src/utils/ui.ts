import { menu, results } from './dom-elements';
import { testResults } from './tests';
import Chart from 'chart.js/auto';

let performanceChart: Chart | null = null;

export function displayResults(): void {
    menu.spinner.classList.replace('d-inline-block', 'd-none');
    menu.liveStats.classList.add('d-none');
    
    const summary = testResults.summary;
    
    // Update result elements
    results.avgFps.textContent = summary.avgFps.toFixed(2);
    results.minFps.textContent = summary.minFps.toFixed(2);
    results.maxFps.textContent = summary.maxFps.toFixed(2);
    results.fpsStability.textContent = summary.fpsStability.toFixed(2) + '%';
    
    results.avgFrameTimeResult.textContent = summary.avgFrameTime.toFixed(2) + ' ms';
    results.minFrameTime.textContent = summary.minFrameTime.toFixed(2) + ' ms';
    results.maxFrameTime.textContent = summary.maxFrameTime.toFixed(2) + ' ms';
    results.frameTimeStdDev.textContent = summary.frameTimeStdDev.toFixed(2) + ' ms';
    
    // Create performance chart
    createPerformanceChart();
    if (performanceChart) {
        performanceChart.resize();
        
        // Add window resize listener to handle browser resizing
        setupChartResizeListener();
    }
    
    // Show results section
    menu.resultsContainer.classList.remove('d-none');
}

// Track the resize listener so we can remove it later
let resizeListener: (() => void) | null = null;

// Set up a debounced resize listener for the chart
function setupChartResizeListener(): void {
    // Remove any existing listener first
    if (resizeListener) {
        window.removeEventListener('resize', resizeListener);
    }
    
    // Create a debounced resize function to avoid excessive redraws
    let resizeTimeout: number | null = null;
    
    resizeListener = () => {
        if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = window.setTimeout(() => {
            if (performanceChart) {
                performanceChart.resize();
            }
        }, 100); // 100ms debounce
    };
    
    // Add the listener
    window.addEventListener('resize', resizeListener);
}

// Function to clean up listeners when no longer needed
export function cleanupChartListeners(): void {
    if (resizeListener) {
        window.removeEventListener('resize', resizeListener);
        resizeListener = null;
    }
}

function createPerformanceChart(): void {
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    const ctx = results.frameTimeChart.getContext('2d');
    if (!ctx) return;
    
    // Get data from test results
    const frames = testResults.frames;
    
    // We'll downsample if there are too many frames to keep the chart responsive
    const maxDataPoints = 1800;
    const samplingRate = frames.length > maxDataPoints ? Math.floor(frames.length / maxDataPoints) : 1;
    
    // Prepare data arrays
    const labels: number[] = [];
    const fpsSeries: number[] = [];
    const frameTimeSeries: number[] = [];
    const targetFps = testResults.frames[0]?.expected ? 1000 / testResults.frames[0].expected : 60;
    const targetFrameTime = 1000 / targetFps;
    
    // Sample the data
    for (let i = 0; i < frames.length; i += samplingRate) {
        const frame = frames[i];
        labels.push(frame.frameNumber);
        fpsSeries.push(frame.fps);
        frameTimeSeries.push(frame.frameDuration);
    }
    
    // Define a custom plugin to draw target lines
    const targetLinesPlugin = {
        id: 'targetLines',
        afterDraw: (chart: Chart) => {
            const { ctx, chartArea, scales } = chart;
            
            if (!chartArea) return; // Safety check
            
            // Draw target FPS line
            if (scales.y) {
                const yScale = scales.y;
                const targetY = yScale.getPixelForValue(targetFps);
                
                if (targetY >= chartArea.top && targetY <= chartArea.bottom) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(chartArea.left, targetY);
                    ctx.lineTo(chartArea.right, targetY);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.restore();
                }
            }
            
            // Draw target frame time line
            if (scales.y1) {
                const y1Scale = scales.y1;
                const targetY = y1Scale.getPixelForValue(targetFrameTime);
                
                if (targetY >= chartArea.top && targetY <= chartArea.bottom) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(chartArea.left, targetY);
                    ctx.lineTo(chartArea.right, targetY);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    };
    
    // Create the chart
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'FPS',
                    data: fpsSeries,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    pointRadius: 0,
                    yAxisID: 'y',
                    tension: 0.1
                },
                {
                    label: 'Frame Time (ms)',
                    data: frameTimeSeries,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    pointRadius: 0,
                    yAxisID: 'y1',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (tooltipItems) => {
                            return `Frame: ${tooltipItems[0].label}`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Frame Number'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'FPS'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Frame Time (ms)'
                    }
                }
            }
        },
        plugins: [targetLinesPlugin]
    });
}

export function exportData(): void {
    // Combine system information and test results
    const exportData = {
        systemInfo: testResults.systemInfo,
        frames: testResults.frames,
        summary: testResults.summary,
        exportDate: new Date().toISOString()
    };
    
    // Stringify the combined data
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
    // Set default file name
    const currentTime = Math.floor(Date.now() / 1000);
    const exportFileDefaultName = `raf-results-${currentTime}.json`;
  
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

export function exportChartDataCSV(): void {
    // Check if we have test results
    if (!testResults.frames || testResults.frames.length === 0) {
        console.error('No data to export');
        return;
    }
    
    // Create CSV header
    let csvContent = 'Frame Number,Timestamp (ms),Frame Duration (ms),FPS,Expected Frame Time (ms),Drift (ms)\n';
    
    // Add each frame's data
    testResults.frames.forEach(frame => {
        const row = [
            frame.frameNumber,
            frame.timestamp.toFixed(2),
            frame.frameDuration.toFixed(2),
            frame.fps.toFixed(2),
            frame.expected.toFixed(2),
            frame.drift.toFixed(2)
        ].join(',');
        
        csvContent += row + '\n';
    });
    
    // Create a download link
    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const currentTime = Math.floor(Date.now() / 1000);
    const exportFileDefaultName = `raf-perfchart-${currentTime}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', encodedUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
