var e = Object.create,
  t = Object.defineProperty,
  n = Object.getOwnPropertyDescriptor,
  r = Object.getOwnPropertyNames,
  i = Object.getPrototypeOf,
  a = Object.prototype.hasOwnProperty,
  o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), (e = null)), t.exports),
  s = (e, i, o, s) => {
    if ((i && typeof i == `object`) || typeof i == `function`)
      for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
        ((d = c[l]), !a.call(e, d) && d !== o && t(e, d, { get: ((e) => i[e]).bind(null, d), enumerable: !(s = n(i, d)) || s.enumerable }))
    return e
  },
  c = (n, r, o) => (
    (o = n == null ? {} : e(i(n))),
    s(r || !n || !n.__esModule || !a.call(n, `default`) ? t(o, `default`, { value: n, enumerable: !0 }) : o, n)
  ),
  l = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.portal`),
      r = Symbol.for(`react.fragment`),
      i = Symbol.for(`react.strict_mode`),
      a = Symbol.for(`react.profiler`),
      o = Symbol.for(`react.consumer`),
      s = Symbol.for(`react.context`),
      c = Symbol.for(`react.forward_ref`),
      l = Symbol.for(`react.suspense`),
      u = Symbol.for(`react.memo`),
      d = Symbol.for(`react.lazy`),
      f = Symbol.for(`react.activity`),
      p = Symbol.iterator
    function m(e) {
      return typeof e != `object` || !e ? null : ((e = (p && e[p]) || e[`@@iterator`]), typeof e == `function` ? e : null)
    }
    var h = {
        isMounted: function () {
          return !1
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      g = Object.assign,
      _ = {}
    function v(e, t, n) {
      ;((this.props = e), (this.context = t), (this.refs = _), (this.updater = n || h))
    }
    ;((v.prototype.isReactComponent = {}),
      (v.prototype.setState = function (e, t) {
        if (typeof e != `object` && typeof e != `function` && e != null)
          throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`)
        this.updater.enqueueSetState(this, e, t, `setState`)
      }),
      (v.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, `forceUpdate`)
      }))
    function y() {}
    y.prototype = v.prototype
    function b(e, t, n) {
      ;((this.props = e), (this.context = t), (this.refs = _), (this.updater = n || h))
    }
    var x = (b.prototype = new y())
    ;((x.constructor = b), g(x, v.prototype), (x.isPureReactComponent = !0))
    var S = Array.isArray
    function C() {}
    var w = { H: null, A: null, T: null, S: null },
      T = Object.prototype.hasOwnProperty
    function E(e, n, r) {
      var i = r.ref
      return { $$typeof: t, type: e, key: n, ref: i === void 0 ? null : i, props: r }
    }
    function ee(e, t) {
      return E(e.type, t, e.props)
    }
    function D(e) {
      return typeof e == `object` && !!e && e.$$typeof === t
    }
    function te(e) {
      var t = { '=': `=0`, ':': `=2` }
      return (
        `$` +
        e.replace(/[=:]/g, function (e) {
          return t[e]
        })
      )
    }
    var O = /\/+/g
    function k(e, t) {
      return typeof e == `object` && e && e.key != null ? te(`` + e.key) : t.toString(36)
    }
    function A(e) {
      switch (e.status) {
        case `fulfilled`:
          return e.value
        case `rejected`:
          throw e.reason
        default:
          switch (
            (typeof e.status == `string`
              ? e.then(C, C)
              : ((e.status = `pending`),
                e.then(
                  function (t) {
                    e.status === `pending` && ((e.status = `fulfilled`), (e.value = t))
                  },
                  function (t) {
                    e.status === `pending` && ((e.status = `rejected`), (e.reason = t))
                  },
                )),
            e.status)
          ) {
            case `fulfilled`:
              return e.value
            case `rejected`:
              throw e.reason
          }
      }
      throw e
    }
    function j(e, r, i, a, o) {
      var s = typeof e
      ;(s === `undefined` || s === `boolean`) && (e = null)
      var c = !1
      if (e === null) c = !0
      else
        switch (s) {
          case `bigint`:
          case `string`:
          case `number`:
            c = !0
            break
          case `object`:
            switch (e.$$typeof) {
              case t:
              case n:
                c = !0
                break
              case d:
                return ((c = e._init), j(c(e._payload), r, i, a, o))
            }
        }
      if (c)
        return (
          (o = o(e)),
          (c = a === `` ? `.` + k(e, 0) : a),
          S(o)
            ? ((i = ``),
              c != null && (i = c.replace(O, `$&/`) + `/`),
              j(o, r, i, ``, function (e) {
                return e
              }))
            : o != null &&
              (D(o) && (o = ee(o, i + (o.key == null || (e && e.key === o.key) ? `` : (`` + o.key).replace(O, `$&/`) + `/`) + c)),
              r.push(o)),
          1
        )
      c = 0
      var l = a === `` ? `.` : a + `:`
      if (S(e)) for (var u = 0; u < e.length; u++) ((a = e[u]), (s = l + k(a, u)), (c += j(a, r, i, s, o)))
      else if (((u = m(e)), typeof u == `function`))
        for (e = u.call(e), u = 0; !(a = e.next()).done;) ((a = a.value), (s = l + k(a, u++)), (c += j(a, r, i, s, o)))
      else if (s === `object`) {
        if (typeof e.then == `function`) return j(A(e), r, i, a, o)
        throw (
          (r = String(e)),
          Error(
            `Objects are not valid as a React child (found: ` +
              (r === `[object Object]` ? `object with keys {` + Object.keys(e).join(`, `) + `}` : r) +
              `). If you meant to render a collection of children, use an array instead.`,
          )
        )
      }
      return c
    }
    function M(e, t, n) {
      if (e == null) return e
      var r = [],
        i = 0
      return (
        j(e, r, ``, ``, function (e) {
          return t.call(n, e, i++)
        }),
        r
      )
    }
    function ne(e) {
      if (e._status === -1) {
        var t = e._result
        ;((t = t()),
          t.then(
            function (t) {
              ;(e._status === 0 || e._status === -1) && ((e._status = 1), (e._result = t))
            },
            function (t) {
              ;(e._status === 0 || e._status === -1) && ((e._status = 2), (e._result = t))
            },
          ),
          e._status === -1 && ((e._status = 0), (e._result = t)))
      }
      if (e._status === 1) return e._result.default
      throw e._result
    }
    var N =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (typeof window == `object` && typeof window.ErrorEvent == `function`) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message: typeof e == `object` && e && typeof e.message == `string` ? String(e.message) : String(e),
                  error: e,
                })
                if (!window.dispatchEvent(t)) return
              } else if (typeof process == `object` && typeof process.emit == `function`) {
                process.emit(`uncaughtException`, e)
                return
              }
              console.error(e)
            },
      re = {
        map: M,
        forEach: function (e, t, n) {
          M(
            e,
            function () {
              t.apply(this, arguments)
            },
            n,
          )
        },
        count: function (e) {
          var t = 0
          return (
            M(e, function () {
              t++
            }),
            t
          )
        },
        toArray: function (e) {
          return (
            M(e, function (e) {
              return e
            }) || []
          )
        },
        only: function (e) {
          if (!D(e)) throw Error(`React.Children.only expected to receive a single React element child.`)
          return e
        },
      }
    ;((e.Activity = f),
      (e.Children = re),
      (e.Component = v),
      (e.Fragment = r),
      (e.Profiler = a),
      (e.PureComponent = b),
      (e.StrictMode = i),
      (e.Suspense = l),
      (e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w),
      (e.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (e) {
          return w.H.useMemoCache(e)
        },
      }),
      (e.cache = function (e) {
        return function () {
          return e.apply(null, arguments)
        }
      }),
      (e.cacheSignal = function () {
        return null
      }),
      (e.cloneElement = function (e, t, n) {
        if (e == null) throw Error(`The argument must be a React element, but you passed ` + e + `.`)
        var r = g({}, e.props),
          i = e.key
        if (t != null)
          for (a in (t.key !== void 0 && (i = `` + t.key), t))
            !T.call(t, a) || a === `key` || a === `__self` || a === `__source` || (a === `ref` && t.ref === void 0) || (r[a] = t[a])
        var a = arguments.length - 2
        if (a === 1) r.children = n
        else if (1 < a) {
          for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2]
          r.children = o
        }
        return E(e.type, i, r)
      }),
      (e.createContext = function (e) {
        return (
          (e = { $$typeof: s, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null }),
          (e.Provider = e),
          (e.Consumer = { $$typeof: o, _context: e }),
          e
        )
      }),
      (e.createElement = function (e, t, n) {
        var r,
          i = {},
          a = null
        if (t != null)
          for (r in (t.key !== void 0 && (a = `` + t.key), t))
            T.call(t, r) && r !== `key` && r !== `__self` && r !== `__source` && (i[r] = t[r])
        var o = arguments.length - 2
        if (o === 1) i.children = n
        else if (1 < o) {
          for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2]
          i.children = s
        }
        if (e && e.defaultProps) for (r in ((o = e.defaultProps), o)) i[r] === void 0 && (i[r] = o[r])
        return E(e, a, i)
      }),
      (e.createRef = function () {
        return { current: null }
      }),
      (e.forwardRef = function (e) {
        return { $$typeof: c, render: e }
      }),
      (e.isValidElement = D),
      (e.lazy = function (e) {
        return { $$typeof: d, _payload: { _status: -1, _result: e }, _init: ne }
      }),
      (e.memo = function (e, t) {
        return { $$typeof: u, type: e, compare: t === void 0 ? null : t }
      }),
      (e.startTransition = function (e) {
        var t = w.T,
          n = {}
        w.T = n
        try {
          var r = e(),
            i = w.S
          ;(i !== null && i(n, r), typeof r == `object` && r && typeof r.then == `function` && r.then(C, N))
        } catch (e) {
          N(e)
        } finally {
          ;(t !== null && n.types !== null && (t.types = n.types), (w.T = t))
        }
      }),
      (e.unstable_useCacheRefresh = function () {
        return w.H.useCacheRefresh()
      }),
      (e.use = function (e) {
        return w.H.use(e)
      }),
      (e.useActionState = function (e, t, n) {
        return w.H.useActionState(e, t, n)
      }),
      (e.useCallback = function (e, t) {
        return w.H.useCallback(e, t)
      }),
      (e.useContext = function (e) {
        return w.H.useContext(e)
      }),
      (e.useDebugValue = function () {}),
      (e.useDeferredValue = function (e, t) {
        return w.H.useDeferredValue(e, t)
      }),
      (e.useEffect = function (e, t) {
        return w.H.useEffect(e, t)
      }),
      (e.useEffectEvent = function (e) {
        return w.H.useEffectEvent(e)
      }),
      (e.useId = function () {
        return w.H.useId()
      }),
      (e.useImperativeHandle = function (e, t, n) {
        return w.H.useImperativeHandle(e, t, n)
      }),
      (e.useInsertionEffect = function (e, t) {
        return w.H.useInsertionEffect(e, t)
      }),
      (e.useLayoutEffect = function (e, t) {
        return w.H.useLayoutEffect(e, t)
      }),
      (e.useMemo = function (e, t) {
        return w.H.useMemo(e, t)
      }),
      (e.useOptimistic = function (e, t) {
        return w.H.useOptimistic(e, t)
      }),
      (e.useReducer = function (e, t, n) {
        return w.H.useReducer(e, t, n)
      }),
      (e.useRef = function (e) {
        return w.H.useRef(e)
      }),
      (e.useState = function (e) {
        return w.H.useState(e)
      }),
      (e.useSyncExternalStore = function (e, t, n) {
        return w.H.useSyncExternalStore(e, t, n)
      }),
      (e.useTransition = function () {
        return w.H.useTransition()
      }),
      (e.version = `19.2.8`))
  }),
  u = o((e, t) => {
    t.exports = l()
  }),
  d = o((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.fragment`)
    function r(e, n, r) {
      var i = null
      if ((r !== void 0 && (i = `` + r), n.key !== void 0 && (i = `` + n.key), `key` in n))
        for (var a in ((r = {}), n)) a !== `key` && (r[a] = n[a])
      else r = n
      return ((n = r.ref), { $$typeof: t, type: e, key: i, ref: n === void 0 ? null : n, props: r })
    }
    ;((e.Fragment = n), (e.jsx = r), (e.jsxs = r))
  }),
  f = o((e, t) => {
    t.exports = d()
  }),
  p = c(u(), 1),
  m = f(),
  h = p.createContext(void 0),
  g = (e) => {
    let t = p.useContext(h)
    if (e) return e
    if (!t) throw Error(`No QueryClient set, use QueryClientProvider to set one`)
    return t
  },
  _ = ({ client: e, children: t }) => (
    p.useEffect(
      () => (
        e.mount(),
        () => {
          e.unmount()
        }
      ),
      [e],
    ),
    (0, m.jsx)(h.Provider, { value: e, children: t })
  ),
  v = {
    setTimeout: (e, t) => setTimeout(e, t),
    clearTimeout: (e) => clearTimeout(e),
    setInterval: (e, t) => setInterval(e, t),
    clearInterval: (e) => clearInterval(e),
  },
  y = new (class {
    #e = v
    setTimeoutProvider(e) {
      this.#e = e
    }
    setTimeout(e, t) {
      return this.#e.setTimeout(e, t)
    }
    clearTimeout(e) {
      this.#e.clearTimeout(e)
    }
    setInterval(e, t) {
      return this.#e.setInterval(e, t)
    }
    clearInterval(e) {
      this.#e.clearInterval(e)
    }
  })()
function b(e) {
  setTimeout(e, 0)
}
var x = typeof window > `u` || `Deno` in globalThis
function S() {}
function C(e, t) {
  return typeof e == `function` ? e(t) : e
}
function w(e) {
  return typeof e == `number` && e >= 0 && e !== 1 / 0
}
function T(e, t) {
  return Math.max(e + (t || 0) - Date.now(), 0)
}
function E(e, t) {
  return typeof e == `function` ? e(t) : e
}
function ee(e, t) {
  let { type: n = `all`, exact: r, fetchStatus: i, predicate: a, queryKey: o, stale: s } = e
  if (o) {
    if (r) {
      if (t.queryHash !== te(o, t.options)) return !1
    } else if (!k(t.queryKey, o)) return !1
  }
  if (n !== `all`) {
    let e = t.isActive()
    if ((n === `active` && !e) || (n === `inactive` && e)) return !1
  }
  return !((typeof s == `boolean` && t.isStale() !== s) || (i && i !== t.state.fetchStatus) || (a && !a(t)))
}
function D(e, t) {
  let { exact: n, status: r, predicate: i, mutationKey: a } = e
  if (a) {
    if (!t.options.mutationKey) return !1
    if (n) {
      if (O(t.options.mutationKey) !== O(a)) return !1
    } else if (!k(t.options.mutationKey, a)) return !1
  }
  return !((r && t.state.status !== r) || (i && !i(t)))
}
function te(e, t) {
  return (t?.queryKeyHashFn || O)(e)
}
function O(e) {
  return JSON.stringify(e, (e, t) =>
    N(t)
      ? Object.keys(t)
          .sort()
          .reduce((e, n) => ((e[n] = t[n]), e), {})
      : t,
  )
}
function k(e, t) {
  if (e === t) return !0
  if (typeof e != typeof t) return !1
  if (e && t && typeof e == `object` && typeof t == `object`) {
    if (Array.isArray(e) && Array.isArray(t)) {
      if (t.length > e.length) return !1
      for (let n = 0; n < t.length; n++) if (!k(e[n], t[n])) return !1
      return !0
    }
    let n = Object.keys(t)
    for (let r of n) if (!k(e[r], t[r])) return !1
    return !0
  }
  return !1
}
var A = Object.prototype.hasOwnProperty
function j(e, t, n = 0) {
  if (e === t) return e
  if (n > 500) return t
  let r = ne(e) && ne(t)
  if (!r && !(N(e) && N(t))) return t
  let i = (r ? e : Object.keys(e)).length,
    a = r ? t : Object.keys(t),
    o = a.length,
    s = r ? Array(o) : {},
    c = 0
  for (let l = 0; l < o; l++) {
    let o = r ? l : a[l],
      u = e[o],
      d = t[o]
    if (u === d) {
      ;((s[o] = u), (r ? l < i : A.call(e, o)) && c++)
      continue
    }
    if (u === null || d === null || typeof u != `object` || typeof d != `object`) {
      s[o] = d
      continue
    }
    let f = j(u, d, n + 1)
    ;((s[o] = f), f === u && c++)
  }
  return i === o && c === i ? e : s
}
function M(e, t) {
  if (!t || Object.keys(e).length !== Object.keys(t).length) return !1
  for (let n in e) if (e[n] !== t[n]) return !1
  return !0
}
function ne(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length
}
function N(e) {
  if (!re(e)) return !1
  let t = Object.getPrototypeOf(e),
    n = t?.constructor
  if (n === void 0) return !0
  if (typeof n != `function`) return !1
  let r = n.prototype
  return !(!re(r) || !r.hasOwnProperty(`isPrototypeOf`) || t !== Object.prototype)
}
function re(e) {
  return Object.prototype.toString.call(e) === `[object Object]`
}
function ie(e) {
  return new Promise((t) => {
    y.setTimeout(t, e)
  })
}
function ae(e, t, n) {
  return typeof n.structuralSharing == `function` ? n.structuralSharing(e, t) : n.structuralSharing === !1 ? t : j(e, t)
}
function oe(e) {
  return e
}
function P(e, t, n = 0) {
  let r = [...e, t]
  return n && r.length > n ? r.slice(1) : r
}
function F(e, t, n = 0) {
  let r = [t, ...e]
  return n && r.length > n ? r.slice(0, -1) : r
}
var I = Symbol()
function se(e, t) {
  return !e.queryFn && t?.initialPromise
    ? () => t.initialPromise
    : !e.queryFn || e.queryFn === I
      ? () => Promise.reject(Error(`Missing queryFn: '${e.queryHash}'`))
      : e.queryFn
}
function L(e, t) {
  return typeof e == `function` ? e(...t) : !!e
}
function ce(e, t, n) {
  let r = !1,
    i
  return (
    Object.defineProperty(e, 'signal', {
      enumerable: !0,
      get: () => ((i ??= t()), r ? i : ((r = !0), i.aborted ? n() : i.addEventListener(`abort`, n, { once: !0 }), i)),
    }),
    e
  )
}
var le = () => x,
  R = () => le(),
  ue = class {
    constructor() {
      ;((this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this)))
    }
    subscribe(e) {
      return (
        this.listeners.add(e),
        this.onSubscribe(),
        () => {
          ;(this.listeners.delete(e), this.onUnsubscribe())
        }
      )
    }
    hasListeners() {
      return this.listeners.size > 0
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  de = new (class extends ue {
    #e
    #t
    #n
    constructor() {
      ;(super(),
        (this.#n = (e) => {
          if (typeof window < `u` && window.addEventListener) {
            let t = () => e()
            return (
              window.addEventListener(`visibilitychange`, t, !1),
              () => {
                window.removeEventListener(`visibilitychange`, t)
              }
            )
          }
        }))
    }
    onSubscribe() {
      this.#t || this.setEventListener(this.#n)
    }
    onUnsubscribe() {
      this.hasListeners() || (this.#t?.(), (this.#t = void 0))
    }
    setEventListener(e) {
      ;((this.#n = e),
        this.#t?.(),
        (this.#t = e((e) => {
          typeof e == `boolean` ? this.setFocused(e) : this.onFocus()
        })))
    }
    setFocused(e) {
      this.#e !== e && ((this.#e = e), this.onFocus())
    }
    onFocus() {
      let e = this.isFocused()
      this.listeners.forEach((t) => {
        t(e)
      })
    }
    isFocused() {
      return typeof this.#e == `boolean` ? this.#e : globalThis.document?.visibilityState !== `hidden`
    }
  })(),
  fe = b
function pe() {
  let e = [],
    t = 0,
    n = (e) => {
      e()
    },
    r = (e) => {
      e()
    },
    i = fe,
    a = (r) => {
      t
        ? e.push(r)
        : i(() => {
            n(r)
          })
    },
    o = () => {
      let t = e
      ;((e = []),
        t.length &&
          i(() => {
            r(() => {
              t.forEach((e) => {
                n(e)
              })
            })
          }))
    }
  return {
    batch: (e) => {
      let n
      t++
      try {
        n = e()
      } finally {
        ;(t--, t || o())
      }
      return n
    },
    batchCalls:
      (e) =>
      (...t) => {
        a(() => {
          e(...t)
        })
      },
    schedule: a,
    setNotifyFunction: (e) => {
      n = e
    },
    setBatchNotifyFunction: (e) => {
      r = e
    },
    setScheduler: (e) => {
      i = e
    },
  }
}
var me = pe(),
  he = new (class extends ue {
    #e = !0
    #t
    #n
    constructor() {
      ;(super(),
        (this.#n = (e) => {
          if (typeof window < `u` && window.addEventListener) {
            let t = () => e(!0),
              n = () => e(!1)
            return (
              window.addEventListener(`online`, t, !1),
              window.addEventListener(`offline`, n, !1),
              () => {
                ;(window.removeEventListener(`online`, t), window.removeEventListener(`offline`, n))
              }
            )
          }
        }))
    }
    onSubscribe() {
      this.#t || this.setEventListener(this.#n)
    }
    onUnsubscribe() {
      this.hasListeners() || (this.#t?.(), (this.#t = void 0))
    }
    setEventListener(e) {
      ;((this.#n = e), this.#t?.(), (this.#t = e(this.setOnline.bind(this))))
    }
    setOnline(e) {
      this.#e !== e &&
        ((this.#e = e),
        this.listeners.forEach((t) => {
          t(e)
        }))
    }
    isOnline() {
      return this.#e
    }
  })()
function ge(e) {
  return Math.min(1e3 * 2 ** e, 3e4)
}
function _e(e) {
  return (e ?? `online`) !== `online` || he.isOnline()
}
var ve = class extends Error {
  constructor(e) {
    ;(super(`CancelledError`), (this.revert = e?.revert), (this.silent = e?.silent))
  }
}
function ye(e) {
  let t = !1,
    n = 0,
    r,
    i = `pending`,
    a,
    o,
    s = new Promise((e, t) => {
      ;((a = e), (o = t))
    })
  s.catch(S)
  let c = () => i !== `pending`,
    l = (t) => {
      if (!c()) {
        let n = new ve(t)
        ;(h(n), e.onCancel?.(n))
      }
    },
    u = () => {
      t = !0
    },
    d = () => {
      t = !1
    },
    f = () => de.isFocused() && (e.networkMode === `always` || he.isOnline()) && e.canRun(),
    p = () => _e(e.networkMode) && e.canRun(),
    m = (e) => {
      c() || (r?.(), (i = `resolved`), a(e))
    },
    h = (e) => {
      c() || (r?.(), (i = `rejected`), o(e))
    },
    g = () =>
      new Promise((t) => {
        ;((r = (e) => {
          ;(c() || f()) && t(e)
        }),
          e.onPause?.())
      }).then(() => {
        ;((r = void 0), c() || e.onContinue?.())
      }),
    _ = () => {
      if (c()) return
      let r,
        i = n === 0 ? e.initialPromise : void 0
      try {
        r = i ?? e.fn()
      } catch (e) {
        r = Promise.reject(e)
      }
      Promise.resolve(r)
        .then(m)
        .catch((r) => {
          if (c()) return
          let i = e.retry ?? (R() ? 0 : 3),
            a = e.retryDelay ?? ge,
            o = typeof a == `function` ? a(n, r) : a,
            s = i === !0 || (typeof i == `number` && n < i) || (typeof i == `function` && i(n, r))
          if (t || !s) {
            h(r)
            return
          }
          ;(n++,
            e.onFail?.(n, r),
            ie(o)
              .then(() => (f() ? void 0 : g()))
              .then(() => {
                t ? h(r) : _()
              }))
        })
    }
  return {
    promise: s,
    status: () => i,
    cancel: l,
    continue: () => (r?.(), s),
    cancelRetry: u,
    continueRetry: d,
    canStart: p,
    start: () => (p() ? _() : g().then(_), s),
  }
}
var be = class {
  #e
  destroy() {
    this.clearGcTimeout()
  }
  scheduleGc() {
    ;(this.clearGcTimeout(),
      w(this.gcTime) &&
        (this.#e = y.setTimeout(() => {
          this.optionalRemove()
        }, this.gcTime)))
  }
  updateGcTime(e) {
    this.gcTime = Math.max(this.gcTime || 0, e ?? (R() ? 1 / 0 : 3e5))
  }
  clearGcTimeout() {
    this.#e !== void 0 && (y.clearTimeout(this.#e), (this.#e = void 0))
  }
}
function xe(e) {
  var t,
    n,
    r = ``
  if (typeof e == `string` || typeof e == `number`) r += e
  else if (typeof e == `object`) {
    if (Array.isArray(e)) {
      var i = e.length
      for (t = 0; t < i; t++) e[t] && (n = xe(e[t])) && (r && (r += ` `), (r += n))
    } else for (n in e) e[n] && (r && (r += ` `), (r += n))
  }
  return r
}
function Se() {
  for (var e, t, n = 0, r = ``, i = arguments.length; n < i; n++) (e = arguments[n]) && (t = xe(e)) && (r && (r += ` `), (r += t))
  return r
}
var Ce = (e, t) => {
    let n = Array(e.length + t.length)
    for (let t = 0; t < e.length; t++) n[t] = e[t]
    for (let r = 0; r < t.length; r++) n[e.length + r] = t[r]
    return n
  },
  we = (e, t) => ({ classGroupId: e, validator: t }),
  Te = (e = new Map(), t = null, n) => ({ nextPart: e, validators: t, classGroupId: n }),
  Ee = `-`,
  De = [],
  Oe = `arbitrary..`,
  ke = (e) => {
    let t = Me(e),
      { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e
    return {
      getClassGroupId: (e) => {
        if (e.startsWith(`[`) && e.endsWith(`]`)) return je(e)
        let n = e.split(Ee)
        return Ae(n, +(n[0] === `` && n.length > 1), t)
      },
      getConflictingClassGroupIds: (e, t) => {
        if (t) {
          let t = r[e],
            i = n[e]
          return t ? (i ? Ce(i, t) : t) : i || De
        }
        return n[e] || De
      },
    }
  },
  Ae = (e, t, n) => {
    if (e.length - t === 0) return n.classGroupId
    let r = e[t],
      i = n.nextPart.get(r)
    if (i) {
      let n = Ae(e, t + 1, i)
      if (n) return n
    }
    let a = n.validators
    if (a === null) return
    let o = t === 0 ? e.join(Ee) : e.slice(t).join(Ee),
      s = a.length
    for (let e = 0; e < s; e++) {
      let t = a[e]
      if (t.validator(o)) return t.classGroupId
    }
  },
  je = (e) =>
    e.slice(1, -1).indexOf(`:`) === -1
      ? void 0
      : (() => {
          let t = e.slice(1, -1),
            n = t.indexOf(`:`),
            r = t.slice(0, n)
          return r ? Oe + r : void 0
        })(),
  Me = (e) => {
    let { theme: t, classGroups: n } = e
    return Ne(n, t)
  },
  Ne = (e, t) => {
    let n = Te()
    for (let r in e) {
      let i = e[r]
      Pe(i, n, r, t)
    }
    return n
  },
  Pe = (e, t, n, r) => {
    let i = e.length
    for (let a = 0; a < i; a++) {
      let i = e[a]
      Fe(i, t, n, r)
    }
  },
  Fe = (e, t, n, r) => {
    if (typeof e == `string`) {
      Ie(e, t, n)
      return
    }
    if (typeof e == `function`) {
      Le(e, t, n, r)
      return
    }
    Re(e, t, n, r)
  },
  Ie = (e, t, n) => {
    let r = e === `` ? t : ze(t, e)
    r.classGroupId = n
  },
  Le = (e, t, n, r) => {
    if (Be(e)) {
      Pe(e(r), t, n, r)
      return
    }
    ;(t.validators === null && (t.validators = []), t.validators.push(we(n, e)))
  },
  Re = (e, t, n, r) => {
    let i = Object.entries(e),
      a = i.length
    for (let e = 0; e < a; e++) {
      let [a, o] = i[e]
      Pe(o, ze(t, a), n, r)
    }
  },
  ze = (e, t) => {
    let n = e,
      r = t.split(Ee),
      i = r.length
    for (let e = 0; e < i; e++) {
      let t = r[e],
        i = n.nextPart.get(t)
      ;(i || ((i = Te()), n.nextPart.set(t, i)), (n = i))
    }
    return n
  },
  Be = (e) => `isThemeGetter` in e && e.isThemeGetter === !0,
  Ve = (e) => {
    if (e < 1) return { get: () => void 0, set: () => {} }
    let t = 0,
      n = Object.create(null),
      r = Object.create(null),
      i = (i, a) => {
        ;((n[i] = a), t++, t > e && ((t = 0), (r = n), (n = Object.create(null))))
      }
    return {
      get(e) {
        let t = n[e]
        if (t !== void 0) return t
        if ((t = r[e]) !== void 0) return (i(e, t), t)
      },
      set(e, t) {
        e in n ? (n[e] = t) : i(e, t)
      },
    }
  },
  He = `!`,
  Ue = `:`,
  We = [],
  Ge = (e, t, n, r, i) => ({ modifiers: e, hasImportantModifier: t, baseClassName: n, maybePostfixModifierPosition: r, isExternal: i }),
  Ke = (e) => {
    let { prefix: t, experimentalParseClassName: n } = e,
      r = (e) => {
        let t = [],
          n = 0,
          r = 0,
          i = 0,
          a,
          o = e.length
        for (let s = 0; s < o; s++) {
          let o = e[s]
          if (n === 0 && r === 0) {
            if (o === Ue) {
              ;(t.push(e.slice(i, s)), (i = s + 1))
              continue
            }
            if (o === `/`) {
              a = s
              continue
            }
          }
          o === `[` ? n++ : o === `]` ? n-- : o === `(` ? r++ : o === `)` && r--
        }
        let s = t.length === 0 ? e : e.slice(i),
          c = s,
          l = !1
        s.endsWith(He) ? ((c = s.slice(0, -1)), (l = !0)) : s.startsWith(He) && ((c = s.slice(1)), (l = !0))
        let u = a && a > i ? a - i : void 0
        return Ge(t, l, c, u)
      }
    if (t) {
      let e = t + Ue,
        n = r
      r = (t) => (t.startsWith(e) ? n(t.slice(e.length)) : Ge(We, !1, t, void 0, !0))
    }
    if (n) {
      let e = r
      r = (t) => n({ className: t, parseClassName: e })
    }
    return r
  },
  qe = (e) => {
    let t = new Map()
    return (
      e.orderSensitiveModifiers.forEach((e, n) => {
        t.set(e, 1e6 + n)
      }),
      (e) => {
        let n = [],
          r = []
        for (let i = 0; i < e.length; i++) {
          let a = e[i],
            o = a[0] === `[`,
            s = t.has(a)
          o || s ? (r.length > 0 && (r.sort(), n.push(...r), (r = [])), n.push(a)) : r.push(a)
        }
        return (r.length > 0 && (r.sort(), n.push(...r)), n)
      }
    )
  },
  Je = (e) => ({ cache: Ve(e.cacheSize), parseClassName: Ke(e), sortModifiers: qe(e), postfixLookupClassGroupIds: Ye(e), ...ke(e) }),
  Ye = (e) => {
    let t = Object.create(null),
      n = e.postfixLookupClassGroups
    if (n) for (let e = 0; e < n.length; e++) t[n[e]] = !0
    return t
  },
  Xe = /\s+/,
  Ze = (e, t) => {
    let { parseClassName: n, getClassGroupId: r, getConflictingClassGroupIds: i, sortModifiers: a, postfixLookupClassGroupIds: o } = t,
      s = [],
      c = e.trim().split(Xe),
      l = ``
    for (let e = c.length - 1; e >= 0; --e) {
      let t = c[e],
        { isExternal: u, modifiers: d, hasImportantModifier: f, baseClassName: p, maybePostfixModifierPosition: m } = n(t)
      if (u) {
        l = t + (l.length > 0 ? ` ` + l : l)
        continue
      }
      let h = !!m,
        g
      if (h) {
        g = r(p.substring(0, m))
        let e = g && o[g] ? r(p) : void 0
        e && e !== g && ((g = e), (h = !1))
      } else g = r(p)
      if (!g) {
        if (!h) {
          l = t + (l.length > 0 ? ` ` + l : l)
          continue
        }
        if (((g = r(p)), !g)) {
          l = t + (l.length > 0 ? ` ` + l : l)
          continue
        }
        h = !1
      }
      let _ = d.length === 0 ? `` : d.length === 1 ? d[0] : a(d).join(`:`),
        v = f ? _ + He : _,
        y = v + g
      if (s.indexOf(y) > -1) continue
      s.push(y)
      let b = i(g, h)
      for (let e = 0; e < b.length; ++e) {
        let t = b[e]
        s.push(v + t)
      }
      l = t + (l.length > 0 ? ` ` + l : l)
    }
    return l
  },
  Qe = (...e) => {
    let t = 0,
      n,
      r,
      i = ``
    for (; t < e.length;) (n = e[t++]) && (r = $e(n)) && (i && (i += ` `), (i += r))
    return i
  },
  $e = (e) => {
    if (typeof e == `string`) return e
    let t,
      n = ``
    for (let r = 0; r < e.length; r++) e[r] && (t = $e(e[r])) && (n && (n += ` `), (n += t))
    return n
  },
  et = (e, ...t) => {
    let n,
      r,
      i,
      a,
      o = (o) => ((n = Je(t.reduce((e, t) => t(e), e()))), (r = n.cache.get), (i = n.cache.set), (a = s), s(o)),
      s = (e) => {
        let t = r(e)
        if (t) return t
        let a = Ze(e, n)
        return (i(e, a), a)
      }
    return ((a = o), (...e) => a(Qe(...e)))
  },
  tt = [],
  z = (e) => {
    let t = (t) => t[e] || tt
    return ((t.isThemeGetter = !0), (t.themeKey = e), t)
  },
  nt = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  rt = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  it = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
  at = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  ot = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  st = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/,
  ct = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  lt = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  B = (e) => it.test(e),
  V = (e) => !!e && !Number.isNaN(Number(e)),
  H = (e) => !!e && Number.isInteger(Number(e)),
  ut = (e) => e.endsWith(`%`) && V(e.slice(0, -1)),
  U = (e) => at.test(e),
  dt = () => !0,
  ft = (e) => ot.test(e) && !st.test(e),
  pt = () => !1,
  mt = (e) => ct.test(e),
  ht = (e) => lt.test(e),
  gt = (e) => !W(e) && !K(e),
  _t = (e) =>
    e.startsWith(`@container`) &&
    ((e[10] === `/` && e[11] !== void 0) ||
      (e[11] === `s` && e[16] !== void 0 && e.startsWith(`-size/`, 10)) ||
      (e[11] === `n` && e[18] !== void 0 && e.startsWith(`-normal/`, 10))),
  vt = (e) => q(e, Pt, pt),
  W = (e) => nt.test(e),
  G = (e) => q(e, Ft, ft),
  yt = (e) => q(e, It, V),
  bt = (e) => q(e, Rt, dt),
  xt = (e) => q(e, Lt, pt),
  St = (e) => q(e, Mt, pt),
  Ct = (e) => q(e, Nt, ht),
  wt = (e) => q(e, zt, mt),
  K = (e) => rt.test(e),
  Tt = (e) => J(e, Ft),
  Et = (e) => J(e, Lt),
  Dt = (e) => J(e, Mt),
  Ot = (e) => J(e, Pt),
  kt = (e) => J(e, Nt),
  At = (e) => J(e, zt, !0),
  jt = (e) => J(e, Rt, !0),
  q = (e, t, n) => {
    let r = nt.exec(e)
    return r ? (r[1] ? t(r[1]) : n(r[2])) : !1
  },
  J = (e, t, n = !1) => {
    let r = rt.exec(e)
    return r ? (r[1] ? t(r[1]) : n) : !1
  },
  Mt = (e) => e === `position` || e === `percentage`,
  Nt = (e) => e === `image` || e === `url`,
  Pt = (e) => e === `length` || e === `size` || e === `bg-size`,
  Ft = (e) => e === `length`,
  It = (e) => e === `number`,
  Lt = (e) => e === `family-name`,
  Rt = (e) => e === `number` || e === `weight`,
  zt = (e) => e === `shadow`,
  Bt = () => {
    let e = z(`color`),
      t = z(`font`),
      n = z(`text`),
      r = z(`font-weight`),
      i = z(`tracking`),
      a = z(`leading`),
      o = z(`breakpoint`),
      s = z(`container`),
      c = z(`spacing`),
      l = z(`radius`),
      u = z(`shadow`),
      d = z(`inset-shadow`),
      f = z(`text-shadow`),
      p = z(`drop-shadow`),
      m = z(`blur`),
      h = z(`perspective`),
      g = z(`aspect`),
      _ = z(`ease`),
      v = z(`animate`),
      y = () => [`auto`, `avoid`, `all`, `avoid-page`, `page`, `left`, `right`, `column`],
      b = () => [
        `center`,
        `top`,
        `bottom`,
        `left`,
        `right`,
        `top-left`,
        `left-top`,
        `top-right`,
        `right-top`,
        `bottom-right`,
        `right-bottom`,
        `bottom-left`,
        `left-bottom`,
      ],
      x = () => [...b(), K, W],
      S = () => [`auto`, `hidden`, `clip`, `visible`, `scroll`],
      C = () => [`auto`, `contain`, `none`],
      w = () => [K, W, c],
      T = () => [B, `full`, `auto`, ...w()],
      E = () => [H, `none`, `subgrid`, K, W],
      ee = () => [`auto`, { span: [`full`, H, K, W] }, H, K, W],
      D = () => [H, `auto`, K, W],
      te = () => [`auto`, `min`, `max`, `fr`, K, W],
      O = () => [`start`, `end`, `center`, `between`, `around`, `evenly`, `stretch`, `baseline`, `center-safe`, `end-safe`],
      k = () => [`start`, `end`, `center`, `stretch`, `center-safe`, `end-safe`],
      A = () => [`auto`, ...w()],
      j = () => [B, `auto`, `full`, `dvw`, `dvh`, `lvw`, `lvh`, `svw`, `svh`, `min`, `max`, `fit`, ...w()],
      M = () => [s, B, `screen`, `full`, `dvw`, `lvw`, `svw`, `min`, `max`, `fit`, ...w()],
      ne = () => [B, `screen`, `full`, `lh`, `dvh`, `lvh`, `svh`, `min`, `max`, `fit`, ...w()],
      N = () => [e, K, W],
      re = () => [...b(), Dt, St, { position: [K, W] }],
      ie = () => [`no-repeat`, { repeat: [``, `x`, `y`, `space`, `round`] }],
      ae = () => [`auto`, `cover`, `contain`, Ot, vt, { size: [K, W] }],
      oe = () => [ut, Tt, G],
      P = () => [``, `none`, `full`, l, K, W],
      F = () => [``, V, Tt, G],
      I = () => [`solid`, `dashed`, `dotted`, `double`],
      se = () => [
        `normal`,
        `multiply`,
        `screen`,
        `overlay`,
        `darken`,
        `lighten`,
        `color-dodge`,
        `color-burn`,
        `hard-light`,
        `soft-light`,
        `difference`,
        `exclusion`,
        `hue`,
        `saturation`,
        `color`,
        `luminosity`,
      ],
      L = () => [V, ut, Dt, St],
      ce = () => [``, `none`, m, K, W],
      le = () => [`none`, V, K, W],
      R = () => [`none`, V, K, W],
      ue = () => [V, K, W],
      de = () => [B, `full`, ...w()]
    return {
      cacheSize: 500,
      theme: {
        animate: [`spin`, `ping`, `pulse`, `bounce`],
        aspect: [`video`],
        blur: [U],
        breakpoint: [U],
        color: [dt],
        container: [U],
        'drop-shadow': [U],
        ease: [`in`, `out`, `in-out`],
        font: [gt],
        'font-weight': [`thin`, `extralight`, `light`, `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`],
        'inset-shadow': [U],
        leading: [`none`, `tight`, `snug`, `normal`, `relaxed`, `loose`],
        perspective: [`dramatic`, `near`, `normal`, `midrange`, `distant`, `none`],
        radius: [U],
        shadow: [U],
        spacing: [`px`, V],
        text: [U],
        'text-shadow': [U],
        tracking: [`tighter`, `tight`, `normal`, `wide`, `wider`, `widest`],
      },
      classGroups: {
        aspect: [{ aspect: [`auto`, `square`, B, W, K, g] }],
        container: [`container`],
        'container-type': [{ '@container': [``, `normal`, `size`, K, W] }],
        'container-named': [_t],
        columns: [{ columns: [V, `auto`, W, K, s] }],
        'break-after': [{ 'break-after': y() }],
        'break-before': [{ 'break-before': y() }],
        'break-inside': [{ 'break-inside': [`auto`, `avoid`, `avoid-page`, `avoid-column`] }],
        'box-decoration': [{ 'box-decoration': [`slice`, `clone`] }],
        box: [{ box: [`border`, `content`] }],
        display: [
          `block`,
          `inline-block`,
          `inline`,
          `flex`,
          `inline-flex`,
          `table`,
          `inline-table`,
          `table-caption`,
          `table-cell`,
          `table-column`,
          `table-column-group`,
          `table-footer-group`,
          `table-header-group`,
          `table-row-group`,
          `table-row`,
          `flow-root`,
          `grid`,
          `inline-grid`,
          `contents`,
          `list-item`,
          `hidden`,
        ],
        sr: [`sr-only`, `not-sr-only`],
        float: [{ float: [`right`, `left`, `none`, `start`, `end`] }],
        clear: [{ clear: [`left`, `right`, `both`, `none`, `start`, `end`] }],
        isolation: [`isolate`, `isolation-auto`],
        'object-fit': [{ object: [`contain`, `cover`, `fill`, `none`, `scale-down`] }],
        'object-position': [{ object: x() }],
        overflow: [{ overflow: S() }],
        'overflow-x': [{ 'overflow-x': S() }],
        'overflow-y': [{ 'overflow-y': S() }],
        overscroll: [{ overscroll: C() }],
        'overscroll-x': [{ 'overscroll-x': C() }],
        'overscroll-y': [{ 'overscroll-y': C() }],
        position: [`static`, `fixed`, `absolute`, `relative`, `sticky`],
        inset: [{ inset: T() }],
        'inset-x': [{ 'inset-x': T() }],
        'inset-y': [{ 'inset-y': T() }],
        start: [{ 'inset-s': T(), start: T() }],
        end: [{ 'inset-e': T(), end: T() }],
        'inset-bs': [{ 'inset-bs': T() }],
        'inset-be': [{ 'inset-be': T() }],
        top: [{ top: T() }],
        right: [{ right: T() }],
        bottom: [{ bottom: T() }],
        left: [{ left: T() }],
        visibility: [`visible`, `invisible`, `collapse`],
        z: [{ z: [H, `auto`, K, W] }],
        basis: [{ basis: [B, `full`, `auto`, s, ...w()] }],
        'flex-direction': [{ flex: [`row`, `row-reverse`, `col`, `col-reverse`] }],
        'flex-wrap': [{ flex: [`nowrap`, `wrap`, `wrap-reverse`] }],
        flex: [{ flex: [V, B, `auto`, `initial`, `none`, W] }],
        grow: [{ grow: [``, V, K, W] }],
        shrink: [{ shrink: [``, V, K, W] }],
        order: [{ order: [H, `first`, `last`, `none`, K, W] }],
        'grid-cols': [{ 'grid-cols': E() }],
        'col-start-end': [{ col: ee() }],
        'col-start': [{ 'col-start': D() }],
        'col-end': [{ 'col-end': D() }],
        'grid-rows': [{ 'grid-rows': E() }],
        'row-start-end': [{ row: ee() }],
        'row-start': [{ 'row-start': D() }],
        'row-end': [{ 'row-end': D() }],
        'grid-flow': [{ 'grid-flow': [`row`, `col`, `dense`, `row-dense`, `col-dense`] }],
        'auto-cols': [{ 'auto-cols': te() }],
        'auto-rows': [{ 'auto-rows': te() }],
        gap: [{ gap: w() }],
        'gap-x': [{ 'gap-x': w() }],
        'gap-y': [{ 'gap-y': w() }],
        'justify-content': [{ justify: [...O(), `normal`] }],
        'justify-items': [{ 'justify-items': [...k(), `normal`] }],
        'justify-self': [{ 'justify-self': [`auto`, ...k()] }],
        'align-content': [{ content: [`normal`, ...O()] }],
        'align-items': [{ items: [...k(), { baseline: [``, `last`] }] }],
        'align-self': [{ self: [`auto`, ...k(), { baseline: [``, `last`] }] }],
        'place-content': [{ 'place-content': O() }],
        'place-items': [{ 'place-items': [...k(), `baseline`] }],
        'place-self': [{ 'place-self': [`auto`, ...k()] }],
        p: [{ p: w() }],
        px: [{ px: w() }],
        py: [{ py: w() }],
        ps: [{ ps: w() }],
        pe: [{ pe: w() }],
        pbs: [{ pbs: w() }],
        pbe: [{ pbe: w() }],
        pt: [{ pt: w() }],
        pr: [{ pr: w() }],
        pb: [{ pb: w() }],
        pl: [{ pl: w() }],
        m: [{ m: A() }],
        mx: [{ mx: A() }],
        my: [{ my: A() }],
        ms: [{ ms: A() }],
        me: [{ me: A() }],
        mbs: [{ mbs: A() }],
        mbe: [{ mbe: A() }],
        mt: [{ mt: A() }],
        mr: [{ mr: A() }],
        mb: [{ mb: A() }],
        ml: [{ ml: A() }],
        'space-x': [{ 'space-x': w() }],
        'space-x-reverse': [`space-x-reverse`],
        'space-y': [{ 'space-y': w() }],
        'space-y-reverse': [`space-y-reverse`],
        size: [{ size: j() }],
        'inline-size': [{ inline: [`auto`, ...M()] }],
        'min-inline-size': [{ 'min-inline': [`auto`, ...M()] }],
        'max-inline-size': [{ 'max-inline': [`none`, ...M()] }],
        'block-size': [{ block: [`auto`, ...ne()] }],
        'min-block-size': [{ 'min-block': [`auto`, ...ne()] }],
        'max-block-size': [{ 'max-block': [`none`, ...ne()] }],
        w: [{ w: [s, `screen`, ...j()] }],
        'min-w': [{ 'min-w': [s, `screen`, `none`, ...j()] }],
        'max-w': [{ 'max-w': [s, `screen`, `none`, `prose`, { screen: [o] }, ...j()] }],
        h: [{ h: [`screen`, `lh`, ...j()] }],
        'min-h': [{ 'min-h': [`screen`, `lh`, `none`, ...j()] }],
        'max-h': [{ 'max-h': [`screen`, `lh`, `none`, ...j()] }],
        'font-size': [{ text: [`base`, n, Tt, G] }],
        'font-smoothing': [`antialiased`, `subpixel-antialiased`],
        'font-style': [`italic`, `not-italic`],
        'font-weight': [{ font: [r, jt, bt] }],
        'font-stretch': [
          {
            'font-stretch': [
              `ultra-condensed`,
              `extra-condensed`,
              `condensed`,
              `semi-condensed`,
              `normal`,
              `semi-expanded`,
              `expanded`,
              `extra-expanded`,
              `ultra-expanded`,
              ut,
              W,
            ],
          },
        ],
        'font-family': [{ font: [Et, xt, t] }],
        'font-features': [{ 'font-features': [W] }],
        'fvn-normal': [`normal-nums`],
        'fvn-ordinal': [`ordinal`],
        'fvn-slashed-zero': [`slashed-zero`],
        'fvn-figure': [`lining-nums`, `oldstyle-nums`],
        'fvn-spacing': [`proportional-nums`, `tabular-nums`],
        'fvn-fraction': [`diagonal-fractions`, `stacked-fractions`],
        tracking: [{ tracking: [i, K, W] }],
        'line-clamp': [{ 'line-clamp': [V, `none`, K, yt] }],
        leading: [{ leading: [`none`, a, ...w()] }],
        'list-image': [{ 'list-image': [`none`, K, W] }],
        'list-style-position': [{ list: [`inside`, `outside`] }],
        'list-style-type': [{ list: [`disc`, `decimal`, `none`, K, W] }],
        'text-alignment': [{ text: [`left`, `center`, `right`, `justify`, `start`, `end`] }],
        'placeholder-color': [{ placeholder: N() }],
        'text-color': [{ text: N() }],
        'text-decoration': [`underline`, `overline`, `line-through`, `no-underline`],
        'text-decoration-style': [{ decoration: [...I(), `wavy`] }],
        'text-decoration-thickness': [{ decoration: [V, `from-font`, `auto`, K, G] }],
        'text-decoration-color': [{ decoration: N() }],
        'underline-offset': [{ 'underline-offset': [V, `auto`, K, W] }],
        'text-transform': [`uppercase`, `lowercase`, `capitalize`, `normal-case`],
        'text-overflow': [`truncate`, `text-ellipsis`, `text-clip`],
        'text-wrap': [{ text: [`wrap`, `nowrap`, `balance`, `pretty`] }],
        indent: [{ indent: w() }],
        'tab-size': [{ tab: [H, K, W] }],
        'vertical-align': [{ align: [`baseline`, `top`, `middle`, `bottom`, `text-top`, `text-bottom`, `sub`, `super`, K, W] }],
        whitespace: [{ whitespace: [`normal`, `nowrap`, `pre`, `pre-line`, `pre-wrap`, `break-spaces`] }],
        break: [{ break: [`normal`, `words`, `all`, `keep`] }],
        wrap: [{ wrap: [`break-word`, `anywhere`, `normal`] }],
        hyphens: [{ hyphens: [`none`, `manual`, `auto`] }],
        content: [{ content: [`none`, K, W] }],
        'bg-attachment': [{ bg: [`fixed`, `local`, `scroll`] }],
        'bg-clip': [{ 'bg-clip': [`border`, `padding`, `content`, `text`] }],
        'bg-origin': [{ 'bg-origin': [`border`, `padding`, `content`] }],
        'bg-position': [{ bg: re() }],
        'bg-repeat': [{ bg: ie() }],
        'bg-size': [{ bg: ae() }],
        'bg-image': [
          {
            bg: [
              `none`,
              { linear: [{ to: [`t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`] }, H, K, W], radial: [``, K, W], conic: [``, H, K, W] },
              kt,
              Ct,
            ],
          },
        ],
        'bg-color': [{ bg: N() }],
        'gradient-from-pos': [{ from: oe() }],
        'gradient-via-pos': [{ via: oe() }],
        'gradient-to-pos': [{ to: oe() }],
        'gradient-from': [{ from: N() }],
        'gradient-via': [{ via: N() }],
        'gradient-to': [{ to: N() }],
        rounded: [{ rounded: P() }],
        'rounded-s': [{ 'rounded-s': P() }],
        'rounded-e': [{ 'rounded-e': P() }],
        'rounded-t': [{ 'rounded-t': P() }],
        'rounded-r': [{ 'rounded-r': P() }],
        'rounded-b': [{ 'rounded-b': P() }],
        'rounded-l': [{ 'rounded-l': P() }],
        'rounded-ss': [{ 'rounded-ss': P() }],
        'rounded-se': [{ 'rounded-se': P() }],
        'rounded-ee': [{ 'rounded-ee': P() }],
        'rounded-es': [{ 'rounded-es': P() }],
        'rounded-tl': [{ 'rounded-tl': P() }],
        'rounded-tr': [{ 'rounded-tr': P() }],
        'rounded-br': [{ 'rounded-br': P() }],
        'rounded-bl': [{ 'rounded-bl': P() }],
        'border-w': [{ border: F() }],
        'border-w-x': [{ 'border-x': F() }],
        'border-w-y': [{ 'border-y': F() }],
        'border-w-s': [{ 'border-s': F() }],
        'border-w-e': [{ 'border-e': F() }],
        'border-w-bs': [{ 'border-bs': F() }],
        'border-w-be': [{ 'border-be': F() }],
        'border-w-t': [{ 'border-t': F() }],
        'border-w-r': [{ 'border-r': F() }],
        'border-w-b': [{ 'border-b': F() }],
        'border-w-l': [{ 'border-l': F() }],
        'divide-x': [{ 'divide-x': F() }],
        'divide-x-reverse': [`divide-x-reverse`],
        'divide-y': [{ 'divide-y': F() }],
        'divide-y-reverse': [`divide-y-reverse`],
        'border-style': [{ border: [...I(), `hidden`, `none`] }],
        'divide-style': [{ divide: [...I(), `hidden`, `none`] }],
        'border-color': [{ border: N() }],
        'border-color-x': [{ 'border-x': N() }],
        'border-color-y': [{ 'border-y': N() }],
        'border-color-s': [{ 'border-s': N() }],
        'border-color-e': [{ 'border-e': N() }],
        'border-color-bs': [{ 'border-bs': N() }],
        'border-color-be': [{ 'border-be': N() }],
        'border-color-t': [{ 'border-t': N() }],
        'border-color-r': [{ 'border-r': N() }],
        'border-color-b': [{ 'border-b': N() }],
        'border-color-l': [{ 'border-l': N() }],
        'divide-color': [{ divide: N() }],
        'outline-style': [{ outline: [...I(), `none`, `hidden`] }],
        'outline-offset': [{ 'outline-offset': [V, K, W] }],
        'outline-w': [{ outline: [``, V, Tt, G] }],
        'outline-color': [{ outline: N() }],
        shadow: [{ shadow: [``, `inner`, `none`, u, At, wt] }],
        'shadow-color': [{ shadow: N() }],
        'inset-shadow': [{ 'inset-shadow': [`none`, d, At, wt] }],
        'inset-shadow-color': [{ 'inset-shadow': N() }],
        'ring-w': [{ ring: F() }],
        'ring-w-inset': [`ring-inset`],
        'ring-color': [{ ring: N() }],
        'ring-offset-w': [{ 'ring-offset': [V, G] }],
        'ring-offset-color': [{ 'ring-offset': N() }],
        'inset-ring-w': [{ 'inset-ring': F() }],
        'inset-ring-color': [{ 'inset-ring': N() }],
        'text-shadow': [{ 'text-shadow': [`none`, f, At, wt] }],
        'text-shadow-color': [{ 'text-shadow': N() }],
        opacity: [{ opacity: [V, K, W] }],
        'mix-blend': [{ 'mix-blend': [...se(), `plus-darker`, `plus-lighter`] }],
        'bg-blend': [{ 'bg-blend': se() }],
        'mask-clip': [{ 'mask-clip': [`border`, `padding`, `content`, `fill`, `stroke`, `view`] }, `mask-no-clip`],
        'mask-composite': [{ mask: [`add`, `subtract`, `intersect`, `exclude`] }],
        'mask-image-linear-pos': [{ 'mask-linear': [V] }],
        'mask-image-linear-from-pos': [{ 'mask-linear-from': L() }],
        'mask-image-linear-to-pos': [{ 'mask-linear-to': L() }],
        'mask-image-linear-from-color': [{ 'mask-linear-from': N() }],
        'mask-image-linear-to-color': [{ 'mask-linear-to': N() }],
        'mask-image-t-from-pos': [{ 'mask-t-from': L() }],
        'mask-image-t-to-pos': [{ 'mask-t-to': L() }],
        'mask-image-t-from-color': [{ 'mask-t-from': N() }],
        'mask-image-t-to-color': [{ 'mask-t-to': N() }],
        'mask-image-r-from-pos': [{ 'mask-r-from': L() }],
        'mask-image-r-to-pos': [{ 'mask-r-to': L() }],
        'mask-image-r-from-color': [{ 'mask-r-from': N() }],
        'mask-image-r-to-color': [{ 'mask-r-to': N() }],
        'mask-image-b-from-pos': [{ 'mask-b-from': L() }],
        'mask-image-b-to-pos': [{ 'mask-b-to': L() }],
        'mask-image-b-from-color': [{ 'mask-b-from': N() }],
        'mask-image-b-to-color': [{ 'mask-b-to': N() }],
        'mask-image-l-from-pos': [{ 'mask-l-from': L() }],
        'mask-image-l-to-pos': [{ 'mask-l-to': L() }],
        'mask-image-l-from-color': [{ 'mask-l-from': N() }],
        'mask-image-l-to-color': [{ 'mask-l-to': N() }],
        'mask-image-x-from-pos': [{ 'mask-x-from': L() }],
        'mask-image-x-to-pos': [{ 'mask-x-to': L() }],
        'mask-image-x-from-color': [{ 'mask-x-from': N() }],
        'mask-image-x-to-color': [{ 'mask-x-to': N() }],
        'mask-image-y-from-pos': [{ 'mask-y-from': L() }],
        'mask-image-y-to-pos': [{ 'mask-y-to': L() }],
        'mask-image-y-from-color': [{ 'mask-y-from': N() }],
        'mask-image-y-to-color': [{ 'mask-y-to': N() }],
        'mask-image-radial': [{ 'mask-radial': [K, W] }],
        'mask-image-radial-from-pos': [{ 'mask-radial-from': L() }],
        'mask-image-radial-to-pos': [{ 'mask-radial-to': L() }],
        'mask-image-radial-from-color': [{ 'mask-radial-from': N() }],
        'mask-image-radial-to-color': [{ 'mask-radial-to': N() }],
        'mask-image-radial-shape': [{ 'mask-radial': [`circle`, `ellipse`] }],
        'mask-image-radial-size': [{ 'mask-radial': [{ closest: [`side`, `corner`], farthest: [`side`, `corner`] }] }],
        'mask-image-radial-pos': [{ 'mask-radial-at': b() }],
        'mask-image-conic-pos': [{ 'mask-conic': [V] }],
        'mask-image-conic-from-pos': [{ 'mask-conic-from': L() }],
        'mask-image-conic-to-pos': [{ 'mask-conic-to': L() }],
        'mask-image-conic-from-color': [{ 'mask-conic-from': N() }],
        'mask-image-conic-to-color': [{ 'mask-conic-to': N() }],
        'mask-mode': [{ mask: [`alpha`, `luminance`, `match`] }],
        'mask-origin': [{ 'mask-origin': [`border`, `padding`, `content`, `fill`, `stroke`, `view`] }],
        'mask-position': [{ mask: re() }],
        'mask-repeat': [{ mask: ie() }],
        'mask-size': [{ mask: ae() }],
        'mask-type': [{ 'mask-type': [`alpha`, `luminance`] }],
        'mask-image': [{ mask: [`none`, K, W] }],
        filter: [{ filter: [``, `none`, K, W] }],
        blur: [{ blur: ce() }],
        brightness: [{ brightness: [V, K, W] }],
        contrast: [{ contrast: [V, K, W] }],
        'drop-shadow': [{ 'drop-shadow': [``, `none`, p, At, wt] }],
        'drop-shadow-color': [{ 'drop-shadow': N() }],
        grayscale: [{ grayscale: [``, V, K, W] }],
        'hue-rotate': [{ 'hue-rotate': [V, K, W] }],
        invert: [{ invert: [``, V, K, W] }],
        saturate: [{ saturate: [V, K, W] }],
        sepia: [{ sepia: [``, V, K, W] }],
        'backdrop-filter': [{ 'backdrop-filter': [``, `none`, K, W] }],
        'backdrop-blur': [{ 'backdrop-blur': ce() }],
        'backdrop-brightness': [{ 'backdrop-brightness': [V, K, W] }],
        'backdrop-contrast': [{ 'backdrop-contrast': [V, K, W] }],
        'backdrop-grayscale': [{ 'backdrop-grayscale': [``, V, K, W] }],
        'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [V, K, W] }],
        'backdrop-invert': [{ 'backdrop-invert': [``, V, K, W] }],
        'backdrop-opacity': [{ 'backdrop-opacity': [V, K, W] }],
        'backdrop-saturate': [{ 'backdrop-saturate': [V, K, W] }],
        'backdrop-sepia': [{ 'backdrop-sepia': [``, V, K, W] }],
        'border-collapse': [{ border: [`collapse`, `separate`] }],
        'border-spacing': [{ 'border-spacing': w() }],
        'border-spacing-x': [{ 'border-spacing-x': w() }],
        'border-spacing-y': [{ 'border-spacing-y': w() }],
        'table-layout': [{ table: [`auto`, `fixed`] }],
        caption: [{ caption: [`top`, `bottom`] }],
        transition: [{ transition: [``, `all`, `colors`, `opacity`, `shadow`, `transform`, `none`, K, W] }],
        'transition-behavior': [{ transition: [`normal`, `discrete`] }],
        duration: [{ duration: [V, `initial`, K, W] }],
        ease: [{ ease: [`linear`, `initial`, _, K, W] }],
        delay: [{ delay: [V, K, W] }],
        animate: [{ animate: [`none`, v, K, W] }],
        backface: [{ backface: [`hidden`, `visible`] }],
        perspective: [{ perspective: [h, K, W] }],
        'perspective-origin': [{ 'perspective-origin': x() }],
        rotate: [{ rotate: le() }],
        'rotate-x': [{ 'rotate-x': le() }],
        'rotate-y': [{ 'rotate-y': le() }],
        'rotate-z': [{ 'rotate-z': le() }],
        scale: [{ scale: R() }],
        'scale-x': [{ 'scale-x': R() }],
        'scale-y': [{ 'scale-y': R() }],
        'scale-z': [{ 'scale-z': R() }],
        'scale-3d': [`scale-3d`],
        skew: [{ skew: ue() }],
        'skew-x': [{ 'skew-x': ue() }],
        'skew-y': [{ 'skew-y': ue() }],
        transform: [{ transform: [K, W, ``, `none`, `gpu`, `cpu`] }],
        'transform-origin': [{ origin: x() }],
        'transform-style': [{ transform: [`3d`, `flat`] }],
        translate: [{ translate: de() }],
        'translate-x': [{ 'translate-x': de() }],
        'translate-y': [{ 'translate-y': de() }],
        'translate-z': [{ 'translate-z': de() }],
        'translate-none': [`translate-none`],
        zoom: [{ zoom: [H, K, W] }],
        accent: [{ accent: N() }],
        appearance: [{ appearance: [`none`, `auto`] }],
        'caret-color': [{ caret: N() }],
        'color-scheme': [{ scheme: [`normal`, `dark`, `light`, `light-dark`, `only-dark`, `only-light`] }],
        cursor: [
          {
            cursor: [
              `auto`,
              `default`,
              `pointer`,
              `wait`,
              `text`,
              `move`,
              `help`,
              `not-allowed`,
              `none`,
              `context-menu`,
              `progress`,
              `cell`,
              `crosshair`,
              `vertical-text`,
              `alias`,
              `copy`,
              `no-drop`,
              `grab`,
              `grabbing`,
              `all-scroll`,
              `col-resize`,
              `row-resize`,
              `n-resize`,
              `e-resize`,
              `s-resize`,
              `w-resize`,
              `ne-resize`,
              `nw-resize`,
              `se-resize`,
              `sw-resize`,
              `ew-resize`,
              `ns-resize`,
              `nesw-resize`,
              `nwse-resize`,
              `zoom-in`,
              `zoom-out`,
              K,
              W,
            ],
          },
        ],
        'field-sizing': [{ 'field-sizing': [`fixed`, `content`] }],
        'pointer-events': [{ 'pointer-events': [`auto`, `none`] }],
        resize: [{ resize: [`none`, ``, `y`, `x`] }],
        'scroll-behavior': [{ scroll: [`auto`, `smooth`] }],
        'scrollbar-thumb-color': [{ 'scrollbar-thumb': N() }],
        'scrollbar-track-color': [{ 'scrollbar-track': N() }],
        'scrollbar-gutter': [{ 'scrollbar-gutter': [`auto`, `stable`, `both`] }],
        'scrollbar-w': [{ scrollbar: [`auto`, `thin`, `none`] }],
        'scroll-m': [{ 'scroll-m': w() }],
        'scroll-mx': [{ 'scroll-mx': w() }],
        'scroll-my': [{ 'scroll-my': w() }],
        'scroll-ms': [{ 'scroll-ms': w() }],
        'scroll-me': [{ 'scroll-me': w() }],
        'scroll-mbs': [{ 'scroll-mbs': w() }],
        'scroll-mbe': [{ 'scroll-mbe': w() }],
        'scroll-mt': [{ 'scroll-mt': w() }],
        'scroll-mr': [{ 'scroll-mr': w() }],
        'scroll-mb': [{ 'scroll-mb': w() }],
        'scroll-ml': [{ 'scroll-ml': w() }],
        'scroll-p': [{ 'scroll-p': w() }],
        'scroll-px': [{ 'scroll-px': w() }],
        'scroll-py': [{ 'scroll-py': w() }],
        'scroll-ps': [{ 'scroll-ps': w() }],
        'scroll-pe': [{ 'scroll-pe': w() }],
        'scroll-pbs': [{ 'scroll-pbs': w() }],
        'scroll-pbe': [{ 'scroll-pbe': w() }],
        'scroll-pt': [{ 'scroll-pt': w() }],
        'scroll-pr': [{ 'scroll-pr': w() }],
        'scroll-pb': [{ 'scroll-pb': w() }],
        'scroll-pl': [{ 'scroll-pl': w() }],
        'snap-align': [{ snap: [`start`, `end`, `center`, `align-none`] }],
        'snap-stop': [{ snap: [`normal`, `always`] }],
        'snap-type': [{ snap: [`none`, `x`, `y`, `both`] }],
        'snap-strictness': [{ snap: [`mandatory`, `proximity`] }],
        touch: [{ touch: [`auto`, `none`, `manipulation`] }],
        'touch-x': [{ 'touch-pan': [`x`, `left`, `right`] }],
        'touch-y': [{ 'touch-pan': [`y`, `up`, `down`] }],
        'touch-pz': [`touch-pinch-zoom`],
        select: [{ select: [`none`, `text`, `all`, `auto`] }],
        'will-change': [{ 'will-change': [`auto`, `scroll`, `contents`, `transform`, K, W] }],
        fill: [{ fill: [`none`, ...N()] }],
        'stroke-w': [{ stroke: [V, Tt, G, yt] }],
        stroke: [{ stroke: [`none`, ...N()] }],
        'forced-color-adjust': [{ 'forced-color-adjust': [`auto`, `none`] }],
      },
      conflictingClassGroups: {
        'container-named': [`container-type`],
        overflow: [`overflow-x`, `overflow-y`],
        overscroll: [`overscroll-x`, `overscroll-y`],
        inset: [`inset-x`, `inset-y`, `inset-bs`, `inset-be`, `start`, `end`, `top`, `right`, `bottom`, `left`],
        'inset-x': [`start`, `end`, `right`, `left`],
        'inset-y': [`inset-bs`, `inset-be`, `top`, `bottom`],
        flex: [`basis`, `grow`, `shrink`],
        gap: [`gap-x`, `gap-y`],
        p: [`px`, `py`, `ps`, `pe`, `pbs`, `pbe`, `pt`, `pr`, `pb`, `pl`],
        px: [`ps`, `pe`, `pr`, `pl`],
        py: [`pbs`, `pbe`, `pt`, `pb`],
        m: [`mx`, `my`, `ms`, `me`, `mbs`, `mbe`, `mt`, `mr`, `mb`, `ml`],
        mx: [`ms`, `me`, `mr`, `ml`],
        my: [`mbs`, `mbe`, `mt`, `mb`],
        size: [`w`, `h`],
        'font-size': [`leading`],
        'fvn-normal': [`fvn-ordinal`, `fvn-slashed-zero`, `fvn-figure`, `fvn-spacing`, `fvn-fraction`],
        'fvn-ordinal': [`fvn-normal`],
        'fvn-slashed-zero': [`fvn-normal`],
        'fvn-figure': [`fvn-normal`],
        'fvn-spacing': [`fvn-normal`],
        'fvn-fraction': [`fvn-normal`],
        'line-clamp': [`display`, `overflow`],
        rounded: [
          `rounded-s`,
          `rounded-e`,
          `rounded-t`,
          `rounded-r`,
          `rounded-b`,
          `rounded-l`,
          `rounded-ss`,
          `rounded-se`,
          `rounded-ee`,
          `rounded-es`,
          `rounded-tl`,
          `rounded-tr`,
          `rounded-br`,
          `rounded-bl`,
        ],
        'rounded-s': [`rounded-ss`, `rounded-es`],
        'rounded-e': [`rounded-se`, `rounded-ee`],
        'rounded-t': [`rounded-tl`, `rounded-tr`],
        'rounded-r': [`rounded-tr`, `rounded-br`],
        'rounded-b': [`rounded-br`, `rounded-bl`],
        'rounded-l': [`rounded-tl`, `rounded-bl`],
        'border-spacing': [`border-spacing-x`, `border-spacing-y`],
        'border-w': [
          `border-w-x`,
          `border-w-y`,
          `border-w-s`,
          `border-w-e`,
          `border-w-bs`,
          `border-w-be`,
          `border-w-t`,
          `border-w-r`,
          `border-w-b`,
          `border-w-l`,
        ],
        'border-w-x': [`border-w-s`, `border-w-e`, `border-w-r`, `border-w-l`],
        'border-w-y': [`border-w-bs`, `border-w-be`, `border-w-t`, `border-w-b`],
        'border-color': [
          `border-color-x`,
          `border-color-y`,
          `border-color-s`,
          `border-color-e`,
          `border-color-bs`,
          `border-color-be`,
          `border-color-t`,
          `border-color-r`,
          `border-color-b`,
          `border-color-l`,
        ],
        'border-color-x': [`border-color-s`, `border-color-e`, `border-color-r`, `border-color-l`],
        'border-color-y': [`border-color-bs`, `border-color-be`, `border-color-t`, `border-color-b`],
        translate: [`translate-x`, `translate-y`, `translate-none`],
        'translate-none': [`translate`, `translate-x`, `translate-y`, `translate-z`],
        'scroll-m': [
          `scroll-mx`,
          `scroll-my`,
          `scroll-ms`,
          `scroll-me`,
          `scroll-mbs`,
          `scroll-mbe`,
          `scroll-mt`,
          `scroll-mr`,
          `scroll-mb`,
          `scroll-ml`,
        ],
        'scroll-mx': [`scroll-ms`, `scroll-me`, `scroll-mr`, `scroll-ml`],
        'scroll-my': [`scroll-mbs`, `scroll-mbe`, `scroll-mt`, `scroll-mb`],
        'scroll-p': [
          `scroll-px`,
          `scroll-py`,
          `scroll-ps`,
          `scroll-pe`,
          `scroll-pbs`,
          `scroll-pbe`,
          `scroll-pt`,
          `scroll-pr`,
          `scroll-pb`,
          `scroll-pl`,
        ],
        'scroll-px': [`scroll-ps`, `scroll-pe`, `scroll-pr`, `scroll-pl`],
        'scroll-py': [`scroll-pbs`, `scroll-pbe`, `scroll-pt`, `scroll-pb`],
        touch: [`touch-x`, `touch-y`, `touch-pz`],
        'touch-x': [`touch`],
        'touch-y': [`touch`],
        'touch-pz': [`touch`],
      },
      conflictingClassGroupModifiers: { 'font-size': [`leading`] },
      postfixLookupClassGroups: [`container-type`],
      orderSensitiveModifiers: [
        `*`,
        `**`,
        `after`,
        `backdrop`,
        `before`,
        `details-content`,
        `file`,
        `first-letter`,
        `first-line`,
        `marker`,
        `placeholder`,
        `selection`,
      ],
    }
  },
  Vt = (e, { cacheSize: t, prefix: n, experimentalParseClassName: r, extend: i = {}, override: a = {} }) => (
    Ht(e, `cacheSize`, t),
    Ht(e, `prefix`, n),
    Ht(e, `experimentalParseClassName`, r),
    Ut(e.theme, a.theme),
    Ut(e.classGroups, a.classGroups),
    Ut(e.conflictingClassGroups, a.conflictingClassGroups),
    Ut(e.conflictingClassGroupModifiers, a.conflictingClassGroupModifiers),
    Ht(e, `postfixLookupClassGroups`, a.postfixLookupClassGroups),
    Ht(e, `orderSensitiveModifiers`, a.orderSensitiveModifiers),
    Wt(e.theme, i.theme),
    Wt(e.classGroups, i.classGroups),
    Wt(e.conflictingClassGroups, i.conflictingClassGroups),
    Wt(e.conflictingClassGroupModifiers, i.conflictingClassGroupModifiers),
    Gt(e, i, `postfixLookupClassGroups`),
    Gt(e, i, `orderSensitiveModifiers`),
    e
  ),
  Ht = (e, t, n) => {
    n !== void 0 && (e[t] = n)
  },
  Ut = (e, t) => {
    if (t) for (let n in t) Ht(e, n, t[n])
  },
  Wt = (e, t) => {
    if (t) for (let n in t) Gt(e, t, n)
  },
  Gt = (e, t, n) => {
    let r = t[n]
    r !== void 0 && (e[n] = e[n] ? e[n].concat(r) : r)
  },
  Kt = ((e, ...t) => (typeof e == `function` ? et(Bt, e, ...t) : et(() => Vt(Bt(), e), ...t)))({
    extend: { classGroups: { 'font-size': [{ text: [`display`, `title`, `heading`, `subheading`, `body`, `body-lg`, `caption`] }] } },
  })
function Y(...e) {
  return Kt(Se(e))
}
var qt = (e) => (typeof e == `boolean` ? `${e}` : e === 0 ? `0` : e),
  Jt = Se,
  Yt = (e, t) => (n) => {
    if (t?.variants == null) return Jt(e, n?.class, n?.className)
    let { variants: r, defaultVariants: i } = t,
      a = Object.keys(r).map((e) => {
        let t = n?.[e],
          a = i?.[e]
        if (t === null) return null
        let o = qt(t) || qt(a)
        return r[e][o]
      }),
      o =
        n &&
        Object.entries(n).reduce((e, t) => {
          let [n, r] = t
          return (r === void 0 || (e[n] = r), e)
        }, {})
    return Jt(
      e,
      a,
      t?.compoundVariants?.reduce((e, t) => {
        let { class: n, className: r, ...a } = t
        return Object.entries(a).every((e) => {
          let [t, n] = e
          return Array.isArray(n) ? n.includes({ ...i, ...o }[t]) : { ...i, ...o }[t] === n
        })
          ? [...e, n, r]
          : e
      }, []),
      n?.class,
      n?.className,
    )
  },
  Xt = (...e) =>
    e
      .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
      .join(` `)
      .trim(),
  Zt = (e) => e.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase(),
  Qt = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => (n ? n.toUpperCase() : t.toLowerCase())),
  $t = (e) => {
    let t = Qt(e)
    return t.charAt(0).toUpperCase() + t.slice(1)
  },
  en = {
    xmlns: `http://www.w3.org/2000/svg`,
    width: 24,
    height: 24,
    viewBox: `0 0 24 24`,
    fill: `none`,
    stroke: `currentColor`,
    strokeWidth: 2,
    strokeLinecap: `round`,
    strokeLinejoin: `round`,
  },
  tn = (e) => {
    for (let t in e) if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0
    return !1
  },
  nn = (0, p.createContext)({}),
  rn = () => (0, p.useContext)(nn),
  an = (0, p.forwardRef)(
    ({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: i = ``, children: a, iconNode: o, ...s }, c) => {
      let { size: l = 24, strokeWidth: u = 2, absoluteStrokeWidth: d = !1, color: f = `currentColor`, className: m = `` } = rn() ?? {},
        h = (r ?? d) ? (Number(n ?? u) * 24) / Number(t ?? l) : (n ?? u)
      return (0, p.createElement)(
        `svg`,
        {
          ref: c,
          ...en,
          width: t ?? l ?? en.width,
          height: t ?? l ?? en.height,
          stroke: e ?? f,
          strokeWidth: h,
          className: Xt(`lucide`, m, i),
          ...(!a && !tn(s) && { 'aria-hidden': `true` }),
          ...s,
        },
        [...o.map(([e, t]) => (0, p.createElement)(e, t)), ...(Array.isArray(a) ? a : [a])],
      )
    },
  ),
  X = (e, t) => {
    let n = (0, p.forwardRef)(({ className: n, ...r }, i) =>
      (0, p.createElement)(an, { ref: i, iconNode: t, className: Xt(`lucide-${Zt($t(e))}`, `lucide-${e}`, n), ...r }),
    )
    return ((n.displayName = $t(e)), n)
  },
  on = X(`chevron-right`, [[`path`, { d: `m9 18 6-6-6-6`, key: `mthhwq` }]]),
  sn = X(`circle-alert`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`line`, { x1: `12`, x2: `12`, y1: `8`, y2: `12`, key: `1pkeuh` }],
    [`line`, { x1: `12`, x2: `12.01`, y1: `16`, y2: `16`, key: `4dfq90` }],
  ]),
  cn = X(`circle-check`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`path`, { d: `m16 9-5.5 5.5L8 12`, key: `xofnsj` }],
  ]),
  ln = X(`info`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`path`, { d: `M12 16v-4`, key: `1dtifu` }],
    [`path`, { d: `M12 8h.01`, key: `e9boi3` }],
  ]),
  un = X(`loader-circle`, [[`path`, { d: `M21 12a9 9 0 1 1-6.219-8.56`, key: `13zald` }]]),
  dn = X(`octagon-alert`, [
    [`path`, { d: `M12 16h.01`, key: `1drbdi` }],
    [`path`, { d: `M12 8v4`, key: `1got3b` }],
    [
      `path`,
      {
        d: `M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z`,
        key: `1fd625`,
      },
    ],
  ]),
  fn = Object.defineProperty,
  pn = (e, t) => fn(e, `name`, { value: t, configurable: !0 })
