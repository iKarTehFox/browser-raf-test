export interface FrameData {
    frameNumber: number;
    timestamp: number;
    frameDuration: number;
    fps: number;
    expected: number;
    drift: number;
}

export interface TestResults {
    frames: FrameData[];
    systemInfo: {
        browser: string;
        os: string;
        userAgent: string;
        timestamp: number;
    };
    summary: {
        avgFps: number;
        minFps: number;
        maxFps: number;
        fpsStability: number;
        avgFrameTime: number;
        minFrameTime: number;
        maxFrameTime: number;
        frameTimeStdDev: number;
    };
}

export interface TestConfig {
    targetFps: number;
    totalFrames: number;
    testDurationSeconds: number;
}
