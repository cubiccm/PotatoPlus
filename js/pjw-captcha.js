/*
  CAPTCHA Identification
  Reference: https://github.com/leonof/imgRecJs
*/

// import { lib, numkeys } from './lib.js';

function CAPTCHAPlugin() {
  var source_img;
  var img_width;
  var img_height;
  window.learned_data = new Array();

  var logArea = document.getElementById("logArea");

  var lastWidth = 18;
  var lastHeight = 18;
  var parts_array;
  var ctx_original, ctx_binary, ctx_color;

  var reasonable_part_count;

  // Image binaryzation
  function imageBinaryzation(img) {
    var fromPixelData = img.data;
    var greyAve = 0;
    for (var j = 0; j < img_width * img_height; j++){
      var r = fromPixelData[4*j];
      var g = fromPixelData[4*j+1];
      var b = fromPixelData[4*j+2];
      greyAve += r*0.3 + g*0.59 + b*0.11;
    }
    // Calculate average grayscale
    greyAve /= img_width * img_height;
    greyAve *= 0.65;
    for (var j = 0; j < img_width * img_height; j++){
      r = fromPixelData[4*j];
      g = fromPixelData[4*j+1];
      b = fromPixelData[4*j+2];
      var grey = r*0.333 + g*0.333 + b*0.333;
      if(grey > greyAve)
        grey = 255;
      else
        grey = 0;
      fromPixelData[4*j] = grey;
      fromPixelData[4*j+1] = grey;
      fromPixelData[4*j+2] = grey;
    }
    return img;
  }

  // Image binaryzation with color data preserved
  function imageBinaryzationWithColor(img){
    var fromPixelData = img.data;
    var greyAve = 0;
    for (var j = 0; j < img_width * img_height; j++){
      var r = fromPixelData[4*j];
      var g = fromPixelData[4*j+1];
      var b = fromPixelData[4*j+2];
      greyAve += r*0.3 + g*0.59 + b*0.11;
    }
    greyAve /= img_width * img_height;
    greyAve *= 0.65;
    for (var j = 0; j < img_width * img_height; j++){
      r = fromPixelData[4*j];
      g = fromPixelData[4*j+1];
      b = fromPixelData[4*j+2];
      var grey = (r + g + b) / 3;
      if (grey > greyAve) {
        fromPixelData[4*j] = 255;
        fromPixelData[4*j+1] = 255;
        fromPixelData[4*j+2] = 255;
      }
    }
    return img;
  }

  // Simple corrosion
  function corrode(img) {
    for (var j = 1; j < img.length - 1; j++)
      for (var k = 1; k < img[j].length - 1; k++)
        if (img[j][k] == 1 &&
            img[j-1][k]+img[j+1][k]+img[j][k-1]+img[j][k+1]+
            img[j-1][k-1]+img[j-1][k+1]+img[j+1][k-1]+img[j+1][k+1] == 0)
          img[j][k] = 0;
    return img;
  }

  // Simple expansion
  function expand(img) {
    for (var j = 1; j < img.length - 1; j++)
      for (var k = 1; k < img[j].length - 1; k++)
        if (img[j][k] == 0 && img[j-1][k]+img[j+1][k]+img[j][k-1]+img[j][k+1] == 4)
          img[j][k] = 1;
    return img;
  }

  // Get a column from 2D array
  function sliceColumn(arr, start, end) {
    var ans = new Array();
    for (var row in arr) {
      ans.push(arr[row].slice(start, end));
    }
    return ans;
  }

  const min_partial_weight = 10;
  const split_count = 4;
  const part_adj_max_mul = 1.8;
  var resonable_part_count = 0;

  // Split image to parts
  function split(img, color_avg) {
    var split_array = new Array();
    var part_info = new Array();
    var status = false, split_index = 0, partial_weight = 0;
    // Traverse image by pixel
    for (var k = 0; k < img[0].length && split_index < split_count; k++) {
      var column_sum = 0;
      for (var j = 0; j < img.length; j++)
        column_sum += img[j][k]; // Add up column weight
      if (column_sum == 0 && status !== false) { // Part ends
        if (partial_weight >= min_partial_weight) {
          split_array.push(sliceColumn(img, status, k));
          part_info.push(new Array(k - status, split_index, status, k));
          split_index++;
        }
        status = false;
        partial_weight = 0;
      } else if (status !== false) { // Part continues
        for (var j = 0; j < img.length; j++)
          partial_weight += img[j][k];
      } else if (column_sum != 0) { // Part begins
        status = k;
      }
    }
    reasonable_part_count = split_index;
    if (split_index == split_count) {
      return split_array;
    } else if (split_index == split_count - 1) {
      part_info.sort(function (a, b) { return b[0] - a[0]; });
      var split_list = splitPartsBasedOnColor(part_info[0][2],
          color_avg.slice(part_info[0][2], part_info[0][3]), 2);
    } else if (split_index == split_count - 2) {
      part_info.sort(function (a, b) { return b[0] - a[0]; });
      if (part_info[0][0] / part_info[1][0] <= part_adj_max_mul) {
        var split_list = splitPartsBasedOnColor(part_info[0][2],
            color_avg.slice(part_info[0][2], part_info[0][3]), 2);
        split_list = split_list.concat(splitPartsBasedOnColor(part_info[1][2],
            color_avg.slice(part_info[1][2], part_info[1][3]), 2));
      } else {
        var split_list = splitPartsBasedOnColor(part_info[0][2],
            color_avg.slice(part_info[0][2], part_info[0][3]), 3);
      }
    } else {
      var split_list = splitPartsBasedOnColor(part_info[0][2],
            color_avg.slice(part_info[0][2], part_info[0][3]), 4);
    }
    part_info.sort(function (a, b) { return a[2] - b[2]; });
    var splitted_parts = 0;
    for (var i = 0; i < split_index && split_list.length > 0; i++) {
      for (var j = 0; split_list.length > 0 && j < split_list.length; j++)
        if (part_info[i][3] >= split_list[j] && part_info[i][2] < split_list[j]) {
          var current_id = part_info[i][1] + (splitted_parts++);
          var orig = split_array[current_id];
          split_array = split_array.slice(0, current_id)
              .concat([sliceColumn(orig, 0, split_list[j] - part_info[i][2]), sliceColumn(orig, split_list[j] - part_info[i][2], orig[0].length)])
              .concat(split_array.slice(current_id + 1, split_array.length));
          part_info[i][2] = split_list[j];
          split_list.splice(j, 1);
          j--;
        }
    }
    return split_array;
  }

  function cubicDistribution(x, peak) {
    if (peak == 2) return 1.0 - 8 * Math.pow(Math.abs(x - 0.5), 3);
    else if (peak == 3) return 1.0 - 27 * Math.pow(Math.min(Math.abs(x - 2/3), Math.abs(x - 1/3)), 3);
    else if (peak == 4) return 1.0 - 64 * Math.pow(Math.min(Math.abs(x - 0.5), Math.abs(x - 0.25), Math.abs(x - 0.75)), 3);
  }

  function squareDistribution(x, peak) {
    if (peak == 2) return 1.0 - 4 * Math.pow(Math.abs(x - 0.5), 2);
    else if (peak == 3) return 1.0 - 9 * Math.pow(Math.min(Math.abs(x - 2/3), Math.abs(x - 1/3)), 2);
    else if (peak == 4) return 1.0 - 16 * Math.pow(Math.min(Math.abs(x - 0.5), Math.abs(x - 0.25), Math.abs(x - 0.75)), 2);
  }

  function easeDistribution(x, peak) {
    if (peak == 2) return Math.sin(2 * Math.PI * (x - 0.25)) + 1;
    else if (peak == 3) return Math.sin(2 * Math.PI * Math.min((x - 1/3), (x - 1/6))) + 1;
    else if (peak == 4) return Math.sin(2 * Math.PI * Math.min((x - 1/8), (x - 1/4), (x - 3/8)));
  }

  function splitPartsBasedOnColor(start_pos, color_avg, split_part_count) {
    var part_split_array = new Array();
    var sorted_color_avg = new Array();
    var part_width = color_avg.length;
    for (var i = 0; i < part_width; i++) {
      if (color_avg[i] > 0)
        color_avg[i] *= squareDistribution(i / part_width, split_part_count);
      sorted_color_avg.push(new Array(color_avg[i], i));
    }
    for (var i = 0; i < split_part_count - 1; i++) {
      sorted_color_avg.sort(function (a, b) { return b[0] - a[0]; });
      part_split_array.push(start_pos + sorted_color_avg[0][1]);
      for (var j = 1; j < sorted_color_avg.length; j++) { // Reevaluate Weight
        var distance = Math.abs(sorted_color_avg[j][1] - sorted_color_avg[0][1]);
        if (distance <= 10)
          sorted_color_avg[j][0] *= Math.pow(distance, 2) / 100;
      }
      sorted_color_avg.splice(0, 1);
    }
    part_split_array.sort(function (a, b) { return a - b; });
    return part_split_array;
  }


  function trimUpDown(img) {
    var h = img.length;
    for (var j = 0; j < h; j++) {
      var sumUp = 0;
      for (var k = 0; k < img[j].length-1; k++) {
        sumUp += img[j][k];
      }
      if (sumUp === 0) { // Clear
        img = removeFromArray(img,j);
        h--;
        break;
      }
    }
    for (var j = h - 1; j >= 0; j--) {
      var sumUp = 0;
      for (var k = 0; k < img[j].length-1; k++) {
        sumUp += img[j][k];
      }
      if (sumUp === 0) { // Clear
        img = removeFromArray(img,j);
        h--;
        break;
      }
    }
    return img;
  } // Remove top & bottom margin

  function zoomToFit(img){
    var imgD = fromXY(img);
    var w = lastWidth;
    var h = lastHeight;
    var tempc1 = document.createElement("canvas");
    var tempc2 = document.createElement("canvas");
    if(!img[0]){
      return false;
    }
    tempc1.width = img[0].length;
    tempc1.height = img.length;
    tempc2.width = w;
    tempc2.height = h;
    var tempt1 = tempc1.getContext("2d");
    var tempt2 = tempc2.getContext("2d");
    tempt1.putImageData(imgD,0,0,0,0,tempc1.width,tempc1.height);
    tempt2.drawImage(tempc1,0,0,w,h);
    var returnImageD = tempt2.getImageData(0,0,img_width,img_height);
    img = toXY(returnImageD);
    img.length = h;
    for(var i=0;i<h;i++){
      img[i].length = w;
    }
    return img;
  } // 尺寸归一化

  function getCode(img) {
    var result = '';
    for (var j = 0; j < img.length; j++) {
      for (var k = 0; k < img[j].length; k++)
        result += String(img[j][k]);
      result += ';';
    }
    return result;
  } // 生成特征码

  function drawThis(toCtx,img) {
    toCtx.drawImage(img, 1, 1, img.width-2, img.height-2,
        0, 0, img.width-2, img.height-2);
  }

  function drawArray(toCtx,img) {
    var fromImageData = fromXY(img);
    toCtx.putImageData(fromImageData,0,0,0,0,img_width,img_height);
  }

  function drawColorArray(toCtx,img) {
    var fromImageData = fromColorXY(img);
    toCtx.putImageData(fromImageData,0,0,0,0,img_width,img_height);
  }

  function logXY(img) {
    logArea.innerHTML = '';
    for (var k = 0; k < img.length; k++) {
      for (var j = 0; j < img[k].length; j++) {
        var str = '';
        if (img[k][j] === 0) {
          str = '&nbsp;'
        } else if (img[k][j] === 1) {
          str = '.'
        } else if (img[k][j] === -1) {
          str = ','
        }
        logArea.innerHTML += str;
      }
      logArea.innerHTML += '<br>';
    }
  }

  function getData() {
    var code = '';
    var diff = 0, min_diff = Infinity;
    for (var i = 0; i < 4; i++) {
      var res = readNum(parts_array[i]);
      code += res[0];
      diff += Math.log(res[1]);
      min_diff = Math.min(min_diff, Math.log(res[1]));
    }
    if (code.length != split_count)
      throw "ERROR: " + code.length + " character(s) solved, while " + split_count + " character(s) required";
    return {
      code: code,
      min_diff: min_diff,
      diff: diff
    };
  } // 根据特征码识别

  function removeFromArray(img, obj) {
    for(var i = 0; i < img.length; i++) {
      var temp = img[i];
      if (!isNaN(obj))
        temp = i;
      if (temp == obj) {
        for (var j = i; j < img.length; j++)
          img[j] = img[j+1];
        img.length--;
      }
    }
    return img;
  } // 移除数组中元素

  function toXY(img) {
    var result = new Array(img_height);
    var source_pixel = img.data;
    for(var j=0;j<img_height;j++) {
      result[j] = new Array(img_width);
      for(var k=0;k<img_width;k++) {
        var r = source_pixel[4 * (j*img_width+k)];
        var g = source_pixel[4 * (j*img_width+k) + 1];
        var b = source_pixel[4 * (j*img_width+k) + 2];
        result[j][k] = (r+g+b) > 500 ? 0 : 1; // 赋值0、1给内部数组
      }
    }
    return result;
  } // 图像转数组

  function toColorXY(img) {
    var result = new Array(img_height);
    var source_pixel = img.data;
    for (var j = 0; j < img_height; j++) {
      result[j] = new Array(img_width);
      for (var k = 0; k < img_width; k++) {
        var r = source_pixel[4 * (j*img_width+k)];
        var g = source_pixel[4 * (j*img_width+k) + 1];
        var b = source_pixel[4 * (j*img_width+k) + 2];

        result[j][k] = new Array(r, g, b);
      }
    }
    return result;
  } // 图像转数组

  function fromXY(source_array) {
    var img = ctx_original.createImageData(img_width,img_height);
    var source_pixel = img.data;
    for (var j = 0; j < source_array.length; j++) {
      for (var k = 0; k < source_array[j].length; k++) {
        var innergrey = (source_array[j][k]==1?0:255);
        source_pixel[4 * (j*img_width+k)] = innergrey;
        source_pixel[4 * (j*img_width+k) + 1] = innergrey;
        source_pixel[4 * (j*img_width+k) + 2] = innergrey;
        source_pixel[4 * (j*img_width+k) + 3] = 255;
      }
    }
    return img;
  } // 数组转图像

  function fromColorXY(source_array) {
    var img = ctx_original.createImageData(img_width,img_height);
    var source_pixel = img.data;
    for (var j=0;j<source_array.length;j++) {
      for (var k=0;k<source_array[j].length;k++) {
        source_pixel[4 * (j*img_width+k)] = source_array[j][k][0];
        source_pixel[4 * (j*img_width+k) + 1] = source_array[j][k][1];
        source_pixel[4 * (j*img_width+k) + 2] = source_array[j][k][2];
        source_pixel[4 * (j*img_width+k) + 3] = 255;
      }
    }
    return img;
  } // 数组转图像（带颜色）

  function transformSingleChar(img) {
    var ctx3 = newCanvas(img[0].length, img.length);
    var ctx4 = newCanvas(lastWidth, lastHeight);

    img = trimUpDown(img); // 去上下空白
    drawArray(ctx3, img); // 画出单一图像

    img = zoomToFit(img);
    if (img === false) return false;
    img = corrode(img); // 腐蚀
    img = expand(img); // 膨胀
    img = trimUpDown(img); // 去上下空白
    drawArray(ctx4, img); // 画出缩放图像
    return getCode(img); // 生成特征码
  }

  const min_similarity_required = 50;
  const dominance_check_interval = 200;
  const max_dom_list_hold = 50;
  const min_check_index = 2300;
  const start_diff_required = 20;
  var trainlib_char_sum = {};

  function getRevLogDistribution(i, l) {
    return 1 - Math.log(i) / Math.log(l);
  }

  function getDominanceRankWeight(rank) {
    return getRevLogDistribution(rank + 1, max_dom_list_hold);
  }

  function checkDominance(list) {
    if (list.length == 0) return {dom: '', diff: 0};
    if (list.length == 1) return {dom: list[0], diff: 1};
    list.sort((a, b) => b[0] - a[0]);
    list = list.slice(0, max_dom_list_hold);
    var res = {};
    list.forEach(function (x, i) {
      if (x[1] in res) {
        res[x[1]] += getDominanceRankWeight(i) * x[0] / trainlib_char_sum[x[1]];
      } else {
        res[x[1]] = getDominanceRankWeight(i) * x[0] / trainlib_char_sum[x[1]];
      }
    });
    var sortable = [];
    for (var dominance in res)
      sortable.push([dominance, res[dominance]]);
    sortable.sort((a, b) => b[1] - a[1]);
    return {
      dom: sortable[0][0],
      diff: (sortable.length > 1 ? sortable[0][1] / sortable[1][1] : 1),
      sorted_list: sortable
    };
  }

  function readNum(code) {
    var total_trainlib_length = numkeys.length;
    var check_cnt = 0;
    var similarity_list = [];
    for (var i = 0; i < numkeys.length; i++) {
      var current_code = numkeys[i][1];
      var current_char = numkeys[i][0];
      var current_similarity = 0;
      for (var j = 0; j < current_code.length; j++)
        if (current_code[j] == code[j])
          current_similarity++;

      if (current_similarity >= min_similarity_required)
        similarity_list.push(new Array(current_similarity, current_char));
      if (++check_cnt % dominance_check_interval == 0 && check_cnt >= min_check_index) {
        var ans = checkDominance(similarity_list);
        if (ans.diff >= start_diff_required * getRevLogDistribution(check_cnt, total_trainlib_length) + 1) {
          // console.log(ans.sorted_list);
          return [ans.dom, ans.diff];
        }
      }
    }
    checkDominance(similarity_list);
    // console.log(ans.sorted_list);
    return [ans.dom, ans.diff];
  }

  function getDiff(a, b) {
    var ans = 0;
    for (var i = 0; i < 3; i++)
      ans += (b[i] - a[i]) * (b[i] - a[i]);
    return ans;
  }

  function calcAvgColor(pixel) {
    var avg = new Array();
    avg.push(0);
    for (var i = 0; i < pixel[0].length; i++) {
      var avg_r, avg_g, avg_b, cnt = 0;
      for (var j = 0; j < pixel.length; j++) {
        if (pixel[j][i][0] + pixel[j][i][1] + pixel[j][i][2] >= 760) continue;
        cnt++;
        avg_r += pixel[j][i][0];
        avg_g += pixel[j][i][1];
        avg_b += pixel[j][i][2];
      }
      if (cnt) {
        avg_r /= cnt, avg_g /= cnt, avg_b /= cnt;
        var ratio = 170.0 / Math.max(avg_r, avg_g, avg_b);
        avg_r *= ratio, avg_g *= ratio, avg_b *= ratio;
      } else {
        avg_r = avg_g = avg_b = 255;
      }
      pixel[0][i] = new Array(avg_r, avg_g, avg_b);
      // for (var j = 0; j < pixel.length; j++)
      //   pixel[j][i] = new Array(avg_r, avg_g, avg_b);
      if (i == 0) continue;
      var grey = getDiff(pixel[0][i-1], pixel[0][i]);
      avg.push(grey);
    }
    var max_grey = Math.max.apply(null, avg);
    for (var i = 0; i < avg.length; i++)
      avg[i] = (Math.log(1.0 / max_grey * avg[i]) + 10) / 10;
    for (var i = 0; i < pixel[0].length; i++)
      for (var j = 0; j < pixel.length * avg[i] ; j++)
        pixel[j][i] = new Array(0, 0, 0);
    return new Array(pixel, avg);
  }

  function newCanvas(w = img_width, h = img_height) {
    var canvas6 = document.createElement("canvas");
    canvas6.style.backgroundColor = "cornsilk";
    // document.getElementsByTagName("body")[0].appendChild(canvas6);
    canvas6.width = w;
    canvas6.height = h;
    return canvas6.getContext("2d");
  }

  window.solveCAPTCHA = function(source_img) {
    numkeys.forEach(x => x[0] in trainlib_char_sum ? trainlib_char_sum[x[0]]++ : trainlib_char_sum[x[0]] = 1);
    // Remove image border
    img_width = source_img.clientWidth - 2;
    img_height = source_img.clientHeight - 2;
    ctx_original = newCanvas(); ctx_binary = newCanvas(); ctx_color = newCanvas();
    if ($$("#pjw-login-mask-canvas").length)
      drawThis($$("#pjw-login-mask-canvas")[0].getContext("2d"), source_img);
    drawThis(ctx_original, source_img); // Paint original image

    var imgData = ctx_original.getImageData(0, 0, img_width, img_height);//读取图像数据
    var imgColorData = new ImageData(new Uint8ClampedArray(imgData.data), img_width, img_height);

    imgColorData = imageBinaryzationWithColor(imgColorData); //彩色二值化图像数据
    ctx_color.putImageData(imgColorData, 0, 0, 0, 0, img_width, img_height); //画出彩色二值化图
    imgData = imageBinaryzation(imgData); //二值化图像数据
    ctx_binary.putImageData(imgData, 0, 0, 0, 0, img_width, img_height); //画出二值化图

    var pixelArray = toXY(imgData); // Convert image to array
    var pixelColorArray = toColorXY(imgColorData);
    var color_res = calcAvgColor(pixelColorArray);
    drawColorArray(ctx_color, color_res[0]);

    pixelArray = corrode(pixelArray);
    pixelArray = expand(pixelArray);

    var ctx_preview = newCanvas();
    drawArray(ctx_preview, pixelArray);

    parts_array = split(pixelArray, color_res[1]);
    if (parts_array.length < 4) return false;
    for (var c = 0; c < split_count; c++) {
      parts_array[c] = transformSingleChar(parts_array[c]);
      if (parts_array[c] === false) return false;
    }

    try {
      var res = getData();
      var certainty = res.min_diff * 4 + res.diff + reasonable_part_count;
      console.log("Code: " + res.code + " Parts: " + reasonable_part_count + " Centainty: " + certainty);
      return {"code": res.code, "certainty": certainty};
    } catch (e) {
      console.log(e);
      return false;
    }
    return parts_array;
  }
}