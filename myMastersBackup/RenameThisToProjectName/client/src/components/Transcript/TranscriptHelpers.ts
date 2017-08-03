/**
 * Helper class for transcript
 *
 * @author Samprity Kashyap <samprityk2014@gmail.com>
 */
import * as colors from './components/ColorCSSTypes';

/**
 * Formmater for converting timestamps to hms format.
 * @constructor
 * @param {string} d - timestamps
 */
export function secondsToHms (d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? h + (h === 1 ? 'h' : 'h') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? 'm' : 'm') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? 's' : 's') : '';

  return hDisplay + mDisplay + sDisplay;
}
/** Construct a table with table[i] as the length of the longest prefix of the substring 0..i
 * @constructor
 * @param {string[]} searchArr - array of search words
 */
function longestPrefix (searchArr) {
  /* create a table of size equal to the length of `str`
  table[i] will store the prefix of the longest prefix of the substring str[0..i] */
  const table = new Array(searchArr.length);
  let maxPrefix = 0;
  /* the longest prefix of the substring str[0] has length */
  table[0] = 0;

  /* for the substrings the following substrings, we have two cases */
  for (let i = 1; i < searchArr.length; i += 1) {
    /* case 1. the current character doesn't match the last character of the longest prefix */
    while (maxPrefix > 0 && searchArr[i] !== searchArr[maxPrefix]) {
      /* if that is the case, we have to backtrack, and try find a character  that will be equal to the current character
      if we reach 0, then we couldn't find a chracter */
      maxPrefix = table[maxPrefix - 1];
    }
    /* case 2. The last character of the longest prefix matches the current character in `str` */
    if (searchArr[maxPrefix] === searchArr[i]) {
      /* if that is the case, we know that the longest prefix at position i has one more character.
      for example consider `-` be any character not contained in the set [a-c]
      str = abc----abc
      consider `i` to be the last character `c` in `str`
      maxPrefix = will be 2 (the first `c` in `str`)
      maxPrefix now will be 3 */
      maxPrefix += 1;
      /*  so the max prefix for table[9] is 3 */
    }
    table[i] = maxPrefix;
  }

  return table;
}

/** Regex for checking word equivalence
 * Removes punctuations at the beginning and end of  word and converts to lowercase for comparision
 * @constructor
 * @param {string} text1 - first word for comparision
 * @param {string} text2 - second word for comparision
 */
function areTextEqual (text1, text2) {
  text1 = text1.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, '');
  text2 = text2.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, '');

  return (text1.toLowerCase() === text2.toLowerCase());
}

/** Find all the patterns that matches in a given string `str`
 * this algorithm is based on the Knuth–Morris–Pratt algorithm. Its beauty consists in that it performs the matching in O(n)
 * @constructor
 * @param {string[]} searchArr - array of search words
 * @param {Object[]} transcriptObj - array of objects
 */
export function findSearchPhrase (searchArr, transcriptObj) {
  // find the prefix table in O(n)
  const prefixes = longestPrefix(searchArr);
  const matches = [];

  // `j` is the index in `P`
  let j = 0;
  // `i` is the index in `S`
  let i = 0;
  while (i < transcriptObj.length) {
    // Case 1.  S[i] == P[j] so we move to the next index in `S` and `P`
    if (areTextEqual(transcriptObj[i].text, searchArr[j])) {
      i += 1;
      j += 1;
    }
    // Case 2.  `j` is equal to the length of `P`
    // that means that we reached the end of `P` and thus we found a match
    if (j === searchArr.length) {
      matches.push(i - j);
      // Next we have to update `j` because we want to save some time
      // instead of updating to j = 0 , we can jump to the last character of the longest prefix well known so far.
      // j-1 means the last character of `P` because j is actually `P.length`
      // e.g.
      // S =  a b a b d e
      // P = `a b`a b
      // we will jump to `a b` and we will compare d and a in the next iteration
      // a b a b `d` e
      //     a b `a` b
      j = prefixes[j - 1];
    } else if (transcriptObj[i].text !== searchArr[j]) {
      // Case 3.
      // S[i] != P[j] There's a mismatch!
      // if we have found at least a character in common, do the same thing as in case 2
      if (j !== 0) {
        j = prefixes[j - 1];
      } else {
        // otherwise, j = 0, and we can move to the next character S[i+1]
        i += 1;
      }
    }
  }

  return matches;
}

/** Using binary search to find the closest transcriptObj given a timestamps
 * The array is sorted and large, use a binary chop to find the nearest elements
 * @constructor
 * @param {string} time - time
 * @param {Object[]} transcriptObj - array of objects
 */
