import isEmpty from "lodash/isEmpty"
import includes from "lodash/includes"
import { isRgb } from "./image";

export const updateUrl = parameters => {
  let search = '';
  let j = 0;
  let separator = '?';

  Object.keys(parameters).forEach((key) => {

    let value = parameters[key];

    if (value) {

      if (j !== 0) {
        separator = '&';
      }

      search += `${separator}${key}=${value}`;

      j++;
    }
  });

  let newUrl = `${window.location.origin}${window.location.pathname}${search}`

  // prevents pushing same url if function won't change url.
  if (window.location.href !== newUrl) {
    window.history.pushState(null, null, newUrl);
  }
}

export const paramObject = (queryString = window.location.search.substring(1)) => {
  return isEmpty(queryString)
    ? {}
    :  queryString.split('&')
      .map(str => {
        let [key, value] = str.split('=');
        return {[key]: decodeURI(value)};
      })
      .reduce((prev, curr) => Object.assign(prev, curr));
}

export const updateFullUrl = path => window.history.pushState(null, null, `${window.location.origin}${path}`)

export const getSmallImageLink = (url, size, colorspace) => {
  if (!url) return null
  let _size = size === '-small' && includes(url, '/images/') ? '-Small' : size
  let dotIndex = url.lastIndexOf(".");
  let suffix = colorspace === null || isRgb(colorspace) ? '' : ''
  if (dotIndex === -1) return url + suffix + _size;
  else return url.substring(0, dotIndex) + suffix + _size + url.substring(dotIndex);
}