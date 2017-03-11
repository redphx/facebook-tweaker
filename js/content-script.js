function overrideRequireJs(b, extensionId) {
  if (b.require) {
    console.error('Cannot override requireJs');
    return;
  }

  var c = {},
    d = {},
    e = {},
    f = {},
    g = 0,
    h = 1,
    i = 2,
    j = 4,
    k = {},
    l = Object.prototype.hasOwnProperty,
    m = Object.prototype.toString;

  function n(ta) {
    var ua = Array.prototype.slice.call(ta),
      va = {},
      wa, xa, ya, za;
    while (ua.length) {
      xa = ua.shift();
      if (va[xa]) continue;
      va[xa] = true;
      ya = c[xa];
      if (!ya || !ya.waiting) continue;
      for (wa = 0; wa < ya.dependencies.length; wa++) {
        za = ya.dependencies[wa];
        if (!c[za] || c[za].waiting) ua.push(za);
      }
    }
    for (xa in va)
      if (l.call(va, xa)) ua.push(xa);
    var ab = [];
    for (wa = 0; wa < ua.length; wa++) {
      xa = ua[wa];
      var bb = xa;
      ya = c[xa];
      if (!ya) {
        bb += ' is not defined';
      } else if (!ya.waiting) {
        bb += ' is ready';
      } else {
        var cb = [];
        for (var db = 0; db < ya.dependencies.length; db++) {
          za = ya.dependencies[db];
          if (!c[za] || c[za].waiting) cb.push(za);
        }
        bb += ' is waiting for ' + cb.join(', ');
      }
      ab.push(bb);
    }
    return ab.join('\n');
  }

  function o(ta) {
    this.name = 'ModuleError';
    this.message = ta;
    this.stack = Error(ta).stack;
    this.framesToPop = 2;
  }
  o.prototype = Object.create(Error.prototype);
  o.prototype.constructor = o;
  var p = (b.Env || {}).profile_require_factories,
    q = b.performance || b.msPerformance || b.webkitPerformance || {},
    r;
  if (q.now && q.timing && q.timing.navigationStart) {
    var s = q.timing.navigationStart;
    r = function ta() {
      return q.now() + s;
    };
  } else r = function ta() {
    return Date.now();
  };
  var t = 0,
    u = 0;

  function v(ta) {
    u++;
    var ua = c[ta];
    if (ua && ua.exports != null) {
      if (ua.refcount-- === 1) c[ta] = void 0;
      return ua.exports;
    }
    return x(ta);
  }

  function w(ta) {
    var ua = c[ta],
      va = d[ta];
    if (ua.factoryLength === -1) {
      var wa = p && b.ProfilingCounters,
        xa, ya;
      if (wa) xa = wa.startTiming('FACTORY_COMPILE_TIME');
      ua.factoryLength = ua.factory.length;
      if (xa != null) {
        ya = wa.stopTiming(xa);
        va.compileTime += ya;
      }
    }
    return ua.factoryLength;
  }

  function x(ta) {
    if (b.ErrorUtils && !b.ErrorUtils.inGuard()) return b.ErrorUtils.applyWithGuard(x, null, [ta]);
    var ua = c[ta];
    if (!ua) {
      var va = 'Requiring unknown module "' + ta + '"';
      throw new o(va);
    }
    if (ua.hasError) throw new o('Requiring module "' + ta + '" which threw an exception');
    if (ua.waiting) throw new o('Requiring module "' + ta + '" with unresolved dependencies: ' + n([ta]));
    var wa = ua.exports = {},
      xa = ua.factory;
    if (m.call(xa) === '[object Function]') {
      var ya = ua.dependencies,
        za = ya.length,
        ab;
      try {
        try {
          la(ua);
        } catch (bb) {
          y(bb, ta);
        }
        var cb = [],
          db = za;
        if (ua.special & i) {
          var eb = w(ta);
          db = Math.min(za, eb);
        }
        for (var fb = 0; fb < za; fb++) {
          var gb = ya[fb];
          if (cb.length < db) cb.push(gb === 'module' ? ua : gb === 'exports' ? wa : v.call(null, gb));
        }++t;
        var hb = p && b.ProfilingCounters,
          ib;
        if (hb) {
          hb.incrementCounter('FACTORY_COUNT', 1);
          ib = hb.startTiming('FACTORY_EXEC_TIME');
        }
        try {
          ab = xa.apply(ua.context || b, cb);
        } catch (bb) {
          y(bb, ta);
        } finally {
          if (p) {
            var jb = r(),
              kb = 0;
            if (ib != null) kb = hb.stopTiming(ib);
            var lb = d[ua.id];
            lb.factoryTime = kb;
            lb.factoryEnd = jb;
            if (xa.__SMmeta)
              for (var mb in xa.__SMmeta)
                if (xa.__SMmeta.hasOwnProperty(mb)) lb[mb] = xa.__SMmeta[mb];
          }
        }
      } catch (bb) {
        ua.hasError = true;
        ua.exports = null;
        throw bb;
      }
      if (ab) ua.exports = ab;
      if (typeof ua.exports === 'function') {
        var nb = ua.exports,
          ob = nb.__superConstructor__;
        if (!nb.displayName || ob && ob.displayName === nb.displayName) nb.displayName = (nb.name || '(anonymous)') + ' [from ' + ta + ']';
      }
      ua.factoryFinished = true;
    } else ua.exports = xa;
    var pb = '__isRequired__' + ta;
    if (e[pb]) ea(pb, k);
    if (ua.refcount-- === 1) c[ta] = void 0;
    return ua.exports;
  }

  function y(ta, ua) {
    if (!(ta instanceof Error)) ta = new Error(ta);
    if (c.ex && c.erx) {
      var va = v.call(null, 'ex'),
        wa = v.call(null, 'erx'),
        xa = wa(ta.message);
      if (xa[0].indexOf(' from module "%s"') < 0) {
        xa[0] += ' from module "%s"';
        xa[xa.length] = ua;
      }
      ta.message = va.apply(null, xa);
    }
    throw ta;
  }

  function z() {
    var ta = 0;
    for (var ua in d)
      if (d.hasOwnProperty(ua)) ta += d[ua].factoryTime;
    return ta;
  }

  function aa() {
    var ta = 0;
    for (var ua in d)
      if (d.hasOwnProperty(ua)) ta += d[ua].compileTime;
    return ta;
  }

  function ba() {
    return t;
  }

  function ca() {
    return u;
  }

  function da() {
    var ta = {};
    for (var ua in d)
      if (d.hasOwnProperty(ua)) ta[ua] = d[ua];
    return ta;
  }

  function ea(ta, ua, va, wa, xa, ya, za) {
    if (ua === undefined) {
      ua = [];
      va = ta;
      ta = ia();
    } else if (va === undefined) {
      va = ua;
      if (m.call(ta) === '[object Array]') {
        ua = ta;
        ta = ia(ua.join(','));
      } else ua = [];
    }
    var ab = {
        cancel: ga.bind(this, ta)
      },
      bb = c[ta];
    if (bb) {
      if (ya) bb.refcount += ya;
      return ab;
    } else if (!ua && !va && ya) {
      f[ta] = (f[ta] || 0) + ya;
      return ab;
    }
    var cb = (f[ta] || 0) + (ya || 0);
    delete f[ta];
    bb = new fa(ta, cb, null, va, ua, xa, wa);
    c[ta] = bb;
    d[ta] = {
      id: ta,
      dependencies: ua,
      meta: za,
      category: wa,
      defined: p ? r() : null,
      compileTime: null,
      factoryTime: null,
      factoryEnd: null
    };
    ka(ta);
    return ab;
  }

  function fa(ta, ua, va, wa, xa, ya, za) {
    this.id = ta;
    this.refcount = ua;
    this.exports = va || null;
    this.factory = wa;
    this.factoryLength = -1;
    this.factoryFinished = false;
    this.dependencies = xa;
    this.context = ya;
    this.special = za || 0;
    this.waitingMap = {};
    this.waiting = 0;
    this.hasError = false;
    this.ranRecursiveSideEffects = false;
    this.sideEffectDependencyException = null;
  }

  function ga(ta) {
    if (!c[ta]) return;
    var ua = c[ta];
    c[ta] = void 0;
    for (var va in ua.waitingMap)
      if (ua.waitingMap[va]) delete e[va][ta];
    for (var wa = 0; wa < ua.dependencies.length; wa++) {
      va = ua.dependencies[wa];
      if (c[va]) {
        if (c[va].refcount-- === 1) ga(va);
      } else if (f[va]) f[va]--;
    }
  }

  function ha(ta, ua, va) {
    return ea('__requireLazy__' + (ta.length > 0 ? ta.join(',') + '__' : '') + g++, ta, sa()(ua, 'requireLazy'), h, va, 1);
  }

  function ia(ta) {
    return '__mod__' + (ta ? ta + '__' : '') + g++;
  }

  function ja(ta, ua) {
    if (!ta.waitingMap[ua] && ta.id !== ua) {
      ta.waiting++;
      ta.waitingMap[ua] = 1;
      e[ua] || (e[ua] = {});
      e[ua][ta.id] = 1;
    }
  }

  function ka(ta) {
    var ua = [],
      va = c[ta],
      wa, xa, ya;
    for (xa = 0; xa < va.dependencies.length; xa++) {
      wa = va.dependencies[xa];
      if (!c[wa]) {
        ja(va, wa);
      } else if (c[wa].waiting)
        for (ya in c[wa].waitingMap)
          if (c[wa].waitingMap[ya]) ja(va, ya);
    }
    if (va.waiting === 0 && va.special & h) ua.push(ta);
    if (e[ta]) {
      var za = e[ta],
        ab;
      e[ta] = undefined;
      for (wa in za) {
        ab = c[wa];
        for (ya in va.waitingMap)
          if (va.waitingMap[ya]) ja(ab, ya);
        if (ab.waitingMap[ta]) {
          ab.waitingMap[ta] = 0;
          ab.waiting--;
        }
        if (ab.waiting === 0 && ab.special & h) ua.push(wa);
      }
    }
    for (xa = 0; xa < ua.length; xa++) v.call(null, ua[xa]);
  }

  function la(ta) {
    if (ta.sideEffectDependencyException) throw ta.sideEffectDependencyException;
    if (ta.ranRecursiveSideEffects) return;
    ta.ranRecursiveSideEffects = true;
    var ua = ta.dependencies;
    if (ua)
      for (var va = 0; va < ua.length; va++) {
        var wa = ua[va],
          xa = c[wa];
        try {
          la(xa);
        } catch (ya) {
          ta.sideEffectDependencyException = ya;
          throw ya;
        }
        if (xa.special & j) try {
          v.call(null, wa);
        } catch (ya) {
          ta.sideEffectDependencyException = ya;
          throw ya;
        }
      }
  }

  function ma(ta, ua) {
    c[ta] = new fa(ta, 0, ua);
    d[ta] = {
      id: ta,
      dependencies: [],
      category: 0,
      compileTime: null,
      factoryLengthAccessTime: null,
      factoryTime: null,
      factoryEnd: null
    };
  }
  ma('module', 0);
  ma('exports', 0);
  ma('define', ea);
  ma('global', b);
  ma('require', v);
  ma('requireDynamic', na);
  ma('requireLazy', ha);
  ma('requireWeak', oa);
  ma('ifRequired', pa);
  ea.amd = {};
  b.define = ea;
  b.require = v;
  b.requireDynamic = na;
  b.requireLazy = ha;

  function na(ta, ua) {
    throw new ReferenceError('requireDynamic is not defined');
  }

  function oa(ta, ua) {
    pa.call(null, ta, function(va) {
      ua(va);
    }, function() {
      ea('__requireWeak__' + ta + '__' + g++, ['__isRequired__' + ta], sa()(function() {
        ua(c[ta].exports);
      }, 'requireWeak'), h, null, 1);
    });
  }

  function pa(ta, ua, va) {
    var wa = c[ta];
    if (wa && wa.factoryFinished) {
      if (typeof ua === 'function') return ua(wa.exports);
    } else if (typeof va === 'function') return va();
  }
  var qa = {
    getModules: function ta() {
      var ua = {};
      for (var va in c)
        if (c[va] && c.hasOwnProperty(va)) ua[va] = c[va];
      return ua;
    },
    modulesMap: c,
    deps: e,
    printDependencyInfo: function ta() {
      if (!b.console) return;
      var ua = Object.keys(qa.deps);
      b.console.log(n(ua));
    },
    debugUnresolvedDependencies: n
  };

  function ra(ta) {
    return ta;
  }

  function sa() {
    return b.TimeSlice && b.TimeSlice.guard || ra;
  }
  ma('__getFactoryTime', z);
  ma('__getCompileTime', aa);
  ma('__getTotalFactories', ba);
  ma('__getTotalRequireCalls', ca);
  ma('__getModuleTimeDetails', da);
  ma('__debug', qa);

  // BEGIN Custom Scripts
  let fbConfigs = {};
  function ServerJSDefine(b, c, d, e, f, g) {
    var h = 2,
      i = new(c('BitMap'))(),
      j = {
        getLoadedModuleHash: function k() {
          return i.toCompressedString();
        },
        handleDefine: function k(name, m, values, o, p) {
          if (!fbConfigs[name]) {
            fbConfigs[name] = {};
          }

          for (let key in values) {
            let v = values[key];

            if (typeof USER_JS_CONFIGS !== 'undefined' && USER_JS_CONFIGS[name] && USER_JS_CONFIGS[name].hasOwnProperty(key)) {
              values[key] = USER_JS_CONFIGS[name][key];
            }

            fbConfigs[name][key] = v;
          }

          i.set(o);
          define(name, m, function q() {
            c('replaceTransportMarkers')(p, values);
            return values;
          }, h);
        },
        handleDefines: function k(l, m) {
          l.forEach(function(n) {
            if (m) n.push(m);
            j.handleDefine.apply(null, n);
          });
        }
      };
    f.exports = j;
  }

  b.sendFbConfigs = function() {
    chrome.runtime.sendMessage(extensionId, {
      cmd: 'manageConfigs',
      fbConfigs: fbConfigs,
    });
  }

  b.__d = function(ta, ua, va, wa) {
    if (ta === 'ServerJSDefine') {
      va = ServerJSDefine;
    }

    var xa = ['global', 'require', 'requireDynamic', 'requireLazy', 'module', 'exports'];
    sa()(function ya() {
      ea(ta, xa.concat(ua), va, wa || i, null, null);
    }, 'define ' + ta, {
      root: true
    })();
  };

  console.log('Overrided RequireJs');
}

function injectScriptTag(scriptContent) {
  let scriptTag = document.createElement('script');
  scriptTag.appendChild(document.createTextNode(scriptContent));
  document.documentElement.appendChild(scriptTag);
}

const extensionId = '"' + chrome.runtime.id + '"';
const injectCode = '(' + overrideRequireJs.toString() + ')(this, ' + extensionId + ')';

injectScriptTag(injectCode);

window.sendFbConfigs = () => {
  injectScriptTag('window.sendFbConfigs()');
}

chrome.storage.local.get('userConfigs', function(data) {
  const userConfigs = data['userConfigs'] || {};
  console.log('USER_CONFIGS', userConfigs);
  const scriptContent = 'window.USER_JS_CONFIGS = ' + JSON.stringify(userConfigs);
  injectScriptTag(scriptContent);
});
