import { FrameData, TestConfig, TestResults } from './types';
import { progressBar, menu } from './dom-elements';
import { updateProgress } from './dom-utils';
import { getSystemInfo } from './system-info';

export const testConfig: TestConfig = {
    targetFps: 60, // Default, will be updated based on actual refresh rate
    totalFrames: 1800, // Will be updated based on refresh rate
    testDurationSeconds: 30 // Configurable test duration
};

export let testResults: TestResults = {
    frames: [],
    systemInfo: {
        browser: '',
        os: '',
        userAgent: '',
        timestamp: 0
    },
    summary: {
        avgFps: 0,
        minFps: 0,
        maxFps: 0,
        fpsStability: 0,
        avgFrameTime: 0,
        minFrameTime: 0,
        maxFrameTime: 0,
        frameTimeStdDev: 0
    }
};

// Function to detect display refresh rate
function detectRefreshRate(): Promise<number> {
    return new Promise<number>((resolve) => {
        let rafTimes: number[] = [];
        let lastTimestamp: number | null = null;
        let frameCount = 0;
        
        function countFrame(timestamp: number) {
            if (lastTimestamp !== null) {
                const delta = timestamp - lastTimestamp;
                // Skip first few frames for warm-up
                if (frameCount > 3) {
                    rafTimes.push(delta);
                }
            }
            
            lastTimestamp = timestamp;
            frameCount++;
            
            // Collect more samples for better accuracy
            if (frameCount < 120) {
                requestAnimationFrame(countFrame);
            } else {
                // Sort the frame times and use median for more stability
                rafTimes.sort((a, b) => a - b);
                const medianIndex = Math.floor(rafTimes.length / 2);
                const medianFrameTime = rafTimes.length % 2 === 0
                    ? (rafTimes[medianIndex - 1] + rafTimes[medianIndex]) / 2
                    : rafTimes[medianIndex];
                
                // Convert to refresh rate
                const refreshRate = Math.round(1000 / medianFrameTime);
                
                // Common refresh rates: 60, 75, 90, 120, 144, 165, 240
                // If we're close to a standard rate, use that instead
                const standardRates = [60, 75, 90, 120, 144, 165, 240];
                let closestRate = 60;
                let minDiff = Math.abs(refreshRate - 60);
                
                for (const rate of standardRates) {
                    const diff = Math.abs(refreshRate - rate);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestRate = rate;
                    }
                }
                
                resolve(closestRate);
            }
        }
        
        requestAnimationFrame(countFrame);
    });
}