function mn(e, t) {
  if (typeof e == `function`) return e(t)
  e != null && (e.current = t)
}
pn(mn, `setRef`)
function hn(...e) {
  return (t) => {
    let n = !1,
      r = e.map((e) => {
        let r = mn(e, t)
        return (!n && typeof r == `function` && (n = !0), r)
      })
    if (n)
      return () => {
        for (let t = 0; t < r.length; t++) {
          let n = r[t]
          typeof n == `function` ? n() : mn(e[t], null)
        }
      }
  }
}
pn(hn, `composeRefs`)
function gn(...e) {
  return p.useCallback(hn(...e), e)
}
pn(gn, `useComposedRefs`)
var _n = Object.defineProperty,
  Z = (e, t) => _n(e, `name`, { value: t, configurable: !0 })
function vn(e) {
  let t = p.forwardRef((t, n) => {
    let { children: r, ...i } = t,
      a = null,
      o = !1,
      s = []
    ;(Dn(r) && typeof Mn == `function` && (r = Mn(r._payload)),
      p.Children.forEach(r, (e) => {
        if (Tn(e)) {
          o = !0
          let t = e,
            n = `child` in t.props ? t.props.child : t.props.children
          ;(Dn(n) && typeof Mn == `function` && (n = Mn(n._payload)), (a = Sn(t, n)), s.push(a?.props?.children))
        } else s.push(e)
      }),
      a ? (a = p.cloneElement(a, void 0, s)) : !o && p.Children.count(r) === 1 && p.isValidElement(r) && (a = r))
    let c = a ? wn(a) : void 0,
      l = gn(n, c)
    if (!a) {
      if (r || r === 0) throw Error(o ? jn(e) : An(e))
      return r
    }
    let u = Cn(i, a.props ?? {})
    return (a.type !== p.Fragment && (u.ref = n ? l : c), p.cloneElement(a, u))
  })
  return ((t.displayName = `${e}.Slot`), t)
}
Z(vn, `createSlot`)
var yn = vn(`Slot`),
  bn = Symbol.for(`radix.slottable`)
