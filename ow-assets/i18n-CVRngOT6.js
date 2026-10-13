import { C as e, w as t } from './api-lC4u2sZi.js'
var n = (e) => typeof e == `string`,
  r = () => {
    let e,
      t,
      n = new Promise((n, r) => {
        ;((e = n), (t = r))
      })
    return ((n.resolve = e), (n.reject = t), n)
  },
  i = (e) => (e == null ? `` : String(e)),
  a = (e, t, n) => {
    e.forEach((e) => {
      t[e] && (n[e] = t[e])
    })
  },
  o = /###/g,
  s = (e) => (e && e.includes(`###`) ? e.replace(o, `.`) : e),
  c = (e) => !e || n(e),
  l = (e, t, r) => {
    let i = n(t) ? t.split(`.`) : t,
      a = 0
    for (; a < i.length - 1;) {
      if (c(e)) return {}
      let t = s(i[a])
      ;(!e[t] && r && (e[t] = new r()), (e = Object.prototype.hasOwnProperty.call(e, t) ? e[t] : {}), ++a)
    }
    return c(e) ? {} : { obj: e, k: s(i[a]) }
  },
  u = (e, t, n) => {
    let { obj: r, k: i } = l(e, t, Object)
    if (r !== void 0 || t.length === 1) {
      r[i] = n
      return
    }
    let a = t[t.length - 1],
      o = t.slice(0, t.length - 1),
      s = l(e, o, Object)
    for (; s.obj === void 0 && o.length;)
      ((a = `${o[o.length - 1]}.${a}`),
        (o = o.slice(0, o.length - 1)),
        (s = l(e, o, Object)),
        s?.obj && s.obj[`${s.k}.${a}`] !== void 0 && (s.obj = void 0))
    s.obj[`${s.k}.${a}`] = n
  },
  d = (e, t, n, r) => {
    let { obj: i, k: a } = l(e, t, Object)
    ;((i[a] = i[a] || []), i[a].push(n))
  },
  f = (e, t) => {
    let { obj: n, k: r } = l(e, t)
    if (n && Object.prototype.hasOwnProperty.call(n, r)) return n[r]
  },
  p = (e, t, n) => {
    let r = f(e, n)
    return r === void 0 ? f(t, n) : r
  },
  m = (e, t, r) => {
    for (let i in t)
      i !== `__proto__` &&
        i !== `constructor` &&
        (Object.prototype.hasOwnProperty.call(e, i)
          ? n(e[i]) || e[i] instanceof String || n(t[i]) || t[i] instanceof String
            ? r && (e[i] = t[i])
            : m(e[i], t[i], r)
          : (e[i] = t[i]))
    return e
  },
  h = (e) => e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, `\\$&`),
  g = { '&': `&amp;`, '<': `&lt;`, '>': `&gt;`, '"': `&quot;`, "'": `&#39;`, '/': `&#x2F;` },
  _ = (e) => (n(e) ? e.replace(/[&<>"'\/]/g, (e) => g[e]) : e),
  v = class {
    constructor(e) {
      ;((this.capacity = e), (this.regExpMap = new Map()), (this.regExpQueue = []))
    }
    getRegExp(e) {
      let t = this.regExpMap.get(e)
      if (t !== void 0) return t
      let n = new RegExp(e)
      return (
        this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()),
        this.regExpMap.set(e, n),
        this.regExpQueue.push(e),
        n
      )
    }
  },
  y = [` `, `,`, `?`, `!`, `;`],
  b = new v(20),
  x = (e, t, n) => {
    ;((t ||= ``), (n ||= ``))
    let r = y.filter((e) => !t.includes(e) && !n.includes(e))
    if (r.length === 0) return !0
    let i = b.getRegExp(`(${r.map((e) => (e === `?` ? `\\?` : e)).join(`|`)})`),
      a = !i.test(e)
    if (!a) {
      let t = e.indexOf(n)
      t > 0 && !i.test(e.substring(0, t)) && (a = !0)
    }
    return a
  },
  S = (e, t, n = `.`) => {
    if (!e) return
    if (e[t]) return Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0
    let r = t.split(n),
      i = e
    for (let e = 0; e < r.length;) {
      if (!i || typeof i != `object`) return
      let t,
        a = ``
      for (let o = e; o < r.length; ++o)
        if ((o !== e && (a += n), (a += r[o]), (t = i[a]), t !== void 0)) {
          if ([`string`, `number`, `boolean`].includes(typeof t) && o < r.length - 1) continue
          e += o - e + 1
          break
        }
      i = t
    }
    return i
  },
  C = (e) => e?.replace(/_/g, `-`),
  w = {
    type: `logger`,
    log(e) {
      this.output(`log`, e)
    },
    warn(e) {
      this.output(`warn`, e)
    },
    error(e) {
      this.output(`error`, e)
    },
    output(e, t) {
      console?.[e]?.apply?.(console, t)
    },
  },
  T = new (class e {
    constructor(e, t = {}) {
      this.init(e, t)
    }
    init(e, t = {}) {
      ;((this.prefix = t.prefix || `i18next:`), (this.logger = e || w), (this.options = t), (this.debug = t.debug))
    }
    log(...e) {
      return this.forward(e, `log`, ``, !0)
    }
    warn(...e) {
      return this.forward(e, `warn`, ``, !0)
    }
    error(...e) {
      return this.forward(e, `error`, ``)
    }
    deprecate(...e) {
      return this.forward(e, `warn`, `WARNING DEPRECATED: `, !0)
    }
    forward(e, t, r, i) {
      return i && !this.debug
        ? null
        : ((e = e.map((e) => (n(e) ? e.replace(/[\r\n\x00-\x1F\x7F]/g, ` `) : e))),
          n(e[0]) && (e[0] = `${r}${this.prefix} ${e[0]}`),
          this.logger[t](e))
    }
    create(t) {
      return new e(this.logger, { prefix: `${this.prefix}:${t}:`, ...this.options })
    }
    clone(t) {
      return ((t ||= this.options), (t.prefix = t.prefix || this.prefix), new e(this.logger, t))
    }
  })(),
  E = class {
    constructor() {
      this.observers = {}
    }
    on(e, t) {
      return (
        e.split(` `).forEach((e) => {
          this.observers[e] || (this.observers[e] = new Map())
          let n = this.observers[e].get(t) || 0
          this.observers[e].set(t, n + 1)
        }),
        this
      )
    }
    off(e, t) {
      if (this.observers[e]) {
        if (!t) {
          delete this.observers[e]
          return
        }
        this.observers[e].delete(t)
      }
    }
    once(e, t) {
      let n = (...r) => {
        ;(t(...r), this.off(e, n))
      }
      return (this.on(e, n), this)
    }
    emit(e, ...t) {
      ;(this.observers[e] &&
        Array.from(this.observers[e].entries()).forEach(([e, n]) => {
          for (let r = 0; r < n; r++) e(...t)
        }),
        this.observers[`*`] &&
          Array.from(this.observers[`*`].entries()).forEach(([n, r]) => {
            for (let i = 0; i < r; i++) n(e, ...t)
          }))
    }
  },
  D = class extends E {
    constructor(e, t = { ns: [`translation`], defaultNS: `translation` }) {
      ;(super(),
        (this.data = e || {}),
        (this.options = t),
        this.options.keySeparator === void 0 && (this.options.keySeparator = `.`),
        this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0))
    }
    addNamespaces(e) {
      this.options.ns.includes(e) || this.options.ns.push(e)
    }
    removeNamespaces(e) {
      let t = this.options.ns.indexOf(e)
      t > -1 && this.options.ns.splice(t, 1)
    }
    getResource(e, t, r, i = {}) {
      let a = i.keySeparator === void 0 ? this.options.keySeparator : i.keySeparator,
        o = i.ignoreJSONStructure === void 0 ? this.options.ignoreJSONStructure : i.ignoreJSONStructure,
        s
      e.includes(`.`)
        ? (s = e.split(`.`))
        : ((s = [e, t]), r && (Array.isArray(r) ? s.push(...r) : n(r) && a ? s.push(...r.split(a)) : s.push(r)))
      let c = f(this.data, s)
      return (
        !c && !t && !r && e.includes(`.`) && ((e = s[0]), (t = s[1]), (r = s.slice(2).join(`.`))),
        c || !o || !n(r) ? c : S(this.data?.[e]?.[t], r, a)
      )
    }
    addResource(e, t, n, r, i = { silent: !1 }) {
      let a = i.keySeparator === void 0 ? this.options.keySeparator : i.keySeparator,
        o = [e, t]
      ;(n && (o = o.concat(a ? n.split(a) : n)),
        e.includes(`.`) && ((o = e.split(`.`)), (r = t), (t = o[1])),
        this.addNamespaces(t),
        u(this.data, o, r),
        i.silent || this.emit(`added`, e, t, n, r))
    }
    addResources(e, t, r, i = { silent: !1 }) {
      for (let i in r) (n(r[i]) || Array.isArray(r[i])) && this.addResource(e, t, i, r[i], { silent: !0 })
      i.silent || this.emit(`added`, e, t, r)
    }
    addResourceBundle(e, t, n, r, i, a = { silent: !1, skipCopy: !1 }) {
      let o = [e, t]
      ;(e.includes(`.`) && ((o = e.split(`.`)), (r = n), (n = t), (t = o[1])), this.addNamespaces(t))
      let s = f(this.data, o) || {}
      ;(a.skipCopy || (n = JSON.parse(JSON.stringify(n))),
        r ? m(s, n, i) : (s = { ...s, ...n }),
        u(this.data, o, s),
        a.silent || this.emit(`added`, e, t, n))
    }
    removeResourceBundle(e, t) {
      ;(this.hasResourceBundle(e, t) && delete this.data[e][t], this.removeNamespaces(t), this.emit(`removed`, e, t))
    }
    hasResourceBundle(e, t) {
      return this.getResource(e, t) !== void 0
    }
    getResourceBundle(e, t) {
      return ((t ||= this.options.defaultNS), this.getResource(e, t))
    }
    getDataByLanguage(e) {
      return this.data[e]
    }
    hasLanguageSomeTranslations(e) {
      let t = this.getDataByLanguage(e)
      return !!((t && Object.keys(t)) || []).find((e) => t[e] && Object.keys(t[e]).length > 0)
    }
    toJSON() {
      return this.data
    }
  },
  O = {
    processors: {},
    addPostProcessor(e) {
      this.processors[e.name] = e
    },
    handle(e, t, n, r, i) {
      return (
        e.forEach((e) => {
          t = this.processors[e]?.process(t, n, r, i) ?? t
        }),
        t
      )
    },
  },
  k = Symbol(`i18next/PATH_KEY`)
function A() {
  let e = [],
    t = Object.create(null),
    n
  return (
    (t.get = (r, i) => (n?.revoke?.(), i === k ? e : (e.push(i), (n = Proxy.revocable(r, t)), n.proxy))),
    Proxy.revocable(Object.create(null), t).proxy
  )
}
function j(e, t) {
  let { [k]: n } = e(A()),
    r = t?.keySeparator ?? `.`,
    i = t?.nsSeparator ?? `:`,
    a = t?.enableSelector === `strict`
  if (n.length > 1 && i) {
    let e = t?.ns,
      o = a ? (Array.isArray(e) ? e : e ? [e] : null) : Array.isArray(e) ? e : null
    if (o && (a ? o : o.length > 1 ? o.slice(1) : []).includes(n[0])) return `${n[0]}${i}${n.slice(1).join(r)}`
  }
  return n.join(r)
}
var M = (e) => !n(e) && typeof e != `boolean` && typeof e != `number`,
  N = class e extends E {
    constructor(e, t = {}) {
      ;(super(),
        a([`resourceStore`, `languageUtils`, `pluralResolver`, `interpolator`, `backendConnector`, `i18nFormat`, `utils`], e, this),
        (this.options = t),
        this.options.keySeparator === void 0 && (this.options.keySeparator = `.`),
        (this.logger = T.create(`translator`)),
        (this.checkedLoadedFor = {}))
    }
    changeLanguage(e) {
      e && (this.language = e)
    }
    exists(e, t = { interpolation: {} }) {
      let n = { ...t }
      if (e == null) return !1
      let r = this.resolve(e, n)
      if (r?.res === void 0) return !1
      let i = M(r.res)
      return !(n.returnObjects === !1 && i)
    }
    extractFromKey(e, t) {
      let r = t.nsSeparator === void 0 ? this.options.nsSeparator : t.nsSeparator
      r === void 0 && (r = `:`)
      let i = t.keySeparator === void 0 ? this.options.keySeparator : t.keySeparator,
        a = t.ns || this.options.defaultNS || [],
        o = r && e.includes(r),
        s =
          !this.options.userDefinedKeySeparator && !t.keySeparator && !this.options.userDefinedNsSeparator && !t.nsSeparator && !x(e, r, i)
      if (o && !s) {
        let t = e.match(this.interpolator.nestingRegexp)
        if (t && t.length > 0) return { key: e, namespaces: n(a) ? [a] : a }
        let o = e.split(r)
        ;((r !== i || (r === i && this.options.ns.includes(o[0]))) && (a = o.shift()), (e = o.join(i)))
      }
      return { key: e, namespaces: n(a) ? [a] : a }
    }
    translate(t, r, i) {
      let a = typeof r == `object` ? { ...r } : r
      if (
        (typeof a != `object` &&
          this.options.overloadTranslationOptionHandler &&
          (a = this.options.overloadTranslationOptionHandler(arguments)),
        typeof a == `object` && (a = { ...a }),
        (a ||= {}),
        t == null)
      )
        return ``
      ;(typeof t == `function` && (t = j(t, { ...this.options, ...a })),
        Array.isArray(t) || (t = [String(t)]),
        (t = t.map((e) => (typeof e == `function` ? j(e, { ...this.options, ...a }) : String(e)))))
      let o = a.returnDetails === void 0 ? this.options.returnDetails : a.returnDetails,
        s = a.keySeparator === void 0 ? this.options.keySeparator : a.keySeparator,
        { key: c, namespaces: l } = this.extractFromKey(t[t.length - 1], a),
        u = l[l.length - 1],
        d = a.nsSeparator === void 0 ? this.options.nsSeparator : a.nsSeparator
      d === void 0 && (d = `:`)
      let f = a.lng || this.language,
        p = a.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode
      if (f?.toLowerCase() === `cimode`)
        return p
          ? o
            ? { res: `${u}${d}${c}`, usedKey: c, exactUsedKey: c, usedLng: f, usedNS: u, usedParams: this.getUsedParamsDetails(a) }
            : `${u}${d}${c}`
          : o
            ? { res: c, usedKey: c, exactUsedKey: c, usedLng: f, usedNS: u, usedParams: this.getUsedParamsDetails(a) }
            : c
      let m = this.resolve(t, a),
        h = m?.res,
        g = m?.usedKey || c,
        _ = m?.exactUsedKey || c,
        v = [`[object Number]`, `[object Function]`, `[object RegExp]`],
        y = a.joinArrays === void 0 ? this.options.joinArrays : a.joinArrays,
        b = !this.i18nFormat || this.i18nFormat.handleAsObject,
        x = a.count !== void 0 && !n(a.count),
        S = e.hasDefaultValue(a),
        C = x ? this.pluralResolver.getSuffix(f, a.count, a) : ``,
        w = a.ordinal && x ? this.pluralResolver.getSuffix(f, a.count, { ordinal: !1 }) : ``,
        T = x && !a.ordinal && a.count === 0,
        E = (T && a[`defaultValue${this.options.pluralSeparator}zero`]) || a[`defaultValue${C}`] || a[`defaultValue${w}`] || a.defaultValue,
        D = h
      b && !h && S && (D = E)
      let O = M(D),
        k = Object.prototype.toString.apply(D)
      if (b && D && O && !v.includes(k) && !(n(y) && Array.isArray(D))) {
        if (!a.returnObjects && !this.options.returnObjects) {
          this.options.returnedObjectHandler || this.logger.warn(`accessing an object - but returnObjects options is not enabled!`)
          let e = this.options.returnedObjectHandler
            ? this.options.returnedObjectHandler(g, D, { ...a, ns: l })
            : `key '${c} (${this.language})' returned an object instead of string.`
          return o ? ((m.res = e), (m.usedParams = this.getUsedParamsDetails(a)), m) : e
        }
        if (s) {
          let e = Array.isArray(D),
            t = e ? [] : {},
            n = e ? _ : g
          for (let e in D)
            if (Object.prototype.hasOwnProperty.call(D, e)) {
              let r = `${n}${s}${e}`
              ;((t[e] =
                S && !h
                  ? this.translate(r, { ...a, defaultValue: M(E) ? E[e] : void 0, joinArrays: !1, ns: l })
                  : this.translate(r, { ...a, joinArrays: !1, ns: l })),
                t[e] === r && (t[e] = D[e]))
            }
          h = t
        }
      } else if (b && n(y) && Array.isArray(h)) ((h = h.join(y)), (h &&= this.extendTranslation(h, t, a, i)))
      else {
        let e = !1,
          n = !1
        ;(!this.isValidLookup(h) && S && ((e = !0), (h = E)), this.isValidLookup(h) || ((n = !0), (h = c)))
        let r = (a.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && n ? void 0 : h,
          o = S && E !== h && this.options.updateMissing
        if (n || e || o) {
          if (
            (this.logger.log(
              o ? `updateKey` : `missingKey`,
              f,
              u,
              x && !o ? `${c}${this.pluralResolver.getSuffix(f, a.count, a)}` : c,
              o ? E : h,
            ),
            s)
          ) {
            let e = this.resolve(c, { ...a, keySeparator: !1 })
            e &&
              e.res &&
              this.logger.warn(
                `Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.`,
              )
          }
          let e = [],
            t = this.languageUtils.getFallbackCodes(this.options.fallbackLng, a.lng || this.language)
          if (this.options.saveMissingTo === `fallback` && t && t[0]) for (let n = 0; n < t.length; n++) e.push(t[n])
          else
            this.options.saveMissingTo === `all`
              ? (e = this.languageUtils.toResolveHierarchy(a.lng || this.language))
              : e.push(a.lng || this.language)
          let n = (e, t, n) => {
            let i = S && n !== h ? n : r
            ;(this.options.missingKeyHandler
              ? this.options.missingKeyHandler(e, u, t, i, o, a)
              : this.backendConnector?.saveMissing && this.backendConnector.saveMissing(e, u, t, i, o, a),
              this.emit(`missingKey`, e, u, t, h))
          }
          this.options.saveMissing &&
            (this.options.saveMissingPlurals && x
              ? e.forEach((e) => {
                  let t = this.pluralResolver.getSuffixes(e, a)
                  ;(T &&
                    a[`defaultValue${this.options.pluralSeparator}zero`] &&
                    !t.includes(`${this.options.pluralSeparator}zero`) &&
                    t.push(`${this.options.pluralSeparator}zero`),
                    t.forEach((t) => {
                      n([e], c + t, a[`defaultValue${t}`] || E)
                    }))
                })
              : n(e, c, E))
        }
        ;((h = this.extendTranslation(h, t, a, m, i)),
          n && h === c && this.options.appendNamespaceToMissingKey && (h = `${u}${d}${c}`),
          (n || e) &&
            this.options.parseMissingKeyHandler &&
            (h = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${u}${d}${c}` : c, e ? h : void 0, a)))
      }
      return o ? ((m.res = h), (m.usedParams = this.getUsedParamsDetails(a)), m) : h
    }
    extendTranslation(e, t, r, i, a) {
      if (this.i18nFormat?.parse)
        e = this.i18nFormat.parse(
          e,
          { ...this.options.interpolation.defaultVariables, ...r },
          r.lng || this.language || i.usedLng,
          i.usedNS,
          i.usedKey,
          { resolved: i },
        )
      else if (!r.skipInterpolation) {
        r.interpolation && this.interpolator.init({ ...r, interpolation: { ...this.options.interpolation, ...r.interpolation } })
        let o =
            n(e) &&
            (r?.interpolation?.skipOnVariables === void 0 ? this.options.interpolation.skipOnVariables : r.interpolation.skipOnVariables),
          s
        if (o) {
          let t = e.match(this.interpolator.nestingRegexp)
          s = t && t.length
        }
        let c = r.replace && !n(r.replace) ? r.replace : r
        if (
          (this.options.interpolation.defaultVariables && (c = { ...this.options.interpolation.defaultVariables, ...c }),
          (e = this.interpolator.interpolate(e, c, r.lng || this.language || i.usedLng, r)),
          o)
        ) {
          let t = e.match(this.interpolator.nestingRegexp),
            n = t && t.length
          s < n && (r.nest = !1)
        }
        ;(!r.lng && i && i.res && (r.lng = this.language || i.usedLng),
          r.nest !== !1 &&
            (e = this.interpolator.nest(
              e,
              (...e) =>
                a?.[0] === e[0] && !r.context
                  ? (this.logger.warn(`It seems you are nesting recursively key: ${e[0]} in key: ${t[0]}`), null)
                  : this.translate(...e, t),
              r,
            )),
          r.interpolation && this.interpolator.reset())
      }
      let o = r.postProcess || this.options.postProcess,
        s = n(o) ? [o] : o
      return (
        e != null &&
          s?.length &&
          r.applyPostProcessor !== !1 &&
          (e = O.handle(
            s,
            e,
            t,
            this.options && this.options.postProcessPassResolved
              ? { i18nResolved: { ...i, usedParams: this.getUsedParamsDetails(r) }, ...r }
              : r,
            this,
          )),
        e
      )
    }
    resolve(e, t = {}) {
      let r, i, a, o, s
      return (
        n(e) && (e = [e]),
        Array.isArray(e) && (e = e.map((e) => (typeof e == `function` ? j(e, { ...this.options, ...t }) : e))),
        e.forEach((e) => {
          if (this.isValidLookup(r)) return
          let c = this.extractFromKey(e, t),
            l = c.key
          i = l
          let u = c.namespaces
          this.options.fallbackNS && (u = u.concat(this.options.fallbackNS))
          let d = t.count !== void 0 && !n(t.count),
            f = d && !t.ordinal && t.count === 0,
            p = t.context !== void 0 && (n(t.context) || typeof t.context == `number`) && t.context !== ``,
            m = t.lngs ? t.lngs : this.languageUtils.toResolveHierarchy(t.lng || this.language, t.fallbackLng)
          u.forEach((e) => {
            this.isValidLookup(r) ||
              ((s = e),
              !this.checkedLoadedFor[`${m[0]}-${e}`] &&
                this.utils?.hasLoadedNamespace &&
                !this.utils?.hasLoadedNamespace(s) &&
                ((this.checkedLoadedFor[`${m[0]}-${e}`] = !0),
                this.logger.warn(
                  `key "${i}" for languages "${m.join(`, `)}" won't get resolved as namespace "${s}" was not yet loaded`,
                  `This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!`,
                )),
              m.forEach((n) => {
                if (this.isValidLookup(r)) return
                o = n
                let i = [l]
                if (this.i18nFormat?.addLookupKeys) this.i18nFormat.addLookupKeys(i, l, n, e, t)
                else {
                  let e
                  d && (e = this.pluralResolver.getSuffix(n, t.count, t))
                  let r = `${this.options.pluralSeparator}zero`,
                    a = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`
                  if (
                    (d &&
                      (t.ordinal && e.startsWith(a) && i.push(l + e.replace(a, this.options.pluralSeparator)),
                      i.push(l + e),
                      f && i.push(l + r)),
                    p)
                  ) {
                    let n = `${l}${this.options.contextSeparator || `_`}${t.context}`
                    ;(i.push(n),
                      d &&
                        (t.ordinal && e.startsWith(a) && i.push(n + e.replace(a, this.options.pluralSeparator)),
                        i.push(n + e),
                        f && i.push(n + r)))
                  }
                }
                let s
                for (; (s = i.pop());) this.isValidLookup(r) || ((a = s), (r = this.getResource(n, e, s, t)))
              }))
          })
        }),
        { res: r, usedKey: i, exactUsedKey: a, usedLng: o, usedNS: s }
      )
    }
    isValidLookup(e) {
      return e !== void 0 && !(!this.options.returnNull && e === null) && !(!this.options.returnEmptyString && e === ``)
    }
    getResource(e, t, n, r = {}) {
      return this.i18nFormat?.getResource ? this.i18nFormat.getResource(e, t, n, r) : this.resourceStore.getResource(e, t, n, r)
    }
    getUsedParamsDetails(e = {}) {
      let t = [
          `defaultValue`,
          `ordinal`,
          `context`,
          `replace`,
          `lng`,
          `lngs`,
          `fallbackLng`,
          `ns`,
          `keySeparator`,
          `nsSeparator`,
          `returnObjects`,
          `returnDetails`,
          `joinArrays`,
          `postProcess`,
          `interpolation`,
        ],
        r = e.replace && !n(e.replace),
        i = r ? e.replace : e
      if (
        (r && e.count !== void 0 && (i = { ...i, count: e.count }),
        this.options.interpolation.defaultVariables && (i = { ...this.options.interpolation.defaultVariables, ...i }),
        !r)
      ) {
        i = { ...i }
        for (let e of t) delete i[e]
      }
      return i
    }
    static hasDefaultValue(e) {
      for (let t in e) if (Object.prototype.hasOwnProperty.call(e, t) && t.startsWith(`defaultValue`) && e[t] !== void 0) return !0
      return !1
    }
  },
  P = class {
    constructor(e) {
      ;((this.options = e),
        (this.supportedLngs = this.options.supportedLngs || !1),
        (this.logger = T.create(`languageUtils`)),
        (this.resolveHierarchyCache = {}))
    }
    clearCache() {
      this.resolveHierarchyCache = {}
    }
    getScriptPartFromCode(e) {
      if (((e = C(e)), !e || !e.includes(`-`))) return null
      let t = e.split(`-`)
      return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === `x`) ? null : this.formatLanguageCode(t.join(`-`))
    }
    getLanguagePartFromCode(e) {
      if (((e = C(e)), !e || !e.includes(`-`))) return e
      let t = e.split(`-`)
      return this.formatLanguageCode(t[0])
    }
    formatLanguageCode(e) {
      if (n(e) && e.includes(`-`)) {
        let t
        try {
          t = Intl.getCanonicalLocales(e)[0]
        } catch {}
        return (t && this.options.lowerCaseLng && (t = t.toLowerCase()), t || (this.options.lowerCaseLng ? e.toLowerCase() : e))
      }
      return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e
    }
    isSupportedCode(e) {
      return (
        (this.options.load === `languageOnly` || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)),
        !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.includes(e)
      )
    }
    getBestMatchFromCodes(e) {
      if (!e) return null
      let t
      return (
        e.forEach((e) => {
          if (t) return
          let n = this.formatLanguageCode(e)
          ;(!this.options.supportedLngs || this.isSupportedCode(n)) && (t = n)
        }),
        !t &&
          this.options.supportedLngs &&
          e.forEach((e) => {
            if (t) return
            let n = this.getScriptPartFromCode(e)
            if (this.isSupportedCode(n)) return (t = n)
            let r = this.getLanguagePartFromCode(e)
            if (this.isSupportedCode(r)) return (t = r)
            t = this.options.supportedLngs.find((e) =>
              e === r
                ? !0
                : !e.includes(`-`) && !r.includes(`-`)
                  ? !1
                  : !!((e.includes(`-`) && !r.includes(`-`) && e.slice(0, e.indexOf(`-`)) === r) || (e.startsWith(r) && r.length > 1)),
            )
          }),
        (t ||= this.getFallbackCodes(this.options.fallbackLng)[0]),
        t
      )
    }
    getFallbackCodes(e, t) {
      if (!e) return []
      if ((typeof e == `function` && (e = e(t)), n(e) && (e = [e]), Array.isArray(e))) return e
      if (!t) return e.default || []
      let r = e[t]
      return (
        (r ||= e[this.getScriptPartFromCode(t)]),
        (r ||= e[this.formatLanguageCode(t)]),
        (r ||= e[this.getLanguagePartFromCode(t)]),
        (r ||= e.default),
        r || []
      )
    }
    toResolveHierarchy(e, t) {
      let r = this.options.fallbackLng,
        i = Array.isArray(r) ? r.join(`|`) : r
      i !== this._cachedFallbackLng && ((this.resolveHierarchyCache = {}), (this._cachedFallbackLng = i))
      let a = t === void 0 || t === !1 || n(t),
        o = t === void 0 && typeof this.options.fallbackLng == `function`,
        s = n(e) && a && !o,
        c = null
      if (s) {
        let n
        ;((n = t === void 0 ? `undefined` : t === !1 ? `boolean:false` : `string:${t}`), (c = `${e.length}:${e}|${n}`))
      }
      if (c !== null) {
        let e = this.resolveHierarchyCache[c]
        if (e !== void 0) return e.slice()
      }
      let l = this.getFallbackCodes((t === !1 ? [] : t) || this.options.fallbackLng || [], e),
        u = [],
        d = (e) => {
          e && (this.isSupportedCode(e) ? u.push(e) : this.logger.warn(`rejecting language code not found in supportedLngs: ${e}`))
        }
      return (
        n(e) && (e.includes(`-`) || e.includes(`_`))
          ? (this.options.load !== `languageOnly` && d(this.formatLanguageCode(e)),
            this.options.load !== `languageOnly` && this.options.load !== `currentOnly` && d(this.getScriptPartFromCode(e)),
            this.options.load !== `currentOnly` && d(this.getLanguagePartFromCode(e)))
          : n(e) && d(this.formatLanguageCode(e)),
        l.forEach((e) => {
          u.includes(e) || d(this.formatLanguageCode(e))
        }),
        c === null ? u : ((this.resolveHierarchyCache[c] = u), u.slice())
      )
    }
  },
  F = { zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5 },
  I = { select: (e) => (e === 1 ? `one` : `other`), resolvedOptions: () => ({ pluralCategories: [`one`, `other`] }) },
  L = class {
    constructor(e, t = {}) {
      ;((this.languageUtils = e), (this.options = t), (this.logger = T.create(`pluralResolver`)), (this.pluralRulesCache = {}))
    }
    clearCache() {
      this.pluralRulesCache = {}
    }
    getRule(e, t = {}) {
      let n = C(e === `dev` ? `en` : e),
        r = t.ordinal ? `ordinal` : `cardinal`,
        i = JSON.stringify({ cleanedCode: n, type: r })
      if (i in this.pluralRulesCache) return this.pluralRulesCache[i]
      let a
      try {
        a = new Intl.PluralRules(n, { type: r })
      } catch {
        if (typeof Intl > `u`) return (this.logger.error(`No Intl support, please use an Intl polyfill!`), I)
        if (!e.match(/-|_/)) return I
        let n = this.languageUtils.getLanguagePartFromCode(e)
        a = this.getRule(n, t)
      }
      return ((this.pluralRulesCache[i] = a), a)
    }
    needsPlural(e, t = {}) {
      let n = this.getRule(e, t)
      return ((n ||= this.getRule(`dev`, t)), n?.resolvedOptions().pluralCategories.length > 1)
    }
    getPluralFormsOfKey(e, t, n = {}) {
      return this.getSuffixes(e, n).map((e) => `${t}${e}`)
    }
    getSuffixes(e, t = {}) {
      let n = this.getRule(e, t)
      return (
        (n ||= this.getRule(`dev`, t)),
        n
          ? n
              .resolvedOptions()
              .pluralCategories.sort((e, t) => F[e] - F[t])
              .map((e) => `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ``}${e}`)
          : []
      )
    }
    getSuffix(e, t, n = {}) {
      let r = this.getRule(e, n)
      return r
        ? `${this.options.prepend}${n.ordinal ? `ordinal${this.options.prepend}` : ``}${r.select(t)}`
        : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix(`dev`, t, n))
    }
  },
  R = (e, t, r, i = `.`, a = !0) => {
    let o = p(e, t, r)
    return (!o && a && n(r) && ((o = S(e, r, i)), o === void 0 && (o = S(t, r, i))), o)
  },
  z = (e) => e.replace(/\$/g, `$$$$`),
  B = class {
    constructor(e = {}) {
      ;((this.logger = T.create(`interpolator`)), (this.options = e), (this.format = e?.interpolation?.format || ((e) => e)), this.init(e))
    }
    init(e = {}) {
      e.interpolation ||= { escapeValue: !0 }
      let {
        escape: t,
        escapeValue: n,
        useRawValueToEscape: r,
        prefix: i,
        prefixEscaped: a,
        suffix: o,
        suffixEscaped: s,
        formatSeparator: c,
        unescapeSuffix: l,
        unescapePrefix: u,
        nestingPrefix: d,
        nestingPrefixEscaped: f,
        nestingSuffix: p,
        nestingSuffixEscaped: m,
        nestingOptionsSeparator: g,
        maxReplaces: v,
        alwaysFormat: y,
      } = e.interpolation
      ;((this.escape = t === void 0 ? _ : t),
        (this.escapeValue = n === void 0 || n),
        (this.useRawValueToEscape = r !== void 0 && r),
        (this.prefix = i ? h(i) : a || `{{`),
        (this.suffix = o ? h(o) : s || `}}`),
        (this.formatSeparator = c || `,`),
        (this.unescapePrefix = l ? `` : u ? h(u) : `-`),
        (this.unescapeSuffix = this.unescapePrefix ? `` : l ? h(l) : ``),
        (this.nestingPrefix = d ? h(d) : f || h(`$t(`)),
        (this.nestingSuffix = p ? h(p) : m || h(`)`)),
        (this.nestingOptionsSeparator = g || `,`),
        (this.maxReplaces = v || 1e3),
        (this.alwaysFormat = y !== void 0 && y),
        this.resetRegExp())
    }
    reset() {
      this.options && this.init(this.options)
    }
    resetRegExp() {
      let e = (e, t) => (e?.source === t ? ((e.lastIndex = 0), e) : new RegExp(t, `g`))
      ;((this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`)),
        (this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`)),
        (this.nestingRegexp = e(
          this.nestingRegexp,
          `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`,
        )))
    }
    interpolate(e, t, r, a) {
      let o,
        s,
        c,
        l = (this.options && this.options.interpolation && this.options.interpolation.defaultVariables) || {},
        u = (e) => {
          if (!e.includes(this.formatSeparator)) {
            let n = R(t, l, e, this.options.keySeparator, this.options.ignoreJSONStructure)
            return this.alwaysFormat ? this.format(n, void 0, r, { ...a, ...t, interpolationkey: e }) : n
          }
          let n = e.split(this.formatSeparator),
            i = n.shift().trim(),
            o = n.join(this.formatSeparator).trim()
          return this.format(R(t, l, i, this.options.keySeparator, this.options.ignoreJSONStructure), o, r, {
            ...a,
            ...t,
            interpolationkey: i,
          })
        }
      ;(this.resetRegExp(),
        !this.escapeValue &&
          typeof e == `string` &&
          /\$t\([^)]*\{[^}]*\{\{/.test(e) &&
          this.logger.warn(
            `nesting options string contains interpolated variables with escapeValue: false — if any of those values are attacker-controlled they can inject additional nesting options (e.g. redirect lng/ns). Sanitise untrusted input before passing it to t(), or keep escapeValue: true.`,
          ))
      let d = a?.missingInterpolationHandler || this.options.missingInterpolationHandler,
        f = a?.interpolation?.skipOnVariables === void 0 ? this.options.interpolation.skipOnVariables : a.interpolation.skipOnVariables
      return (
        [
          { regex: this.regexpUnescape, safeValue: (e) => e },
          { regex: this.regexp, safeValue: (e) => (this.escapeValue ? this.escape(e) : e) },
        ].forEach((t) => {
          for (c = 0; (o = t.regex.exec(e));) {
            let r = o[1].trim()
            if (((s = u(r)), s === void 0)) {
              if (typeof d == `function`) {
                let t = d(e, o, a)
                s = n(t) ? t : ``
              } else if (a && Object.prototype.hasOwnProperty.call(a, r)) s = ``
              else if (f) {
                s = o[0]
                continue
              } else (this.logger.warn(`missed to pass in variable ${r} for interpolating ${e}`), (s = ``))
            } else !n(s) && !this.useRawValueToEscape && (s = i(s))
            let l = t.safeValue(s)
            if (
              ((e = e.replace(o[0], z(l))),
              f ? ((t.regex.lastIndex += l.length), (t.regex.lastIndex -= o[0].length)) : (t.regex.lastIndex = 0),
              c++,
              c >= this.maxReplaces)
            )
              break
          }
        }),
        e
      )
    }
    nest(e, t, r = {}) {
      let a,
        o,
        s,
        c = (e, t) => {
          let n = this.nestingOptionsSeparator
          if (!e.includes(n)) return e
          let r = e.split(RegExp(`${h(n)}[ ]*{`)),
            i = `{${r[1]}`
          ;((e = r[0]), (i = this.interpolate(i, s)))
          let a = i.match(/'/g),
            o = i.match(/"/g)
          ;(((a?.length ?? 0) % 2 == 0 && !o) || (o?.length ?? 0) % 2 != 0) && (i = i.replace(/'/g, `"`))
          try {
            ;((s = JSON.parse(i)), t && (s = { ...t, ...s }))
          } catch (t) {
            return (this.logger.warn(`failed parsing options string in nesting for key ${e}`, t), `${e}${n}${i}`)
          }
          return (s.defaultValue && s.defaultValue.includes(this.prefix) && delete s.defaultValue, e)
        }
      for (; (a = this.nestingRegexp.exec(e));) {
        let l = []
        ;((s = { ...r }), (s = s.replace && !n(s.replace) ? s.replace : s), (s.applyPostProcessor = !1), delete s.defaultValue)
        let u = /{.*}/s.test(a[1]) ? a[1].lastIndexOf(`}`) + 1 : a[1].indexOf(this.formatSeparator)
        if (
          (u !== -1 &&
            ((l = a[1]
              .slice(u)
              .split(this.formatSeparator)
              .map((e) => e.trim())
              .filter(Boolean)),
            (a[1] = a[1].slice(0, u))),
          (o = t(c.call(this, a[1].trim(), s), s)),
          o && a[0] === e && !n(o))
        )
          return o
        ;(n(o) || (o = i(o)),
          (o ||= (this.logger.warn(`missed to resolve ${a[1]} for nesting ${e}`), ``)),
          l.length && (o = l.reduce((e, t) => this.format(e, t, r.lng, { ...r, interpolationkey: a[1].trim() }), o.trim())),
          (e = e.replace(a[0], z(i(o)))),
          (this.regexp.lastIndex = 0))
      }
      return e
    }
  },
  V = (e) => {
    let t = e.toLowerCase().trim(),
      n = {}
    if (e.includes(`(`)) {
      let r = e.split(`(`)
      t = r[0].toLowerCase().trim()
      let i = r[1].slice(0, -1)
      t === `currency` && !i.includes(`:`)
        ? (n.currency ||= i.trim())
        : t === `relativetime` && !i.includes(`:`)
          ? (n.range ||= i.trim())
          : i.split(`;`).forEach((e) => {
              if (e) {
                let [t, ...r] = e.split(`:`),
                  i = r
                    .join(`:`)
                    .trim()
                    .replace(/^'+|'+$/g, ``),
                  a = t.trim()
                ;(n[a] || (n[a] = i), i === `false` && (n[a] = !1), i === `true` && (n[a] = !0), isNaN(i) || (n[a] = parseInt(i, 10)))
              }
            })
    }
    return { formatName: t, formatOptions: n }
  },
  H = (e) => {
    let t = {}
    return (n, r, i) => {
      let a = i
      i &&
        i.interpolationkey &&
        i.formatParams &&
        i.formatParams[i.interpolationkey] &&
        i[i.interpolationkey] &&
        (a = { ...a, [i.interpolationkey]: void 0 })
      let o = r + JSON.stringify(a),
        s = t[o]
      return (s || ((s = e(C(r), i)), (t[o] = s)), s(n))
    }
  },
  U = (e) => (t, n, r) => e(C(n), r)(t),
  W = class {
    constructor(e = {}) {
      ;((this.logger = T.create(`formatter`)), (this.options = e), this.init(e))
    }
    init(e, t = { interpolation: {} }) {
      this.formatSeparator = t.interpolation.formatSeparator || `,`
      let n = t.cacheInBuiltFormats ? H : U
      this.formats = {
        number: n((e, t) => {
          let n = new Intl.NumberFormat(e, { ...t })
          return (e) => n.format(e)
        }),
        currency: n((e, t) => {
          let n = new Intl.NumberFormat(e, { ...t, style: `currency` })
          return (e) => n.format(e)
        }),
        datetime: n((e, t) => {
          let n = new Intl.DateTimeFormat(e, { ...t })
          return (e) => n.format(e)
        }),
        relativetime: n((e, t) => {
          let n = new Intl.RelativeTimeFormat(e, { ...t })
          return (e) => n.format(e, t.range || `day`)
        }),
        list: n((e, t) => {
          let n = new Intl.ListFormat(e, { ...t })
          return (e) => n.format(e)
        }),
      }
    }
    add(e, t) {
      this.formats[e.toLowerCase().trim()] = t
    }
    addCached(e, t) {
      this.formats[e.toLowerCase().trim()] = H(t)
    }
    format(e, t, n, r = {}) {
      if (!t || e == null) return e
      let i = t.split(this.formatSeparator),
        a = []
      for (let e = 0; e < i.length; e++) {
        let t = i[e]
        for (; t.indexOf(`(`) > -1 && !t.includes(`)`) && e + 1 < i.length;) t = `${t}${this.formatSeparator}${i[++e]}`
        a.push(t)
      }
      return a.reduce((e, t) => {
        let { formatName: i, formatOptions: a } = V(t)
        if (this.formats[i]) {
          let t = e
          try {
            let o = r?.formatParams?.[r.interpolationkey] || {},
              s = o.locale || o.lng || r.locale || r.lng || n
            t = this.formats[i](e, s, { ...a, ...r, ...o })
          } catch (e) {
            this.logger.warn(e)
          }
          return t
        }
        return (this.logger.warn(`there was no format function for ${i}`), e)
      }, e)
    }
  },
  G = (e, t) => {
    e.pending[t] !== void 0 && (delete e.pending[t], e.pendingCount--)
  },
  K = class extends E {
    constructor(e, t, n, r = {}) {
      ;(super(),
        (this.backend = e),
        (this.store = t),
        (this.services = n),
        (this.languageUtils = n.languageUtils),
        (this.options = r),
        (this.logger = T.create(`backendConnector`)),
        (this.waitingReads = []),
        (this.maxParallelReads = r.maxParallelReads || 10),
        (this.readingCalls = 0),
        (this.maxRetries = r.maxRetries >= 0 ? r.maxRetries : 5),
        (this.retryTimeout = r.retryTimeout >= 1 ? r.retryTimeout : 350),
        (this.state = {}),
        (this.queue = []),
        this.backend?.init?.(n, r.backend, r))
    }
    queueLoad(e, t, n, r) {
      let i = {},
        a = {},
        o = {},
        s = {}
      return (
        e.forEach((e) => {
          let r = !0
          ;(t.forEach((t) => {
            let o = `${e}|${t}`
            !n.reload && this.store.hasResourceBundle(e, t)
              ? (this.state[o] = 2)
              : this.state[o] < 0 ||
                (this.state[o] === 1
                  ? a[o] === void 0 && (a[o] = !0)
                  : ((this.state[o] = 1),
                    (r = !1),
                    a[o] === void 0 && (a[o] = !0),
                    i[o] === void 0 && (i[o] = !0),
                    s[t] === void 0 && (s[t] = !0)))
          }),
            r || (o[e] = !0))
        }),
        (Object.keys(i).length || Object.keys(a).length) &&
          this.queue.push({ pending: a, pendingCount: Object.keys(a).length, loaded: {}, errors: [], callback: r }),
        { toLoad: Object.keys(i), pending: Object.keys(a), toLoadLanguages: Object.keys(o), toLoadNamespaces: Object.keys(s) }
      )
    }
    loaded(e, t, n) {
      let r = e.split(`|`),
        i = r[0],
        a = r[1]
      ;(t && this.emit(`failedLoading`, i, a, t),
        !t && n && this.store.addResourceBundle(i, a, n, void 0, void 0, { skipCopy: !0 }),
        (this.state[e] = t ? -1 : 2),
        t && n && (this.state[e] = 0))
      let o = {}
      ;(this.queue.forEach((n) => {
        ;(d(n.loaded, [i], a),
          G(n, e),
          t && n.errors.push(t),
          n.pendingCount === 0 &&
            !n.done &&
            (Object.keys(n.loaded).forEach((e) => {
              o[e] || (o[e] = {})
              let t = n.loaded[e]
              t.length &&
                t.forEach((t) => {
                  o[e][t] === void 0 && (o[e][t] = !0)
                })
            }),
            (n.done = !0),
            n.errors.length ? n.callback(n.errors) : n.callback()))
      }),
        this.emit(`loaded`, o),
        (this.queue = this.queue.filter((e) => !e.done)))
    }
    read(e, t, n, r = 0, i = this.retryTimeout, a) {
      if (!e.length) return a(null, {})
      if (this.readingCalls >= this.maxParallelReads) {
        this.waitingReads.push({ lng: e, ns: t, fcName: n, tried: r, wait: i, callback: a })
        return
      }
      this.readingCalls++
      let o = (o, s) => {
          if ((this.readingCalls--, this.waitingReads.length > 0)) {
            let e = this.waitingReads.shift()
            this.read(e.lng, e.ns, e.fcName, e.tried, e.wait, e.callback)
          }
          if (o && s && r < this.maxRetries) {
            setTimeout(() => {
              this.read(e, t, n, r + 1, i * 2, a)
            }, i)
            return
          }
          a(o, s)
        },
        s = this.backend[n].bind(this.backend)
      if (s.length === 2) {
        try {
          let n = s(e, t)
          n && typeof n.then == `function` ? n.then((e) => o(null, e)).catch(o) : o(null, n)
        } catch (e) {
          o(e)
        }
        return
      }
      return s(e, t, o)
    }
    prepareLoading(e, t, r = {}, i) {
      if (!this.backend) return (this.logger.warn(`No backend was added via i18next.use. Will not load resources.`), i && i())
      ;(n(e) && (e = this.languageUtils.toResolveHierarchy(e)), n(t) && (t = [t]))
      let a = this.queueLoad(e, t, r, i)
      if (!a.toLoad.length) return (a.pending.length || i(), null)
      a.toLoad.forEach((e) => {
        this.loadOne(e)
      })
    }
    load(e, t, n) {
      this.prepareLoading(e, t, {}, n)
    }
    reload(e, t, n) {
      this.prepareLoading(e, t, { reload: !0 }, n)
    }
    loadOne(e, t = ``) {
      let n = e.split(`|`),
        r = n[0],
        i = n[1]
      this.read(r, i, `read`, void 0, void 0, (n, a) => {
        ;(n && this.logger.warn(`${t}loading namespace ${i} for language ${r} failed`, n),
          !n && a && this.logger.log(`${t}loaded namespace ${i} for language ${r}`, a),
          this.loaded(e, n, a))
      })
    }
    saveMissing(e, t, n, r, i, a = {}, o = () => {}) {
      if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(t)) {
        this.logger.warn(
          `did not save key "${n}" as the namespace "${t}" was not yet loaded`,
          `This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!`,
        )
        return
      }
      if (n != null && n !== ``) {
        if (this.backend?.create) {
          let s = { ...a, isUpdate: i },
            c = this.backend.create.bind(this.backend)
          if (c.length < 6)
            try {
              let i
              ;((i = c.length === 5 ? c(e, t, n, r, s) : c(e, t, n, r)),
                i && typeof i.then == `function` ? i.then((e) => o(null, e)).catch(o) : o(null, i))
            } catch (e) {
              o(e)
            }
          else c(e, t, n, r, o, s)
        }
        e && e[0] && this.store.addResource(e[0], t, n, r)
      }
    }
  },
  q = () => ({
    debug: !1,
    initAsync: !0,
    ns: [`translation`],
    defaultNS: [`translation`],
    fallbackLng: [`dev`],
    fallbackNS: !1,
    supportedLngs: !1,
    nonExplicitSupportedLngs: !1,
    load: `all`,
    preload: !1,
    keySeparator: `.`,
    nsSeparator: `:`,
    pluralSeparator: `_`,
    contextSeparator: `_`,
    enableSelector: !1,
    partialBundledLanguages: !1,
    saveMissing: !1,
    updateMissing: !1,
    saveMissingTo: `fallback`,
    saveMissingPlurals: !0,
    missingKeyHandler: !1,
    missingInterpolationHandler: !1,
    postProcess: !1,
    postProcessPassResolved: !1,
    returnNull: !1,
    returnEmptyString: !0,
    returnObjects: !1,
    joinArrays: !1,
    returnedObjectHandler: !1,
    parseMissingKeyHandler: !1,
    appendNamespaceToMissingKey: !1,
    appendNamespaceToCIMode: !1,
    overloadTranslationOptionHandler: (e) => {
      let t = {}
      if (
        (typeof e[1] == `object` && (t = e[1]),
        n(e[1]) && (t.defaultValue = e[1]),
        n(e[2]) && (t.tDescription = e[2]),
        typeof e[2] == `object` || typeof e[3] == `object`)
      ) {
        let n = e[3] || e[2]
        Object.keys(n).forEach((e) => {
          t[e] = n[e]
        })
      }
      return t
    },
    interpolation: {
      escapeValue: !0,
      prefix: `{{`,
      suffix: `}}`,
      formatSeparator: `,`,
      unescapePrefix: `-`,
      nestingPrefix: `$t(`,
      nestingSuffix: `)`,
      nestingOptionsSeparator: `,`,
      maxReplaces: 1e3,
      skipOnVariables: !0,
    },
    cacheInBuiltFormats: !0,
  }),
  J = (e) => (
    n(e.ns) && (e.ns = [e.ns]),
    n(e.fallbackLng) && (e.fallbackLng = [e.fallbackLng]),
    n(e.fallbackNS) && (e.fallbackNS = [e.fallbackNS]),
    e.supportedLngs && !e.supportedLngs.includes(`cimode`) && (e.supportedLngs = e.supportedLngs.concat([`cimode`])),
    e
  ),
  Y = () => {},
  X = (e) => {
    Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach((t) => {
      typeof e[t] == `function` && (e[t] = e[t].bind(e))
    })
  },
  Z = class e extends E {
    constructor(e = {}, t) {
      if (
        (super(),
        (this.options = J(e)),
        (this.services = {}),
        (this.logger = T),
        (this.modules = { external: [] }),
        X(this),
        t && !this.isInitialized && !e.isClone)
      ) {
        if (!this.options.initAsync) return (this.init(e, t), this)
        setTimeout(() => {
          this.init(e, t)
        }, 0)
      }
    }
    init(e = {}, t) {
      ;((this.isInitializing = !0),
        typeof e == `function` && ((t = e), (e = {})),
        e.defaultNS == null && e.ns && (n(e.ns) ? (e.defaultNS = e.ns) : e.ns.includes(`translation`) || (e.defaultNS = e.ns[0])))
      let i = q()
      ;((this.options = { ...i, ...this.options, ...J(e) }),
        (this.options.interpolation = { ...i.interpolation, ...this.options.interpolation }),
        e.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = e.keySeparator),
        e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator),
        typeof this.options.overloadTranslationOptionHandler != `function` &&
          (this.options.overloadTranslationOptionHandler = i.overloadTranslationOptionHandler))
      let a = (e) => (e ? (typeof e == `function` ? new e() : e) : null)
      if (!this.options.isClone) {
        this.modules.logger ? T.init(a(this.modules.logger), this.options) : T.init(null, this.options)
        let e
        e = this.modules.formatter ? this.modules.formatter : W
        let t = new P(this.options)
        this.store = new D(this.options.resources, this.options)
        let n = this.services
        ;((n.logger = T),
          (n.resourceStore = this.store),
          (n.languageUtils = t),
          (n.pluralResolver = new L(t, { prepend: this.options.pluralSeparator })),
          e &&
            ((n.formatter = a(e)),
            n.formatter.init && n.formatter.init(n, this.options),
            (this.options.interpolation.format = n.formatter.format.bind(n.formatter))),
          (n.interpolator = new B(this.options)),
          (n.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) }),
          (n.backendConnector = new K(a(this.modules.backend), n.resourceStore, n, this.options)),
          n.backendConnector.on(`*`, (e, ...t) => {
            this.emit(e, ...t)
          }),
          this.modules.languageDetector &&
            ((n.languageDetector = a(this.modules.languageDetector)),
            n.languageDetector.init && n.languageDetector.init(n, this.options.detection, this.options)),
          this.modules.i18nFormat && ((n.i18nFormat = a(this.modules.i18nFormat)), n.i18nFormat.init && n.i18nFormat.init(this)),
          (this.translator = new N(this.services, this.options)),
          this.translator.on(`*`, (e, ...t) => {
            this.emit(e, ...t)
          }),
          this.modules.external.forEach((e) => {
            e.init && e.init(this)
          }))
      }
      if (
        ((this.format = this.options.interpolation.format),
        (t ||= Y),
        this.options.fallbackLng && !this.services.languageDetector && !this.options.lng)
      ) {
        let e = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng)
        e.length > 0 && e[0] !== `dev` && (this.options.lng = e[0])
      }
      ;(!this.services.languageDetector && !this.options.lng && this.logger.warn(`init: no languageDetector is used and no lng is defined`),
        [`getResource`, `hasResourceBundle`, `getResourceBundle`, `getDataByLanguage`].forEach((e) => {
          this[e] = (...t) => this.store[e](...t)
        }),
        [`addResource`, `addResources`, `addResourceBundle`, `removeResourceBundle`].forEach((e) => {
          this[e] = (...t) => (this.store[e](...t), this)
        }))
      let o = r(),
        s = () => {
          let e = (e, n) => {
            ;((this.isInitializing = !1),
              this.isInitialized &&
                !this.initializedStoreOnce &&
                this.logger.warn(`init: i18next is already initialized. You should call init just once!`),
              (this.isInitialized = !0),
              this.options.isClone || this.logger.log(`initialized`, this.options),
              this.emit(`initialized`, this.options),
              o.resolve(n),
              t(e, n))
          }
          if ((this.languages || this.isLanguageChangingTo) && !this.isInitialized) return e(null, this.t.bind(this))
          this.changeLanguage(this.options.lng, e)
        }
      return (this.options.resources || !this.options.initAsync ? s() : setTimeout(s, 0), o)
    }
    loadResources(e, t = Y) {
      let r = t,
        i = n(e) ? e : this.language
      if ((typeof e == `function` && (r = e), !this.options.resources || this.options.partialBundledLanguages)) {
        if (i?.toLowerCase() === `cimode` && (!this.options.preload || this.options.preload.length === 0)) return r()
        let e = [],
          t = (t) => {
            t &&
              t !== `cimode` &&
              this.services.languageUtils.toResolveHierarchy(t).forEach((t) => {
                t !== `cimode` && (e.includes(t) || e.push(t))
              })
          }
        ;(i ? t(i) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((e) => t(e)),
          this.options.preload?.forEach?.((e) => t(e)),
          this.services.backendConnector.load(e, this.options.ns, (e) => {
            ;(!e && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), r(e))
          }))
      } else r(null)
    }
    reloadResources(e, t, n) {
      let i = r()
      return (
        typeof e == `function` && ((n = e), (e = void 0)),
        typeof t == `function` && ((n = t), (t = void 0)),
        (e ||= this.languages),
        (t ||= this.options.ns),
        (n ||= Y),
        this.services.backendConnector.reload(e, t, (e) => {
          ;(i.resolve(), n(e))
        }),
        i
      )
    }
    use(e) {
      if (!e) throw Error(`You are passing an undefined module! Please check the object you are passing to i18next.use()`)
      if (!e.type) throw Error(`You are passing a wrong module! Please check the object you are passing to i18next.use()`)
      return (
        e.type === `backend` && (this.modules.backend = e),
        (e.type === `logger` || (e.log && e.warn && e.error)) && (this.modules.logger = e),
        e.type === `languageDetector` && (this.modules.languageDetector = e),
        e.type === `i18nFormat` && (this.modules.i18nFormat = e),
        e.type === `postProcessor` && O.addPostProcessor(e),
        e.type === `formatter` && (this.modules.formatter = e),
        e.type === `3rdParty` && this.modules.external.push(e),
        this
      )
    }
    setResolvedLanguage(e) {
      if (e && this.languages && ![`cimode`, `dev`].includes(e)) {
        for (let e = 0; e < this.languages.length; e++) {
          let t = this.languages[e]
          if (![`cimode`, `dev`].includes(t) && this.store.hasLanguageSomeTranslations(t)) {
            this.resolvedLanguage = t
            break
          }
        }
        !this.resolvedLanguage &&
          !this.languages.includes(e) &&
          this.store.hasLanguageSomeTranslations(e) &&
          ((this.resolvedLanguage = e), this.languages.unshift(e))
      }
    }
    changeLanguage(e, t) {
      this.isLanguageChangingTo = e
      let i = r()
      this.emit(`languageChanging`, e)
      let a = (e) => {
          ;((this.language = e),
            (this.languages = this.services.languageUtils.toResolveHierarchy(e)),
            (this.resolvedLanguage = void 0),
            this.setResolvedLanguage(e))
        },
        o = (n, r) => {
          ;(r
            ? this.isLanguageChangingTo === e &&
              (a(r),
              this.translator.changeLanguage(r),
              (this.isLanguageChangingTo = void 0),
              this.emit(`languageChanged`, r),
              this.logger.log(`languageChanged`, r))
            : (this.isLanguageChangingTo = void 0),
            i.resolve((...e) => this.t(...e)),
            t && t(n, (...e) => this.t(...e)))
        },
        s = (t) => {
          !e && !t && this.services.languageDetector && (t = [])
          let r = n(t) ? t : t && t[0],
            i = this.store.hasLanguageSomeTranslations(r) ? r : this.services.languageUtils.getBestMatchFromCodes(n(t) ? [t] : t)
          ;(i &&
            (this.language || a(i),
            this.translator.language || this.translator.changeLanguage(i),
            this.services.languageDetector?.cacheUserLanguage?.(i)),
            this.loadResources(i, (e) => {
              o(e, i)
            }))
        }
      return (
        !e && this.services.languageDetector && !this.services.languageDetector.async
          ? s(this.services.languageDetector.detect())
          : !e && this.services.languageDetector && this.services.languageDetector.async
            ? this.services.languageDetector.detect.length === 0
              ? this.services.languageDetector.detect().then(s)
              : this.services.languageDetector.detect(s)
            : s(e),
        i
      )
    }
    getFixedT(e, t, r, i) {
      let a = i?.scopeNs,
        o = (e, t, ...n) => {
          let i
          ;((i = typeof t == `object` ? { ...t } : this.options.overloadTranslationOptionHandler([e, t].concat(n))),
            (i.lng = i.lng || o.lng),
            (i.lngs = i.lngs || o.lngs))
          let s = i.ns !== void 0 && i.ns !== null
          ;((i.ns = i.ns || o.ns), i.keyPrefix !== `` && (i.keyPrefix = i.keyPrefix || r || o.keyPrefix))
          let c = { ...this.options, ...i }
          ;(Array.isArray(a) && !s && (c.ns = a), typeof i.keyPrefix == `function` && (i.keyPrefix = j(i.keyPrefix, c)))
          let l = this.options.keySeparator || `.`,
            u
          return (
            i.keyPrefix && Array.isArray(e)
              ? (u = e.map((e) => (typeof e == `function` && (e = j(e, c)), `${i.keyPrefix}${l}${e}`)))
              : (typeof e == `function` && (e = j(e, c)), (u = i.keyPrefix ? `${i.keyPrefix}${l}${e}` : e)),
            this.t(u, i)
          )
        }
      return (n(e) ? (o.lng = e) : (o.lngs = e), (o.ns = t), (o.keyPrefix = r), o)
    }
    t(...e) {
      return this.translator?.translate(...e)
    }
    exists(...e) {
      return this.translator?.exists(...e)
    }
    setDefaultNamespace(e) {
      this.options.defaultNS = e
    }
    hasLoadedNamespace(e, t = {}) {
      if (!this.isInitialized) return (this.logger.warn(`hasLoadedNamespace: i18next was not initialized`, this.languages), !1)
      if (!this.languages || !this.languages.length)
        return (this.logger.warn(`hasLoadedNamespace: i18n.languages were undefined or empty`, this.languages), !1)
      let n = t.lng || this.resolvedLanguage || this.languages[0],
        r = this.options ? this.options.fallbackLng : !1,
        i = this.languages[this.languages.length - 1]
      if (n.toLowerCase() === `cimode`) return !0
      let a = (e, t) => {
        let n = this.services.backendConnector.state[`${e}|${t}`]
        return n === -1 || n === 0 || n === 2
      }
      if (t.precheck) {
        let e = t.precheck(this, a)
        if (e !== void 0) return e
      }
      return !!(
        this.hasResourceBundle(n, e) ||
        !this.services.backendConnector.backend ||
        (this.options.resources && !this.options.partialBundledLanguages) ||
        (a(n, e) && (!r || a(i, e)))
      )
    }
    loadNamespaces(e, t) {
      let i = r()
      return this.options.ns
        ? (n(e) && (e = [e]),
          e.forEach((e) => {
            this.options.ns.includes(e) || this.options.ns.push(e)
          }),
          this.loadResources((e) => {
            ;(i.resolve(), t && t(e))
          }),
          i)
        : (t && t(), Promise.resolve())
    }
    loadLanguages(e, t) {
      let i = r()
      n(e) && (e = [e])
      let a = this.options.preload || [],
        o = e.filter((e) => !a.includes(e) && this.services.languageUtils.isSupportedCode(e))
      return o.length
        ? ((this.options.preload = a.concat(o)),
          this.loadResources((e) => {
            ;(i.resolve(), t && t(e))
          }),
          i)
        : (t && t(), Promise.resolve())
    }
    dir(e) {
      if (((e ||= this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language)), !e)) return `rtl`
      try {
        let t = new Intl.Locale(e)
        if (t && t.getTextInfo) {
          let e = t.getTextInfo()
          if (e && e.direction) return e.direction
        }
      } catch {}
      let t =
          `ar.shu.sqr.ssh.xaa.yhd.yud.aao.abh.abv.acm.acq.acw.acx.acy.adf.ads.aeb.aec.afb.ajp.apc.apd.arb.arq.ars.ary.arz.auz.avl.ayh.ayl.ayn.ayp.bbz.pga.he.iw.ps.pbt.pbu.pst.prp.prd.ug.ur.ydd.yds.yih.ji.yi.hbo.men.xmn.fa.jpr.peo.pes.prs.dv.sam.ckb`.split(
            `.`,
          ),
        n = this.services?.languageUtils || new P(q())
      return e.toLowerCase().indexOf(`-latn`) > 1
        ? `ltr`
        : t.includes(n.getLanguagePartFromCode(e)) || e.toLowerCase().indexOf(`-arab`) > 1
          ? `rtl`
          : `ltr`
    }
    static createInstance(t = {}, n) {
      let r = new e(t, n)
      return ((r.createInstance = e.createInstance), r)
    }
    cloneInstance(t = {}, n = Y) {
      let r = t.forkResourceStore
      r && delete t.forkResourceStore
      let i = { ...this.options, ...t, isClone: !0 },
        a = new e(i)
      if (
        ((t.debug !== void 0 || t.prefix !== void 0) && (a.logger = a.logger.clone(t)),
        [`store`, `services`, `language`].forEach((e) => {
          a[e] = this[e]
        }),
        (a.services = { ...this.services }),
        (a.services.utils = { hasLoadedNamespace: a.hasLoadedNamespace.bind(a) }),
        r &&
          ((a.store = new D(
            Object.keys(this.store.data).reduce(
              (e, t) => (
                (e[t] = { ...this.store.data[t] }),
                (e[t] = Object.keys(e[t]).reduce((n, r) => ((n[r] = { ...e[t][r] }), n), e[t])),
                e
              ),
              {},
            ),
            i,
          )),
          (a.services.resourceStore = a.store)),
        t.interpolation)
      ) {
        let e = { ...q().interpolation, ...this.options.interpolation, ...t.interpolation },
          n = { ...i, interpolation: e }
        a.services.interpolator = new B(n)
      }
      return (
        (a.translator = new N(a.services, i)),
        a.translator.on(`*`, (e, ...t) => {
          a.emit(e, ...t)
        }),
        a.init(i, n),
        (a.translator.options = i),
        (a.translator.backendConnector.services.utils = { hasLoadedNamespace: a.hasLoadedNamespace.bind(a) }),
        a
      )
    }
    toJSON() {
      return {
        options: this.options,
        store: this.store,
        language: this.language,
        languages: this.languages,
        resolvedLanguage: this.resolvedLanguage,
      }
    }
  }.createInstance()
