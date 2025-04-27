# Browser RAF Test

A tool for measuring the accuracy and consistency of requestAnimationFrame (RAF) in different browsers.

## Overview

Browser RAF Test provides detailed measurements of how consistently browsers deliver animation frames using the requestAnimationFrame API. This is crucial for smooth animations, games, and interactive visualizations.

## Features

- Tests requestAnimationFrame consistency over a configurable duration (default: 30 seconds)
- Automatically detects display refresh rate and adapts test parameters accordingly
- Provides real-time FPS and frame time statistics during the test
- Calculates key metrics: average FPS, FPS stability, frame time statistics
- Visualizes performance with an interactive dual-axis chart showing FPS and frame times
- Detects browser and operating system information
- Exports raw test data as JSON for further analysis
- Handles page visibility changes to ensure accurate measurements
- Responsive design that adapts to different screen sizes

## How to Run

Clone the repository and open the `browser-raf-test` directory.
Ensure you have Node.js installed.

1. Run `npm install` to install dependencies
2. Run `npm run serve` to serve the website on port 4000
3. Open your browser and go to `http://localhost:4000`
4. Click `Start RAF test` to begin the testing.

You can also export the raw data as JSON by clicking the "Export Raw Data" button. Additionally, you can also upload exported JSON results to analyze within the site.

## Understanding the Results

- **Average FPS**: The average frames per second achieved during the test
- **FPS Stability**: How consistent the frame rate was (100% = perfectly stable)
- **Frame Time**: The time between frames in milliseconds
- **Frame Time Std Dev**: Standard deviation of frame times (lower = more consistent)
- **Performance Chart**: Interactive visualization showing both FPS and frame times throughout the test, with reference lines for target values

## Technical Details

- The test automatically detects your display's refresh rate for accurate benchmarking
- Initial frames are skipped to allow the browser to stabilize
- Frame time outliers are handled with appropriate bounds to ensure accurate statistics
- The test will warn you if the page loses focus during measurement
- Performance data is downsampled for efficient visualization when necessary

## Why This Matters

The requestAnimationFrame API is the foundation of modern web animations and games. Understanding how consistently your browser delivers frames helps diagnose performance issues and optimize animations. Factors like system load, background processes, and power-saving features can all affect RAF consistency.

# Acknowledgements (OSS)
- **Bootstrap** ([Link](https://getbootstrap.com/)): Licensed under MIT License
  - Copyright (c) 2011-2025 The Bootstrap Authors
- **Chart.js** ([Link](https://www.chartjs.org/)): Licensed under MIT License
  - Copyright (c) 2014-2022 Chart.js Contributors
- **Material Design Icons by Pictogrammers** ([GitHub](https://github.com/Templarian/MaterialDesign)): Icons licensed under Apache License 2.0
- **Webpack** ([Link](https://webpack.js.org/)): Licensed under MIT License
  - Copyright JS Foundation and other contributors  

Copyright (c) 2025 Diego Perez (iKarTehFox)