function xn(e) {
  let t = Z((e) => (`child` in e ? e.children(e.child) : e.children), `Slottable`)
  return ((t.displayName = `${e}.Slottable`), (t.__radixId = bn), t)
}
Z(xn, `createSlottable`)
var Sn = Z((e, t) => {
  if (`child` in e.props) {
    let t = e.props.child
    return p.isValidElement(t) ? p.cloneElement(t, void 0, e.props.children(t.props.children)) : null
  }
  return p.isValidElement(t) ? t : null
}, `getSlottableElementFromSlottable`)
function Cn(e, t) {
  let n = { ...t }
  for (let r in t) {
    let i = e[r],
      a = t[r]
    ;/^on[A-Z]/.test(r)
      ? i && a
        ? (n[r] = (...e) => {
            let t = a(...e)
            return (i(...e), t)
          })
        : i && (n[r] = i)
      : r === `style`
        ? (n[r] = { ...i, ...a })
        : r === `className`
          ? (n[r] = [i, a].filter(Boolean).join(` `))
          : r === `aria-describedby` && (n[r] = kn(a, i))
  }
  return { ...e, ...n }
}
Z(Cn, `mergeProps`)
function wn(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, `ref`)?.get,
    n = t && `isReactWarning` in t && t.isReactWarning
  return n
    ? e.ref
    : ((t = Object.getOwnPropertyDescriptor(e, `ref`)?.get),
      (n = t && `isReactWarning` in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref)
}
Z(wn, `getElementRef`)
function Tn(e) {
  return p.isValidElement(e) && typeof e.type == `function` && `__radixId` in e.type && e.type.__radixId === bn
}
Z(Tn, `isSlottable`)
var En = Symbol.for(`react.lazy`)
function Dn(e) {
  return typeof e == `object` && !!e && `$$typeof` in e && e.$$typeof === En && `_payload` in e && On(e._payload)
}
Z(Dn, `isLazyComponent`)
function On(e) {
  return typeof e == `object` && !!e && `then` in e
}
Z(On, `isPromiseLike`)
function kn(...e) {
  let t = new Set()
  for (let n of e) if (typeof n == `string`) for (let e of String(n).trim().split(/\s+/)) e && t.add(e)
  return t.size > 0 ? Array.from(t).join(` `) : void 0
}
Z(kn, `concatAriaDescribedby`)
var An = Z((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, `createSlotError`),
  jn = Z(
    (e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`,
    `createSlottableError`,
  ),
  Mn = p.use,
  Nn = Yt(
    `inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-body font-medium transition-colors duration-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-progress [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4`,
    {
      variants: {
        variant: {
          primary: `bg-primary text-primary-foreground hover:bg-primary-hover active:translate-y-px`,
          secondary: `bg-secondary text-secondary-foreground shadow-sm hover:bg-accent active:translate-y-px`,
          outline: `border border-input bg-surface text-foreground hover:bg-accent active:translate-y-px`,
          ghost: `text-foreground hover:bg-accent`,
          destructive: `bg-destructive text-destructive-foreground hover:brightness-95 active:translate-y-px`,
          link: `h-auto rounded-sm p-0 text-primary-subtle-foreground underline-offset-4 hover:underline`,
        },
        size: { sm: `h-8 px-3`, md: `h-9 px-3.5`, lg: `h-10 px-4`, icon: `size-9`, 'icon-sm': `size-8` },
      },
      defaultVariants: { variant: `secondary`, size: `md` },
    },
  )
function Pn({ className: e, variant: t, size: n, asChild: r, loading: i, disabled: a, children: o, type: s, ...c }) {
  let l = Y(Nn({ variant: t, size: n }), `pointer-coarse:min-h-11`, e)
  return r
    ? (0, m.jsx)(yn, { className: l, ...c, children: o })
    : (0, m.jsxs)(`button`, {
        type: s ?? `button`,
        className: l,
        disabled: a || i,
        'aria-busy': i || void 0,
        ...c,
        children: [i && (0, m.jsx)(un, { className: `animate-spin-slow`, 'aria-hidden': !0 }), o],
      })
}
function Fn({ className: e, wide: t, ...n }) {
  return (0, m.jsx)(`div`, {
    className: Y(`mx-auto flex w-full flex-col gap-6 px-4 py-6 md:px-6 lg:px-8`, t ? `max-w-none` : `max-w-[1280px]`, e),
    ...n,
  })
}
function In({ items: e, label: t, renderLink: n }) {
  return (0, m.jsx)(`nav`, {
    'aria-label': t,
    children: (0, m.jsx)(`ol`, {
      className: `flex flex-wrap items-center gap-1 text-caption text-muted-foreground`,
      children: e.map((t, r) => {
        let i = r === e.length - 1
        return (0, m.jsxs)(
          `li`,
          {
            className: `flex items-center gap-1`,
            children: [
              i || !t.href
                ? (0, m.jsx)(`span`, { 'aria-current': i ? `page` : void 0, className: i ? `text-foreground` : void 0, children: t.label })
                : n(t),
              !i && (0, m.jsx)(on, { className: `size-3.5`, 'aria-hidden': !0 }),
            ],
          },
          r,
        )
      }),
    }),
  })
}
function Ln({ title: e, description: t, breadcrumb: n, actions: r, meta: i }) {
  return (0, m.jsxs)(`header`, {
    className: `flex flex-col gap-3`,
    children: [
      n,
      (0, m.jsxs)(`div`, {
        className: `flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6`,
        children: [
          (0, m.jsxs)(`div`, {
            className: `min-w-0`,
            children: [
              (0, m.jsxs)(`div`, {
                className: `flex flex-wrap items-center gap-x-3 gap-y-1`,
                children: [(0, m.jsx)(`h1`, { className: `text-title text-foreground`, children: e }), i],
              }),
              t && (0, m.jsx)(`p`, { className: `mt-1 text-body text-muted-foreground`, children: t }),
            ],
          }),
          r && (0, m.jsx)(`div`, { className: `flex shrink-0 flex-wrap items-center gap-2 max-sm:[&>*]:flex-1`, children: r }),
        ],
      }),
    ],
  })
}
function Rn({ className: e, ...t }) {
  return (0, m.jsx)(`section`, {
    className: Y(`overflow-hidden rounded-lg border border-border bg-surface text-surface-foreground`, e),
    ...t,
  })
}
function zn({ title: e, description: t, actions: n, className: r }) {
  return (0, m.jsxs)(`div`, {
    className: Y(`flex items-start justify-between gap-4 border-b border-border px-5 py-4`, r),
    children: [
      (0, m.jsxs)(`div`, {
        className: `min-w-0`,
        children: [
          (0, m.jsx)(`h2`, { className: `text-heading`, children: e }),
          t && (0, m.jsx)(`p`, { className: `mt-0.5 text-body text-muted-foreground`, children: t }),
        ],
      }),
      n && (0, m.jsx)(`div`, { className: `flex shrink-0 items-center gap-2`, children: n }),
    ],
  })
}
function Bn({ className: e, ...t }) {
  return (0, m.jsx)(`div`, { className: Y(`p-5 max-sm:p-4`, e), ...t })
}
function Vn({ title: e, description: t, actions: n, children: r, className: i }) {
  return (0, m.jsxs)(`section`, {
    className: Y(`flex flex-col gap-3`, i),
    children: [
      (0, m.jsxs)(`div`, {
        className: `flex items-end justify-between gap-4`,
        children: [
          (0, m.jsxs)(`div`, {
            className: `min-w-0`,
            children: [
              (0, m.jsx)(`h2`, { className: `text-heading`, children: e }),
              t && (0, m.jsx)(`p`, { className: `mt-0.5 text-body text-muted-foreground`, children: t }),
            ],
          }),
          n,
        ],
      }),
      r,
    ],
  })
}
function Hn({ items: e, className: t }) {
  return (0, m.jsx)(`dl`, {
    className: Y(`grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-6 gap-y-4`, t),
    children: e.map((e, t) =>
      (0, m.jsxs)(
        `div`,
        {
          className: `min-w-0`,
          children: [
            (0, m.jsx)(`dt`, { className: `text-caption text-muted-foreground`, children: e.label }),
            (0, m.jsx)(`dd`, { className: `mt-0.5 break-words text-body text-foreground`, children: e.value }),
          ],
        },
        t,
      ),
    ),
  })
}
function Un({ className: e, ...t }) {
  return (0, m.jsx)(`div`, {
    className: Y(
      `sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8`,
      e,
    ),
    ...t,
  })
}
function Wn({ className: e, ...t }) {
  return (0, m.jsx)(`div`, {
    'aria-hidden': !0,
    className: Y(
      `animate-shimmer rounded-sm bg-[linear-gradient(90deg,var(--muted)_25%,var(--accent)_50%,var(--muted)_75%)] bg-[length:200%_100%]`,
      e,
    ),
    ...t,
  })
}
var Gn = { info: ln, success: cn, warning: sn, destructive: dn },
  Kn = {
    info: `border-info/30 bg-info-subtle text-info-subtle-foreground`,
    success: `border-success/30 bg-success-subtle text-success-subtle-foreground`,
    warning: `border-warning/40 bg-warning-subtle text-warning-subtle-foreground`,
    destructive: `border-destructive/30 bg-destructive-subtle text-destructive-subtle-foreground`,
  }
function qn({ tone: e, title: t, children: n, action: r, className: i }) {
  let a = Gn[e]
  return (0, m.jsxs)(`div`, {
    role: e === `destructive` || e === `warning` ? `alert` : `status`,
    className: Y(`flex items-start gap-3 rounded-lg border p-4 max-sm:flex-wrap`, Kn[e], i),
    children: [
      (0, m.jsx)(a, { className: `mt-0.5 size-5 shrink-0`, 'aria-hidden': !0 }),
      (0, m.jsxs)(`div`, {
        className: `min-w-0 flex-1`,
        children: [
          (0, m.jsx)(`p`, { className: `text-body font-medium`, children: t }),
          n && (0, m.jsx)(`div`, { className: `mt-0.5 text-body opacity-90`, children: n }),
        ],
      }),
      r && (0, m.jsx)(`div`, { className: `shrink-0 max-sm:w-full max-sm:[&>*]:w-full`, children: r }),
    ],
  })
}
function Jn({ locale: e }) {
  return (0, m.jsx)(qn, {
    tone: `info`,
    title:
      e === `en`
        ? `If you don't see the e-mail, check your spam or junk folder.`
        : `Nếu không thấy email, hãy kiểm tra thư mục thư rác (Spam/Junk).`,
  })
}
function Yn({ kind: e, className: t }) {
  let n = { viewBox: `0 0 120 90`, fill: `none`, 'aria-hidden': !0, className: Y(`h-[90px] w-[120px]`, t) }
  return e === `search`
    ? (0, m.jsxs)(`svg`, {
        ...n,
        children: [
          (0, m.jsx)(`rect`, { x: `10`, y: `62`, width: `100`, height: `6`, rx: `3`, fill: `var(--muted)` }),
          (0, m.jsx)(`circle`, { cx: `52`, cy: `38`, r: `20`, fill: `var(--primary-subtle)`, stroke: `var(--primary)`, strokeWidth: `3` }),
          (0, m.jsx)(`path`, { d: `m67 53 18 18`, stroke: `var(--primary)`, strokeWidth: `5`, strokeLinecap: `round` }),
          (0, m.jsx)(`path`, { d: `M44 38h16`, stroke: `var(--primary)`, strokeWidth: `3`, strokeLinecap: `round`, opacity: `.5` }),
        ],
      })
    : e === `error`
      ? (0, m.jsxs)(`svg`, {
          ...n,
          children: [
            (0, m.jsx)(`rect`, { x: `10`, y: `66`, width: `100`, height: `6`, rx: `3`, fill: `var(--muted)` }),
            (0, m.jsx)(`path`, {
              d: `M60 14 98 62H22L60 14Z`,
              fill: `var(--warning-subtle)`,
              stroke: `var(--warning)`,
              strokeWidth: `3`,
              strokeLinejoin: `round`,
            }),
            (0, m.jsx)(`path`, { d: `M60 32v14`, stroke: `var(--warning)`, strokeWidth: `4`, strokeLinecap: `round` }),
            (0, m.jsx)(`circle`, { cx: `60`, cy: `54`, r: `2.5`, fill: `var(--warning)` }),
          ],
        })
      : (0, m.jsxs)(`svg`, {
          ...n,
          children: [
            (0, m.jsx)(`rect`, { x: `8`, y: `66`, width: `104`, height: `6`, rx: `3`, fill: `var(--muted)` }),
            (0, m.jsx)(`path`, {
              d: `M22 60V46l8-14c1-2 3-3 5-3h50c2 0 4 1 5 3l8 14v14H22Z`,
              fill: `var(--primary-subtle)`,
              stroke: `var(--primary)`,
              strokeWidth: `3`,
              strokeLinejoin: `round`,
            }),
            (0, m.jsx)(`path`, { d: `M33 46h54`, stroke: `var(--primary)`, strokeWidth: `3`, opacity: `.5` }),
            (0, m.jsx)(`circle`, { cx: `40`, cy: `60`, r: `7`, fill: `var(--surface)`, stroke: `var(--primary)`, strokeWidth: `3` }),
            (0, m.jsx)(`circle`, { cx: `80`, cy: `60`, r: `7`, fill: `var(--surface)`, stroke: `var(--primary)`, strokeWidth: `3` }),
          ],
        })
}
function Xn({ title: e, message: t, action: n, kind: r = `list`, className: i, compact: a }) {
  return (0, m.jsxs)(`div`, {
    className: Y(`flex flex-col items-center px-6 text-center`, a ? `py-8` : `py-14`, i),
    children: [
      (0, m.jsx)(Yn, { kind: r }),
      e && (0, m.jsx)(`h2`, { className: `mt-4 text-subheading`, children: e }),
      (0, m.jsx)(`p`, { className: Y(`max-w-sm text-body text-muted-foreground`, e ? `mt-1` : `mt-4`), children: t }),
      n && (0, m.jsx)(`div`, { className: `mt-5 flex flex-wrap justify-center gap-2`, children: n }),
    ],
  })
}
var Zn = (e, t, n, r) => {
    let i = [n, { code: t, ...(r || {}) }]
    if (e?.services?.logger?.forward) return e.services.logger.forward(i, `warn`, `react-i18next::`, !0)
    ;(Q(i[0]) && (i[0] = `react-i18next:: ${i[0]}`),
      e?.services?.logger?.warn ? e.services.logger.warn(...i) : console?.warn && console.warn(...i))
  },
  Qn = {},
  $n = (e, t, n, r) => {
    ;(Q(n) && Qn[n]) || (Q(n) && (Qn[n] = new Date()), Zn(e, t, n, r))
  },
  er = (e, t) => () => {
    if (e.isInitialized) t()
    else {
      let n = () => {
        ;(setTimeout(() => {
          e.off(`initialized`, n)
        }, 0),
          t())
      }
      e.on(`initialized`, n)
    }
  },
  tr = (e, t, n) => {
    e.loadNamespaces(t, er(e, n))
  },
  nr = (e, t, n, r) => {
    if ((Q(n) && (n = [n]), e.options.preload && e.options.preload.indexOf(t) > -1)) return tr(e, n, r)
    ;(n.forEach((t) => {
      e.options.ns.indexOf(t) < 0 && e.options.ns.push(t)
    }),
      e.loadLanguages(t, er(e, r)))
  },
  rr = (e, t, n = {}) =>
    !t.languages || !t.languages.length
      ? ($n(t, `NO_LANGUAGES`, `i18n.languages were undefined or empty`, { languages: t.languages }), !0)
      : t.hasLoadedNamespace(e, {
          lng: n.lng,
          precheck: (t, r) => {
            if (
              n.bindI18n &&
              n.bindI18n.indexOf(`languageChanging`) > -1 &&
              t.services.backendConnector.backend &&
              t.isLanguageChangingTo &&
              !r(t.isLanguageChangingTo, e)
            )
              return !1
          },
        }),
  Q = (e) => typeof e == `string`,
  ir = (e) => typeof e == `object` && !!e,
  ar = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,
  or = {
    '&amp;': `&`,
    '&#38;': `&`,
    '&lt;': `<`,
    '&#60;': `<`,
    '&gt;': `>`,
    '&#62;': `>`,
    '&apos;': `'`,
    '&#39;': `'`,
    '&quot;': `"`,
    '&#34;': `"`,
    '&nbsp;': ` `,
    '&#160;': ` `,
    '&copy;': `©`,
    '&#169;': `©`,
    '&reg;': `®`,
    '&#174;': `®`,
    '&hellip;': `…`,
    '&#8230;': `…`,
    '&#x2F;': `/`,
    '&#47;': `/`,
  },
  sr = (e) => or[e],
  cr = {
    bindI18n: `languageChanged`,
    bindI18nStore: ``,
    transEmptyNodeValue: ``,
    transSupportBasicHtmlNodes: !0,
    transWrapTextNodes: ``,
    transKeepBasicHtmlNodesFor: [`br`, `strong`, `i`, `p`],
    useSuspense: !0,
    unescape: (e) => e.replace(ar, sr),
    transDefaultProps: void 0,
  },
  lr = (e = {}) => {
    cr = { ...cr, ...e }
  },
  ur = () => cr,
  dr,
  fr = (e) => {
    dr = e
  },
  pr = () => dr,
  mr = (0, p.createContext)(),
  hr = class {
    constructor() {
      this.usedNamespaces = {}
    }
    addUsedNamespaces(e) {
      e.forEach((e) => {
        this.usedNamespaces[e] || (this.usedNamespaces[e] = !0)
      })
    }
    getUsedNamespaces() {
      return Object.keys(this.usedNamespaces)
    }
  },
  gr = o((e) => {
    var t = u()
    function n(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t)
    }
    var r = typeof Object.is == `function` ? Object.is : n,
      i = t.useState,
      a = t.useEffect,
      o = t.useLayoutEffect,
      s = t.useDebugValue
    function c(e, t) {
      var n = t(),
        r = i({ inst: { value: n, getSnapshot: t } }),
        c = r[0].inst,
        u = r[1]
      return (
        o(
          function () {
            ;((c.value = n), (c.getSnapshot = t), l(c) && u({ inst: c }))
          },
          [e, n, t],
        ),
        a(
          function () {
            return (
              l(c) && u({ inst: c }),
              e(function () {
                l(c) && u({ inst: c })
              })
            )
          },
          [e],
        ),
        s(n),
        n
      )
    }
    function l(e) {
      var t = e.getSnapshot
      e = e.value
      try {
        var n = t()
        return !r(e, n)
      } catch {
        return !0
      }
    }
    function d(e, t) {
      return t()
    }
    var f = typeof window > `u` || window.document === void 0 || window.document.createElement === void 0 ? d : c
    e.useSyncExternalStore = t.useSyncExternalStore === void 0 ? f : t.useSyncExternalStore
  }),
  _r = o((e, t) => {
    t.exports = gr()
  })(),
  vr = {
    t: (e, t) => {
      if (Q(t)) return t
      if (ir(t) && Q(t.defaultValue)) return t.defaultValue
      if (typeof e == `function`) return ``
      if (Array.isArray(e)) {
        let t = e[e.length - 1]
        return typeof t == `function` ? `` : t
      }
      return e
    },
    ready: !1,
  },
  yr = () => () => {},
  br = (e, t = {}) => {
    let { i18n: n } = t,
      { i18n: r, defaultNS: i } = (0, p.useContext)(mr) || {},
      a = n || r || pr()
    ;(a && !a.reportNamespaces && (a.reportNamespaces = new hr()),
      a ||
        $n(
          a,
          `NO_I18NEXT_INSTANCE`,
          `useTranslation: You will need to pass in an i18next instance by using initReactI18next or by passing it via props or context. In monorepo setups, make sure there is only one instance of react-i18next.`,
        ))
    let o = (0, p.useMemo)(() => ({ ...ur(), ...a?.options?.react, ...t }), [a, t]),
      { useSuspense: s, keyPrefix: c } = o,
      l = e || i || a?.options?.defaultNS,
      u = Q(l) ? [l] : l || [`translation`],
      d = (0, p.useMemo)(() => u, u)
    a?.reportNamespaces?.addUsedNamespaces?.(d)
    let f = (0, p.useRef)(0),
      m = (0, p.useCallback)(
        (e) => {
          if (!a) return yr
          let { bindI18n: t, bindI18nStore: n } = o,
            r = () => {
              ;((f.current += 1), e())
            }
          return (
            t && a.on(t, r),
            n && a.store.on(n, r),
            () => {
              ;(t && t.split(` `).forEach((e) => a.off(e, r)), n && n.split(` `).forEach((e) => a.store.off(e, r)))
            }
          )
        },
        [a, o],
      ),
      h = (0, p.useRef)(),
      g = (0, p.useCallback)(() => {
        if (!a) return vr
        let e = !!(a.isInitialized || a.initializedStoreOnce) && d.every((e) => rr(e, a, o)),
          n = t.lng || a.language,
          r = f.current,
          i = h.current
        if (i && i.ready === e && i.lng === n && i.keyPrefix === c && i.revision === r) return i
        let s = { t: a.getFixedT(n, o.nsMode === `fallback` ? d : d[0], c, { scopeNs: d }), ready: e, lng: n, keyPrefix: c, revision: r }
        return ((h.current = s), s)
      }, [a, d, c, o, t.lng]),
      [_, v] = (0, p.useState)(0),
      { t: y, ready: b } = (0, _r.useSyncExternalStore)(m, g, g)
    ;(0, p.useEffect)(() => {
      if (a && !b && !s) {
        let e = () => v((e) => e + 1)
        t.lng ? nr(a, t.lng, d, e) : tr(a, d, e)
      }
    }, [a, t.lng, d, b, s, _])
    let x = a || {},
      S = (0, p.useRef)(null),
      C = (0, p.useRef)(),
      w = (e) => `${e.language}|${e.resolvedLanguage}|${e.languages?.join(`,`)}`,
      T = (e) => {
        let t = Object.getOwnPropertyDescriptors(e)
        t.__original && delete t.__original
        let n = Object.create(Object.getPrototypeOf(e), t)
        if (!Object.prototype.hasOwnProperty.call(n, `__original`))
          try {
            Object.defineProperty(n, '__original', { value: e, writable: !1, enumerable: !1, configurable: !1 })
          } catch {}
        return n
      },
      E = (0, p.useMemo)(() => {
        let e = x,
          t = e && w(e),
          n = e
        e && (S.current && S.current.__original === e && C.current === t ? (n = S.current) : ((n = T(e)), (S.current = n), (C.current = t)))
        let r =
            !b && !s
              ? (...e) => (
                  $n(
                    a,
                    `USE_T_BEFORE_READY`,
                    `useTranslation: t was called before ready. When using useSuspense: false, make sure to check the ready flag before using t.`,
                  ),
                  y(...e)
                )
              : y,
          i = [r, n, b]
        return ((i.t = r), (i.i18n = n), (i.ready = b), i)
      }, [y, x, b, x.resolvedLanguage, x.language, x.languages])
    if (a && s && !b) {
      let e = !1
      try {
        e = !1
      } catch {}
      throw (
        e &&
          $n(
            a,
            `SUSPENDED_WHILE_LOADING`,
            `useTranslation: suspended while translations are loading (useSuspense is true by default). Add a <Suspense> boundary above this component, or set react.useSuspense: false in the i18next init options. https://react.i18next.com/latest/usetranslation-hook`,
          ),
        new Promise((e) => {
          let n = () => e()
          t.lng ? nr(a, t.lng, d, n) : tr(a, d, n)
        })
      )
    }
    return E
  },
  xr = `/api`,
  Sr = `/garages`,
  Cr = `${xr}/v1/auth/google/login`,
  wr = `vietgara-google-auth`,
  Tr = `popup,width=520,height=680`,
  Er = `support@viettechno.com`,
  Dr = `vietgara.accessToken`,
  Or = `vietgara.refreshToken`,
  kr = `vietgara.user`,
  Ar = `vietgara.garageId`,
  jr = new Set()