export function getClosestTimestamp (transcriptObj, time) {
  let lo = -1;
  let hi = transcriptObj.length;
  while (hi - lo > 1) {
    const mid = Math.round((lo + hi) / 2);
    if (Number(transcriptObj[mid].start) <= time) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  lo = lo === -1 ? 0 : lo;
  if (transcriptObj[lo].start === time) {
    hi = lo;
  }

  return [transcriptObj[lo].start, transcriptObj[hi].start];
}

/** Handler for getting css color for a highlight color
 * @constructor
 * @param colour
 */
export function getCSSColor (colour) {
  switch (colour) {
    case colors.RED:
      return colors.RED_CSS;
    case colors.YELLOW:
      return colors.YELLOW_CSS;
    case colors.BLUE:
      return colors.BLUE_CSS;
    case colors.GREEN:
      return colors.GREEN_CSS;
    case colors.PURPLE:
      return colors.PURPLE_CSS;
    default:
      return '';
  }
}

/** Handler for adding or removing a single highlight
 * @constructor
 * @param {Object[]} transcriptObj - array of word objects
 * @param  {Object} colorTimeStamps - colorTimeStamps has startTime and endTime based on whih highlight flags are added to every words
 * @param {string} activeColor - activeColor is the current highlight selected colorTimeStamps
 * @param isAdd - if it is true it means it is an add highlight event, if it is false it means it is a remove highlight event
 */
export function handleSingleColorHighlight (transcriptObj, colorTimeStamps, activeColor, isAdd) {
  /* get transcriptObj timestamp for starttime of  colorTimeStamps*/
  const startTime = getClosestTimestamp(transcriptObj, colorTimeStamps.startTime)[0];
  /* get transcriptObj timestamp for endtime of  colorTimeStamps*/
  const endTime = getClosestTimestamp(transcriptObj, colorTimeStamps.endTime)[1];
  /* get transcriptObj id for startTime*/
  const startId = transcriptObj.filter(obj => obj.start === startTime)[0].id;
  /* get transcriptObj id for endTime*/
  const endId = transcriptObj.filter(obj => obj.end === endTime)[0].id;
  const newTranscriptObj = transcriptObj;
  let i;
  /* adds or removes highlight color flag in transcriptObj based on isAdd*/
  for (i = startId; i <= endId; i += 1) {
    /* if activeColor is not present in the word.colors array then we add a color */
    if (newTranscriptObj[i].colors.indexOf(activeColor) === -1 && isAdd) {
      newTranscriptObj[i].colors.push(activeColor);
      newTranscriptObj[i].colors.sort();
    } else if (newTranscriptObj[i].colors.indexOf(activeColor) !== -1 && !isAdd) {
      const index = newTranscriptObj[i].colors.indexOf(activeColor);
      newTranscriptObj[i].colors.splice(index, 1);
    }
  }

  return newTranscriptObj;
}


/** Handler for adding or removing a single comment
 * @constructor
 * @param {Object[]} transcriptObj - array of word objects
 * @param  {Object} colorTimeStamps - colorTimeStamps has startTime and endTime based on whih comment flags are added to every words
 * @param {string} activeColor - activeColor is the current comment selected colorTimeStamps
 * @param isAdd - if it is true it means it is an add comment event, if it is false it means it is a remove comment event
 */
export function handleSingleComment (transcriptObj, colorTimeStamps, activeColor, isAdd) {

  /* get transcriptObj timestamp for endtime of  colorTimeStamps*/
  const endTime = getClosestTimestamp(transcriptObj, colorTimeStamps.endTime)[1];

  /* get transcriptObj id for endTime*/
  const endId = transcriptObj.filter(obj => obj.end === endTime)[0].id;
  const newTranscriptObj = transcriptObj;

  if (isAdd) {
      newTranscriptObj[endId].isCommentEnd = true;
    } else if (!isAdd) {
      newTranscriptObj[endId].isCommentEnd = false;
    }

  return newTranscriptObj;
}


/** Handler for adding highlight flag for all colors in transcriptObj
 * @constructor
 * @param {Object[]} transcriptObj - array of word objects
 * @param  {Object[]} highlightData - array of color objects
 */
export function addHighLightFlags (transcriptObj, highlightData, commentData) {
  let newTranscriptObj = {};
  /* Add color array to every word */
  newTranscriptObj = transcriptObj.map((obj) => {
    obj.colors = [];
    obj.comments = [];
    obj.isCommentEnd = false;
    obj.showInterval = false;
    return obj;
  });
  let i;
  const colorTimeStamps = { startTime: 0, endTime: 0 };
  /* For every highlightData we use  handleSingleColorHighlight to add flags to words */
  if (highlightData && highlightData.red) {
    for (i = 0; i < highlightData.red.length; i += 1) {
      colorTimeStamps.startTime = highlightData.red[i].start;
      colorTimeStamps.endTime = highlightData.red[i].end;
      newTranscriptObj = handleSingleColorHighlight(transcriptObj, colorTimeStamps, 'red', true);
    }
  }
  if (highlightData && highlightData.yellow) {
    for (i = 0; i < highlightData.yellow.length; i += 1) {
      colorTimeStamps.startTime = highlightData.yellow[i].start;
      colorTimeStamps.endTime = highlightData.yellow[i].end;
      newTranscriptObj = handleSingleColorHighlight(transcriptObj, colorTimeStamps, 'yellow', true);
    }
  }
  if (highlightData && highlightData.blue) {
    for (i = 0; i < highlightData.blue.length; i += 1) {
      colorTimeStamps.startTime = highlightData.blue[i].start;
      colorTimeStamps.endTime = highlightData.blue[i].end;
      newTranscriptObj = handleSingleColorHighlight(transcriptObj, colorTimeStamps, 'blue', true);
    }
  }
  if (highlightData && highlightData.green) {
    for (i = 0; i < highlightData.green.length; i += 1) {
      colorTimeStamps.startTime = highlightData.green[i].start;
      colorTimeStamps.endTime = highlightData.green[i].end;
      newTranscriptObj = handleSingleColorHighlight(transcriptObj, colorTimeStamps, 'green', true);
    }
  }
  if (highlightData && highlightData.purple) {
    for (i = 0; i < highlightData.purple.length; i += 1) {
      colorTimeStamps.startTime = highlightData.purple[i].start;
      colorTimeStamps.endTime = highlightData.purple[i].end;
      newTranscriptObj = handleSingleColorHighlight(transcriptObj, colorTimeStamps, 'purple', true);
    }
  }


  //HS same as above but to add the stuff in commandData as well
  //TODO remove above when no longer showing comments as highlights
    if (commentData && commentData.red) {
      for (i = 0; i < commentData.red.length; i += 1) {
        colorTimeStamps.startTime = commentData.red[i].start;

        /* get transcriptObj timestamp for endtime of  colorTimeStamps*/
        const endTime = getClosestTimestamp(transcriptObj, commentData.red[i].end)[1];

        /* get transcriptObj id for endTime*/
        const endId = transcriptObj.filter(obj => obj.end === endTime)[0].id;


        newTranscriptObj[endId].comments.push({
          _id:     commentData.red[i]._id,
          TimeStamp: commentData.red[i].TimeStamp,
          start:   commentData.red[i].start,
          end:     commentData.red[i].end,
          Color: 'red',
          Text:    commentData.red[i].Text,
          Parent:  commentData.red[i].Parent,
          Replies: commentData.red[i].Replies,
        });

      }
    }


    if (commentData && commentData.yellow) {
      for (i = 0; i < commentData.yellow.length; i += 1) {
        colorTimeStamps.startTime = commentData.yellow[i].start;

        /* get transcriptObj timestamp for endtime of  colorTimeStamps*/
        const endTime = getClosestTimestamp(transcriptObj, commentData.yellow[i].end)[1];

        /* get transcriptObj id for endTime*/
        const endId = transcriptObj.filter(obj => obj.end === endTime)[0].id;


        newTranscriptObj[endId].comments.push({
          _id:     commentData.yellow[i]._id,
          start:   commentData.yellow[i].start,
          end:     commentData.yellow[i].end,
          TimeStamp: commentData.yellow[i].TimeStamp,
          Color: 'yellow',
          Text:    commentData.yellow[i].Text,
          Parent:  commentData.yellow[i].Parent,
          Replies: commentData.yellow[i].Replies,
        });
      }
    }


    if (commentData && commentData.blue) {
      for (i = 0; i < commentData.blue.length; i += 1) {
        colorTimeStamps.startTime = commentData.blue[i].start;

        /* get transcriptObj timestamp for endtime of  colorTimeStamps*/
        const endTime = getClosestTimestamp(transcriptObj, commentData.blue[i].end)[1];

        /* get transcriptObj id for endTime*/
        const endId = transcriptObj.filter(obj => obj.end === endTime)[0].id;


        newTranscriptObj[endId].comments.push({
          _id:     commentData.blue[i]._id,
          start:   commentData.blue[i].start,
          end:     commentData.blue[i].end,
          TimeStamp: commentData.blue[i].TimeStamp,
          Color: 'blue',
          Text:    commentData.blue[i].Text,
          Parent:  commentData.blue[i].Parent,
          Replies: commentData.blue[i].Replies,
        });
      }
    }
    if (commentData && commentData.green) {
      for (i = 0; i < commentData.green.length; i += 1) {
        colorTimeStamps.startTime = commentData.green[i].start;

        /* get transcriptObj timestamp for endtime of  colorTimeStamps*/
        const endTime = getClosestTimestamp(transcriptObj, commentData.green[i].end)[1];

        /* get transcriptObj id for endTime*/
        const endId = transcriptObj.filter(obj => obj.end === endTime)[0].id;


        newTranscriptObj[endId].comments.push({
          _id:     commentData.green[i]._id,
          start:   commentData.green[i].start,
          end:     commentData.green[i].end,
          TimeStamp: commentData.green[i].TimeStamp,
          Color: 'green',
          Text:    commentData.green[i].Text,
          Parent:  commentData.green[i].Parent,
          Replies: commentData.green[i].Replies,
        });
      }
    }

  return newTranscriptObj;
}
/* Creates a div with styles and fonts to check width */
function measureText (pText) {
  let lDiv = document.createElement('div');
  document.body.appendChild(lDiv);
  lDiv.style.fontFamily = 'Arial';
  lDiv.style.fontSize = '13 px';
  lDiv.style.position = 'absolute';
  lDiv.style.left = '-1000px';
  lDiv.style.top = '-1000px';
  lDiv.innerHTML = pText;
  const lResult = {
    width: lDiv.clientWidth,
  };
  document.body.removeChild(lDiv);
  lDiv = null;

  return lResult;
}

/** Checks width using canvas. Using this as response seems better than measureText
 * @constructor
 * @param {sting} text - text to be calculated
 * @param  {string} font - font and style
 */
function getTextWidth (text, font) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);

  return metrics.width;
}
/** Object to populate transcriptArr where each element is a line populated based on current width
 * @constructor
 * @param {Object} activeVideo - main video object passed from activeVideo container
 * @param  {string} width - width of the transcript component
 */
