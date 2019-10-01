const _ = require('lodash');

const kEmptyString = 'NAYNAYNAY';

function simplediff() {
  return {
    applyRawPatch(obj, obj2) {
      var allKeys = _.union(_.keys(obj), _.keys(obj2));

      var merged = _.reduce(
        allKeys,
        (res, key) => {
          if (!_.isEqual(obj[key], obj2[key])) {
            if (
              _.isPlainObject(obj[key]) &&
              _.isPlainObject(obj2[key]) &&
              !_.isEmpty(obj[key]) &&
              !_.isEmpty(obj2[key])
            ) {
              res[key] = this.applyRawPatch(obj[key], obj2[key]);
            } else {
              res[key] = _.isUndefined(obj2[key]) ? obj[key] : obj2[key];
            }
          } else {
            res[key] = _.cloneDeep(obj[key]);
          }
          return res;
        },
        {}
      );

      return _.isEmpty(merged) ? null : merged;
    },
    clean(obj) {
      return _.reduce(
        obj,
        (res, e, key) => {
          if (_.isPlainObject(e)) {
            res[key] = this.clean(e);
          } else if (e !== kEmptyString) {
            res[key] = e;
          }

          return res;
        },
        {}
      );
    },
    patch(obj, patch) {
      if (!patch) {
        return _.cloneDeep(obj);
      }

      var patched = this.applyRawPatch(obj, patch);

      return this.clean(patched);
    },
    diff(obj, obj2) {
      var allKeys = _.union(_.keys(obj), _.keys(obj2));

      var patch = _.reduce(
        allKeys,
        (res, key) => {
          if (!_.isEqual(obj[key], obj2[key])) {
            if (
              _.isPlainObject(obj[key]) &&
              _.isPlainObject(obj2[key]) &&
              !_.isEmpty(obj[key]) &&
              !_.isEmpty(obj2[key])
            ) {
              res[key] = this.diff(obj[key], obj2[key]);
            } else {
              res[key] = _.isUndefined(obj2[key]) ? kEmptyString : obj2[key];
            }
          }
          return res;
        },
        {}
      );

      return _.isEmpty(patch) ? null : patch;
    }
  };
}

module.exports = simplediff;

/*
var differ = simplediff()
var testArray = [{
  A: {
    a: 'a',
    b: 'b',
    c: {
      ca: 'ca',
      cb: 'cb'
    }
  },
  B: {
    a: 'a',
    c: {
      cb: 'EKK'
    }
  }
}, {
  A: {
    ar: [1,2,3]
  },
  B: {
    ar: [1,2]
  }
}, {
  A: {
    Aa: [1,2,3]
  },
  B: {
    Aa: [3],
    Bb: {
      Bbb: [1, 2, 3]
    }
  }
}, {
  A: {
    a: 'a',
    b: [1, 2, 3],
    c: 'c'
  },
  B: {
    b: [2],
    e: {
      f: {
        g: {
          h: [1, 2, 3]
        }
      }
    }
  }
}, {
  A: {
    a: ['ka', 'kb'],
    b: {
      ka: 'ka',
      kb: 'kb'
    }
  },
  B: {
    a: ['ka', 'kb', 'kc'],
    b: {
      ka: 'ka',
      kb: 'kb',
      kc: 'kc'
    }
  }
}, {
  A: {
    a: 'a',
    b: {
      bb: 'bb'
    }
  },
  B: {
    a: 'a',
    b: {
      bb: 'bb'
    }
  }
}]

_.forEach(testArray, (test, testKey) => {

  var ABDelta = differ.diff(test.A, test.B)
  var BADelta = differ.diff(test.B, test.A)

  console.log(
    _.isEqual(test.B,
      differ.patch(test.A, ABDelta)
    ),
    'Works?', testKey
  )
  console.log(
    _.isEqual(test.B,
      differ.patch(differ.patch(test.A, ABDelta), ABDelta)
    ),
    'Works Over?', testKey
  )
  console.log(
    _.isEqual(test.A,
      differ.patch(test.B, BADelta)
    ),
    'Works Inverse?', testKey
  )
  console.log(
    _.isEqual(test.A,
      differ.patch(differ.patch(test.B, BADelta), BADelta)
    ),
    'Works Over Reverse?', testKey
  )
})
*/