function Mr(e) {
  return (jr.add(e), () => jr.delete(e))
}
function Nr() {
  jr.forEach((e) => e())
}
function Pr(e) {
  try {
    return localStorage.getItem(e)
  } catch {
    return null
  }
}
function Fr() {
  return Pr(Dr)
}
function Ir() {
  return Pr(Or)
}
function Lr() {
  let e = Pr(kr)
  if (!e) return null
  try {
    return JSON.parse(e)
  } catch {
    return null
  }
}
function Rr(e) {
  ;(localStorage.setItem(Dr, e.accessToken ?? ``),
    localStorage.setItem(Or, e.refreshToken ?? ``),
    e.user && localStorage.setItem(kr, JSON.stringify(e.user)),
    Nr())
}
function zr(e) {
  ;(localStorage.setItem(kr, JSON.stringify(e)), Nr())
}
function Br() {
  ;([Dr, Or, kr, Ar].forEach((e) => localStorage.removeItem(e)), Nr())
}
function Vr() {
  return Pr(Ar) ?? ``
}
function Hr(e) {
  localStorage.setItem(Ar, e)
}
function Ur() {
  return !!(Ir() && Fr())
}
var Wr = class extends Error {
    status
    code
    details
    constructor(e, t) {
      ;(super(t?.error?.message || `HTTP ${e}`),
        (this.name = `ApiError`),
        (this.status = e),
        (this.code = t?.error?.code || `INTERNAL`),
        (this.details = t?.error?.details ?? []))
    }
  },
  Gr = null