export function transformTranscriptObj (activeVideo, width) {
  /* New array of lines calculated from transcriptObj */
  const transcriptArr = [];
  /* Counter to keep tack of transcriptObj index */
  /* Counter to keep tack of transcriptArr index */
  let gTranscriptObjIndex = 0;
  let gTranscriptArrIndex = 0;
  /* nextLine keeps track of current words plus next word line width  */
  let nextLine = activeVideo.transcriptObj[0].text;
  /* currentLineArr keeps track of current words array */
  let currentLineArr = [];
  while (width !== -1
    && activeVideo.transcriptObj
    && gTranscriptObjIndex < activeVideo.transcriptObj.length) {
    const wordObj = activeVideo.transcriptObj[gTranscriptObjIndex];
    currentLineArr.push(wordObj);
    /* concat nextLine with  gTranscriptObjIndex + 1 word in transcriptObj  */
    if (activeVideo.transcriptObj[gTranscriptObjIndex + 1]) {
      nextLine = nextLine.concat(' ').concat(activeVideo.transcriptObj[gTranscriptObjIndex + 1].text);
    }
    /* Once nextLine width > than passed width we populate transcriptArr width */
    if (getTextWidth(nextLine, '13px Arial') > (width - 80)
      || gTranscriptObjIndex + 1 === activeVideo.transcriptObj.length) {
      const time = gTranscriptArrIndex === 0 ? '0.000' : transcriptArr[gTranscriptArrIndex - 1].endTime;
      const t = {
        startTime: time,
        formattedTime: secondsToHms(time),
        endTime: activeVideo.transcriptObj[gTranscriptObjIndex].end,
        id: gTranscriptArrIndex,
        sentenceArr: currentLineArr,
      };
      /* Check for last obj in transcriptObj */
      if (activeVideo.transcriptObj[gTranscriptObjIndex + 1]) {
        nextLine = activeVideo.transcriptObj[gTranscriptObjIndex + 1].text;
      }
      currentLineArr = [];
      transcriptArr.push(t);
      /* increment gTranscriptArrIndex as we pushed one obj to it */
      gTranscriptArrIndex += 1;
    }
    gTranscriptObjIndex += 1;
  }

  return transcriptArr;
}
