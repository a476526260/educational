import axios from 'axios';

export function fetchPost(url, data) {
  return new Promise(function(resolve, reject) {
    axios
      .post(url, handleData(data))
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function fetchPut(url, data) {
  return new Promise(function(resolve, reject) {
    axios
      .put(url, handleData(data))
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function fetchGet(url, data) {
  return new Promise(function(resolve, reject) {
    axios
      .get(url, {
        params: handleData(data)
      })
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function fetchDel(url, data) {
  return new Promise(function(resolve, reject) {
    axios
      .delete(url, {
        params: handleData(data)
      })
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function handleData(data) {
  let realData = {};
  for (let prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (
        ((typeof data[prop] === 'string' || typeof data[prop] === 'number') &&
          data[prop] !== '') ||
        (data[prop] instanceof Array && data[prop].length > 0)
      ) {
        realData[prop] = data[prop];
      }
    }
  }
  return realData;
}
