/**
 * @author Nikhil Karthik
 *
 * this code is a rewrite of LK from nvision library for jsfeat integration
 */

(function (global) {
  'use strict';

  var optical_flow_lk_sparse = (function () {
    // Default parameters matching C++ implementation
    var DEFAULT_PATCH_SIZE = 15;
    var DEFAULT_MAX_ITER = 20;
    var DEFAULT_MIN_DISPLACEMENT = 0.03;
    var DEFAULT_MIN_EIGEN_THRESHOLD = 1e-6;
    var DEFAULT_MAX_EIGEN_RATIO = 100.0;

    // Extract patch with bilinear interpolation from jsfeat matrix
    function extractPatch(
      img_matrix,
      center_x,
      center_y,
      patch_size,
      patch_buffer
    ) {
      var half_patch = patch_size / 2.0;
      var extracted = true;

      var img_data = img_matrix.data;
      var img_cols = img_matrix.cols;
      var img_rows = img_matrix.rows;

      for (var y = 0; y < patch_size; y++) {
        for (var x = 0; x < patch_size; x++) {
          var img_y = center_y + (y - half_patch);
          var img_x = center_x + (x - half_patch);

          // Check bounds
          if (
            img_x >= 0 &&
            img_x < img_cols - 1 &&
            img_y >= 0 &&
            img_y < img_rows - 1
          ) {
            var x0 = Math.floor(img_x);
            var y0 = Math.floor(img_y);
            var x1 = x0 + 1;
            var y1 = y0 + 1;

            var dx = img_x - x0;
            var dy = img_y - y0;

            // Bilinear interpolation
            patch_buffer[y * patch_size + x] =
              img_data[y0 * img_cols + x0] * (1 - dx) * (1 - dy) +
              img_data[y0 * img_cols + x1] * dx * (1 - dy) +
              img_data[y1 * img_cols + x0] * (1 - dx) * dy +
              img_data[y1 * img_cols + x1] * dx * dy;
          } else {
            extracted = false;
            break;
          }
        }
        if (!extracted) break;
      }

      return extracted;
    }

    // Validate matrix for numerical stability
    function validateMatrix(G, min_eigen_threshold, max_eigen_ratio) {
      // Calculate determinant
      var det = G[0] * G[3] - G[1] * G[2]; // G[0,0] * G[1,1] - G[0,1] * G[1,0]

      if (det < min_eigen_threshold) {
        return false;
      }

      // Calculate eigenvalues for 2x2 matrix
      var trace = G[0] + G[3]; // G[0,0] + G[1,1]
      var discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det));
      var lambda1 = (trace + discriminant) / 2;
      var lambda2 = (trace - discriminant) / 2;

      // Ensure eigenvalues are positive and within ratio
      if (lambda1 < min_eigen_threshold || lambda2 < min_eigen_threshold) {
        return false;
      }

      if (lambda2 > 0 && lambda1 / lambda2 > max_eigen_ratio) {
        return false;
      }

      return true;
    }

    // Matrix 2x2 inverse
    function invertMatrix2x2(G, G_inv) {
      var det = G[0] * G[3] - G[1] * G[2];
      if (Math.abs(det) < 1e-10) {
        return false;
      }

      G_inv[0] = G[3] / det;
      G_inv[1] = -G[1] / det;
      G_inv[2] = -G[2] / det;
      G_inv[3] = G[0] / det;

      return true;
    }

    // Track single keypoint through pyramid levels
    function trackKeypoint(
      pyr_a,
      pyr_b,
      point_x,
      point_y,
      level,
      max_level,
      patch_size,
      max_iter,
      min_displacement,
      min_eigen_threshold,
      max_eigen_ratio,
      patch_buffers,
      G_buffer,
      G_inv_buffer,
      b_buffer
    ) {
      // Base case: highest level
      if (level === max_level) {
        return { dx: 0.0, dy: 0.0, success: true };
      }

      // Get displacement from higher level (recursive call)
      var higher_level_result = trackKeypoint(
        pyr_a,
        pyr_b,
        point_x,
        point_y,
        level + 1,
        max_level,
        patch_size,
        max_iter,
        min_displacement,
        min_eigen_threshold,
        max_eigen_ratio,
        patch_buffers,
        G_buffer,
        G_inv_buffer,
        b_buffer
      );

      if (!higher_level_result.success) {
        return { dx: 0.0, dy: 0.0, success: false };
      }

      // Scale displacement from higher level
      var low_lvl_disp_x = 2.0 * higher_level_result.dx;
      var low_lvl_disp_y = 2.0 * higher_level_result.dy;

      // Scale point to current level
      var scale = Math.pow(0.5, level);
      var current_x = point_x * scale;
      var current_y = point_y * scale;

      var current_disp_x = 0.0;
      var current_disp_y = 0.0;

      // Get patch buffers
      var patch_a = patch_buffers.patch_a;
      var patch_a_10 = patch_buffers.patch_a_10;
      var patch_a_01 = patch_buffers.patch_a_01;
      var patch_a_11 = patch_buffers.patch_a_11;
      var patch_b = patch_buffers.patch_b;
      var patch_b_10 = patch_buffers.patch_b_10;
      var patch_b_01 = patch_buffers.patch_b_01;
      var patch_b_11 = patch_buffers.patch_b_11;

      // Iterative refinement at current level
      for (var iter = 0; iter < max_iter; iter++) {
        var shifted_x = current_x + low_lvl_disp_x + current_disp_x;
        var shifted_y = current_y + low_lvl_disp_y + current_disp_y;

        // Extract patches for gradient computation using finite differences
        var extracted_a = extractPatch(
          pyr_a.data[level],
          current_x,
          current_y,
          patch_size,
          patch_a
        );
        var extracted_a_10 = extractPatch(
          pyr_a.data[level],
          current_x + 1,
          current_y,
          patch_size,
          patch_a_10
        );
        var extracted_a_01 = extractPatch(
          pyr_a.data[level],
          current_x,
          current_y + 1,
          patch_size,
          patch_a_01
        );
        var extracted_a_11 = extractPatch(
          pyr_a.data[level],
          current_x + 1,
          current_y + 1,
          patch_size,
          patch_a_11
        );

        var extracted_b = extractPatch(
          pyr_b.data[level],
          shifted_x,
          shifted_y,
          patch_size,
          patch_b
        );
        var extracted_b_10 = extractPatch(
          pyr_b.data[level],
          shifted_x + 1,
          shifted_y,
          patch_size,
          patch_b_10
        );
        var extracted_b_01 = extractPatch(
          pyr_b.data[level],
          shifted_x,
          shifted_y + 1,
          patch_size,
          patch_b_01
        );
        var extracted_b_11 = extractPatch(
          pyr_b.data[level],
          shifted_x + 1,
          shifted_y + 1,
          patch_size,
          patch_b_11
        );

        // Check if all patches were extracted successfully
        if (
          !extracted_a ||
          !extracted_a_10 ||
          !extracted_a_01 ||
          !extracted_a_11 ||
          !extracted_b ||
          !extracted_b_10 ||
          !extracted_b_01 ||
          !extracted_b_11
        ) {
          return { dx: 0.0, dy: 0.0, success: false };
        }

        // Reset system matrix and vector
        G_buffer[0] = 0.0;
        G_buffer[1] = 0.0;
        G_buffer[2] = 0.0;
        G_buffer[3] = 0.0;
        b_buffer[0] = 0.0;
        b_buffer[1] = 0.0;

        // Compute gradients and accumulate system matrix
        var patch_area = patch_size * patch_size;
        for (var i = 0; i < patch_area; i++) {
          // Finite difference gradients (4-point averaging like NVISION)
          var ix =
            (patch_a_11[i] +
              patch_a_10[i] +
              patch_b_11[i] +
              patch_b_10[i] -
              (patch_a_01[i] + patch_a[i] + patch_b_01[i] + patch_b[i])) *
            0.25;

          var iy =
            (patch_a_11[i] +
              patch_a_01[i] +
              patch_b_11[i] +
              patch_b_01[i] -
              (patch_a_10[i] + patch_a[i] + patch_b_10[i] + patch_b[i])) *
            0.25;

          // Temporal difference
          var it =
            (patch_b[i] +
              patch_b_01[i] +
              patch_b_10[i] +
              patch_b_11[i] -
              (patch_a[i] + patch_a_01[i] + patch_a_10[i] + patch_a_11[i])) *
            0.25;

          // Accumulate structure tensor and optical flow equation
          G_buffer[0] += ix * ix; // G[0,0]
          G_buffer[1] += ix * iy; // G[0,1]
          G_buffer[2] += ix * iy; // G[1,0] (same as G[0,1])
          G_buffer[3] += iy * iy; // G[1,1]

          b_buffer[0] -= ix * it;
          b_buffer[1] -= iy * it;
        }

        // Normalize by patch area
        var normalizer = 1.0 / patch_area;
        G_buffer[0] *= normalizer;
        G_buffer[1] *= normalizer;
        G_buffer[2] *= normalizer;
        G_buffer[3] *= normalizer;
        b_buffer[0] *= normalizer;
        b_buffer[1] *= normalizer;

        // Validate matrix for numerical stability
        if (!validateMatrix(G_buffer, min_eigen_threshold, max_eigen_ratio)) {
          return { dx: 0.0, dy: 0.0, success: false };
        }

        // Solve system G * delta = b
        if (!invertMatrix2x2(G_buffer, G_inv_buffer)) {
          return { dx: 0.0, dy: 0.0, success: false };
        }

        var delta_x =
          G_inv_buffer[0] * b_buffer[0] + G_inv_buffer[1] * b_buffer[1];
        var delta_y =
          G_inv_buffer[2] * b_buffer[0] + G_inv_buffer[3] * b_buffer[1];

        // Check convergence
        var delta_norm = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
        if (delta_norm < min_displacement) {
          break;
        }

        current_disp_x += delta_x;
        current_disp_y += delta_y;
      }

      return {
        dx: low_lvl_disp_x + current_disp_x,
        dy: low_lvl_disp_y + current_disp_y,
        success: true
      };
    }

    return {
      track: function (prev_pyr, curr_pyr, prev_xy, curr_xy, count, options) {
        // Set default options
        options = options || {};
        var patch_size = options.patch_size || DEFAULT_PATCH_SIZE;
        var max_iter = options.max_iter || DEFAULT_MAX_ITER;
        var min_displacement =
          options.min_displacement || DEFAULT_MIN_DISPLACEMENT;
        var min_eigen_threshold =
          options.min_eigen_threshold || DEFAULT_MIN_EIGEN_THRESHOLD;
        var max_eigen_ratio =
          options.max_eigen_ratio || DEFAULT_MAX_EIGEN_RATIO;

        if (!prev_xy || prev_xy.length === 0) {
          throw new Error('prev_xy array is empty or undefined');
        }

        // Initialize status array
        var status = new Uint8Array(count);
        for (var i = 0; i < count; i++) {
          status[i] = 1; // Initially all points are valid
        }

        // Get maximum pyramid level (jsfeat pyramids have levels property)
        var max_level = prev_pyr.levels;

        // Pre-allocate memory buffers using jsfeat cache
        var patch_area = patch_size * patch_size;
        var patch_buffer_size = patch_area << 2; // * 4 bytes per float

        // Get patch buffers from cache
        var patch_a_node = jsfeat.cache.get_buffer(patch_buffer_size);
        var patch_a_10_node = jsfeat.cache.get_buffer(patch_buffer_size);
        var patch_a_01_node = jsfeat.cache.get_buffer(patch_buffer_size);
        var patch_a_11_node = jsfeat.cache.get_buffer(patch_buffer_size);
        var patch_b_node = jsfeat.cache.get_buffer(patch_buffer_size);
        var patch_b_10_node = jsfeat.cache.get_buffer(patch_buffer_size);
        var patch_b_01_node = jsfeat.cache.get_buffer(patch_buffer_size);
        var patch_b_11_node = jsfeat.cache.get_buffer(patch_buffer_size);

        // System matrix and vector buffers
        var G_node = jsfeat.cache.get_buffer(16); // 4 floats * 4 bytes = 16 bytes
        var G_inv_node = jsfeat.cache.get_buffer(16);
        var b_node = jsfeat.cache.get_buffer(8); // 2 floats * 4 bytes = 8 bytes

        // Create patch buffer structure
        var patch_buffers = {
          patch_a: patch_a_node.f32,
          patch_a_10: patch_a_10_node.f32,
          patch_a_01: patch_a_01_node.f32,
          patch_a_11: patch_a_11_node.f32,
          patch_b: patch_b_node.f32,
          patch_b_10: patch_b_10_node.f32,
          patch_b_01: patch_b_01_node.f32,
          patch_b_11: patch_b_11_node.f32
        };

        var G_buffer = G_node.f32;
        var G_inv_buffer = G_inv_node.f32;
        var b_buffer = b_node.f32;

        // Track each point
        for (var ptid = 0; ptid < count; ptid++) {
          var prev_x = prev_xy[ptid * 2];
          var prev_y = prev_xy[ptid * 2 + 1];

          var result = trackKeypoint(
            prev_pyr,
            curr_pyr,
            prev_x,
            prev_y,
            0,
            max_level,
            patch_size,
            max_iter,
            min_displacement,
            min_eigen_threshold,
            max_eigen_ratio,
            patch_buffers,
            G_buffer,
            G_inv_buffer,
            b_buffer
          );

          if (result.success) {
            curr_xy[ptid * 2] = prev_x + result.dx;
            curr_xy[ptid * 2 + 1] = prev_y + result.dy;
            status[ptid] = 1;
          } else {
            curr_xy[ptid * 2] = prev_x;
            curr_xy[ptid * 2 + 1] = prev_y;
            status[ptid] = 0;
          }
        }

        // Return buffers to cache
        jsfeat.cache.put_buffer(patch_a_node);
        jsfeat.cache.put_buffer(patch_a_10_node);
        jsfeat.cache.put_buffer(patch_a_01_node);
        jsfeat.cache.put_buffer(patch_a_11_node);
        jsfeat.cache.put_buffer(patch_b_node);
        jsfeat.cache.put_buffer(patch_b_10_node);
        jsfeat.cache.put_buffer(patch_b_01_node);
        jsfeat.cache.put_buffer(patch_b_11_node);
        jsfeat.cache.put_buffer(G_node);
        jsfeat.cache.put_buffer(G_inv_node);
        jsfeat.cache.put_buffer(b_node);

        return status;
      }
    };
  })();

  global.optical_flow_lk_sparse = optical_flow_lk_sparse;
})(jsfeat);