export async function runRAFTest(): Promise<void> {
    // First, detect the refresh rate
    const refreshRate = await detectRefreshRate();
    testConfig.targetFps = refreshRate;
    testConfig.totalFrames = Math.round(refreshRate * testConfig.testDurationSeconds);
    menu.testHeader.textContent = `RAF Test (${testConfig.totalFrames} frames @ ${refreshRate}Hz)`;
    
    return new Promise<void>((resolve) => {
        const expectedFrameTime = 1000 / testConfig.targetFps;
        const frames: FrameData[] = [];
        let lastFrameTime: number | null = null;
        let frameCount = 0;
        let warmupFrames = 10; // Skip first 10 frames for warm-up
        let recentFrameTimes: number[] = [];
        
        // Calculate acceptable frame time bounds
        const minAcceptableFrameTime = Math.max(expectedFrameTime - 2, 1);
        const maxAcceptableFrameTime = expectedFrameTime * 2; // Cap at 2x expected time
        
        // Initialize system info
        const sysInfo = getSystemInfo();
        testResults.systemInfo = {
            browser: sysInfo.browser,
            os: sysInfo.os,
            userAgent: sysInfo.userAgent,
            timestamp: Date.now()
        };
        
        // Show live stats
        menu.liveStats.classList.remove('d-none');
        
        // Handle visibility change
        let wasHidden = false;
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState !== 'visible') {
                wasHidden = true;
            }
        });
        
        function frameCallback(timestamp: number) {
            // Check if test should continue
            if (wasHidden) {
                // Clean up UI
                menu.liveStats.classList.add('d-none');
                progressBar.raf.classList.add('bg-warning');
                progressBar.raf.textContent = 'Test interrupted - page was hidden';
                
                // Calculate stats with what we have so far
                if (frames.length > 0) {
                    calculateSummaryStats(frames, minAcceptableFrameTime, maxAcceptableFrameTime);
                    testResults.frames = frames;
                }
                
                resolve();
                return;
            }
            
            // Initialize lastFrameTime on first callback
            if (lastFrameTime === null) {
                lastFrameTime = timestamp;
                requestAnimationFrame(frameCallback);
                return;
            }
            
            const frameDuration = timestamp - lastFrameTime;
            
            // Adjust frame duration if it's outside acceptable range
            const adjustedFrameDuration = Math.min(
                Math.max(frameDuration, minAcceptableFrameTime),
                maxAcceptableFrameTime
            );
            const currentFps = 1000 / adjustedFrameDuration;
            
            // Skip warm-up frames
            if (frameCount >= warmupFrames) {
                const frameData: FrameData = {
                    frameNumber: frameCount - warmupFrames,
                    timestamp: timestamp,
                    frameDuration: frameDuration, // Store actual measured duration
                    fps: currentFps,
                    expected: expectedFrameTime,
                    drift: frameDuration - expectedFrameTime
                };
                
                frames.push(frameData);
                
                // Update live stats
                recentFrameTimes.push(frameDuration);
                if (recentFrameTimes.length > 10) {
                    recentFrameTimes.shift();
                }
                
                const avgRecentFrameTime = recentFrameTimes.reduce((sum, time) => sum + time, 0) / recentFrameTimes.length;
                // Apply same bounds to average calculation
                const adjustedAvgFrameTime = Math.min(
                    Math.max(avgRecentFrameTime, minAcceptableFrameTime),
                    maxAcceptableFrameTime
                );
                const avgRecentFps = 1000 / adjustedAvgFrameTime;
                
                menu.currentFps.textContent = avgRecentFps.toFixed(1);
                menu.avgFrameTime.textContent = avgRecentFrameTime.toFixed(2) + 'ms';
                
                // Update progress
                updateProgress(progressBar.raf, frameCount - warmupFrames, testConfig.totalFrames);
            }
            
            lastFrameTime = timestamp;
            frameCount++;
            
            if (frameCount < testConfig.totalFrames + warmupFrames) {
                requestAnimationFrame(frameCallback);
            } else {
                // Clean up UI
                menu.liveStats.classList.add('d-none');
                progressBar.raf.classList.add('bg-success');
                
                // Calculate summary statistics
                calculateSummaryStats(frames, minAcceptableFrameTime, maxAcceptableFrameTime);
                testResults.frames = frames;
                resolve();
            }
        }
        
        requestAnimationFrame(frameCallback);
    });
}

function calculateSummaryStats(frames: FrameData[], minAcceptableFrameTime: number, maxAcceptableFrameTime: number): void {
    if (frames.length === 0) return;
    
    // Get the actual frame times
    const frameTimes = frames.map(frame => frame.frameDuration);
    
    // Calculate adjusted frame times (bounded by min/max acceptable)
    const adjustedFrameTimes = frameTimes.map(time => 
        Math.min(Math.max(time, minAcceptableFrameTime), maxAcceptableFrameTime)
    );
    
    // Calculate FPS from adjusted frame times
    const fpsList = adjustedFrameTimes.map(time => 1000 / time);
    
    // Calculate statistics
    const avgFps = fpsList.reduce((sum, fps) => sum + fps, 0) / fpsList.length;
    const minFps = Math.min(...fpsList);
    const maxFps = Math.max(...fpsList);
    
    // Calculate frame time stats using actual measured times
    const avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
    const minFrameTime = Math.min(...frameTimes);
    const maxFrameTime = Math.max(...frameTimes);
    
    // Calculate standard deviation for frame times
    const squaredDiffs = frameTimes.map(time => {
        const diff = time - avgFrameTime;
        return diff * diff;
    });
    const avgSquaredDiff = squaredDiffs.reduce((sum, sqDiff) => sum + sqDiff, 0) / squaredDiffs.length;
    const frameTimeStdDev = Math.sqrt(avgSquaredDiff);
    
    // Calculate FPS stability from the FPS list directly
    const fpsAvg = fpsList.reduce((sum, fps) => sum + fps, 0) / fpsList.length;
    const fpsSquaredDiffs = fpsList.map(fps => {
        const diff = fps - fpsAvg;
        return diff * diff;
    });
    const fpsVariance = fpsSquaredDiffs.reduce((sum, sqDiff) => sum + sqDiff, 0) / fpsSquaredDiffs.length;
    const fpsStdDev = Math.sqrt(fpsVariance);
    const fpsStability = 100 * (1 - (fpsStdDev / fpsAvg));
    
    // Update the test results
    testResults.summary = {
        avgFps,
        minFps,
        maxFps,
        fpsStability,
        avgFrameTime,
        minFrameTime,
        maxFrameTime,
        frameTimeStdDev
    };
}
