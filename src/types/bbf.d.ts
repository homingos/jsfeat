declare module "jsfeat/lib/jsfeat_bbf.js" {
  import { matrix_t, pyramid_t } from "jsfeat/lib/jsfeat_core.js";

  export function detect(pyramid: pyramid_t, cascade: any): any[];
  export function build_pyramid(
    src: matrix_t,
    min_width: number,
    min_height: number,
    interval?: number
  ): pyramid_t;
  export function prepare_cascade(cascade: any): void;
  export function group_rectangles(
    rects: any[],
    min_neighbors?: number
  ): any[];

  export let interval: number;
  export let scale: number;
  export let next: number;
  export let scale_to: number;
}
