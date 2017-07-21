/**
 * Configuration file
 *
 * @author Junyuan Zheng <joseph.zjy@gmail.com>
 */

/**
 * Filmstrip HEIGHT
 *
 * @type {number}
 */
export const FILMSTRIP_HEIGHT: number = 200;

export const HIGHLIGHT_COLOR_COUNT: number = 5;

/**
 * Heat map default size
 *
 * @example 6 means 1/6 of the filmstrip height
 * @type {number}
 */
export const HEATMAP_PORTION: number = 6;

/**
 * Highlight default size
 *
 * @example 6 means 1/6 of the highlight height
 * @type {number}
 */
export const HIGHLIGHT_PORTION: number = 6;

/**
 * Thumbnail number based on different dimensions
 *
 * @type {number}
 */
export const THUMBNAIL_NUMBER_1: number = 3;
export const THUMBNAIL_NUMBER_2: number = 6;
export const THUMBNAIL_NUMBER_3: number = 9;

/**
 * Timer to sync up with remote server
 *
 * @type {number}
 */
export const FILMSTRIP_FETCH_CROWD_HEATMAP_TIMER: number = 10000;
