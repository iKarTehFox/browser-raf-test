/**
 * Updates a progress bar element with the current progress
 * @param progressBar The progress bar element to update
 * @param current Current progress value
 * @param total Total progress value
 */
export function updateProgress(progressBar: HTMLDivElement, current: number, total: number): void {
    const percentage = Math.min(Math.round((current / total) * 100), 100);
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage.toString());
    progressBar.textContent = `${percentage}%`;

    if (percentage === 100) {
        progressBar.classList.remove('progress-bar-animated');
        progressBar.classList.add('bg-success');
    }
}