;(Z.createInstance,
  Z.dir,
  Z.init,
  Z.loadResources,
  Z.reloadResources,
  Z.use,
  Z.changeLanguage,
  Z.getFixedT,
  Z.t,
  Z.exists,
  Z.setDefaultNamespace,
  Z.hasLoadedNamespace,
  Z.loadNamespaces,
  Z.loadLanguages)
var ee = {
    type: `3rdParty`,
    init(n) {
      ;(t(n.options.react), e(n))
    },
  },
  te = {
    common: {
      save: `Save`,
      cancel: `Cancel`,
      create: `Create`,
      edit: `Edit`,
      delete: `Delete`,
      remove: `Remove`,
      close: `Close`,
      copy: `Copy`,
      copied: `Copied`,
      back: `Back`,
      search: `Search`,
      loading: `Loading…`,
      retry: `Retry`,
      confirm: `Confirm`,
      actions: `Actions`,
      status: `Status`,
      active: `Active`,
      inactive: `Inactive`,
      name: `Name`,
      description: `Description`,
      email: `Email`,
      phone: `Phone`,
      address: `Address`,
      optional: `optional`,
      saved: `Changes saved.`,
      none: `None`,
      all: `All`,
      next: `Continue`,
      previous: `Previous`,
      nextPage: `Next`,
      page: `Page {{page}} of {{pages}}`,
      total: `{{count}} items`,
      yes: `Yes`,
      no: `No`,
      saving: `Saving…`,
      change: `Change`,
      createdAt: `Created`,
      note: `Note`,
      taxCode: `Tax ID`,
      selectGarageFirst: `Select or create a garage first.`,
    },
    nav: {
      help: `Help & support`,
      workspace: `Workspace`,
      dashboard: `Dashboard`,
      garages: `Garages`,
      customers: `Customers`,
      vehicles: `Vehicles`,
      quotes: `Quotes`,
      suppliers: `Suppliers`,
      staff: `Staff`,
      roles: `Roles & groups`,
      subscription: `Subscription`,
      invitations: `Invitations`,
      account: `My account`,
      repairOrders: `Repair orders`,
      inventory: `Inventory`,
      settlements: `Billing & Receivables`,
      soon: `Soon`,
      signOut: `Sign out`,
      language: `Language`,
      selectGarage: `Select garage`,
      noGarage: `No garage yet`,
      group: { operations: `Operations`, customers: `Customers`, finance: `Finance`, garage: `Garage` },
      manageGarages: `Manage garages`,
      comingSoon: `This module arrives in a later release.`,
    },
    language: { vi: `Tiếng Việt`, en: `English` },
    ui: {
      menu: `Menu`,
      sidebar: { collapse: `Collapse sidebar`, expand: `Expand sidebar` },
      navigation: `Navigation`,
      skipToContent: `Skip to main content`,
      theme: { label: `Appearance`, light: `Light`, dark: `Dark`, system: `System` },
      commandOpen: `Quick search`,
      commandPlaceholder: `Search pages and actions…`,
      commandEmpty: `No results.`,
      commandPages: `Pages`,
      commandGarages: `Garages`,
      range: `{{from}}–{{to}} of {{total}}`,
      clear: `Clear`,
      loadFailed: `Could not load the data`,
      noResults: `No matching results`,
      breadcrumb: `Breadcrumb`,
      clearFilters: `Clear filters`,
      account: `My account`,
      userMenu: `User menu`,
    },
    auth: {
      brandTagline: `Run your auto garages on one platform`,
      brandBody: `Quotes, repairs, parts inventory and settlements for every branch.`,
      login: {
        title: `Sign in`,
        subtitle: `Welcome back to VietGara.`,
        email: `Email`,
        password: `Password`,
        submit: `Sign in`,
        forgot: `Forgot password?`,
        noAccount: `New to VietGara?`,
        register: `Create one`,
        google: `Continue with Google`,
        or: `or`,
        showPassword: `Show password`,
        hidePassword: `Hide password`,
      },
      register: {
        title: `Register`,
        subtitle: `Start a free 14-day trial once your e-mail is verified.`,
        fullName: `Full name`,
        phone: `Phone`,
        password: `Password`,
        passwordHint: `At least 8 characters.`,
        language: `Language`,
        submit: `Sign up`,
        haveAccount: `Already registered?`,
        login: `Sign in`,
      },
      verify: {
        title: `Verify your e-mail`,
        subtitle: `We sent a 6-digit code to {{email}}. Enter it within 2 minutes.`,
        code: `Verification code`,
        submit: `Verify`,
        resend: `Resend code`,
        resendIn: `Resend in {{seconds}}s`,
        expiresIn: `Code expires in {{time}}`,
        expired: `The code expired. Request a new one.`,
        sent: `A new code was sent.`,
        blocked: `Verify your e-mail before managing garages, staff and data.`,
        otherAccount: `Sign in as another user`,
      },
      forgot: {
        title: `Forgot password`,
        subtitle: `Enter your e-mail and we will send a reset code.`,
        sendCode: `Send code`,
        codeTitle: `Enter the code`,
        codeSubtitle: `If {{email}} is registered, a 6-digit code was sent. It is valid for 2 minutes.`,
        verify: `Confirm code`,
        newPasswordTitle: `Choose a new password`,
        newPassword: `New password`,
        confirmPassword: `Repeat password`,
        mismatch: `The passwords do not match.`,
        reset: `Reset password`,
        done: `Password changed. Sign in again.`,
        backToLogin: `Back to sign in`,
        changeEmail: `Change e-mail`,
      },
    },
    garages: {
      current: `Current`,
      day: `Day`,
      workday: `Open`,
      activateConfirm: `Reactivate {{name}}? Its staff regain access.`,
      title: `Garages`,
      description: `Each garage is an independent branch with its own data, staff and settings.`,
      new: `Add garage`,
      createTitle: `Add a garage`,
      createDescription: `New garages share the owner’s subscription.`,
      name: `Garage name`,
      empty: `No garage yet. Create your first garage to get started.`,
      owner: `Owner`,
      member: `Staff`,
      open: `Open`,
      settings: `Garage settings`,
      settingsDescription: `Profile, opening hours, document numbering and logo.`,
      deactivate: `Deactivate`,
      activate: `Reactivate`,
      deactivateConfirm: `Deactivate {{name}}? Staff lose access until you reactivate it.`,
      profile: `Profile`,
      legalProfile: `Legal profile`,
      legalProfileHint: `Printed in the header of quotes, repair orders, settlements and payment vouchers with the logo and tax ID. Documents already issued keep the details they were issued with.`,
      legalName: `Legal name`,
      legalAddress: `Registered address`,
      representative: `Legal representative`,
      settlementTemplate: `Settlement number template`,
      paymentVoucherTemplate: `Payment voucher number template`,
      paymentVoucherTemplateHint: `Same placeholders, e.g. PT-{YYYY}{MM}-{SEQ:4}.`,
      configuration: `Configuration`,
      timezone: `Time zone`,
      currency: `Currency`,
      logo: `Logo`,
      uploadLogo: `Upload logo`,
      removeLogo: `Remove logo`,
      logoHint: `PNG, JPEG or WebP, up to 1 MB.`,
      operatingHours: `Opening hours`,
      closed: `Closed`,
      opens: `Opens`,
      closes: `Closes`,
      numbering: `Document numbering`,
      quoteTemplate: `Quote number template`,
      repairOrderTemplate: `Repair order number template`,
      templateHint: `Use {YYYY}, {YY}, {MM}, {DD} and exactly one {SEQ:n}, e.g. BG-{YYYY}{MM}-{SEQ:4}.`,
      defaultApprovalMode: `Default quote approval mode`,
      defaultApprovalModeHint: `Applied to new quotes; can still be changed per quote.`,
      days: {
        DAY_OF_WEEK_UNSPECIFIED: ``,
        MONDAY: `Monday`,
        TUESDAY: `Tuesday`,
        WEDNESDAY: `Wednesday`,
        THURSDAY: `Thursday`,
        FRIDAY: `Friday`,
        SATURDAY: `Saturday`,
        SUNDAY: `Sunday`,
      },
      readOnly: `The subscription expired: this garage is read-only.`,
      locked: `The subscription is suspended.`,
      renew: `Renew`,
      inactiveNotice: `This garage is inactive.`,
    },
    staff: {
      expires: `Expires`,
      noGroupsYet: `This garage has no staff groups yet. The owner creates them on the Roles & groups page.`,
      title: `Staff`,
      description: `Invite VietGara users and put them in groups to grant permissions.`,
      invite: `Invite staff`,
      inviteTitle: `Invite staff`,
      inviteDescription: `Find the user by e-mail or phone. They get an e-mail and accept the invitation.`,
      lookup: `E-mail or phone`,
      find: `Find`,
      inviteSent: `Invitation sent.`,
      candidateMember: `This user is already a member of the garage.`,
      candidateInvited: `This user already has a pending invitation.`,
      groups: `Groups`,
      noGroups: `No group yet`,
      sendInvite: `Send invitation`,
      members: `Members`,
      invitations: `Invitations`,
      owner: `Owner`,
      permissions: `{{count}} permissions`,
      editGroups: `Change groups`,
      editGroupsTitle: `Groups of {{name}}`,
      deactivate: `Deactivate`,
      activate: `Activate`,
      remove: `Remove from garage`,
      removeConfirm: `Remove {{name}} from the garage? They lose access at once.`,
      revoke: `Revoke`,
      invitedBy: `Invited by {{name}}`,
      expiresAt: `Expires {{date}}`,
      empty: `No staff besides the owner yet.`,
      noInvitations: `No invitations yet.`,
      seats: `Staff: {{used}} / {{max}}`,
    },
    invitationStatus: {
      INVITATION_STATUS_UNSPECIFIED: ``,
      INVITATION_STATUS_PENDING: `Pending`,
      INVITATION_STATUS_ACCEPTED: `Accepted`,
      INVITATION_STATUS_DECLINED: `Declined`,
      INVITATION_STATUS_REVOKED: `Revoked`,
      INVITATION_STATUS_EXPIRED: `Expired`,
    },
    invitations: {
      title: `My invitations`,
      description: `Garages that invited you to join.`,
      empty: `You have no invitations.`,
      accept: `Accept`,
      decline: `Decline`,
      from: `{{inviter}} invited you to join {{garage}}`,
      accepted: `You joined {{garage}}.`,
      notFound: `Invitation not found, or it is not addressed to this user.`,
    },
    roles: {
      title: `Roles & groups`,
      description: `A role is a set of permissions shared by all your garages. A group gives a role to staff in one garage.`,
      roles: `Roles`,
      new: `Add role`,
      createTitle: `Add role`,
      editTitle: `Edit role`,
      permissions: `Permissions`,
      default: `Default`,
      usedBy: `Used by {{count}} groups`,
      deleteConfirm: `Delete the role {{name}}?`,
      ownerOnly: `Only garage owners manage roles and groups.`,
      groups: `Groups in {{garage}}`,
      newGroup: `Add group`,
      groupTitle: `Staff group`,
      role: `Role`,
      members: `{{count}} members`,
      deleteGroupConfirm: `Delete the group {{name}}? Members keep their other groups.`,
      editor: {
        breadcrumb: `Roles & groups`,
        description: `Tick what the role may do in each module. Write includes read. Nothing changes until you save.`,
        selectRole: `Role`,
        module: `Module`,
        read: `View`,
        write: `Add & edit`,
        none: `Not available`,
        comingSoon: `Coming soon`,
        impact: `Applies at once to all your garages, for the members of {{count}} groups using this role.`,
        impactNone: `No staff group uses this role yet.`,
        changes_one: `{{count}} unsaved change`,
        changes_other: `{{count}} unsaved changes`,
        noChanges: `No unsaved changes`,
        created: `Role created.`,
        discardTitle: `Discard unsaved changes?`,
        discardBody: `Your changes to this role have not been saved.`,
        discard: `Discard`,
        undo: `Undo changes`,
        resetDefault: `Reset to default`,
        resetHint: `Restore the permissions this default role was created with. The name and description are kept; nothing changes until you save.`,
      },
      modules: {
        garage: `Garage`,
        staff: `Staff`,
        customer: `Customers & vehicles`,
        supplier: `Suppliers`,
        subscription: `Subscription`,
        quote: `Quotes`,
        repair_order: `Repair orders`,
        inventory: `Inventory`,
        billing: `Billing & receivables`,
        report: `Reports`,
      },
    },
    permission: {
      PERMISSION_GARAGE_WRITE: `Edit garage profile and settings`,
      PERMISSION_STAFF_READ: `View staff`,
      PERMISSION_STAFF_WRITE: `Manage staff`,
      PERMISSION_CUSTOMER_READ: `View customers and vehicles`,
      PERMISSION_CUSTOMER_WRITE: `Add and edit customers and vehicles`,
      PERMISSION_SUPPLIER_READ: `View suppliers`,
      PERMISSION_SUPPLIER_WRITE: `Manage suppliers`,
      PERMISSION_SUBSCRIPTION_READ: `View subscription`,
      PERMISSION_QUOTE_READ: `View quotes`,
      PERMISSION_QUOTE_WRITE: `Create quotes`,
      PERMISSION_REPAIR_ORDER_READ: `View repair orders`,
      PERMISSION_REPAIR_ORDER_WRITE: `Update repair orders`,
      PERMISSION_INVENTORY_READ: `View inventory`,
      PERMISSION_INVENTORY_WRITE: `Stock in and out`,
      PERMISSION_BILLING_READ: `View settlements and receivables`,
      PERMISSION_BILLING_WRITE: `Settle and record payments`,
      PERMISSION_REPORT_READ: `View reports`,
      PERMISSION_CUSTOMER_CORRECT: `Correct locked vehicle fields and change a vehicle owner`,
    },
    subscription: {
      confirmTitle: `Pay for the {{name}} plan?`,
      confirmBody: `Price {{price}} · {{limits}}. We quote the amount, with your account credit applied, and show how to transfer it. The plan applies at once when a platform admin approves your payment.`,
      confirmReplaceBody: `Price {{price}} · {{limits}}. This replaces your open request that is still waiting for payment, with a new quote and a new transfer reference.`,
      getQuote: `Get the payment details`,
      quoted: `Payment details for {{name}} are ready below.`,
      overLimitTitle: `Your usage exceeds the {{name}} plan`,
      overLimitBody: `You use more {{limits}} than the plan allows ({{allowed}}). Reduce them first, then choose the plan again.`,
      waitingForReview: `Your payment is waiting for review.`,
      manualPayment: `You pay by bank transfer and a platform admin approves it; the new plan then applies at once. Unused days of your current plan are credited.`,
      title: `Subscription`,
      description: `One subscription covers every garage of the owner.`,
      plan: `Current plan`,
      periodEnd: `Valid until`,
      trialEnd: `Trial until`,
      graceEnd: `Read-only until`,
      usage: `Usage`,
      garages: `Garages`,
      staff: `Staff`,
      transactionsToday: `Transactions today`,
      choosePlan: `Choose a plan`,
      current: `Current plan`,
      choose: `Choose this plan`,
      renew: `Renew`,
      perMonth: `/month`,
      perYear: `/year`,
      ownerOnly: `Only the owner manages the subscription.`,
      limits: `{{garages}} garages · {{staff}} staff · {{transactions}} transactions/day`,
      credit: {
        title: `Account credit`,
        balance: `Balance:`,
        hint: `Credit comes from the unused part of a plan you leave and is applied automatically to your next payment.`,
        kind: {
          CREDIT_ENTRY_KIND_UNSPECIFIED: ``,
          CREDIT_ENTRY_KIND_EARNED: `Credit earned`,
          CREDIT_ENTRY_KIND_APPLIED: `Credit used`,
          CREDIT_ENTRY_KIND_ADJUSTMENT: `Adjustment`,
        },
      },
      payment: {
        title: `Payment for the {{name}} plan`,
        status: {
          PLAN_PAYMENT_STATUS_UNSPECIFIED: ``,
          PLAN_PAYMENT_STATUS_AWAITING_PAYMENT: `Awaiting payment`,
          PLAN_PAYMENT_STATUS_SUBMITTED: `Waiting for review`,
          PLAN_PAYMENT_STATUS_APPROVED: `Approved`,
          PLAN_PAYMENT_STATUS_REJECTED: `Rejected`,
          PLAN_PAYMENT_STATUS_CANCELLED: `Cancelled`,
        },
        decided: {
          PLAN_PAYMENT_STATUS_APPROVED: `Your payment for the {{name}} plan was approved`,
          PLAN_PAYMENT_STATUS_REJECTED: `Your payment for the {{name}} plan was rejected`,
        },
        waitingTitle: `Waiting for review`,
        waitingBody: `A platform admin checks your transfer. The plan applies at once when it is approved, and you get an e-mail.`,
        rejectedTitle: `Your payment was rejected`,
        mismatchTitle: `The amount differs from the quote`,
        mismatchBody: `You transferred an amount other than {{amount}}. The platform admin will contact you to settle it.`,
        planPrice: `Plan price`,
        creditApplied: `Account credit applied`,
        amountDue: `Amount to transfer`,
        creditSurplus: `Surplus kept as credit`,
        unusedDays: `Unused days of the current period`,
        unusedOf: `{{unused}} of {{total}} days`,
        howToPay: `Transfer the amount to this account and put the reference in the transfer note, then declare your payment below.`,
        coveredByCredit: `Your account credit covers the whole price: nothing to transfer. Declare the request so an admin approves it.`,
        bank: `Bank`,
        account: `Account number`,
        holder: `Account holder`,
        branch: `Branch`,
        reference: `Transfer reference`,
        referenceHint: `Write the reference in the transfer note so the payment can be matched.`,
        qrAlt: `Bank QR code`,
        qrCaption: `Scan with your banking app`,
        declareAction: `I have paid: declare the transfer`,
        declareTitle: `Declare your transfer`,
        declareDescription: `Amount {{amount}} · reference {{reference}}.`,
        declare: `Send for review`,
        payerName: `Payer name`,
        payerBank: `Payer bank`,
        payerAccount: `Payer account`,
        transferredAmount: `Amount transferred`,
        transferredHint: `In VND. A different amount is flagged for the admin.`,
        paidAt: `Transfer date`,
        bankRef: `Bank transaction code`,
        bankRefHint: `Shown in your banking app, if any.`,
        evidence: `Evidence (screenshot or PDF)`,
        evidenceHint: `PNG, JPEG, WebP or PDF, up to 5 MB.`,
        noEvidenceNeeded: `No evidence needed: nothing was transferred.`,
        evidenceRequired: `Attach the evidence of your transfer.`,
        evidenceProblem: { type: `Use a PNG, JPEG, WebP or PDF file.`, size: `The file must be at most 5 MB.` },
        submittedAt: `Declared on`,
        cancel: `Cancel request`,
        cancelTitle: `Cancel this payment request?`,
        cancelBody: `If you already transferred the money, do not cancel: ask the platform admin instead.`,
      },
      status: {
        SUBSCRIPTION_STATUS_UNSPECIFIED: ``,
        SUBSCRIPTION_STATUS_TRIAL: `Trial`,
        SUBSCRIPTION_STATUS_ACTIVE: `Active`,
        SUBSCRIPTION_STATUS_PAST_DUE: `Past due (read-only)`,
        SUBSCRIPTION_STATUS_SUSPENDED: `Suspended`,
        SUBSCRIPTION_STATUS_CANCELLED: `Cancelled`,
      },
      features: {
        FEATURE_UNSPECIFIED: ``,
        FEATURE_CUSTOMERS: `Customers & vehicles`,
        FEATURE_QUOTES: `Quotes`,
        FEATURE_REPAIR_ORDERS: `Repair orders`,
        FEATURE_INVENTORY: `Parts inventory`,
        FEATURE_BILLING: `Billing`,
        FEATURE_DOCUMENTS: `Documents`,
        FEATURE_REPORTS: `Reports`,
      },
    },
    license: {
      notice: {
        trial: {
          title: `{{count}} days left in your free trial`,
          owner: `Choose a plan to keep using VietGara after the trial.`,
          staff: `This garage is on a free trial.`,
        },
        readOnly: {
          title: `The subscription has expired: the garage is read-only`,
          owner: `You can still view your data, but changes are blocked. Renew within {{count}} days to avoid suspension.`,
          staff: `Ask the garage owner to renew the subscription.`,
        },
        suspended: {
          title: `The subscription is suspended`,
          owner: `The garage is locked until you renew. Your data is kept safe.`,
          staff: `Ask the garage owner to renew the subscription.`,
        },
      },
    },
    account: {
      phoneHint: `Lets garage owners find and invite you as staff.`,
      title: `My account`,
      description: `Your profile and the language of the interface and e-mails.`,
      fullName: `Full name`,
      language: `Language`,
      emailVerified: `Verified`,
      emailUnverified: `Not verified`,
    },
    customers: {
      consentColumn: `Data consent`,
      title: `Customers`,
      description: `Vehicle owners of this garage. Search by name, phone or e-mail.`,
      new: `New customer`,
      createTitle: `New customer`,
      editTitle: `Edit customer`,
      fullName: `Full name`,
      consent: `The customer consents to personal data processing (Decree 13/2023)`,
      consentGiven: `Consent given`,
      consentMissing: `No consent`,
      vehicles: `{{count}} vehicles`,
      empty: `No customers yet.`,
      deleteVehicles: `The customer's vehicles ({{count}}) go with them.`,
      searchPlaceholder: `Search customers…`,
      detail: `Customer details`,
      picker: {
        placeholder: `Search by name, phone, e-mail or plate…`,
        use: `Use this profile`,
        none: `No customer matches.`,
        create: `Create a walk-in customer`,
        createNamed: `Create walk-in customer “{{name}}”`,
      },
      link: {
        account: `VietGara account`,
        title: `Link {{name}} with a VietGara account`,
        description: `Ask the person who owns this e-mail to link their VietGara account with this profile.`,
        codeDescription: `Ask the customer for the code we sent them, then enter it here.`,
        consentNote: `We send a one-time code to the account that owns the customer’s verified e-mail. You never see who the user is: the customer reads the code to you, or accepts in the VietGara app.`,
        request: `Request link`,
        send: `Send code`,
        enterCode: `Enter code`,
        code: `Code the customer read out`,
        confirm: `Confirm link`,
        resend: `Send again`,
        cancelRequest: `Cancel request`,
        unlink: `Unlink`,
        linked: `The customer is linked.`,
        unlinked: `The link was ended.`,
        noUser: `No VietGara user has verified this e-mail yet, so there is nobody to ask. Add the customer’s e-mail, or keep them as a walk-in customer.`,
        status: { requested: `Link requested`, linked: `Linked`, declined: `Declined`, unlinked: `Unlinked` },
      },
    },
    taxProfiles: {
      title: `Tax profiles`,
      new: `New tax profile`,
      createTitle: `New tax profile`,
      editTitle: `Edit tax profile`,
      empty: `No tax profile yet. Documents are billed to the customer under their own name.`,
      kindLabel: `Type`,
      kind: { personal: `Personal`, company: `Company` },
      legalName: `Legal name`,
      taxId: `Tax ID`,
      taxIdHint: `10 digits, or 13 with the branch suffix.`,
      invoiceEmail: `E-invoice e-mail`,
      isDefault: `Bill to this profile when none is chosen`,
      default: `Default`,
    },
    billing: {
      billTo: `Bill to`,
      billToHint: `A tax profile of the customer, or a retail receipt under their own name.`,
      incompleteHint: `This profile has no tax ID or address yet, so it cannot be invoiced.`,
      retail: `Retail receipt (customer’s own name)`,
      defaultProfile: `Customer’s default profile`,
      change: `Change who is billed`,
      settlementTitle: `Billing`,
      settlementDescription: `Who this settlement is billed to, and whether the customer asked for a VAT invoice.`,
      invoiceRequested: `The customer asked for a VAT invoice`,
      invoiceYes: `VAT invoice requested`,
      invoiceNo: `Retail receipt, no VAT invoice`,
      invoiceIncomplete: `An invoice needs: {{fields}}. Complete the customer’s tax profile first.`,
      fields: { legalName: `legal name`, taxId: `tax ID`, address: `address` },
    },
    lifecycle: {
      deleteTitle: `Delete {{subject}}?`,
      deactivateTitle: `Deactivate {{subject}}?`,
      willDelete: `No document uses {{subject}}, so it will be deleted for good.`,
      willDeactivate: `{{subject}} is used by quotes or repair orders, so it will only be deactivated: it no longer shows in pickers, stays on the existing documents, and can be reactivated.`,
      deactivate: `Deactivate`,
      activate: `Reactivate`,
      deleted: `{{subject}} was deleted.`,
      deactivated: `{{subject}} was deactivated. You can reactivate it at any time.`,
      activated: `{{subject}} was reactivated.`,
      showInactive: `Show inactive items`,
    },
    vehicles: {
      title: `Vehicles`,
      description: `Customers’ vehicles. Search by plate, make or model.`,
      new: `New vehicle`,
      createTitle: `New vehicle`,
      editTitle: `Edit vehicle`,
      plate: `License plate`,
      make: `Make`,
      model: `Model`,
      year: `Year`,
      vin: `VIN`,
      engine: `Engine number`,
      customer: `Owner`,
      empty: `No vehicles yet.`,
      searchPlaceholder: `Search plate, make, model…`,
      lockedTitle: `Identity locked: a live quote, repair order or settlement uses this vehicle.`,
      lockedHint: `some fields are locked by live documents`,
      fieldLocked: `Locked while a document uses this vehicle. Use a correction.`,
      lockedCanCorrect: `Use “Correct data” to change a locked field with a reason; the documents keep what they recorded.`,
      lockedAskManager: `Ask a manager to correct a locked field.`,
      correct: {
        action: `Correct data`,
        title: `Correct {{plate}}`,
        description: `Changes one identity field of the vehicle. Documents already issued keep the value they recorded.`,
        field: `Field to correct`,
        value: `Corrected value`,
        valueHint: `The year as digits. Leave empty to clear an optional field.`,
        reason: `Why is the correction needed?`,
        submit: `Correct`,
        done: `The vehicle was corrected.`,
      },
      owner: {
        action: `Change owner`,
        title: `Change the owner of {{plate}}`,
        description: `Currently owned by {{owner}}. The vehicle keeps its repair history.`,
        newOwner: `New owner`,
        same: `This customer already owns the vehicle.`,
        reason: `Reason (optional)`,
        submit: `Change owner`,
        done: `The owner was changed.`,
      },
      history: `Repair history`,
      historyEmpty: `Quotes, repair orders and settlements will appear here — create the first quote for this vehicle.`,
      historyType: `Type`,
      historyTypes: {
        VEHICLE_HISTORY_ENTRY_TYPE_QUOTE: `Quote`,
        VEHICLE_HISTORY_ENTRY_TYPE_REPAIR_ORDER: `Repair order`,
        VEHICLE_HISTORY_ENTRY_TYPE_SETTLEMENT: `Settlement`,
      },
    },
    suppliers: {
      title: `Suppliers`,
      description: `The businesses you buy parts from.`,
      new: `New supplier`,
      createTitle: `New supplier`,
      editTitle: `Edit supplier`,
      contactPerson: `Contact person`,
      bankName: `Bank`,
      accountNumber: `Account number`,
      accountHolder: `Account holder`,
      empty: `No suppliers yet.`,
      searchPlaceholder: `Search suppliers…`,
    },
    quotes: {
      title: `Quotes`,
      description: `Create and track quotes sent to customers for approval.`,
      new: `New quote`,
      formDescription: `Pick the customer, vehicle and line items; choose how the customer approves the quote.`,
      empty: `No quotes yet.`,
      number: `Quote number`,
      customerVehicle: `Customer / Vehicle`,
      customer: `Customer`,
      vehicle: `Vehicle`,
      total: `Total`,
      itemType: `Type`,
      labor: `Labor`,
      part: `Part`,
      lineDescription: `Description`,
      quantity: `Quantity`,
      unitPrice: `Unit price`,
      lineTotal: `Line total`,
      addLine: `Add line item`,
      send: `Send for approval`,
      linkCopied: `Link copied.`,
      copyLink: `Copy link`,
      emailedNotice: `The approval link was e-mailed to the customer.`,
      notEmailedNotice: `The approval link was created — the customer has no e-mail on file, so share the link another way.`,
      recordDecision: `Record the customer's decision`,
      recordDecisionHint: `Use when the customer approved in person (no link), or to override a phone decision.`,
      approve: `Approve`,
      reject: `Reject`,
      saveDecision: `Save decision`,
      convert: `Convert to repair order`,
      convertedNotice: `A repair order was created from this quote.`,
      viewRepairOrder: `View repair order`,
      deleteConfirm: `Delete quote {{number}}?`,
      exportPdf: `Export PDF`,
      approvalMode: {
        label: `Quote approval mode`,
        LINK: `Send a link`,
        MANUAL: `Record manually`,
        LINKHint: `Generates a public link and e-mails it to the customer automatically when they have an e-mail on file.`,
        MANUALHint: `No link or e-mail is sent — a staff member asks the customer directly and records their decision.`,
      },
      status: {
        QUOTE_STATUS_DRAFT: `Draft`,
        QUOTE_STATUS_SENT: `Sent`,
        QUOTE_STATUS_APPROVED: `Approved`,
        QUOTE_STATUS_REJECTED: `Rejected`,
        QUOTE_STATUS_CONVERTED: `Converted`,
      },
      publicTitle: `Quote {{number}}`,
      publicApproved: `You approved this quote. Thank you!`,
      publicRejected: `You rejected this quote.`,
      publicDecideStart: `Review and decide each line`,
      publicSubmitDecision: `Submit decision`,
    },
    repairOrders: {
      title: `Repair orders`,
      description: `Track repair orders on the Kanban board: assign technicians, update progress, close when done.`,
      new: `New repair order`,
      formDescription: `Pick the vehicle and line items for this ad-hoc repair order.`,
      empty: `No repair orders yet.`,
      columnEmpty: `No orders`,
      filterTechnician: `Filter: Technician`,
      number: `Order #`,
      vehicle: `Vehicle`,
      itemType: `Type`,
      labor: `Labor`,
      part: `Part`,
      lineDescription: `Description`,
      quantity: `Quantity`,
      unitPrice: `Unit price`,
      lineTotal: `Line total`,
      lineStatus: `Status`,
      technicians: `Technicians`,
      total: `Total`,
      addLine: `Add line item`,
      close: `Close repair order`,
      readyToClose: `Every line is completed — ready to close.`,
      notReadyToClose: `Complete every line before closing.`,
      exportPdf: `Export PDF`,
      createSettlement: `Create settlement`,
      settlementCreatedNotice: `A settlement was created from this repair order.`,
      viewSettlement: `View settlement`,
      status: {
        REPAIR_ORDER_STATUS_OPEN: `To Do`,
        REPAIR_ORDER_STATUS_IN_PROGRESS: `In Progress`,
        REPAIR_ORDER_STATUS_WAITING_ON_PARTS: `Waiting on Parts`,
        REPAIR_ORDER_STATUS_COMPLETED: `Completed`,
        REPAIR_ORDER_STATUS_CLOSED: `Closed`,
      },
      lineStatuses: { NOT_STARTED: `Not started`, IN_PROGRESS: `In progress`, COMPLETED: `Completed` },
    },
    inventory: {
      title: `Inventory`,
      description: `Parts stock: catalogue, goods receipts and the stock movement report.`,
      tabStockOnHand: `Stock on Hand`,
      tabMovements: `Stock Movements`,
      new: `New item`,
      createTitle: `New item`,
      editTitle: `Edit item`,
      sku: `SKU`,
      name: `Name`,
      unit: `Unit`,
      unitPlaceholder: `e.g. piece, liter`,
      reorderThreshold: `Reorder threshold`,
      reorderThresholdHint: `A low-stock badge shows once on-hand quantity falls to or below this.`,
      onHand: `On hand`,
      lowStock: `Low stock`,
      empty: `No items yet.`,
      searchPlaceholder: `Search SKU or name…`,
      deleteConfirm: `Delete the item {{sku}}?`,
      receive: `Receive stock`,
      receiptTitle: `Receive stock — {{name}}`,
      receiptDescription: `Currently {{onHand}} {{unit}} on hand.`,
      receiptQuantity: `Quantity received`,
      unitCost: `Unit cost (VND)`,
      movementsEmpty: `No stock movements yet.`,
      reference: `Reference`,
      refRepairOrder: `Repair order issue`,
      direction: { label: `Direction`, STOCK_TRANSACTION_TYPE_IN: `In`, STOCK_TRANSACTION_TYPE_OUT: `Out` },
      exportExcel: `Export Excel`,
    },
    settlements: {
      title: `Billing & Receivables`,
      description: `Settle closed repair orders, record payments, and track what is still outstanding.`,
      outstandingOnly: `Outstanding only`,
      empty: `Settlements appear here once a repair order is closed and settled.`,
      number: `Settlement number`,
      customerVehicle: `Customer / Vehicle`,
      total: `Total`,
      payments: `Payments`,
      noPayments: `No payments recorded yet.`,
      voucherNumber: `Voucher`,
      voided: `Voided`,
      method: `Method`,
      amount: `Amount`,
      recordPayment: `Record payment`,
      recordPaymentDescription: `{{due}} still due.`,
      paymentRecorded: `Payment recorded.`,
      amountHint: `Up to {{due}} still due.`,
      payer: `Payer`,
      payerName: `Payer name`,
      payerNameHint: `Leave blank to use the customer: {{name}}.`,
      payerAddress: `Payer address`,
      reason: `Reason`,
      reasonHint: `Leave blank for "Payment of settlement {{number}}".`,
      collector: `Collected by`,
      exportVoucher: `Voucher PDF`,
      voidPayment: `Void voucher`,
      voidPaymentDescription: `Voucher {{number}} stays on file as voided and no longer counts towards the amount paid.`,
      voidReason: `Reason for voiding`,
      voidedBecause: `Voided: {{reason}}`,
      paymentVoided: `Voucher voided.`,
      exportReceipt: `Export receipt PDF`,
      methods: { CASH: `Cash`, BANK_TRANSFER: `Bank transfer`, ONLINE: `Online` },
      status: { SETTLEMENT_STATUS_PENDING: `Pending`, SETTLEMENT_STATUS_PARTIALLY_PAID: `Partially paid`, SETTLEMENT_STATUS_PAID: `Paid` },
    },
    dashboard: {
      title: `Dashboard`,
      body: `An overview of this garage: revenue, orders in progress, and anything that needs attention.`,
      attention: `Needs attention`,
      attentionNone: `Nothing needs your attention.`,
      monthlyRevenue: `Monthly revenue`,
      ordersInProgress: `Orders in progress`,
      outstandingReceivables: `Outstanding receivables`,
      revenueChartTitle: `Revenue, last 30 days`,
      revenueEmpty: `No revenue yet — create your first quote to get started.`,
      lowStockAlert_one: `{{count}} item is low on stock`,
      lowStockAlert_other: `{{count}} items are low on stock`,
      outstandingAlert_one: `{{count}} settlement has an outstanding balance`,
      outstandingAlert_other: `{{count}} settlements have an outstanding balance`,
      viewInventory: `View inventory`,
      viewSettlements: `View settlements`,
      recentOrders: `Repair orders in progress`,
      recentOrdersEmpty: `No repair orders in progress.`,
    },
    errors: {
      GENERIC: `Something went wrong. Please try again.`,
      INVOICE_DATA_INCOMPLETE: `An invoice needs the billing party’s legal name, tax ID and address.`,
      INTERNAL: `The service is having trouble. Please try again later.`,
      BAD_REQUEST: `The request is invalid.`,
      VALIDATION_ERROR: `Please check the highlighted information.`,
      NOT_FOUND: `Not found.`,
      UNAUTHENTICATED: `Your session expired. Please sign in again.`,
      PERMISSION_DENIED: `You are not allowed to do this.`,
      ALREADY_EXISTS: `This already exists.`,
      FAILED_PRECONDITION: `This cannot be done right now.`,
      RATE_LIMITED: `Too many attempts. Please wait a moment.`,
      INVALID_CREDENTIALS: `Wrong e-mail or password.`,
      USER_SUSPENDED: `This user is suspended.`,
      EMAIL_TAKEN: `This e-mail is already registered.`,
      PHONE_TAKEN: `This phone number belongs to another user.`,
      EMAIL_NOT_VERIFIED: `Please verify your e-mail first.`,
      EMAIL_ALREADY_VERIFIED: `Your e-mail is already verified.`,
      OTP_INVALID: `Wrong code.`,
      OTP_EXPIRED: `The code expired. Request a new one.`,
      OTP_TOO_MANY_ATTEMPTS: `Too many wrong codes. Request a new one.`,
      OTP_RESEND_TOO_SOON: `Please wait before requesting another code.`,
      RESET_TOKEN_INVALID: `The reset session expired. Start again.`,
      REFRESH_TOKEN_INVALID: `Your session expired.`,
      GARAGE_ACCESS_DENIED: `You have no access to this garage.`,
      OWNER_ONLY: `Only the garage owner can do this.`,
      GARAGE_INACTIVE: `This garage is inactive.`,
      SUBSCRIPTION_SUSPENDED: `The subscription is suspended. Please renew.`,
      SUBSCRIPTION_READ_ONLY: `The subscription is past due: read-only mode.`,
      PLAN_LIMIT_REACHED: `Your plan limit is reached. Upgrade to add more.`,
      PLAN_NOT_AVAILABLE: `This plan cannot be chosen.`,
      TRIAL_NOT_AVAILABLE: `The free trial can be used only once.`,
      REQUEST_ALREADY_OPEN: `A payment is already waiting for review. Wait for the decision or cancel it.`,
      REQUEST_NOT_OPEN: `This payment request was already decided.`,
      EVIDENCE_REQUIRED: `Attach the evidence of your transfer.`,
      PLAN_CODE_TAKEN: `A plan with this code exists.`,
      IDEMPOTENCY_KEY_REUSED: `This was already submitted with different details. Check the record before trying again.`,
      USER_NOT_FOUND: `No VietGara user uses this e-mail or phone.`,
      USER_INACTIVE: `This user is inactive.`,
      ALREADY_MEMBER: `This user is already a member.`,
      ALREADY_INVITED: `This user already has a pending invitation.`,
      OWNER_MEMBERSHIP: `The owner’s membership cannot change.`,
      INVITATION_NOT_PENDING: `The invitation was already answered or revoked.`,
      INVITATION_EXPIRED: `The invitation expired.`,
      ROLE_NAME_TAKEN: `A role with this name exists.`,
      ROLE_IN_USE: `Groups still use this role.`,
      GROUP_NAME_TAKEN: `A group with this name exists in the garage.`,
      INVALID_LOGO: `The logo must be a PNG, JPEG or WebP image of at most 1 MB.`,
      GOOGLE_NOT_CONFIGURED: `Google sign-in is not configured.`,
      GOOGLE_STATE_INVALID: `The Google sign-in expired, try again.`,
      GOOGLE_DENIED: `Google sign-in was cancelled.`,
      GOOGLE_EXCHANGE_FAILED: `Google sign-in is unavailable right now.`,
      POPUP_BLOCKED: `The browser blocked the Google sign-in window.`,
      QUOTE_LINK_INVALID: `This link is invalid or has expired.`,
    },
  },
  ne = {
    common: {
      save: `Lưu`,
      cancel: `Huỷ`,
      create: `Tạo`,
      edit: `Sửa`,
      delete: `Xoá`,
      remove: `Gỡ`,
      close: `Đóng`,
      copy: `Sao chép`,
      copied: `Đã sao chép`,
      back: `Quay lại`,
      search: `Tìm kiếm`,
      loading: `Đang tải…`,
      retry: `Thử lại`,
      confirm: `Xác nhận`,
      actions: `Thao tác`,
      status: `Trạng thái`,
      active: `Đang hoạt động`,
      inactive: `Ngừng hoạt động`,
      name: `Tên`,
      description: `Mô tả`,
      email: `Email`,
      phone: `Số điện thoại`,
      address: `Địa chỉ`,
      optional: `không bắt buộc`,
      saved: `Đã lưu thay đổi.`,
      none: `Không có`,
      all: `Tất cả`,
      next: `Tiếp tục`,
      previous: `Trang trước`,
      nextPage: `Trang sau`,
      page: `Trang {{page}} / {{pages}}`,
      total: `{{count}} mục`,
      yes: `Có`,
      no: `Không`,
      saving: `Đang lưu…`,
      change: `Đổi`,
      createdAt: `Ngày tạo`,
      note: `Ghi chú`,
      taxCode: `Mã số thuế`,
      selectGarageFirst: `Hãy chọn hoặc tạo một gara trước.`,
    },
    nav: {
      help: `Trợ giúp & hỗ trợ`,
      workspace: `Không gian làm việc`,
      dashboard: `Tổng quan`,
      garages: `Gara`,
      customers: `Khách hàng`,
      vehicles: `Xe`,
      quotes: `Báo giá`,
      suppliers: `Nhà cung cấp`,
      staff: `Nhân viên`,
      roles: `Vai trò & nhóm`,
      subscription: `Gói dịch vụ`,
      invitations: `Lời mời`,
      account: `Tài khoản của tôi`,
      repairOrders: `Lệnh sửa chữa`,
      inventory: `Kho`,
      settlements: `Quyết toán & Công nợ`,
      soon: `Sắp có`,
      signOut: `Đăng xuất`,
      language: `Ngôn ngữ`,
      selectGarage: `Chọn gara`,
      noGarage: `Chưa có gara`,
      group: { operations: `Vận hành`, customers: `Khách hàng`, finance: `Tài chính`, garage: `Gara` },
      manageGarages: `Quản lý gara`,
      comingSoon: `Tính năng này sẽ có trong phiên bản tiếp theo.`,
    },
    language: { vi: `Tiếng Việt`, en: `English` },
    ui: {
      menu: `Menu`,
      sidebar: { collapse: `Thu gọn thanh bên`, expand: `Mở rộng thanh bên` },
      navigation: `Điều hướng`,
      skipToContent: `Chuyển đến nội dung chính`,
      theme: { label: `Giao diện`, light: `Sáng`, dark: `Tối`, system: `Theo hệ thống` },
      commandOpen: `Tìm nhanh`,
      commandPlaceholder: `Tìm trang hoặc thao tác…`,
      commandEmpty: `Không có kết quả.`,
      commandPages: `Trang`,
      commandGarages: `Gara`,
      range: `{{from}}–{{to}} / {{total}}`,
      clear: `Xoá`,
      loadFailed: `Không tải được dữ liệu`,
      noResults: `Không có kết quả phù hợp`,
      breadcrumb: `Đường dẫn`,
      clearFilters: `Xoá bộ lọc`,
      account: `Tài khoản của tôi`,
      userMenu: `Menu người dùng`,
    },
    auth: {
      brandTagline: `Quản lý gara ô tô trên một nền tảng duy nhất`,
      brandBody: `Báo giá, sửa chữa, kho phụ tùng và quyết toán cho mọi chi nhánh của bạn.`,
      login: {
        title: `Đăng nhập`,
        subtitle: `Chào mừng trở lại VietGara.`,
        email: `Email`,
        password: `Mật khẩu`,
        submit: `Đăng nhập`,
        forgot: `Quên mật khẩu?`,
        noAccount: `Mới dùng VietGara?`,
        register: `Đăng ký`,
        google: `Tiếp tục với Google`,
        or: `hoặc`,
        showPassword: `Hiện mật khẩu`,
        hidePassword: `Ẩn mật khẩu`,
      },
      register: {
        title: `Tạo tài khoản`,
        subtitle: `Dùng thử miễn phí 14 ngày sau khi xác minh email.`,
        fullName: `Họ và tên`,
        phone: `Số điện thoại`,
        password: `Mật khẩu`,
        passwordHint: `Ít nhất 8 ký tự.`,
        language: `Ngôn ngữ`,
        submit: `Đăng ký`,
        haveAccount: `Đã đăng ký?`,
        login: `Đăng nhập`,
      },
      verify: {
        title: `Xác minh email`,
        subtitle: `Chúng tôi đã gửi mã 6 chữ số đến {{email}}. Nhập mã trong vòng 2 phút.`,
        code: `Mã xác minh`,
        submit: `Xác minh`,
        resend: `Gửi lại mã`,
        resendIn: `Gửi lại sau {{seconds}} giây`,
        expiresIn: `Mã hết hạn sau {{time}}`,
        expired: `Mã đã hết hạn. Hãy gửi lại mã mới.`,
        sent: `Đã gửi mã mới.`,
        blocked: `Bạn cần xác minh email trước khi quản lý gara, nhân viên và dữ liệu.`,
        otherAccount: `Đăng nhập bằng người dùng khác`,
      },
      forgot: {
        title: `Quên mật khẩu`,
        subtitle: `Nhập email tài khoản. Chúng tôi sẽ gửi mã đặt lại mật khẩu.`,
        sendCode: `Gửi mã`,
        codeTitle: `Nhập mã`,
        codeSubtitle: `Nếu {{email}} có tài khoản, mã 6 chữ số đã được gửi. Mã có hiệu lực 2 phút.`,
        verify: `Xác nhận mã`,
        newPasswordTitle: `Đặt mật khẩu mới`,
        newPassword: `Mật khẩu mới`,
        confirmPassword: `Nhập lại mật khẩu`,
        mismatch: `Mật khẩu nhập lại không khớp.`,
        reset: `Đặt lại mật khẩu`,
        done: `Đã đổi mật khẩu. Hãy đăng nhập lại.`,
        backToLogin: `Quay lại đăng nhập`,
        changeEmail: `Đổi email`,
      },
    },
    garages: {
      current: `Đang dùng`,
      day: `Ngày`,
      workday: `Làm việc`,
      activateConfirm: `Kích hoạt lại gara {{name}}? Nhân viên sẽ truy cập được trở lại.`,
      title: `Gara`,
      description: `Mỗi gara là một chi nhánh độc lập với dữ liệu, nhân viên và cấu hình riêng.`,
      new: `Thêm gara`,
      createTitle: `Thêm gara mới`,
      createDescription: `Gara mới dùng chung gói dịch vụ của chủ sở hữu.`,
      name: `Tên gara`,
      empty: `Chưa có gara nào. Hãy tạo gara đầu tiên để bắt đầu.`,
      owner: `Chủ sở hữu`,
      member: `Nhân viên`,
      open: `Mở`,
      settings: `Cài đặt gara`,
      settingsDescription: `Hồ sơ, giờ làm việc, cách đánh số chứng từ và logo.`,
      deactivate: `Ngừng hoạt động`,
      activate: `Kích hoạt lại`,
      deactivateConfirm: `Ngừng hoạt động gara {{name}}? Nhân viên sẽ không truy cập được cho đến khi bạn kích hoạt lại.`,
      profile: `Hồ sơ`,
      legalProfile: `Thông tin pháp lý`,
      legalProfileHint: `In ở đầu báo giá, lệnh sửa chữa, quyết toán và phiếu thu cùng với logo và mã số thuế. Chứng từ đã phát hành giữ nguyên thông tin lúc phát hành.`,
      legalName: `Tên pháp lý`,
      legalAddress: `Địa chỉ đăng ký`,
      representative: `Người đại diện pháp luật`,
      settlementTemplate: `Mẫu số quyết toán`,
      paymentVoucherTemplate: `Mẫu số phiếu thu`,
      paymentVoucherTemplateHint: `Dùng cùng ký hiệu, ví dụ PT-{YYYY}{MM}-{SEQ:4}.`,
      configuration: `Cấu hình`,
      timezone: `Múi giờ`,
      currency: `Tiền tệ`,
      logo: `Logo`,
      uploadLogo: `Tải logo lên`,
      removeLogo: `Xoá logo`,
      logoHint: `PNG, JPEG hoặc WebP, tối đa 1 MB.`,
      operatingHours: `Giờ làm việc`,
      closed: `Nghỉ`,
      opens: `Mở cửa`,
      closes: `Đóng cửa`,
      numbering: `Đánh số chứng từ`,
      quoteTemplate: `Mẫu số báo giá`,
      repairOrderTemplate: `Mẫu số lệnh sửa chữa`,
      templateHint: `Dùng {YYYY}, {YY}, {MM}, {DD} và đúng một {SEQ:n}, ví dụ BG-{YYYY}{MM}-{SEQ:4}.`,
      defaultApprovalMode: `Cách duyệt báo giá mặc định`,
      defaultApprovalModeHint: `Áp dụng cho báo giá mới; có thể đổi riêng cho từng báo giá.`,
      days: {
        DAY_OF_WEEK_UNSPECIFIED: ``,
        MONDAY: `Thứ Hai`,
        TUESDAY: `Thứ Ba`,
        WEDNESDAY: `Thứ Tư`,
        THURSDAY: `Thứ Năm`,
        FRIDAY: `Thứ Sáu`,
        SATURDAY: `Thứ Bảy`,
        SUNDAY: `Chủ Nhật`,
      },
      readOnly: `Gói dịch vụ đã hết hạn: gara đang ở chế độ chỉ đọc.`,
      locked: `Gói dịch vụ đã bị tạm khoá.`,
      renew: `Gia hạn`,
      inactiveNotice: `Gara này đang ngừng hoạt động.`,
    },
    staff: {
      expires: `Hết hạn`,
      noGroupsYet: `Gara chưa có nhóm nhân viên nào. Chủ gara tạo nhóm ở trang Vai trò & nhóm.`,
      title: `Nhân viên`,
      description: `Mời người dùng VietGara vào gara và phân nhóm để cấp quyền.`,
      invite: `Mời nhân viên`,
      inviteTitle: `Mời nhân viên`,
      inviteDescription: `Tìm người dùng bằng email hoặc số điện thoại. Người được mời nhận email và chấp nhận lời mời.`,
      lookup: `Email hoặc số điện thoại`,
      find: `Tìm`,
      inviteSent: `Đã gửi lời mời.`,
      candidateMember: `Người dùng này đã là nhân viên của gara.`,
      candidateInvited: `Người dùng này đang có lời mời chờ xác nhận.`,
      groups: `Nhóm`,
      noGroups: `Chưa thuộc nhóm nào`,
      sendInvite: `Gửi lời mời`,
      members: `Thành viên`,
      invitations: `Lời mời`,
      owner: `Chủ gara`,
      permissions: `{{count}} quyền`,
      editGroups: `Đổi nhóm`,
      editGroupsTitle: `Nhóm của {{name}}`,
      deactivate: `Tạm dừng`,
      activate: `Kích hoạt`,
      remove: `Gỡ khỏi gara`,
      removeConfirm: `Gỡ {{name}} khỏi gara? Tài khoản sẽ mất quyền truy cập ngay.`,
      revoke: `Thu hồi`,
      invitedBy: `Mời bởi {{name}}`,
      expiresAt: `Hết hạn {{date}}`,
      empty: `Chưa có nhân viên nào ngoài chủ gara.`,
      noInvitations: `Chưa có lời mời nào.`,
      seats: `Nhân viên: {{used}} / {{max}}`,
    },
    invitationStatus: {
      INVITATION_STATUS_UNSPECIFIED: ``,
      INVITATION_STATUS_PENDING: `Chờ xác nhận`,
      INVITATION_STATUS_ACCEPTED: `Đã chấp nhận`,
      INVITATION_STATUS_DECLINED: `Đã từ chối`,
      INVITATION_STATUS_REVOKED: `Đã thu hồi`,
      INVITATION_STATUS_EXPIRED: `Hết hạn`,
    },
    invitations: {
      title: `Lời mời của tôi`,
      description: `Các gara đã mời bạn tham gia.`,
      empty: `Bạn chưa có lời mời nào.`,
      accept: `Chấp nhận`,
      decline: `Từ chối`,
      from: `{{inviter}} mời bạn tham gia {{garage}}`,
      accepted: `Bạn đã tham gia {{garage}}.`,
      notFound: `Không tìm thấy lời mời, hoặc lời mời không dành cho tài khoản này.`,
    },
    roles: {
      title: `Vai trò & nhóm`,
      description: `Vai trò là tập quyền dùng chung cho mọi gara của bạn. Nhóm gán một vai trò cho nhân viên trong từng gara.`,
      roles: `Vai trò`,
      new: `Thêm vai trò`,
      createTitle: `Thêm vai trò`,
      editTitle: `Sửa vai trò`,
      permissions: `Quyền`,
      default: `Mặc định`,
      usedBy: `Dùng bởi {{count}} nhóm`,
      deleteConfirm: `Xoá vai trò {{name}}?`,
      ownerOnly: `Chỉ chủ gara quản lý vai trò và nhóm.`,
      groups: `Nhóm trong {{garage}}`,
      newGroup: `Thêm nhóm`,
      groupTitle: `Nhóm nhân viên`,
      role: `Vai trò`,
      members: `{{count}} thành viên`,
      deleteGroupConfirm: `Xoá nhóm {{name}}? Thành viên vẫn giữ các nhóm khác.`,
      editor: {
        breadcrumb: `Vai trò & nhóm`,
        description: `Đánh dấu những gì vai trò được làm trong từng phân hệ. Quyền sửa đã bao gồm quyền xem. Chỉ áp dụng khi bạn lưu.`,
        selectRole: `Vai trò`,
        module: `Phân hệ`,
        read: `Xem`,
        write: `Thêm & sửa`,
        none: `Không áp dụng`,
        comingSoon: `Sắp ra mắt`,
        impact: `Áp dụng ngay cho mọi gara của bạn, với thành viên của {{count}} nhóm đang dùng vai trò này.`,
        impactNone: `Chưa có nhóm nhân viên nào dùng vai trò này.`,
        changes_one: `{{count}} thay đổi chưa lưu`,
        changes_other: `{{count}} thay đổi chưa lưu`,
        noChanges: `Không có thay đổi chưa lưu`,
        created: `Đã tạo vai trò.`,
        discardTitle: `Bỏ các thay đổi chưa lưu?`,
        discardBody: `Các thay đổi của vai trò này chưa được lưu.`,
        discard: `Bỏ thay đổi`,
        undo: `Hoàn tác`,
        resetDefault: `Khôi phục mặc định`,
        resetHint: `Khôi phục các quyền ban đầu của vai trò mặc định này. Tên và mô tả được giữ nguyên; chỉ áp dụng khi bạn lưu.`,
      },
      modules: {
        garage: `Gara`,
        staff: `Nhân viên`,
        customer: `Khách hàng & xe`,
        supplier: `Nhà cung cấp`,
        subscription: `Gói dịch vụ`,
        quote: `Báo giá`,
        repair_order: `Lệnh sửa chữa`,
        inventory: `Kho`,
        billing: `Quyết toán & công nợ`,
        report: `Báo cáo`,
      },
    },
    permission: {
      PERMISSION_GARAGE_WRITE: `Sửa hồ sơ và cấu hình gara`,
      PERMISSION_STAFF_READ: `Xem nhân viên`,
      PERMISSION_STAFF_WRITE: `Quản lý nhân viên`,
      PERMISSION_CUSTOMER_READ: `Xem khách hàng và xe`,
      PERMISSION_CUSTOMER_WRITE: `Thêm, sửa khách hàng và xe`,
      PERMISSION_SUPPLIER_READ: `Xem nhà cung cấp`,
      PERMISSION_SUPPLIER_WRITE: `Quản lý nhà cung cấp`,
      PERMISSION_SUBSCRIPTION_READ: `Xem gói dịch vụ`,
      PERMISSION_QUOTE_READ: `Xem báo giá`,
      PERMISSION_QUOTE_WRITE: `Lập báo giá`,
      PERMISSION_REPAIR_ORDER_READ: `Xem lệnh sửa chữa`,
      PERMISSION_REPAIR_ORDER_WRITE: `Cập nhật lệnh sửa chữa`,
      PERMISSION_INVENTORY_READ: `Xem kho`,
      PERMISSION_INVENTORY_WRITE: `Nhập, xuất kho`,
      PERMISSION_BILLING_READ: `Xem quyết toán, công nợ`,
      PERMISSION_BILLING_WRITE: `Quyết toán, thu tiền`,
      PERMISSION_REPORT_READ: `Xem báo cáo`,
      PERMISSION_CUSTOMER_CORRECT: `Sửa trường định danh xe đã khoá và đổi chủ xe`,
    },
    subscription: {
      confirmTitle: `Thanh toán cho gói {{name}}?`,
      confirmBody: `Giá {{price}} · {{limits}}. Chúng tôi báo số tiền cần chuyển, đã trừ số dư tín dụng của bạn, và hướng dẫn chuyển khoản. Gói mới có hiệu lực ngay khi quản trị viên nền tảng duyệt thanh toán.`,
      confirmReplaceBody: `Giá {{price}} · {{limits}}. Thao tác này thay thế yêu cầu đang chờ thanh toán của bạn bằng báo giá và mã chuyển khoản mới.`,
      getQuote: `Xem thông tin thanh toán`,
      quoted: `Thông tin thanh toán cho gói {{name}} ở bên dưới.`,
      overLimitTitle: `Mức sử dụng vượt quá gói {{name}}`,
      overLimitBody: `Bạn đang dùng nhiều {{limits}} hơn mức gói cho phép ({{allowed}}). Hãy giảm bớt rồi chọn lại gói.`,
      waitingForReview: `Thanh toán của bạn đang chờ duyệt.`,
      manualPayment: `Bạn thanh toán bằng chuyển khoản, quản trị viên nền tảng sẽ duyệt và gói mới có hiệu lực ngay. Số ngày chưa dùng của gói hiện tại được quy đổi thành tín dụng.`,
      title: `Gói dịch vụ`,
      description: `Một gói dịch vụ áp dụng cho mọi gara của tài khoản.`,
      plan: `Gói hiện tại`,
      periodEnd: `Hiệu lực đến`,
      trialEnd: `Dùng thử đến`,
      graceEnd: `Chỉ đọc đến`,
      usage: `Mức sử dụng`,
      garages: `Gara`,
      staff: `Nhân viên`,
      transactionsToday: `Giao dịch hôm nay`,
      choosePlan: `Chọn gói`,
      current: `Gói đang dùng`,
      choose: `Chọn gói này`,
      renew: `Gia hạn`,
      perMonth: `/tháng`,
      perYear: `/năm`,
      ownerOnly: `Chỉ chủ sở hữu quản lý gói dịch vụ.`,
      limits: `{{garages}} gara · {{staff}} nhân viên · {{transactions}} giao dịch/ngày`,
      credit: {
        title: `Tín dụng tài khoản`,
        balance: `Số dư:`,
        hint: `Tín dụng phát sinh từ phần chưa dùng của gói bạn rời đi và được tự động trừ vào lần thanh toán tiếp theo.`,
        kind: {
          CREDIT_ENTRY_KIND_UNSPECIFIED: ``,
          CREDIT_ENTRY_KIND_EARNED: `Tín dụng phát sinh`,
          CREDIT_ENTRY_KIND_APPLIED: `Tín dụng đã dùng`,
          CREDIT_ENTRY_KIND_ADJUSTMENT: `Điều chỉnh`,
        },
      },
      payment: {
        title: `Thanh toán gói {{name}}`,
        status: {
          PLAN_PAYMENT_STATUS_UNSPECIFIED: ``,
          PLAN_PAYMENT_STATUS_AWAITING_PAYMENT: `Chờ thanh toán`,
          PLAN_PAYMENT_STATUS_SUBMITTED: `Chờ duyệt`,
          PLAN_PAYMENT_STATUS_APPROVED: `Đã duyệt`,
          PLAN_PAYMENT_STATUS_REJECTED: `Bị từ chối`,
          PLAN_PAYMENT_STATUS_CANCELLED: `Đã huỷ`,
        },
        decided: {
          PLAN_PAYMENT_STATUS_APPROVED: `Thanh toán gói {{name}} đã được duyệt`,
          PLAN_PAYMENT_STATUS_REJECTED: `Thanh toán gói {{name}} bị từ chối`,
        },
        waitingTitle: `Đang chờ duyệt`,
        waitingBody: `Quản trị viên nền tảng đang kiểm tra giao dịch của bạn. Gói có hiệu lực ngay khi được duyệt và bạn sẽ nhận email.`,
        rejectedTitle: `Thanh toán của bạn bị từ chối`,
        mismatchTitle: `Số tiền khác với báo giá`,
        mismatchBody: `Bạn đã chuyển số tiền khác {{amount}}. Quản trị viên nền tảng sẽ liên hệ để xử lý.`,
        planPrice: `Giá gói`,
        creditApplied: `Tín dụng tài khoản đã trừ`,
        amountDue: `Số tiền cần chuyển`,
        creditSurplus: `Phần dư giữ lại làm tín dụng`,
        unusedDays: `Số ngày chưa dùng của kỳ hiện tại`,
        unusedOf: `{{unused}} trên {{total}} ngày`,
        howToPay: `Chuyển đúng số tiền vào tài khoản này, ghi mã tham chiếu vào nội dung chuyển khoản, rồi khai báo thanh toán bên dưới.`,
        coveredByCredit: `Tín dụng tài khoản đã đủ trả toàn bộ giá: không cần chuyển tiền. Hãy gửi yêu cầu để quản trị viên duyệt.`,
        bank: `Ngân hàng`,
        account: `Số tài khoản`,
        holder: `Chủ tài khoản`,
        branch: `Chi nhánh`,
        reference: `Mã tham chiếu chuyển khoản`,
        referenceHint: `Ghi mã tham chiếu vào nội dung chuyển khoản để đối soát.`,
        qrAlt: `Mã QR ngân hàng`,
        qrCaption: `Quét bằng ứng dụng ngân hàng`,
        declareAction: `Tôi đã chuyển tiền: khai báo giao dịch`,
        declareTitle: `Khai báo giao dịch chuyển khoản`,
        declareDescription: `Số tiền {{amount}} · mã tham chiếu {{reference}}.`,
        declare: `Gửi để duyệt`,
        payerName: `Tên người chuyển`,
        payerBank: `Ngân hàng người chuyển`,
        payerAccount: `Tài khoản người chuyển`,
        transferredAmount: `Số tiền đã chuyển`,
        transferredHint: `Đơn vị VND. Số tiền khác báo giá sẽ được đánh dấu cho quản trị viên.`,
        paidAt: `Ngày chuyển`,
        bankRef: `Mã giao dịch ngân hàng`,
        bankRefHint: `Hiển thị trong ứng dụng ngân hàng của bạn, nếu có.`,
        evidence: `Chứng từ (ảnh chụp hoặc PDF)`,
        evidenceHint: `PNG, JPEG, WebP hoặc PDF, tối đa 5 MB.`,
        noEvidenceNeeded: `Không cần chứng từ: không có khoản nào được chuyển.`,
        evidenceRequired: `Hãy đính kèm chứng từ chuyển khoản.`,
        evidenceProblem: { type: `Hãy dùng tệp PNG, JPEG, WebP hoặc PDF.`, size: `Tệp tối đa 5 MB.` },
        submittedAt: `Khai báo lúc`,
        cancel: `Huỷ yêu cầu`,
        cancelTitle: `Huỷ yêu cầu thanh toán này?`,
        cancelBody: `Nếu bạn đã chuyển tiền thì đừng huỷ: hãy liên hệ quản trị viên nền tảng.`,
      },
      status: {
        SUBSCRIPTION_STATUS_UNSPECIFIED: ``,
        SUBSCRIPTION_STATUS_TRIAL: `Dùng thử`,
        SUBSCRIPTION_STATUS_ACTIVE: `Đang hoạt động`,
        SUBSCRIPTION_STATUS_PAST_DUE: `Quá hạn (chỉ đọc)`,
        SUBSCRIPTION_STATUS_SUSPENDED: `Tạm khoá`,
        SUBSCRIPTION_STATUS_CANCELLED: `Đã huỷ`,
      },
      features: {
        FEATURE_UNSPECIFIED: ``,
        FEATURE_CUSTOMERS: `Khách hàng & xe`,
        FEATURE_QUOTES: `Báo giá`,
        FEATURE_REPAIR_ORDERS: `Lệnh sửa chữa`,
        FEATURE_INVENTORY: `Kho phụ tùng`,
        FEATURE_BILLING: `Quyết toán`,
        FEATURE_DOCUMENTS: `In ấn chứng từ`,
        FEATURE_REPORTS: `Báo cáo`,
      },
    },
    license: {
      notice: {
        trial: {
          title: `Còn {{count}} ngày dùng thử`,
          owner: `Chọn gói dịch vụ để tiếp tục dùng VietGara sau khi hết hạn dùng thử.`,
          staff: `Gara đang trong thời gian dùng thử.`,
        },
        readOnly: {
          title: `Gói dịch vụ đã hết hạn: gara đang ở chế độ chỉ đọc`,
          owner: `Bạn vẫn xem được dữ liệu nhưng không thể thay đổi. Gia hạn trong {{count}} ngày để tránh bị khoá.`,
          staff: `Hãy liên hệ chủ gara để gia hạn gói dịch vụ.`,
        },
        suspended: {
          title: `Gói dịch vụ đã bị tạm khoá`,
          owner: `Gara bị khoá cho đến khi bạn gia hạn. Dữ liệu vẫn được giữ an toàn.`,
          staff: `Hãy liên hệ chủ gara để gia hạn gói dịch vụ.`,
        },
      },
    },
    account: {
      phoneHint: `Dùng để chủ gara tìm và mời bạn làm nhân viên.`,
      title: `Tài khoản của tôi`,
      description: `Thông tin cá nhân và ngôn ngữ giao diện, email.`,
      fullName: `Họ và tên`,
      language: `Ngôn ngữ`,
      emailVerified: `Đã xác minh`,
      emailUnverified: `Chưa xác minh`,
    },
    customers: {
      consentColumn: `Đồng ý dữ liệu`,
      title: `Khách hàng`,
      description: `Chủ xe của gara. Tìm theo tên, số điện thoại hoặc email.`,
      new: `Thêm khách hàng`,
      createTitle: `Thêm khách hàng`,
      editTitle: `Sửa khách hàng`,
      fullName: `Họ và tên`,
      consent: `Khách đồng ý cho gara lưu và xử lý dữ liệu cá nhân (Nghị định 13/2023)`,
      consentGiven: `Đã đồng ý`,
      consentMissing: `Chưa đồng ý`,
      vehicles: `{{count}} xe`,
      empty: `Chưa có khách hàng nào.`,
      deleteVehicles: `Các xe của khách ({{count}} xe) đi cùng khách hàng này.`,
      searchPlaceholder: `Tìm khách hàng…`,
      detail: `Chi tiết khách hàng`,
      picker: {
        placeholder: `Tìm theo tên, số điện thoại, email hoặc biển số…`,
        use: `Dùng hồ sơ này`,
        none: `Không có khách hàng phù hợp.`,
        create: `Tạo khách vãng lai`,
        createNamed: `Tạo khách vãng lai “{{name}}”`,
      },
      link: {
        account: `Tài khoản VietGara`,
        title: `Liên kết {{name}} với tài khoản VietGara`,
        description: `Gửi lời mời tới người sở hữu email này để liên kết tài khoản VietGara của họ với hồ sơ khách hàng.`,
        codeDescription: `Hỏi khách mã chúng tôi vừa gửi, rồi nhập vào đây.`,
        consentNote: `Chúng tôi gửi mã dùng một lần tới tài khoản sở hữu email đã xác minh của khách. Gara không thấy đó là ai: khách đọc mã cho bạn, hoặc chấp nhận trong ứng dụng VietGara.`,
        request: `Yêu cầu liên kết`,
        send: `Gửi mã`,
        enterCode: `Nhập mã`,
        code: `Mã khách đọc cho bạn`,
        confirm: `Xác nhận liên kết`,
        resend: `Gửi lại`,
        cancelRequest: `Huỷ yêu cầu`,
        unlink: `Huỷ liên kết`,
        linked: `Đã liên kết với khách hàng.`,
        unlinked: `Đã huỷ liên kết.`,
        noUser: `Chưa có người dùng VietGara nào xác minh email này nên chưa có ai để gửi lời mời. Hãy bổ sung email của khách, hoặc giữ họ là khách vãng lai.`,
        status: { requested: `Đã gửi yêu cầu`, linked: `Đã liên kết`, declined: `Đã từ chối`, unlinked: `Đã huỷ liên kết` },
      },
    },
    taxProfiles: {
      title: `Hồ sơ thuế`,
      new: `Thêm hồ sơ thuế`,
      createTitle: `Thêm hồ sơ thuế`,
      editTitle: `Sửa hồ sơ thuế`,
      empty: `Chưa có hồ sơ thuế. Chứng từ được lập cho khách bằng tên của chính họ.`,
      kindLabel: `Loại`,
      kind: { personal: `Cá nhân`, company: `Doanh nghiệp` },
      legalName: `Tên pháp lý`,
      taxId: `Mã số thuế`,
      taxIdHint: `10 chữ số, hoặc 13 chữ số kèm hậu tố chi nhánh.`,
      invoiceEmail: `Email nhận hoá đơn điện tử`,
      isDefault: `Lập chứng từ cho hồ sơ này khi không chọn`,
      default: `Mặc định`,
    },
    billing: {
      billTo: `Lập cho`,
      billToHint: `Một hồ sơ thuế của khách, hoặc biên nhận bán lẻ theo tên của chính khách.`,
      incompleteHint: `Hồ sơ này chưa có mã số thuế hoặc địa chỉ nên chưa xuất hoá đơn được.`,
      retail: `Biên nhận bán lẻ (tên của khách)`,
      defaultProfile: `Hồ sơ mặc định của khách`,
      change: `Đổi bên được lập`,
      settlementTitle: `Thông tin lập hoá đơn`,
      settlementDescription: `Quyết toán này lập cho ai, và khách có yêu cầu hoá đơn VAT không.`,
      invoiceRequested: `Khách yêu cầu hoá đơn VAT`,
      invoiceYes: `Có yêu cầu hoá đơn VAT`,
      invoiceNo: `Biên nhận bán lẻ, không có hoá đơn VAT`,
      invoiceIncomplete: `Hoá đơn cần: {{fields}}. Hãy bổ sung hồ sơ thuế của khách trước.`,
      fields: { legalName: `tên pháp lý`, taxId: `mã số thuế`, address: `địa chỉ` },
    },
    lifecycle: {
      deleteTitle: `Xoá {{subject}}?`,
      deactivateTitle: `Ngừng hoạt động {{subject}}?`,
      willDelete: `Chưa có chứng từ nào dùng {{subject}}, nên sẽ được xoá hẳn.`,
      willDeactivate: `{{subject}} đang được báo giá hoặc lệnh sửa chữa sử dụng, nên sẽ chỉ ngừng hoạt động: không còn hiện khi chọn, vẫn giữ trên chứng từ cũ và có thể kích hoạt lại.`,
      deactivate: `Ngừng hoạt động`,
      activate: `Kích hoạt lại`,
      deleted: `Đã xoá {{subject}}.`,
      deactivated: `Đã ngừng hoạt động {{subject}}. Có thể kích hoạt lại bất cứ lúc nào.`,
      activated: `Đã kích hoạt lại {{subject}}.`,
      showInactive: `Hiện cả mục ngừng hoạt động`,
    },
    vehicles: {
      title: `Xe`,
      description: `Xe của khách hàng. Tìm theo biển số, hãng hoặc dòng xe.`,
      new: `Thêm xe`,
      createTitle: `Thêm xe`,
      editTitle: `Sửa xe`,
      plate: `Biển số`,
      make: `Hãng`,
      model: `Dòng xe`,
      year: `Năm sản xuất`,
      vin: `Số khung`,
      engine: `Số máy`,
      customer: `Chủ xe`,
      empty: `Chưa có xe nào.`,
      searchPlaceholder: `Tìm biển số, hãng, dòng xe…`,
      lockedTitle: `Thông tin định danh bị khoá: có báo giá, lệnh sửa chữa hoặc quyết toán đang dùng xe này.`,
      lockedHint: `một số trường bị khoá bởi chứng từ đang dùng`,
      fieldLocked: `Bị khoá khi có chứng từ dùng xe này. Hãy dùng chức năng điều chỉnh.`,
      lockedCanCorrect: `Dùng “Điều chỉnh dữ liệu” để sửa trường bị khoá kèm lý do; các chứng từ giữ nguyên giá trị đã ghi.`,
      lockedAskManager: `Hãy nhờ quản lý điều chỉnh trường bị khoá.`,
      correct: {
        action: `Điều chỉnh dữ liệu`,
        title: `Điều chỉnh {{plate}}`,
        description: `Sửa một trường định danh của xe. Chứng từ đã lập giữ nguyên giá trị đã ghi.`,
        field: `Trường cần điều chỉnh`,
        value: `Giá trị đúng`,
        valueHint: `Năm sản xuất nhập bằng chữ số. Để trống để xoá trường tuỳ chọn.`,
        reason: `Lý do điều chỉnh`,
        submit: `Điều chỉnh`,
        done: `Đã điều chỉnh thông tin xe.`,
      },
      owner: {
        action: `Đổi chủ xe`,
        title: `Đổi chủ xe {{plate}}`,
        description: `Hiện thuộc về {{owner}}. Xe giữ nguyên lịch sử sửa chữa.`,
        newOwner: `Chủ xe mới`,
        same: `Khách hàng này đang là chủ xe.`,
        reason: `Lý do (không bắt buộc)`,
        submit: `Đổi chủ xe`,
        done: `Đã đổi chủ xe.`,
      },
      history: `Lịch sử sửa chữa`,
      historyEmpty: `Báo giá, lệnh sửa chữa và quyết toán sẽ hiển thị ở đây — hãy tạo báo giá đầu tiên cho xe này.`,
      historyType: `Loại`,
      historyTypes: {
        VEHICLE_HISTORY_ENTRY_TYPE_QUOTE: `Báo giá`,
        VEHICLE_HISTORY_ENTRY_TYPE_REPAIR_ORDER: `Lệnh sửa chữa`,
        VEHICLE_HISTORY_ENTRY_TYPE_SETTLEMENT: `Quyết toán`,
      },
    },
    suppliers: {
      title: `Nhà cung cấp`,
      description: `Các đơn vị bạn mua phụ tùng.`,
      new: `Thêm nhà cung cấp`,
      createTitle: `Thêm nhà cung cấp`,
      editTitle: `Sửa nhà cung cấp`,
      contactPerson: `Người liên hệ`,
      bankName: `Ngân hàng`,
      accountNumber: `Số tài khoản`,
      accountHolder: `Chủ tài khoản`,
      empty: `Chưa có nhà cung cấp nào.`,
      searchPlaceholder: `Tìm nhà cung cấp…`,
    },
    quotes: {
      title: `Báo giá`,
      description: `Tạo và theo dõi báo giá gửi khách hàng duyệt.`,
      new: `Tạo báo giá`,
      formDescription: `Chọn khách hàng, xe và các hạng mục; chọn cách khách hàng duyệt báo giá.`,
      empty: `Chưa có báo giá nào.`,
      number: `Số báo giá`,
      customerVehicle: `Khách hàng / Xe`,
      customer: `Khách hàng`,
      vehicle: `Xe`,
      total: `Tổng cộng`,
      itemType: `Loại`,
      labor: `Nhân công`,
      part: `Phụ tùng`,
      lineDescription: `Nội dung`,
      quantity: `Số lượng`,
      unitPrice: `Đơn giá`,
      lineTotal: `Thành tiền`,
      addLine: `Thêm hạng mục`,
      send: `Gửi duyệt`,
      linkCopied: `Đã sao chép liên kết.`,
      copyLink: `Sao chép liên kết`,
      emailedNotice: `Đã gửi liên kết duyệt báo giá qua email cho khách hàng.`,
      notEmailedNotice: `Đã tạo liên kết duyệt — khách hàng chưa có email trên hệ thống, hãy gửi liên kết bằng cách khác.`,
      recordDecision: `Ghi nhận quyết định của khách hàng`,
      recordDecisionHint: `Dùng khi khách hàng duyệt trực tiếp (không qua liên kết) hoặc để ghi đè quyết định qua điện thoại.`,
      approve: `Duyệt`,
      reject: `Từ chối`,
      saveDecision: `Lưu quyết định`,
      convert: `Chuyển thành lệnh sửa chữa`,
      convertedNotice: `Đã tạo lệnh sửa chữa từ báo giá này.`,
      viewRepairOrder: `Xem lệnh sửa chữa`,
      deleteConfirm: `Xoá báo giá {{number}}?`,
      exportPdf: `Xuất PDF`,
      approvalMode: {
        label: `Cách duyệt báo giá`,
        LINK: `Gửi liên kết`,
        MANUAL: `Ghi nhận thủ công`,
        LINKHint: `Hệ thống tạo liên kết công khai và tự động gửi email cho khách hàng nếu có email trên hệ thống.`,
        MANUALHint: `Không gửi liên kết hay email — nhân viên hỏi trực tiếp và ghi nhận quyết định của khách hàng.`,
      },
      status: {
        QUOTE_STATUS_DRAFT: `Nháp`,
        QUOTE_STATUS_SENT: `Đã gửi duyệt`,
        QUOTE_STATUS_APPROVED: `Đã duyệt`,
        QUOTE_STATUS_REJECTED: `Đã từ chối`,
        QUOTE_STATUS_CONVERTED: `Đã chuyển lệnh sửa chữa`,
      },
      publicTitle: `Báo giá {{number}}`,
      publicApproved: `Bạn đã duyệt báo giá này. Cảm ơn bạn!`,
      publicRejected: `Bạn đã từ chối báo giá này.`,
      publicDecideStart: `Xem và quyết định từng hạng mục`,
      publicSubmitDecision: `Gửi quyết định`,
    },
    repairOrders: {
      title: `Lệnh sửa chữa`,
      description: `Theo dõi lệnh sửa chữa trên bảng Kanban: phân công kỹ thuật viên, cập nhật tiến độ, đóng lệnh khi hoàn tất.`,
      new: `Tạo lệnh sửa chữa`,
      formDescription: `Chọn xe và các hạng mục cho lệnh sửa chữa phát sinh này.`,
      empty: `Chưa có lệnh sửa chữa nào.`,
      columnEmpty: `Chưa có lệnh`,
      filterTechnician: `Lọc theo kỹ thuật viên`,
      number: `Mã lệnh`,
      vehicle: `Xe`,
      itemType: `Loại`,
      labor: `Nhân công`,
      part: `Phụ tùng`,
      lineDescription: `Nội dung`,
      quantity: `Số lượng`,
      unitPrice: `Đơn giá`,
      lineTotal: `Thành tiền`,
      lineStatus: `Trạng thái`,
      technicians: `Kỹ thuật viên`,
      total: `Tổng cộng`,
      addLine: `Thêm hạng mục`,
      close: `Đóng lệnh sửa chữa`,
      readyToClose: `Mọi hạng mục đã hoàn tất — có thể đóng lệnh.`,
      notReadyToClose: `Hoàn tất mọi hạng mục trước khi đóng lệnh.`,
      exportPdf: `Xuất PDF`,
      createSettlement: `Tạo quyết toán`,
      settlementCreatedNotice: `Đã tạo quyết toán từ lệnh sửa chữa này.`,
      viewSettlement: `Xem quyết toán`,
      status: {
        REPAIR_ORDER_STATUS_OPEN: `Chưa bắt đầu`,
        REPAIR_ORDER_STATUS_IN_PROGRESS: `Đang thực hiện`,
        REPAIR_ORDER_STATUS_WAITING_ON_PARTS: `Chờ phụ tùng`,
        REPAIR_ORDER_STATUS_COMPLETED: `Hoàn tất`,
        REPAIR_ORDER_STATUS_CLOSED: `Đã đóng`,
      },
      lineStatuses: { NOT_STARTED: `Chưa bắt đầu`, IN_PROGRESS: `Đang thực hiện`, COMPLETED: `Hoàn tất` },
    },
    inventory: {
      title: `Kho phụ tùng`,
      description: `Kho phụ tùng: danh mục, phiếu nhập kho và báo cáo xuất nhập tồn.`,
      tabStockOnHand: `Tồn kho`,
      tabMovements: `Xuất nhập kho`,
      new: `Thêm phụ tùng`,
      createTitle: `Thêm phụ tùng`,
      editTitle: `Sửa phụ tùng`,
      sku: `Mã phụ tùng`,
      name: `Tên phụ tùng`,
      unit: `Đơn vị`,
      unitPlaceholder: `VD: cái, lít`,
      reorderThreshold: `Ngưỡng cảnh báo tồn kho`,
      reorderThresholdHint: `Hiển thị cảnh báo tồn thấp khi số lượng tồn kho bằng hoặc thấp hơn mức này.`,
      onHand: `Tồn kho`,
      lowStock: `Sắp hết`,
      empty: `Chưa có phụ tùng nào.`,
      searchPlaceholder: `Tìm theo mã hoặc tên…`,
      deleteConfirm: `Xoá phụ tùng {{sku}}?`,
      receive: `Nhập kho`,
      receiptTitle: `Nhập kho — {{name}}`,
      receiptDescription: `Hiện đang tồn {{onHand}} {{unit}}.`,
      receiptQuantity: `Số lượng nhập`,
      unitCost: `Đơn giá nhập (VND)`,
      movementsEmpty: `Chưa có phát sinh xuất nhập kho nào.`,
      reference: `Nguồn gốc`,
      refRepairOrder: `Xuất theo lệnh sửa chữa`,
      direction: { label: `Loại phát sinh`, STOCK_TRANSACTION_TYPE_IN: `Nhập`, STOCK_TRANSACTION_TYPE_OUT: `Xuất` },
      exportExcel: `Xuất Excel`,
    },
    settlements: {
      title: `Quyết toán & Công nợ`,
      description: `Quyết toán lệnh sửa chữa đã đóng, ghi nhận thanh toán, theo dõi công nợ còn lại.`,
      outstandingOnly: `Chỉ công nợ chưa thu`,
      empty: `Quyết toán sẽ xuất hiện khi một lệnh sửa chữa được đóng và quyết toán.`,
      number: `Số quyết toán`,
      customerVehicle: `Khách hàng / Xe`,
      total: `Tổng cộng`,
      payments: `Thanh toán`,
      noPayments: `Chưa có khoản thanh toán nào.`,
      voucherNumber: `Phiếu thu`,
      voided: `Đã huỷ`,
      method: `Hình thức`,
      amount: `Số tiền`,
      recordPayment: `Ghi nhận thanh toán`,
      recordPaymentDescription: `Còn {{due}} chưa thu.`,
      paymentRecorded: `Đã ghi nhận thanh toán.`,
      amountHint: `Tối đa {{due}} còn chưa thu.`,
      payer: `Người nộp`,
      payerName: `Tên người nộp tiền`,
      payerNameHint: `Để trống để dùng tên khách hàng: {{name}}.`,
      payerAddress: `Địa chỉ người nộp`,
      reason: `Lý do nộp`,
      reasonHint: `Để trống sẽ ghi "Thanh toán quyết toán {{number}}".`,
      collector: `Người thu`,
      exportVoucher: `PDF phiếu thu`,
      voidPayment: `Huỷ phiếu thu`,
      voidPaymentDescription: `Phiếu thu {{number}} vẫn được lưu và đánh dấu đã huỷ, không còn tính vào số đã thu.`,
      voidReason: `Lý do huỷ`,
      voidedBecause: `Đã huỷ: {{reason}}`,
      paymentVoided: `Đã huỷ phiếu thu.`,
      exportReceipt: `Xuất PDF biên nhận`,
      methods: { CASH: `Tiền mặt`, BANK_TRANSFER: `Chuyển khoản`, ONLINE: `Trực tuyến` },
      status: {
        SETTLEMENT_STATUS_PENDING: `Chưa thu`,
        SETTLEMENT_STATUS_PARTIALLY_PAID: `Thu một phần`,
        SETTLEMENT_STATUS_PAID: `Đã thu đủ`,
      },
    },
    dashboard: {
      title: `Tổng quan`,
      body: `Tổng quan về gara này: doanh thu, đơn sửa chữa đang xử lý, và những việc cần chú ý.`,
      attention: `Cần chú ý`,
      attentionNone: `Không có việc nào cần chú ý.`,
      monthlyRevenue: `Doanh thu tháng này`,
      ordersInProgress: `Đơn đang xử lý`,
      outstandingReceivables: `Công nợ chưa thu`,
      revenueChartTitle: `Doanh thu 30 ngày qua`,
      revenueEmpty: `Chưa có doanh thu — tạo báo giá đầu tiên để bắt đầu.`,
      lowStockAlert_one: `{{count}} mặt hàng sắp hết`,
      lowStockAlert_other: `{{count}} mặt hàng sắp hết`,
      outstandingAlert_one: `{{count}} phiếu quyết toán còn công nợ`,
      outstandingAlert_other: `{{count}} phiếu quyết toán còn công nợ`,
      viewInventory: `Xem kho hàng`,
      viewSettlements: `Xem quyết toán`,
      recentOrders: `Đơn sửa chữa đang xử lý`,
      recentOrdersEmpty: `Không có đơn sửa chữa nào đang xử lý.`,
    },
    errors: {
      GENERIC: `Đã có lỗi xảy ra. Vui lòng thử lại.`,
      INVOICE_DATA_INCOMPLETE: `Hoá đơn cần tên pháp lý, mã số thuế và địa chỉ của bên được lập.`,
      INTERNAL: `Hệ thống đang gặp sự cố. Vui lòng thử lại sau.`,
      BAD_REQUEST: `Yêu cầu không hợp lệ.`,
      VALIDATION_ERROR: `Vui lòng kiểm tra lại thông tin.`,
      NOT_FOUND: `Không tìm thấy dữ liệu.`,
      UNAUTHENTICATED: `Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.`,
      PERMISSION_DENIED: `Bạn không có quyền thực hiện thao tác này.`,
      ALREADY_EXISTS: `Dữ liệu đã tồn tại.`,
      FAILED_PRECONDITION: `Không thể thực hiện thao tác lúc này.`,
      RATE_LIMITED: `Bạn thao tác quá nhanh, vui lòng thử lại sau.`,
      INVALID_CREDENTIALS: `Email hoặc mật khẩu không đúng.`,
      USER_SUSPENDED: `Người dùng đang bị tạm khoá.`,
      EMAIL_TAKEN: `Email đã được đăng ký.`,
      PHONE_TAKEN: `Số điện thoại đã được dùng cho người dùng khác.`,
      EMAIL_NOT_VERIFIED: `Vui lòng xác minh email trước.`,
      EMAIL_ALREADY_VERIFIED: `Email đã được xác minh.`,
      OTP_INVALID: `Mã không đúng.`,
      OTP_EXPIRED: `Mã đã hết hạn. Hãy yêu cầu mã mới.`,
      OTP_TOO_MANY_ATTEMPTS: `Nhập sai quá nhiều lần. Hãy yêu cầu mã mới.`,
      OTP_RESEND_TOO_SOON: `Vui lòng chờ trước khi gửi lại mã.`,
      RESET_TOKEN_INVALID: `Phiên đặt lại mật khẩu đã hết hạn. Hãy làm lại từ đầu.`,
      REFRESH_TOKEN_INVALID: `Phiên đăng nhập đã hết hạn.`,
      GARAGE_ACCESS_DENIED: `Bạn không có quyền truy cập gara này.`,
      OWNER_ONLY: `Chỉ chủ gara được thực hiện thao tác này.`,
      GARAGE_INACTIVE: `Gara đang ngừng hoạt động.`,
      SUBSCRIPTION_SUSPENDED: `Gói dịch vụ đã bị tạm khoá. Vui lòng gia hạn.`,
      SUBSCRIPTION_READ_ONLY: `Gói dịch vụ đã quá hạn: chỉ được xem dữ liệu.`,
      PLAN_LIMIT_REACHED: `Đã đạt giới hạn của gói dịch vụ. Hãy nâng cấp gói.`,
      PLAN_NOT_AVAILABLE: `Không thể chọn gói này.`,
      TRIAL_NOT_AVAILABLE: `Gói dùng thử chỉ được dùng một lần.`,
      REQUEST_ALREADY_OPEN: `Đã có một thanh toán đang chờ duyệt. Hãy chờ kết quả hoặc huỷ yêu cầu đó.`,
      REQUEST_NOT_OPEN: `Yêu cầu thanh toán này đã được xử lý.`,
      EVIDENCE_REQUIRED: `Hãy đính kèm chứng từ chuyển khoản.`,
      PLAN_CODE_TAKEN: `Mã gói đã tồn tại.`,
      IDEMPOTENCY_KEY_REUSED: `Thao tác này đã được gửi với thông tin khác. Hãy kiểm tra lại trước khi thử lại.`,
      USER_NOT_FOUND: `Không tìm thấy người dùng VietGara với email hoặc số điện thoại này.`,
      USER_INACTIVE: `Người dùng này đang bị khoá.`,
      ALREADY_MEMBER: `Người dùng đã là nhân viên của gara.`,
      ALREADY_INVITED: `Người dùng đã có lời mời chờ xác nhận.`,
      OWNER_MEMBERSHIP: `Không thể thay đổi tư cách chủ gara.`,
      INVITATION_NOT_PENDING: `Lời mời đã được trả lời hoặc thu hồi.`,
      INVITATION_EXPIRED: `Lời mời đã hết hạn.`,
      ROLE_NAME_TAKEN: `Tên vai trò đã tồn tại.`,
      ROLE_IN_USE: `Vai trò đang được nhóm sử dụng.`,
      GROUP_NAME_TAKEN: `Tên nhóm đã tồn tại trong gara.`,
      INVALID_LOGO: `Logo phải là ảnh PNG, JPEG hoặc WebP, tối đa 1 MB.`,
      GOOGLE_NOT_CONFIGURED: `Đăng nhập Google chưa được cấu hình.`,
      GOOGLE_STATE_INVALID: `Phiên đăng nhập Google không hợp lệ, hãy thử lại.`,
      GOOGLE_DENIED: `Bạn đã huỷ đăng nhập Google.`,
      GOOGLE_EXCHANGE_FAILED: `Không thể đăng nhập bằng Google lúc này.`,
      POPUP_BLOCKED: `Trình duyệt đã chặn cửa sổ đăng nhập Google.`,
      QUOTE_LINK_INVALID: `Liên kết này không hợp lệ hoặc đã hết hạn.`,
    },
  },
  Q = `vietgara.language`
function re() {
  try {
    return localStorage.getItem(Q) === `en` ? `en` : `vi`
  } catch {
    return `vi`
  }
}
function ie(e) {
  try {
    localStorage.setItem(Q, e)
  } catch {}
  ;((document.documentElement.lang = e), Z.changeLanguage(e))
}
function ae(e) {
  return e === `LOCALE_EN` ? `en` : `vi`
}
function oe(e) {
  return e === `en` ? `LOCALE_EN` : `LOCALE_VI`
}
var $ = re()
;((document.documentElement.lang = $),
  Z.use(ee).init({
    resources: { vi: { translation: ne }, en: { translation: te } },
    lng: $,
    fallbackLng: `vi`,
    interpolation: { escapeValue: !1 },
  }))
var se = Z
export { ie as i, ae as n, oe as r, se as t }
