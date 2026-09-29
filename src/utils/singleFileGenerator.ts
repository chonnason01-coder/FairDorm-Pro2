import standaloneHtml from '../../public/fairdorm-pro.html?raw';

/**
 * Returns the all-in-one Single-File HTML (HTML + Tailwind CDN + Vanilla JS)
 * that works completely standalone without any build tools.
 */
export function generateSingleFileHTML(): string {
  return standaloneHtml;
}