async function Kr() {
  let e = Ir()
  return e
    ? ((Gr ??= fetch(`${xr}/v1/auth/refresh`, {
        method: `POST`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify({ refreshToken: e }),
      })
        .then(async (e) => (e.ok ? (Rr(await e.json()), !0) : !1))
        .catch(() => !1)
        .finally(() => {
          Gr = null
        })),
      Gr)
    : !1
}
var qr = () => void 0
function Jr(e) {
  qr = e
}
async function $(e, t, n, r = {}) {
  let { headers: i = {}, retry: a = !0 } = r,
    o = Fr(),
    s = await fetch(`${xr}/v1${t}`, {
      method: e,
      headers: {
        ...(o ? { Authorization: `Bearer ${o}` } : {}),
        ...(n === void 0 ? {} : { 'Content-Type': `application/json` }),
        'Accept-Language': document.documentElement.lang || `vi`,
        ...i,
      },
      body: n === void 0 ? void 0 : JSON.stringify(n),
    })
  if (s.status === 401 && o && a) {
    if (await Kr()) return $(e, t, n, { headers: i, retry: !1 })
    ;(Br(), qr())
  }
  if (s.status === 204) return
  let c = await s.text(),
    l = c ? JSON.parse(c) : void 0
  if (!s.ok) throw new Wr(s.status, l)
  return l
}
var Yr = {
  get: (e) => $(`GET`, e),
  post: (e, t = {}) => $(`POST`, e, t),
  postIdempotent: (e, t, n) => $(`POST`, e, t, { headers: { 'Idempotency-Key': n } }),
  patch: (e, t) => $(`PATCH`, e, t),
  put: (e, t) => $(`PUT`, e, t),
  delete: (e) => $(`DELETE`, e),
  download: (e, t) => Xr(e, t),
}
async function Xr(e, t, n = !0) {
  let r = Fr(),
    i = await fetch(`${xr}/v1${e}`, { headers: { ...(r ? { Authorization: `Bearer ${r}` } : {}) } })
  if (i.status === 401 && r && n) {
    if (await Kr()) return Xr(e, t, !1)
    ;(Br(), qr())
    return
  }
  if (!i.ok) {
    let e = await i.text(),
      t = e ? JSON.parse(e) : void 0
    throw new Wr(i.status, t)
  }
  let a = await i.blob(),
    o = URL.createObjectURL(a),
    s = document.createElement(`a`)
  ;((s.href = o), (s.download = t), document.body.appendChild(s), s.click(), s.remove(), URL.revokeObjectURL(o))
}
function Zr(e) {
  let t = new URLSearchParams()
  for (let [n, r] of Object.entries(e)) r !== void 0 && r !== `` && r !== !1 && t.set(n, String(r))
  let n = t.toString()
  return n ? `?${n}` : ``
}
function Qr() {
  return crypto.randomUUID()
}
export {
  ye as $,
  Hn as A,
  c as At,
  xn as B,
  fr as C,
  T as Ct,
  Jn as D,
  f as Dt,
  Xn as E,
  g as Et,
  zn as F,
  sn as G,
  gn as H,
  Vn as I,
  Yt as J,
  on as K,
  Un as L,
  Fn as M,
  Rn as N,
  Wn as O,
  u as Ot,
  Bn as P,
  _e as Q,
  Pn as R,
  br as S,
  I as St,
  qn as T,
  _ as Tt,
  ln as U,
  hn as V,
  cn as W,
  be as X,
  Y,
  ve as Z,
  Sr as _,
  k as _t,
  $ as a,
  ce as at,
  Tr as b,
  M as bt,
  Vr as c,
  se as ct,
  Ur as d,
  te as dt,
  he as et,
  Mr as f,
  w as ft,
  xr as g,
  S as gt,
  Hr as h,
  ee as ht,
  Zr as i,
  R as it,
  Ln as j,
  In as k,
  o as kt,
  Ir as l,
  C as lt,
  zr as m,
  D as mt,
  Yr as n,
  de as nt,
  Jr as o,
  P as ot,
  Rr as p,
  oe as pt,
  X as q,
  Qr as r,
  ue as rt,
  Br as s,
  F as st,
  Wr as t,
  me as tt,
  Lr as u,
  O as ut,
  wr as v,
  ae as vt,
  lr as w,
  y as wt,
  Er as x,
  L as xt,
  Cr as y,
  E as yt,
  vn as z,
}
