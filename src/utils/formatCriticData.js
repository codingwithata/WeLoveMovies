const lodash = require("lodash");

function formatCriticData(data) {
  if (data) {
    let dataToBe;

    if (Array.isArray(data)) {
      dataToBe = data.map((review) => {
        return Object.entries(review).reduce((accumulator, [key, value]) => {
          return lodash.set(accumulator, key, value);
        }, {});
      });
    } else {
      dataToBe = Object.entries(data).reduce((accumulator, [key, value]) => {
        return lodash.set(accumulator, key, value);
      }, {});
    }

    return dataToBe;
  }

  return data;
}

module.exports = formatCriticData;
