import Bowser from 'bowser';

export interface SystemInfo {
    browser: string;
    os: string;
    userAgent: string;
    version?: string;
    platform?: string;
}

export function getSystemInfo(): SystemInfo {
    const parser = Bowser.getParser(window.navigator.userAgent);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    
    return {
        browser: `${browserInfo.name} ${browserInfo.version}`,
        os: osInfo.name + (osInfo.version ? ` ${osInfo.version}` : ''),
        userAgent: window.navigator.userAgent,
        version: browserInfo.version,
        platform: navigator.platform
    };
}
