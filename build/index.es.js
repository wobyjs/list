(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const SYMBOL_OBSERVABLE = Symbol("Observable");
const SYMBOL_OBSERVABLE_FROZEN = Symbol("Observable.Frozen");
const SYMBOL_OBSERVABLE_READABLE = Symbol("Observable.Readable");
const SYMBOL_OBSERVABLE_WRITABLE = Symbol("Observable.Writable");
const SYMBOL_STORE = Symbol("Store");
const SYMBOL_STORE_KEYS = Symbol("Store.Keys");
const SYMBOL_STORE_OBSERVABLE = Symbol("Store.Observable");
const SYMBOL_STORE_TARGET = Symbol("Store.Target");
const SYMBOL_STORE_VALUES = Symbol("Store.Values");
const SYMBOL_STORE_UNTRACKED = Symbol("Store.Untracked");
const SYMBOL_SUSPENSE$1 = Symbol("Suspense");
const SYMBOL_UNCACHED = Symbol("Uncached");
const SYMBOL_UNTRACKED = Symbol("Untracked");
const SYMBOL_UNTRACKED_UNWRAPPED = Symbol("Untracked.Unwrapped");
const castArray$1 = (value) => {
  return isArray$1(value) ? value : [value];
};
const castError$1 = (error) => {
  if (error instanceof Error)
    return error;
  if (typeof error === "string")
    return new Error(error);
  return new Error("Unknown error");
};
const { is } = Object;
const { isArray: isArray$1 } = Array;
const isFunction$1 = (value) => {
  return typeof value === "function";
};
const isObject$1 = (value) => {
  return value !== null && typeof value === "object";
};
const isSymbol = (value) => {
  return typeof value === "symbol";
};
const noop$1 = () => {
  return;
};
const nope = () => {
  return false;
};
function frozenFunction() {
  if (arguments.length) {
    throw new Error("A readonly Observable can not be updated");
  } else {
    return this;
  }
}
function readableFunction() {
  if (arguments.length) {
    throw new Error("A readonly Observable can not be updated");
  } else {
    return this.get();
  }
}
function writableFunction(fn) {
  if (arguments.length) {
    if (isFunction$1(fn)) {
      return this.C(fn);
    } else {
      return this.set(fn);
    }
  } else {
    return this.get();
  }
}
const frozen = (value) => {
  const fn = frozenFunction.bind(value);
  fn[SYMBOL_OBSERVABLE] = true;
  fn[SYMBOL_OBSERVABLE_FROZEN] = true;
  return fn;
};
const readable = (value) => {
  const fn = readableFunction.bind(value);
  fn[SYMBOL_OBSERVABLE] = true;
  fn[SYMBOL_OBSERVABLE_READABLE] = value;
  return fn;
};
const writable = (value) => {
  const fn = writableFunction.bind(value);
  fn[SYMBOL_OBSERVABLE] = true;
  fn[SYMBOL_OBSERVABLE_WRITABLE] = value;
  return fn;
};
const DIRTY_NO = 0;
const DIRTY_MAYBE_NO = 1;
const DIRTY_MAYBE_YES = 2;
const DIRTY_YES = 3;
frozen(false);
frozen(true);
const UNAVAILABLE = new Proxy({}, new Proxy({}, { get() {
  throw new Error("Unavailable value");
} }));
const UNINITIALIZED = function() {
};
const lazyArrayEachRight = (arr, fn) => {
  if (arr instanceof Array) {
    for (let i = arr.length - 1; i >= 0; i--) {
      fn(arr[i]);
    }
  } else if (arr) {
    fn(arr);
  }
};
const lazyArrayPush = (obj, key, value) => {
  const arr = obj[key];
  if (arr instanceof Array) {
    arr.push(value);
  } else if (arr) {
    obj[key] = [arr, value];
  } else {
    obj[key] = value;
  }
};
const lazySetAdd = (obj, key, value) => {
  const set = obj[key];
  if (set instanceof Set) {
    set.add(value);
  } else if (set) {
    if (value !== set) {
      const s = /* @__PURE__ */ new Set();
      s.add(set);
      s.add(value);
      obj[key] = s;
    }
  } else {
    obj[key] = value;
  }
};
const lazySetDelete = (obj, key, value) => {
  const set = obj[key];
  if (set instanceof Set) {
    set.delete(value);
  } else if (set === value) {
    obj[key] = void 0;
  }
};
const lazySetEach = (set, fn) => {
  if (set instanceof Set) {
    for (const value of set) {
      fn(value);
    }
  } else if (set) {
    fn(set);
  }
};
const onCleanup = (cleanup2) => cleanup2.call(cleanup2);
const onDispose = (owner) => owner.Q(true);
class Owner {
  constructor() {
    this.disposed = false;
    this.B = void 0;
    this.S = void 0;
    this.D = void 0;
    this.K = void 0;
    this.T = void 0;
    this.U = void 0;
  }
  /* API */
  catch(error, silent) {
    var _a2;
    const { S } = this;
    if (S) {
      S(error);
      return true;
    } else {
      if ((_a2 = this.parent) == null ? void 0 : _a2.catch(error, true))
        return true;
      if (silent)
        return false;
      throw error;
    }
  }
  Q(deep) {
    lazyArrayEachRight(this.D, onDispose);
    lazyArrayEachRight(this.K, onDispose);
    lazyArrayEachRight(this.U, onDispose);
    lazyArrayEachRight(this.B, onCleanup);
    this.B = void 0;
    this.disposed = deep;
    this.S = void 0;
    this.K = void 0;
    this.U = void 0;
  }
  get(symbol) {
    var _a2;
    return (_a2 = this.context) == null ? void 0 : _a2[symbol];
  }
  E(fn, owner, observer) {
    const ownerPrev = OWNER;
    const observerPrev = OBSERVER;
    setOwner(owner);
    setObserver(observer);
    try {
      return fn();
    } catch (error) {
      this.catch(castError$1(error), false);
      return UNAVAILABLE;
    } finally {
      setOwner(ownerPrev);
      setObserver(observerPrev);
    }
  }
}
class SuperRoot extends Owner {
  constructor() {
    super(...arguments);
    this.context = {};
  }
}
let SUPER_OWNER = new SuperRoot();
let OBSERVER;
let OWNER = SUPER_OWNER;
const setObserver = (value) => OBSERVER = value;
const setOwner = (value) => OWNER = value;
let Scheduler$2 = class Scheduler {
  constructor() {
    this.A1 = [];
    this.M = 0;
    this.A2 = false;
    this.N = () => {
      if (this.A2)
        return;
      if (this.M)
        return;
      if (!this.A1.length)
        return;
      try {
        this.A2 = true;
        while (true) {
          const queue = this.A1;
          if (!queue.length)
            break;
          this.A1 = [];
          for (let i = 0, l = queue.length; i < l; i++) {
            queue[i].C();
          }
        }
      } finally {
        this.A2 = false;
      }
    };
    this.E = (fn) => {
      this.M += 1;
      fn();
      this.M -= 1;
      this.N();
    };
    this.F = (observer) => {
      this.A1.push(observer);
    };
  }
};
const SchedulerSync = new Scheduler$2();
class Observable {
  /* CONSTRUCTOR */
  constructor(value, options2, parent) {
    this.K = /* @__PURE__ */ new Set();
    this.value = value;
    if (parent) {
      this.parent = parent;
    }
    if ((options2 == null ? void 0 : options2.equals) !== void 0) {
      this.equals = options2.equals || nope;
    }
  }
  /* API */
  get() {
    var _a2, _b2;
    if (!((_a2 = this.parent) == null ? void 0 : _a2.disposed)) {
      (_b2 = this.parent) == null ? void 0 : _b2.C();
      OBSERVER == null ? void 0 : OBSERVER.A.L(this);
    }
    return this.value;
  }
  set(value) {
    const equals = this.equals || is;
    const fresh = this.value === UNINITIALIZED || !equals(value, this.value);
    if (!fresh)
      return value;
    this.value = value;
    SchedulerSync.M += 1;
    this.I(DIRTY_YES);
    SchedulerSync.M -= 1;
    SchedulerSync.N();
    return value;
  }
  I(J) {
    for (const observer of this.K) {
      if (observer.J !== DIRTY_MAYBE_NO || observer.A.has(this)) {
        if (observer.sync) {
          observer.J = Math.max(observer.J, J);
          SchedulerSync.F(observer);
        } else {
          observer.I(J);
        }
      }
    }
  }
  C(fn) {
    const value = fn(this.value);
    return this.set(value);
  }
}
class ObservablesArray {
  /* CONSTRUCTOR */
  constructor(observer) {
    this.observer = observer;
    this.A = [];
    this.P = 0;
  }
  /* API */
  Q(deep) {
    if (deep) {
      const { observer, A } = this;
      for (let i = 0; i < A.length; i++) {
        A[i].K.delete(observer);
      }
    }
    this.P = 0;
  }
  R() {
    const { observer, A, P } = this;
    const observablesLength = A.length;
    if (P < observablesLength) {
      for (let i = P; i < observablesLength; i++) {
        A[i].K.delete(observer);
      }
      A.length = P;
    }
  }
  empty() {
    return !this.A.length;
  }
  has(observable2) {
    const index = this.A.indexOf(observable2);
    return index >= 0 && index < this.P;
  }
  L(observable2) {
    const { observer, A, P } = this;
    const observablesLength = A.length;
    if (observablesLength > 0) {
      if (A[P] === observable2) {
        this.P += 1;
        return;
      }
      const index = A.indexOf(observable2);
      if (index >= 0 && index < P) {
        return;
      }
      if (P < observablesLength - 1) {
        this.R();
      } else if (P === observablesLength - 1) {
        A[P].K.delete(observer);
      }
    }
    observable2.K.add(observer);
    A[this.P++] = observable2;
    if (P === 128) {
      observer.A = new ObservablesSet(observer, A);
    }
  }
  C() {
    var _a2;
    const { A } = this;
    for (let i = 0, l = A.length; i < l; i++) {
      (_a2 = A[i].parent) == null ? void 0 : _a2.C();
    }
  }
}
class ObservablesSet {
  /* CONSTRUCTOR */
  constructor(observer, A) {
    this.observer = observer;
    this.A = new Set(A);
  }
  /* API */
  Q(deep) {
    for (const observable2 of this.A) {
      observable2.K.delete(this.observer);
    }
  }
  R() {
    return;
  }
  empty() {
    return !this.A.size;
  }
  has(observable2) {
    return this.A.has(observable2);
  }
  L(observable2) {
    const { observer, A } = this;
    const sizePrev = A.size;
    observable2.K.add(observer);
    const sizeNext = A.size;
    if (sizePrev === sizeNext)
      return;
    A.add(observable2);
  }
  C() {
    var _a2;
    for (const observable2 of this.A) {
      (_a2 = observable2.parent) == null ? void 0 : _a2.C();
    }
  }
}
class Observer extends Owner {
  /* CONSTRUCTOR */
  constructor() {
    super();
    this.parent = OWNER;
    this.context = OWNER.context;
    this.J = DIRTY_YES;
    this.A = new ObservablesArray(this);
    if (OWNER !== SUPER_OWNER) {
      lazyArrayPush(this.parent, "K", this);
    }
  }
  /* API */
  Q(deep) {
    this.A.Q(deep);
    super.Q(deep);
  }
  H(fn) {
    this.Q(false);
    this.J = DIRTY_MAYBE_NO;
    try {
      return this.E(fn, this, this);
    } finally {
      this.A.R();
    }
  }
  run() {
    throw new Error("Abstract method");
  }
  I(J) {
    throw new Error("Abstract method");
  }
  C() {
    if (this.disposed)
      return;
    if (this.J === DIRTY_MAYBE_YES) {
      this.A.C();
    }
    if (this.J === DIRTY_YES) {
      this.J = DIRTY_MAYBE_NO;
      this.run();
      if (this.J === DIRTY_MAYBE_NO) {
        this.J = DIRTY_NO;
      } else {
        this.C();
      }
    } else {
      this.J = DIRTY_NO;
    }
  }
}
const cleanup = (fn) => {
  lazyArrayPush(OWNER, "B", fn);
};
const cleanup$1 = cleanup;
class Context extends Owner {
  /* CONSTRUCTOR */
  constructor(context2) {
    super();
    this.parent = OWNER;
    this.context = { ...OWNER.context, ...context2 };
    lazyArrayPush(this.parent, "D", this);
  }
  /* API */
  E(fn) {
    return super.E(fn, this, void 0);
  }
}
const Context$1 = Context;
function context(symbolOrContext, fn) {
  if (isSymbol(symbolOrContext)) {
    return OWNER.context[symbolOrContext];
  } else {
    return new Context$1(symbolOrContext).E(fn || noop$1);
  }
}
class Scheduler2 {
  constructor() {
    this.A1 = [];
    this.A2 = false;
    this.A3 = false;
    this.N = () => {
      if (this.A2)
        return;
      if (!this.A1.length)
        return;
      try {
        this.A2 = true;
        while (true) {
          const queue = this.A1;
          if (!queue.length)
            break;
          this.A1 = [];
          for (let i = 0, l = queue.length; i < l; i++) {
            queue[i].C();
          }
        }
      } finally {
        this.A2 = false;
      }
    };
    this.queue = () => {
      if (this.A3)
        return;
      this.A3 = true;
      this.resolve();
    };
    this.resolve = () => {
      queueMicrotask(() => {
        queueMicrotask(() => {
          {
            this.A3 = false;
            this.N();
          }
        });
      });
    };
    this.F = (effect2) => {
      this.A1.push(effect2);
      this.queue();
    };
  }
}
const Scheduler$1 = new Scheduler2();
class Effect extends Observer {
  /* CONSTRUCTOR */
  constructor(fn, options2) {
    super();
    this.fn = fn;
    if ((options2 == null ? void 0 : options2.suspense) !== false) {
      const suspense = this.get(SYMBOL_SUSPENSE$1);
      if (suspense) {
        this.suspense = suspense;
      }
    }
    if ((options2 == null ? void 0 : options2.sync) === true) {
      this.sync = true;
    }
    if ((options2 == null ? void 0 : options2.sync) === "init") {
      this.init = true;
      this.C();
    } else {
      this.F();
    }
  }
  /* API */
  run() {
    const G = super.H(this.fn);
    if (isFunction$1(G)) {
      lazyArrayPush(this, "B", G);
    }
  }
  F() {
    var _a2;
    if ((_a2 = this.suspense) == null ? void 0 : _a2.suspended)
      return;
    if (this.sync) {
      this.C();
    } else {
      Scheduler$1.F(this);
    }
  }
  I(J) {
    const statusPrev = this.J;
    if (statusPrev >= J)
      return;
    this.J = J;
    if (!this.sync || statusPrev !== 2 && statusPrev !== 3) {
      this.F();
    }
  }
  C() {
    var _a2;
    if ((_a2 = this.suspense) == null ? void 0 : _a2.suspended)
      return;
    super.C();
  }
}
const effect = (fn, options2) => {
  const effect2 = new Effect(fn, options2);
  const Q = () => effect2.Q(true);
  return Q;
};
const isObservable = (value) => {
  return isFunction$1(value) && SYMBOL_OBSERVABLE in value;
};
function get(value, getFunction = true) {
  const is2 = getFunction ? isFunction$1 : isObservable;
  if (is2(value)) {
    return value();
  } else {
    return value;
  }
}
const isStore = (value) => {
  return isObject$1(value) && SYMBOL_STORE in value;
};
const isStore$1 = isStore;
function untrack(fn) {
  if (isFunction$1(fn)) {
    const observerPrev = OBSERVER;
    if (observerPrev) {
      try {
        setObserver(void 0);
        return fn();
      } finally {
        setObserver(observerPrev);
      }
    } else {
      return fn();
    }
  } else {
    return fn;
  }
}
const isBatching = () => {
  return Scheduler$1.A3 || Scheduler$1.A2 || SchedulerSync.A2;
};
const isBatching$1 = isBatching;
class StoreMap extends Map {
  AH(key, value) {
    super.set(key, value);
    return value;
  }
}
class StoreCleanable {
  constructor() {
    this.AE = 0;
  }
  listen() {
    this.AE += 1;
    cleanup$1(this);
  }
  call() {
    this.AE -= 1;
    if (this.AE)
      return;
    this.Q();
  }
  Q() {
  }
}
class StoreKeys extends StoreCleanable {
  constructor(parent, observable2) {
    super();
    this.parent = parent;
    this.observable = observable2;
  }
  Q() {
    this.parent.keys = void 0;
  }
}
class StoreValues extends StoreCleanable {
  constructor(parent, observable2) {
    super();
    this.parent = parent;
    this.observable = observable2;
  }
  Q() {
    this.parent.values = void 0;
  }
}
class StoreHas extends StoreCleanable {
  constructor(parent, key, observable2) {
    super();
    this.parent = parent;
    this.key = key;
    this.observable = observable2;
  }
  Q() {
    var _a2;
    (_a2 = this.parent.has) == null ? void 0 : _a2.delete(this.key);
  }
}
class StoreProperty extends StoreCleanable {
  constructor(parent, key, observable2, AI) {
    super();
    this.parent = parent;
    this.key = key;
    this.observable = observable2;
    this.AI = AI;
  }
  Q() {
    var _a2;
    (_a2 = this.parent.AJ) == null ? void 0 : _a2.delete(this.key);
  }
}
const StoreListenersRegular = {
  /* VARIABLES */
  AK: 0,
  AL: /* @__PURE__ */ new Set(),
  AM: /* @__PURE__ */ new Set(),
  /* API */
  AN: () => {
    const { AL, AM } = StoreListenersRegular;
    const traversed = /* @__PURE__ */ new Set();
    const traverse = (AI) => {
      if (traversed.has(AI))
        return;
      traversed.add(AI);
      lazySetEach(AI.AO, traverse);
      lazySetEach(AI.AP, (listener) => {
        AL.add(listener);
      });
    };
    AM.forEach(traverse);
    return () => {
      AL.forEach((listener) => {
        listener();
      });
    };
  },
  V: (AI) => {
    StoreListenersRegular.AM.add(AI);
    StoreScheduler.F();
  },
  reset: () => {
    StoreListenersRegular.AL = /* @__PURE__ */ new Set();
    StoreListenersRegular.AM = /* @__PURE__ */ new Set();
  }
};
const StoreListenersRoots = {
  /* VARIABLES */
  AK: 0,
  AM: /* @__PURE__ */ new Map(),
  /* API */
  AN: () => {
    const { AM } = StoreListenersRoots;
    return () => {
      AM.forEach((rootsSet, store2) => {
        const T = Array.from(rootsSet);
        lazySetEach(store2.AQ, (listener) => {
          listener(T);
        });
      });
    };
  },
  V: (store2, root2) => {
    const T = StoreListenersRoots.AM.get(store2) || /* @__PURE__ */ new Set();
    T.add(root2);
    StoreListenersRoots.AM.set(store2, T);
    StoreScheduler.F();
  },
  AR: (current, parent, key) => {
    if (!parent.AO) {
      const root2 = (current == null ? void 0 : current.store) || untrack(() => parent.store[key]);
      StoreListenersRoots.V(parent, root2);
    } else {
      const traversed = /* @__PURE__ */ new Set();
      const traverse = (AI) => {
        if (traversed.has(AI))
          return;
        traversed.add(AI);
        lazySetEach(AI.AO, (parent2) => {
          if (!parent2.AO) {
            StoreListenersRoots.V(parent2, AI.store);
          }
          traverse(parent2);
        });
      };
      traverse(current || parent);
    }
  },
  reset: () => {
    StoreListenersRoots.AM = /* @__PURE__ */ new Map();
  }
};
const StoreScheduler = {
  /* VARIABLES */
  AK: false,
  /* API */
  N: () => {
    const flushRegular = StoreListenersRegular.AN();
    const flushRoots = StoreListenersRoots.AN();
    StoreScheduler.reset();
    flushRegular();
    flushRoots();
  },
  AS: () => {
    if (isBatching$1()) {
      {
        setTimeout(StoreScheduler.AS, 0);
      }
    } else {
      StoreScheduler.N();
    }
  },
  reset: () => {
    StoreScheduler.AK = false;
    StoreListenersRegular.reset();
    StoreListenersRoots.reset();
  },
  F: () => {
    if (StoreScheduler.AK)
      return;
    StoreScheduler.AK = true;
    queueMicrotask(StoreScheduler.AS);
  }
};
const NODES = /* @__PURE__ */ new WeakMap();
const SPECIAL_SYMBOLS = /* @__PURE__ */ new Set([SYMBOL_STORE, SYMBOL_STORE_KEYS, SYMBOL_STORE_OBSERVABLE, SYMBOL_STORE_TARGET, SYMBOL_STORE_VALUES]);
const UNREACTIVE_KEYS = /* @__PURE__ */ new Set(["__proto__", "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__", "prototype", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toSource", "toString", "valueOf"]);
const STORE_TRAPS = {
  /* API */
  get: (target, key) => {
    var _a2, _b2;
    if (SPECIAL_SYMBOLS.has(key)) {
      if (key === SYMBOL_STORE)
        return true;
      if (key === SYMBOL_STORE_TARGET)
        return target;
      if (key === SYMBOL_STORE_KEYS) {
        if (isListenable()) {
          const AI2 = getNodeExisting(target);
          AI2.keys || (AI2.keys = getNodeKeys(AI2));
          AI2.keys.listen();
          AI2.keys.observable.get();
        }
        return;
      }
      if (key === SYMBOL_STORE_VALUES) {
        if (isListenable()) {
          const AI2 = getNodeExisting(target);
          AI2.values || (AI2.values = getNodeValues(AI2));
          AI2.values.listen();
          AI2.values.observable.get();
        }
        return;
      }
      if (key === SYMBOL_STORE_OBSERVABLE) {
        return (key2) => {
          var _a22;
          key2 = typeof key2 === "number" ? String(key2) : key2;
          const AI2 = getNodeExisting(target);
          const getter2 = (_a22 = AI2.AT) == null ? void 0 : _a22.get(key2);
          if (getter2)
            return getter2.bind(AI2.store);
          AI2.AJ || (AI2.AJ = new StoreMap());
          const value2 = target[key2];
          const property2 = AI2.AJ.get(key2) || AI2.AJ.AH(key2, getNodeProperty(AI2, key2, value2));
          const options2 = AI2.equals ? { equals: AI2.equals } : void 0;
          property2.observable || (property2.observable = getNodeObservable(AI2, value2, options2));
          const observable2 = readable(property2.observable);
          return observable2;
        };
      }
    }
    if (UNREACTIVE_KEYS.has(key))
      return target[key];
    const AI = getNodeExisting(target);
    const getter = (_a2 = AI.AT) == null ? void 0 : _a2.get(key);
    const value = getter || target[key];
    AI.AJ || (AI.AJ = new StoreMap());
    const listenable = isListenable();
    const proxiable = isProxiable(value);
    const property = listenable || proxiable ? AI.AJ.get(key) || AI.AJ.AH(key, getNodeProperty(AI, key, value)) : void 0;
    if (property == null ? void 0 : property.AI) {
      lazySetAdd(property.AI, "AO", AI);
    }
    if (property && listenable) {
      const options2 = AI.equals ? { equals: AI.equals } : void 0;
      property.listen();
      property.observable || (property.observable = getNodeObservable(AI, value, options2));
      property.observable.get();
    }
    if (getter) {
      return getter.call(AI.store);
    } else {
      if (typeof value === "function" && value === Array.prototype[key]) {
        return function() {
          return value.apply(AI.store, arguments);
        };
      }
      return ((_b2 = property == null ? void 0 : property.AI) == null ? void 0 : _b2.store) || value;
    }
  },
  set: (target, key, value) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j;
    value = getTarget(value);
    const AI = getNodeExisting(target);
    const setter = (_a2 = AI.AU) == null ? void 0 : _a2.get(key);
    if (setter) {
      setter.call(AI.store, value);
    } else {
      const targetIsArray = isArray$1(target);
      const valuePrev = target[key];
      const hadProperty = !!valuePrev || key in target;
      const equals = AI.equals || is;
      if (hadProperty && equals(value, valuePrev) && (key !== "length" || !targetIsArray))
        return true;
      const lengthPrev = targetIsArray && target["length"];
      target[key] = value;
      const lengthNext = targetIsArray && target["length"];
      if (targetIsArray && key !== "length" && lengthPrev !== lengthNext) {
        (_d = (_c = (_b2 = AI.AJ) == null ? void 0 : _b2.get("length")) == null ? void 0 : _c.observable) == null ? void 0 : _d.set(lengthNext);
      }
      (_e = AI.values) == null ? void 0 : _e.observable.set(0);
      if (!hadProperty) {
        (_f = AI.keys) == null ? void 0 : _f.observable.set(0);
        (_h = (_g = AI.has) == null ? void 0 : _g.get(key)) == null ? void 0 : _h.observable.set(true);
      }
      const property = (_i = AI.AJ) == null ? void 0 : _i.get(key);
      if (property == null ? void 0 : property.AI) {
        lazySetDelete(property.AI, "AO", AI);
      }
      if (property) {
        (_j = property.observable) == null ? void 0 : _j.set(value);
        property.AI = isProxiable(value) ? NODES.get(value) || getNode(value, key, AI) : void 0;
      }
      if (property == null ? void 0 : property.AI) {
        lazySetAdd(property.AI, "AO", AI);
      }
      if (StoreListenersRoots.AK) {
        StoreListenersRoots.AR(property == null ? void 0 : property.AI, AI, key);
      }
      if (StoreListenersRegular.AK) {
        StoreListenersRegular.V(AI);
      }
      if (targetIsArray && key === "length") {
        const lengthPrev2 = Number(valuePrev);
        const lengthNext2 = Number(value);
        for (let i = lengthNext2; i < lengthPrev2; i++) {
          if (i in target)
            continue;
          STORE_TRAPS.deleteProperty(target, `${i}`, true);
        }
      }
    }
    return true;
  },
  deleteProperty: (target, key, _force) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    const hasProperty = key in target;
    if (!_force && !hasProperty)
      return true;
    const deleted = Reflect.deleteProperty(target, key);
    if (!deleted)
      return false;
    const AI = getNodeExisting(target);
    (_a2 = AI.AT) == null ? void 0 : _a2.delete(key);
    (_b2 = AI.AU) == null ? void 0 : _b2.delete(key);
    (_c = AI.keys) == null ? void 0 : _c.observable.set(0);
    (_d = AI.values) == null ? void 0 : _d.observable.set(0);
    (_f = (_e = AI.has) == null ? void 0 : _e.get(key)) == null ? void 0 : _f.observable.set(false);
    const property = (_g = AI.AJ) == null ? void 0 : _g.get(key);
    if (StoreListenersRoots.AK) {
      StoreListenersRoots.AR(property == null ? void 0 : property.AI, AI, key);
    }
    if (property == null ? void 0 : property.AI) {
      lazySetDelete(property.AI, "AO", AI);
    }
    if (property) {
      (_h = property.observable) == null ? void 0 : _h.set(void 0);
      property.AI = void 0;
    }
    if (StoreListenersRegular.AK) {
      StoreListenersRegular.V(AI);
    }
    return true;
  },
  defineProperty: (target, key, descriptor) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    const AI = getNodeExisting(target);
    const equals = AI.equals || is;
    const hadProperty = key in target;
    const descriptorPrev = Reflect.getOwnPropertyDescriptor(target, key);
    if ("value" in descriptor && isStore$1(descriptor.value)) {
      descriptor = { ...descriptor, value: getTarget(descriptor.value) };
    }
    if (descriptorPrev && isEqualDescriptor(descriptorPrev, descriptor, equals))
      return true;
    const defined = Reflect.defineProperty(target, key, descriptor);
    if (!defined)
      return false;
    if (!descriptor.get) {
      (_a2 = AI.AT) == null ? void 0 : _a2.delete(key);
    } else if (descriptor.get) {
      AI.AT || (AI.AT = new StoreMap());
      AI.AT.set(key, descriptor.get);
    }
    if (!descriptor.set) {
      (_b2 = AI.AU) == null ? void 0 : _b2.delete(key);
    } else if (descriptor.set) {
      AI.AU || (AI.AU = new StoreMap());
      AI.AU.set(key, descriptor.set);
    }
    if (hadProperty !== !!descriptor.enumerable) {
      (_c = AI.keys) == null ? void 0 : _c.observable.set(0);
    }
    (_e = (_d = AI.has) == null ? void 0 : _d.get(key)) == null ? void 0 : _e.observable.set(true);
    const property = (_f = AI.AJ) == null ? void 0 : _f.get(key);
    if (StoreListenersRoots.AK) {
      StoreListenersRoots.AR(property == null ? void 0 : property.AI, AI, key);
    }
    if (property == null ? void 0 : property.AI) {
      lazySetDelete(property.AI, "AO", AI);
    }
    if (property) {
      if ("get" in descriptor) {
        (_g = property.observable) == null ? void 0 : _g.set(descriptor.get);
        property.AI = void 0;
      } else {
        const value = descriptor.value;
        (_h = property.observable) == null ? void 0 : _h.set(value);
        property.AI = isProxiable(value) ? NODES.get(value) || getNode(value, key, AI) : void 0;
      }
    }
    if (property == null ? void 0 : property.AI) {
      lazySetAdd(property.AI, "AO", AI);
    }
    if (StoreListenersRoots.AK) {
      StoreListenersRoots.AR(property == null ? void 0 : property.AI, AI, key);
    }
    if (StoreListenersRegular.AK) {
      StoreListenersRegular.V(AI);
    }
    return true;
  },
  has: (target, key) => {
    if (key === SYMBOL_STORE)
      return true;
    if (key === SYMBOL_STORE_TARGET)
      return true;
    const value = key in target;
    if (isListenable()) {
      const AI = getNodeExisting(target);
      AI.has || (AI.has = new StoreMap());
      const has = AI.has.get(key) || AI.has.AH(key, getNodeHas(AI, key, value));
      has.listen();
      has.observable.get();
    }
    return value;
  },
  ownKeys: (target) => {
    const keys = Reflect.ownKeys(target);
    if (isListenable()) {
      const AI = getNodeExisting(target);
      AI.keys || (AI.keys = getNodeKeys(AI));
      AI.keys.listen();
      AI.keys.observable.get();
    }
    return keys;
  }
};
const STORE_UNTRACK_TRAPS = {
  /* API */
  has: (target, key) => {
    if (key === SYMBOL_STORE_UNTRACKED)
      return true;
    return key in target;
  }
};
const getNode = (value, key, parent, equals) => {
  if (isStore$1(value))
    return getNodeExisting(getTarget(value));
  const store2 = isFrozenLike(value, key, parent) ? value : new Proxy(value, STORE_TRAPS);
  const gettersAndSetters = getGettersAndSetters(value);
  const AI = { AO: parent, store: store2 };
  if (gettersAndSetters) {
    const { AT, AU } = gettersAndSetters;
    if (AT)
      AI.AT = AT;
    if (AU)
      AI.AU = AU;
  }
  if (equals === false) {
    AI.equals = nope;
  } else if (equals) {
    AI.equals = equals;
  } else if (parent == null ? void 0 : parent.equals) {
    AI.equals = parent.equals;
  }
  NODES.set(value, AI);
  return AI;
};
const getNodeExisting = (value) => {
  const AI = NODES.get(value);
  if (!AI)
    throw new Error("Impossible");
  return AI;
};
const getNodeFromStore = (store2) => {
  return getNodeExisting(getTarget(store2));
};
const getNodeKeys = (AI) => {
  const observable2 = getNodeObservable(AI, 0, { equals: false });
  const keys = new StoreKeys(AI, observable2);
  return keys;
};
const getNodeValues = (AI) => {
  const observable2 = getNodeObservable(AI, 0, { equals: false });
  const values = new StoreValues(AI, observable2);
  return values;
};
const getNodeHas = (AI, key, value) => {
  const observable2 = getNodeObservable(AI, value);
  const has = new StoreHas(AI, key, observable2);
  return has;
};
const getNodeObservable = (AI, value, options2) => {
  return new Observable(value, options2);
};
const getNodeProperty = (AI, key, value) => {
  const observable2 = void 0;
  const propertyNode = isProxiable(value) ? NODES.get(value) || getNode(value, key, AI) : void 0;
  const property = new StoreProperty(AI, key, observable2, propertyNode);
  AI.AJ || (AI.AJ = new StoreMap());
  AI.AJ.set(key, property);
  return property;
};
const getGettersAndSetters = (value) => {
  if (isArray$1(value))
    return;
  let AT;
  let AU;
  const keys = Object.keys(value);
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor)
      continue;
    const { get: get2, set } = descriptor;
    if (get2) {
      AT || (AT = new StoreMap());
      AT.set(key, get2);
    }
    if (set) {
      AU || (AU = new StoreMap());
      AU.set(key, set);
    }
    if (get2 && !set) {
      AU || (AU = new StoreMap());
      AU.set(key, throwNoSetterError);
    }
  }
  if (!AT && !AU)
    return;
  return { AT, AU };
};
const getStore = (value, options2) => {
  if (isStore$1(value))
    return value;
  const AI = NODES.get(value) || getNode(value, void 0, void 0, options2 == null ? void 0 : options2.equals);
  return AI.store;
};
const getTarget = (value) => {
  if (isStore$1(value))
    return value[SYMBOL_STORE_TARGET];
  return value;
};
const getUntracked = (value) => {
  if (!isObject$1(value))
    return value;
  if (isUntracked$1(value))
    return value;
  return new Proxy(value, STORE_UNTRACK_TRAPS);
};
const isEqualDescriptor = (a, b, equals) => {
  return !!a.configurable === !!b.configurable && !!a.enumerable === !!b.enumerable && !!a.writable === !!b.writable && equals(a.value, b.value) && a.get === b.get && a.set === b.set;
};
const isFrozenLike = (value, key, parent) => {
  if (Object.isFrozen(value))
    return true;
  if (!parent || key === void 0)
    return false;
  const target = store.unwrap(parent.store);
  const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
  if ((descriptor == null ? void 0 : descriptor.configurable) || (descriptor == null ? void 0 : descriptor.writable))
    return false;
  return true;
};
const isListenable = () => {
  return !!OBSERVER;
};
const isProxiable = (value) => {
  if (value === null || typeof value !== "object")
    return false;
  if (SYMBOL_STORE in value)
    return true;
  if (SYMBOL_STORE_UNTRACKED in value)
    return false;
  if (isArray$1(value))
    return true;
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null)
    return true;
  return Object.getPrototypeOf(prototype) === null;
};
const isUntracked$1 = (value) => {
  if (value === null || typeof value !== "object")
    return false;
  return SYMBOL_STORE_UNTRACKED in value;
};
const throwNoSetterError = () => {
  throw new TypeError("Cannot set property value of #<Object> which has only a getter");
};
const store = (value, options2) => {
  if (!isObject$1(value))
    return value;
  if (isUntracked$1(value))
    return value;
  return getStore(value, options2);
};
store.on = (target, listener) => {
  const targets = isStore$1(target) ? [target] : castArray$1(target);
  const selectors = targets.filter(isFunction$1);
  const AM = targets.filter(isStore$1).map(getNodeFromStore);
  StoreListenersRegular.AK += 1;
  const disposers = selectors.map((selector) => {
    let inited = false;
    return effect(() => {
      if (inited) {
        StoreListenersRegular.AL.add(listener);
        StoreScheduler.F();
      }
      inited = true;
      selector();
    }, { suspense: false, sync: true });
  });
  AM.forEach((AI) => {
    lazySetAdd(AI, "AP", listener);
  });
  return () => {
    StoreListenersRegular.AK -= 1;
    disposers.forEach((disposer) => {
      disposer();
    });
    AM.forEach((AI) => {
      lazySetDelete(AI, "AP", listener);
    });
  };
};
store._onRoots = (target, listener) => {
  if (!isStore$1(target))
    return noop$1;
  const AI = getNodeFromStore(target);
  if (AI.AO)
    throw new Error("Only top-level stores are supported");
  StoreListenersRoots.AK += 1;
  lazySetAdd(AI, "AQ", listener);
  return () => {
    StoreListenersRoots.AK -= 1;
    lazySetDelete(AI, "AQ", listener);
  };
};
store.reconcile = /* @__PURE__ */ (() => {
  const getType = (value) => {
    if (isArray$1(value))
      return 1;
    if (isProxiable(value))
      return 2;
    return 0;
  };
  const reconcileOuter = (prev, next) => {
    const uprev = getTarget(prev);
    const unext = getTarget(next);
    reconcileInner(prev, next);
    const prevType = getType(uprev);
    const nextType = getType(unext);
    if (prevType === 1 || nextType === 1) {
      prev.length = next.length;
    }
    return prev;
  };
  const reconcileInner = (prev, next) => {
    const uprev = getTarget(prev);
    const unext = getTarget(next);
    const prevKeys = Object.keys(uprev);
    const nextKeys = Object.keys(unext);
    for (let i = 0, l = nextKeys.length; i < l; i++) {
      const key = nextKeys[i];
      const prevValue = uprev[key];
      const nextValue = unext[key];
      if (!is(prevValue, nextValue)) {
        const prevType = getType(prevValue);
        const nextType = getType(nextValue);
        if (prevType && prevType === nextType) {
          reconcileInner(prev[key], nextValue);
          if (prevType === 1) {
            prev[key].length = nextValue.length;
          }
        } else {
          prev[key] = nextValue;
        }
      } else if (prevValue === void 0 && !(key in uprev)) {
        prev[key] = void 0;
      }
    }
    for (let i = 0, l = prevKeys.length; i < l; i++) {
      const key = prevKeys[i];
      if (!(key in unext)) {
        delete prev[key];
      }
    }
    return prev;
  };
  const reconcile = (prev, next) => {
    return untrack(() => {
      return reconcileOuter(prev, next);
    });
  };
  return reconcile;
})();
store.untrack = (value) => {
  return getUntracked(value);
};
store.unwrap = (value) => {
  return getTarget(value);
};
const store$1 = store;
const _with = () => {
  const owner = OWNER;
  const observer = OBSERVER;
  return (fn) => {
    return owner.E(() => fn(), owner, observer);
  };
};
const DIRECTIVES = {};
const SYMBOL_TEMPLATE_ACCESSOR = Symbol("Template.Accessor");
const SYMBOLS_DIRECTIVES = {};
const SYMBOL_CLONE = Symbol("CloneElement");
const { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment } = (() => {
  if (typeof via !== "undefined") {
    const document2 = via.document;
    const createComment2 = document2.createComment;
    const createHTMLNode2 = document2.createElement;
    const createSVGNode2 = (name) => document2.createElementNS("http://www.w3.org/2000/svg", name);
    const createText2 = document2.createTextNode;
    const createDocumentFragment2 = document2.createDocumentFragment;
    return { createComment: createComment2, createHTMLNode: createHTMLNode2, createSVGNode: createSVGNode2, createText: createText2, createDocumentFragment: createDocumentFragment2 };
  } else {
    const createComment2 = document.createComment.bind(document, "");
    const createHTMLNode2 = document.createElement.bind(document);
    const createSVGNode2 = document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
    const createText2 = document.createTextNode.bind(document);
    const createDocumentFragment2 = document.createDocumentFragment.bind(document);
    return { createComment: createComment2, createHTMLNode: createHTMLNode2, createSVGNode: createSVGNode2, createText: createText2, createDocumentFragment: createDocumentFragment2 };
  }
})();
const { assign } = Object;
const castArray = (value) => {
  return isArray(value) ? value : [value];
};
const flatten = (arr) => {
  for (let i = 0, l = arr.length; i < l; i++) {
    if (!isArray(arr[i]))
      continue;
    return arr.flat(Infinity);
  }
  return arr;
};
const { isArray } = Array;
const isBoolean = (value) => {
  return typeof value === "boolean";
};
const isFunction = (value) => {
  return typeof value === "function";
};
const isFunctionReactive = (value) => {
  var _a2, _b2;
  return !(SYMBOL_UNTRACKED in value || SYMBOL_UNTRACKED_UNWRAPPED in value || SYMBOL_OBSERVABLE_FROZEN in value || ((_b2 = (_a2 = value[SYMBOL_OBSERVABLE_READABLE]) == null ? void 0 : _a2.parent) == null ? void 0 : _b2.disposed));
};
const isNil = (value) => {
  return value === null || value === void 0;
};
const isNode = (value) => {
  return value instanceof Node;
};
const isObject = (value) => {
  return typeof value === "object" && value !== null;
};
const isString = (value) => {
  return typeof value === "string";
};
const isSVG = (value) => {
  return !!value["isSVG"];
};
const isSVGElement = /* @__PURE__ */ (() => {
  const svgRe = /^(t(ext$|s)|s[vwy]|g)|^set|tad|ker|p(at|s)|s(to|c$|ca|k)|r(ec|cl)|ew|us|f($|e|s)|cu|n[ei]|l[ty]|[GOP]/;
  const svgCache = {};
  return (element) => {
    const cached = svgCache[element];
    return cached !== void 0 ? cached : svgCache[element] = !element.includes("-") && svgRe.test(element);
  };
})();
const isTemplateAccessor = (value) => {
  return isFunction(value) && SYMBOL_TEMPLATE_ACCESSOR in value;
};
const isVoidChild = (value) => {
  return value === null || value === void 0 || typeof value === "boolean" || typeof value === "symbol";
};
const options = {
  sync: "init"
};
const useRenderEffect = (fn) => {
  return effect(fn, options);
};
const useCheapDisposed = () => {
  let disposed = false;
  const get2 = () => disposed;
  const set = () => disposed = true;
  cleanup$1(set);
  return get2;
};
const useMicrotask = (fn) => {
  const disposed = useCheapDisposed();
  const runWithOwner = _with();
  queueMicrotask(() => {
    if (disposed())
      return;
    runWithOwner(fn);
  });
};
const useMicrotask$1 = useMicrotask;
const classesToggle = (element, classes, force) => {
  const { className } = element;
  if (isString(className)) {
    if (!className) {
      if (force) {
        element.className = classes;
        return;
      } else {
        return;
      }
    } else if (!force && className === classes) {
      element.className = "";
      return;
    }
  }
  if (classes.includes(" ")) {
    classes.split(" ").forEach((cls) => {
      if (!cls.length)
        return;
      element.classList.toggle(cls, !!force);
    });
  } else {
    element.classList.toggle(classes, !!force);
  }
};
const dummyNode = createComment("");
const beforeDummyWrapper = [dummyNode];
const afterDummyWrapper = [dummyNode];
const diff = (parent, before, after, nextSibling) => {
  if (before === after)
    return;
  if (before instanceof Node) {
    if (after instanceof Node) {
      if (before.parentNode === parent) {
        parent.replaceChild(after, before);
        return;
      }
    }
    beforeDummyWrapper[0] = before;
    before = beforeDummyWrapper;
  }
  if (after instanceof Node) {
    afterDummyWrapper[0] = after;
    after = afterDummyWrapper;
  }
  const bLength = after.length;
  let aEnd = before.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map = null;
  let removable;
  while (aStart < aEnd || bStart < bEnd) {
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? after[bStart - 1].nextSibling : after[bEnd - bStart] : nextSibling;
      if (bStart < bEnd) {
        if (node) {
          node.before.apply(node, after.slice(bStart, bEnd));
        } else {
          parent.append.apply(parent, after.slice(bStart, bEnd));
        }
        bStart = bEnd;
      }
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(before[aStart])) {
          removable = before[aStart];
          if (removable.parentNode === parent) {
            parent.removeChild(removable);
          }
        }
        aStart++;
      }
    } else if (before[aStart] === after[bStart]) {
      aStart++;
      bStart++;
    } else if (before[aEnd - 1] === after[bEnd - 1]) {
      aEnd--;
      bEnd--;
    } else if (before[aStart] === after[bEnd - 1] && after[bStart] === before[aEnd - 1]) {
      const node = before[--aEnd].nextSibling;
      parent.insertBefore(
        after[bStart++],
        before[aStart++].nextSibling
      );
      parent.insertBefore(after[--bEnd], node);
      before[aEnd] = after[bEnd];
    } else {
      if (!map) {
        map = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd)
          map.set(after[i], i++);
      }
      if (map.has(before[aStart])) {
        const index = map.get(before[aStart]);
        if (bStart < index && index < bEnd) {
          let i = aStart;
          let sequence = 1;
          while (++i < aEnd && i < bEnd && map.get(before[i]) === index + sequence)
            sequence++;
          if (sequence > index - bStart) {
            const node = before[aStart];
            if (bStart < index) {
              if (node) {
                node.before.apply(node, after.slice(bStart, index));
              } else {
                parent.append.apply(parent, after.slice(bStart, index));
              }
              bStart = index;
            }
          } else {
            parent.replaceChild(
              after[bStart++],
              before[aStart++]
            );
          }
        } else
          aStart++;
      } else {
        removable = before[aStart++];
        if (removable.parentNode === parent) {
          parent.removeChild(removable);
        }
      }
    }
  }
  beforeDummyWrapper[0] = dummyNode;
  afterDummyWrapper[0] = dummyNode;
};
const NOOP_CHILDREN = [];
const FragmentUtils = {
  make: () => {
    return {
      values: void 0,
      length: 0
    };
  },
  makeWithNode: (node) => {
    return {
      values: node,
      length: 1
    };
  },
  makeWithFragment: (fragment) => {
    return {
      values: fragment,
      fragmented: true,
      length: 1
    };
  },
  getChildrenFragmented: (thiz, children = []) => {
    const { values, length } = thiz;
    if (!length)
      return children;
    if (values instanceof Array) {
      for (let i = 0, l = values.length; i < l; i++) {
        const value = values[i];
        if (value instanceof Node) {
          children.push(value);
        } else {
          FragmentUtils.getChildrenFragmented(value, children);
        }
      }
    } else {
      if (values instanceof Node) {
        children.push(values);
      } else {
        FragmentUtils.getChildrenFragmented(values, children);
      }
    }
    return children;
  },
  getChildren: (thiz) => {
    if (!thiz.length)
      return NOOP_CHILDREN;
    if (!thiz.fragmented)
      return thiz.values;
    if (thiz.length === 1)
      return FragmentUtils.getChildren(thiz.values);
    return FragmentUtils.getChildrenFragmented(thiz);
  },
  pushFragment: (thiz, fragment) => {
    FragmentUtils.pushValue(thiz, fragment);
    thiz.fragmented = true;
  },
  pushNode: (thiz, node) => {
    FragmentUtils.pushValue(thiz, node);
  },
  pushValue: (thiz, value) => {
    const { values, length } = thiz;
    if (length === 0) {
      thiz.values = value;
    } else if (length === 1) {
      thiz.values = [values, value];
    } else {
      values.push(value);
    }
    thiz.length += 1;
  },
  replaceWithNode: (thiz, node) => {
    thiz.values = node;
    delete thiz.fragmented;
    thiz.length = 1;
  },
  replaceWithFragment: (thiz, fragment) => {
    thiz.values = fragment.values;
    thiz.fragmented = fragment.fragmented;
    thiz.length = fragment.length;
  }
};
const resolveChild = (value, setter, _dynamic = false) => {
  if (isFunction(value)) {
    if (!isFunctionReactive(value)) {
      resolveChild(value(), setter, _dynamic);
    } else {
      useRenderEffect(() => {
        resolveChild(value(), setter, true);
      });
    }
  } else if (isArray(value)) {
    const [values, hasObservables] = resolveArraysAndStatics(value);
    values[SYMBOL_UNCACHED] = value[SYMBOL_UNCACHED];
    setter(values, hasObservables || _dynamic);
  } else {
    setter(value, _dynamic);
  }
};
const resolveClass = (classes, resolved = {}) => {
  if (isString(classes)) {
    classes.split(/\s+/g).filter(Boolean).filter((cls) => {
      resolved[cls] = true;
    });
  } else if (isFunction(classes)) {
    resolveClass(classes(), resolved);
  } else if (isArray(classes)) {
    classes.forEach((cls) => {
      resolveClass(cls, resolved);
    });
  } else if (classes) {
    for (const key in classes) {
      const value = classes[key];
      const isActive = !!get(value);
      if (!isActive)
        continue;
      resolved[key] = true;
    }
  }
  return resolved;
};
const resolveStyle = (styles, resolved = {}) => {
  if (isString(styles)) {
    return styles;
  } else if (isFunction(styles)) {
    return resolveStyle(styles(), resolved);
  } else if (isArray(styles)) {
    styles.forEach((style) => {
      resolveStyle(style, resolved);
    });
  } else if (styles) {
    for (const key in styles) {
      const value = styles[key];
      resolved[key] = get(value);
    }
  }
  return resolved;
};
const resolveArraysAndStatics = /* @__PURE__ */ (() => {
  const DUMMY_RESOLVED = [];
  const resolveArraysAndStaticsInner = (values, resolved, hasObservables) => {
    for (let i = 0, l = values.length; i < l; i++) {
      const value = values[i];
      const type = typeof value;
      if (type === "string" || type === "number" || type === "bigint") {
        if (resolved === DUMMY_RESOLVED)
          resolved = values.slice(0, i);
        resolved.push(createText(value));
      } else if (type === "object" && isArray(value)) {
        if (resolved === DUMMY_RESOLVED)
          resolved = values.slice(0, i);
        hasObservables = resolveArraysAndStaticsInner(value, resolved, hasObservables)[1];
      } else if (type === "function" && isObservable(value)) {
        if (resolved !== DUMMY_RESOLVED)
          resolved.push(value);
        hasObservables = true;
      } else {
        if (resolved !== DUMMY_RESOLVED)
          resolved.push(value);
      }
    }
    if (resolved === DUMMY_RESOLVED)
      resolved = values;
    return [resolved, hasObservables];
  };
  return (values) => {
    return resolveArraysAndStaticsInner(values, DUMMY_RESOLVED, false);
  };
})();
const setAttributeStatic = /* @__PURE__ */ (() => {
  const attributesBoolean = /* @__PURE__ */ new Set(["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"]);
  const attributeCamelCasedRe = /e(r[HRWrv]|[Vawy])|Con|l(e[Tcs]|c)|s(eP|y)|a(t[rt]|u|v)|Of|Ex|f[XYa]|gt|hR|d[Pg]|t[TXYd]|[UZq]/;
  const attributesCache = {};
  const uppercaseRe = /[A-Z]/g;
  const normalizeKeySvg = (key) => {
    return attributesCache[key] || (attributesCache[key] = attributeCamelCasedRe.test(key) ? key : key.replace(uppercaseRe, (char) => `-${char.toLowerCase()}`));
  };
  return (element, key, value) => {
    if (isSVG(element)) {
      key = key === "xlinkHref" || key === "xlink:href" ? "href" : normalizeKeySvg(key);
      if (isNil(value) || value === false && attributesBoolean.has(key)) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, String(value));
      }
    } else {
      if (isNil(value) || value === false && attributesBoolean.has(key)) {
        element.removeAttribute(key);
      } else {
        value = value === true ? "" : String(value);
        element.setAttribute(key, value);
      }
    }
  };
})();
const setAttribute = (element, key, value) => {
  if (isFunction(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setAttributeStatic(element, key, value());
    });
  } else {
    setAttributeStatic(element, key, get(value));
  }
};
const setChildReplacementText = (child, childPrev) => {
  if (childPrev.nodeType === 3) {
    childPrev.nodeValue = child;
    return childPrev;
  } else {
    const parent = childPrev.parentElement;
    if (!parent)
      throw new Error("Invalid child replacement");
    const textNode = createText(child);
    parent.replaceChild(textNode, childPrev);
    return textNode;
  }
};
const setChildStatic = (parent, fragment, fragmentOnly, child, dynamic) => {
  if (!dynamic && isVoidChild(child))
    return;
  const prev = FragmentUtils.getChildren(fragment);
  const prevIsArray = prev instanceof Array;
  const prevLength = prevIsArray ? prev.length : 1;
  const prevFirst = prevIsArray ? prev[0] : prev;
  const prevLast = prevIsArray ? prev[prevLength - 1] : prev;
  const prevSibling = (prevLast == null ? void 0 : prevLast.nextSibling) || null;
  if (prevLength === 0) {
    const type = typeof child;
    if (type === "string" || type === "number" || type === "bigint") {
      const textNode = createText(child);
      if (!fragmentOnly) {
        parent.appendChild(textNode);
      }
      FragmentUtils.replaceWithNode(fragment, textNode);
      return;
    } else if (type === "object" && child !== null && typeof child.nodeType === "number") {
      const node = child;
      if (!fragmentOnly) {
        parent.insertBefore(node, null);
      }
      FragmentUtils.replaceWithNode(fragment, node);
      return;
    }
  }
  if (prevLength === 1) {
    const type = typeof child;
    if (type === "string" || type === "number" || type === "bigint") {
      const node = setChildReplacementText(String(child), prevFirst);
      FragmentUtils.replaceWithNode(fragment, node);
      return;
    }
  }
  const fragmentNext = FragmentUtils.make();
  const children = Array.isArray(child) ? child : [child];
  for (let i = 0, l = children.length; i < l; i++) {
    const child2 = children[i];
    const type = typeof child2;
    if (type === "string" || type === "number" || type === "bigint") {
      FragmentUtils.pushNode(fragmentNext, createText(child2));
    } else if (type === "object" && child2 !== null && typeof child2.nodeType === "number") {
      FragmentUtils.pushNode(fragmentNext, child2);
    } else if (type === "function") {
      const fragment2 = FragmentUtils.make();
      let childFragmentOnly = !fragmentOnly;
      FragmentUtils.pushFragment(fragmentNext, fragment2);
      resolveChild(child2, (child3, dynamic2) => {
        const fragmentOnly2 = childFragmentOnly;
        childFragmentOnly = false;
        setChildStatic(parent, fragment2, fragmentOnly2, child3, dynamic2);
      });
    }
  }
  let next = FragmentUtils.getChildren(fragmentNext);
  let nextLength = fragmentNext.length;
  if (nextLength === 0 && prevLength === 1 && prevFirst.nodeType === 8) {
    return;
  }
  if (!fragmentOnly && (nextLength === 0 || prevLength === 1 && prevFirst.nodeType === 8 || children[SYMBOL_UNCACHED])) {
    const { childNodes } = parent;
    if (childNodes.length === prevLength) {
      parent.textContent = "";
      if (nextLength === 0) {
        const placeholder = createComment("");
        FragmentUtils.pushNode(fragmentNext, placeholder);
        if (next !== fragmentNext.values) {
          next = placeholder;
          nextLength += 1;
        }
      }
      if (prevSibling) {
        if (next instanceof Array) {
          prevSibling.before.apply(prevSibling, next);
        } else {
          parent.insertBefore(next, prevSibling);
        }
      } else {
        if (next instanceof Array) {
          parent.append.apply(parent, next);
        } else {
          parent.append(next);
        }
      }
      FragmentUtils.replaceWithFragment(fragment, fragmentNext);
      return;
    }
  }
  if (nextLength === 0) {
    const placeholder = createComment("");
    FragmentUtils.pushNode(fragmentNext, placeholder);
    if (next !== fragmentNext.values) {
      next = placeholder;
      nextLength += 1;
    }
  }
  if (!fragmentOnly) {
    diff(parent, prev, next, prevSibling);
  }
  FragmentUtils.replaceWithFragment(fragment, fragmentNext);
};
const setChild = (parent, child, fragment = FragmentUtils.make()) => {
  resolveChild(child, setChildStatic.bind(void 0, parent, fragment, false));
};
const setClassStatic = classesToggle;
const setClass = (element, key, value) => {
  if (isFunction(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setClassStatic(element, key, value());
    });
  } else {
    setClassStatic(element, key, get(value));
  }
};
const setClassBooleanStatic = (element, value, key, keyPrev) => {
  if (keyPrev && keyPrev !== true) {
    setClassStatic(element, keyPrev, false);
  }
  if (key && key !== true) {
    setClassStatic(element, key, value);
  }
};
const setClassBoolean = (element, value, key) => {
  if (isFunction(key) && isFunctionReactive(key)) {
    let keyPrev;
    useRenderEffect(() => {
      const keyNext = key();
      setClassBooleanStatic(element, value, keyNext, keyPrev);
      keyPrev = keyNext;
    });
  } else {
    setClassBooleanStatic(element, value, get(key));
  }
};
const setClassesStatic = (element, object, objectPrev) => {
  if (isString(object)) {
    if (isSVG(element)) {
      element.setAttribute("class", object);
    } else {
      element.className = object;
    }
  } else {
    if (objectPrev) {
      if (isString(objectPrev)) {
        if (objectPrev) {
          if (isSVG(element)) {
            element.setAttribute("class", "");
          } else {
            element.className = "";
          }
        }
      } else if (isArray(objectPrev)) {
        objectPrev = store$1.unwrap(objectPrev);
        for (let i = 0, l = objectPrev.length; i < l; i++) {
          if (!objectPrev[i])
            continue;
          setClassBoolean(element, false, objectPrev[i]);
        }
      } else {
        objectPrev = store$1.unwrap(objectPrev);
        for (const key in objectPrev) {
          if (object && key in object)
            continue;
          setClass(element, key, false);
        }
      }
    }
    if (isArray(object)) {
      if (isStore$1(object)) {
        for (let i = 0, l = object.length; i < l; i++) {
          const fn = untrack(() => isFunction(object[i]) ? object[i] : object[SYMBOL_STORE_OBSERVABLE](String(i)));
          setClassBoolean(element, true, fn);
        }
      } else {
        for (let i = 0, l = object.length; i < l; i++) {
          if (!object[i])
            continue;
          setClassBoolean(element, true, object[i]);
        }
      }
    } else {
      if (isStore$1(object)) {
        for (const key in object) {
          const fn = untrack(() => isFunction(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key));
          setClass(element, key, fn);
        }
      } else {
        for (const key in object) {
          setClass(element, key, object[key]);
        }
      }
    }
  }
};
const setClasses = (element, object) => {
  if (isFunction(object) || isArray(object)) {
    let objectPrev;
    useRenderEffect(() => {
      const objectNext = resolveClass(object);
      setClassesStatic(element, objectNext, objectPrev);
      objectPrev = objectNext;
    });
  } else {
    setClassesStatic(element, object);
  }
};
const setDirective = (element, directive, args) => {
  const symbol = SYMBOLS_DIRECTIVES[directive] || Symbol();
  const data = context(symbol) || DIRECTIVES[symbol];
  if (!data)
    throw new Error(`Directive "${directive}" not found`);
  const call = () => data.fn(element, ...castArray(args));
  if (data.immediate) {
    call();
  } else {
    useMicrotask$1(call);
  }
};
const setEventStatic = /* @__PURE__ */ (() => {
  const delegatedEvents = {
    onauxclick: ["_onauxclick", false],
    onbeforeinput: ["_onbeforeinput", false],
    onclick: ["_onclick", false],
    ondblclick: ["_ondblclick", false],
    onfocusin: ["_onfocusin", false],
    onfocusout: ["_onfocusout", false],
    oninput: ["_oninput", false],
    onkeydown: ["_onkeydown", false],
    onkeyup: ["_onkeyup", false],
    onmousedown: ["_onmousedown", false],
    onmouseup: ["_onmouseup", false]
  };
  const delegate = (event) => {
    const key = `_${event}`;
    document.addEventListener(event.slice(2), (event2) => {
      const targets = event2.composedPath();
      let target = null;
      Object.defineProperty(event2, "currentTarget", {
        configurable: true,
        get() {
          return target;
        }
      });
      for (let i = 0, l = targets.length; i < l; i++) {
        target = targets[i];
        const handler = target[key];
        if (!handler)
          continue;
        handler(event2);
        if (event2.cancelBubble)
          break;
      }
      target = null;
    });
  };
  return (element, event, value) => {
    if (event.startsWith("onmiddleclick")) {
      const _value = value;
      event = `onauxclick${event.slice(13)}`;
      value = _value && ((event2) => event2["button"] === 1 && _value(event2));
    }
    const delegated = delegatedEvents[event];
    if (delegated) {
      if (!delegated[1]) {
        delegated[1] = true;
        delegate(event);
      }
      element[delegated[0]] = value;
    } else if (event.endsWith("passive")) {
      const isCapture = event.endsWith("capturepassive");
      const type = event.slice(2, -7 - (isCapture ? 7 : 0));
      const key = `_${event}`;
      const valuePrev = element[key];
      if (valuePrev)
        element.removeEventListener(type, valuePrev, { capture: isCapture });
      if (value)
        element.addEventListener(type, value, { passive: true, capture: isCapture });
      element[key] = value;
    } else if (event.endsWith("capture")) {
      const type = event.slice(2, -7);
      const key = `_${event}`;
      const valuePrev = element[key];
      if (valuePrev)
        element.removeEventListener(type, valuePrev, { capture: true });
      if (value)
        element.addEventListener(type, value, { capture: true });
      element[key] = value;
    } else {
      element[event] = value;
    }
  };
})();
const setEvent = (element, event, value) => {
  setEventStatic(element, event, value);
};
const setHTMLStatic = (element, value) => {
  element.innerHTML = String(isNil(value) ? "" : value);
};
const setHTML = (element, value) => {
  useRenderEffect(() => {
    setHTMLStatic(element, get(get(value).__html));
  });
};
const setPropertyStatic = (element, key, value) => {
  if (key === "tabIndex" && isBoolean(value)) {
    value = value ? 0 : void 0;
  }
  if (key === "value") {
    if (element.tagName === "PROGRESS") {
      value ?? (value = null);
    } else if (element.tagName === "SELECT" && !element["_$inited"]) {
      element["_$inited"] = true;
      queueMicrotask(() => element[key] = value);
    }
  }
  try {
    element[key] = value;
    if (isNil(value)) {
      setAttributeStatic(element, key, null);
    }
  } catch {
    setAttributeStatic(element, key, value);
  }
};
const setProperty = (element, key, value) => {
  if (isFunction(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setPropertyStatic(element, key, value());
    });
  } else {
    setPropertyStatic(element, key, get(value));
  }
};
const setRef = (element, value) => {
  if (isNil(value))
    return;
  const values = flatten(castArray(value)).filter(Boolean);
  if (!values.length)
    return;
  useMicrotask$1(() => untrack(() => values.forEach((value2) => value2 == null ? void 0 : value2(element))));
};
const setStyleStatic = /* @__PURE__ */ (() => {
  const propertyNonDimensionalRe = /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/i;
  const propertyNonDimensionalCache = {};
  return (element, key, value) => {
    if (key.charCodeAt(0) === 45) {
      if (isNil(value)) {
        element.style.removeProperty(key);
      } else {
        element.style.setProperty(key, String(value));
      }
    } else if (isNil(value)) {
      element.style[key] = null;
    } else {
      element.style[key] = isString(value) || (propertyNonDimensionalCache[key] || (propertyNonDimensionalCache[key] = propertyNonDimensionalRe.test(key))) ? value : `${value}px`;
    }
  };
})();
const setStyle = (element, key, value) => {
  if (isFunction(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setStyleStatic(element, key, value());
    });
  } else {
    setStyleStatic(element, key, get(value));
  }
};
const setStylesStatic = (element, object, objectPrev) => {
  if (isString(object)) {
    element.setAttribute("style", object);
  } else {
    if (objectPrev) {
      if (isString(objectPrev)) {
        if (objectPrev) {
          element.style.cssText = "";
        }
      } else {
        objectPrev = store$1.unwrap(objectPrev);
        for (const key in objectPrev) {
          if (object && key in object)
            continue;
          setStyleStatic(element, key, null);
        }
      }
    }
    if (isStore$1(object)) {
      for (const key in object) {
        const fn = untrack(() => isFunction(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key));
        setStyle(element, key, fn);
      }
    } else {
      for (const key in object) {
        setStyle(element, key, object[key]);
      }
    }
  }
};
const setStyles = (element, object) => {
  if (isFunction(object) || isArray(object)) {
    let objectPrev;
    useRenderEffect(() => {
      const objectNext = resolveStyle(object);
      setStylesStatic(element, objectNext, objectPrev);
      objectPrev = objectNext;
    });
  } else {
    setStylesStatic(element, get(object));
  }
};
const setTemplateAccessor = (element, key, value) => {
  if (key === "children") {
    const placeholder = createText("");
    element.insertBefore(placeholder, null);
    value(element, "setChildReplacement", void 0, placeholder);
  } else if (key === "ref") {
    value(element, "setRef");
  } else if (key === "style") {
    value(element, "setStyles");
  } else if (key === "class" || key === "className") {
    if (!isSVG(element)) {
      element.className = "";
    }
    value(element, "setClasses");
  } else if (key === "dangerouslySetInnerHTML") {
    value(element, "setHTML");
  } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) {
    value(element, "setEvent", key.toLowerCase());
  } else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) {
    value(element, "setDirective", key.slice(4));
  } else if (key === "innerHTML" || key === "outerHTML" || key === "textContent" || key === "className")
    ;
  else if (key in element && !isSVG(element)) {
    value(element, "setProperty", key);
  } else {
    element.setAttribute(key, "");
    value(element, "setAttribute", key);
  }
};
const setProp = (element, key, value) => {
  if (value === void 0)
    return;
  if (isTemplateAccessor(value)) {
    setTemplateAccessor(element, key, value);
  } else if (key === "children") {
    setChild(element, value);
  } else if (key === "ref") {
    setRef(element, value);
  } else if (key === "style") {
    setStyles(element, value);
  } else if (key === "class" || key === "className") {
    setClasses(element, value);
  } else if (key === "dangerouslySetInnerHTML") {
    setHTML(element, value);
  } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) {
    setEvent(element, key.toLowerCase(), value);
  } else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) {
    setDirective(element, key.slice(4), value);
  } else if (key === "innerHTML" || key === "outerHTML" || key === "textContent" || key === "className")
    ;
  else if (key in element && !isSVG(element)) {
    setProperty(element, key, value);
  } else {
    setAttribute(element, key, value);
  }
};
const setProps = (element, object) => {
  for (const key in object) {
    setProp(element, key, object[key]);
  }
};
const wrapElement = (element) => {
  element[SYMBOL_UNTRACKED_UNWRAPPED] = true;
  return element;
};
const wrapCloneElement = (target, component, props) => {
  target[SYMBOL_CLONE] = { Component: component, props };
  return target;
};
const createElement = (component, _props, ..._children) => {
  const children = _children.length > 1 ? _children : _children.length > 0 ? _children[0] : void 0;
  const hasChildren = !isVoidChild(children);
  if (hasChildren && isObject(_props) && "children" in _props) {
    throw new Error('Providing "children" both as a prop and as rest arguments is forbidden');
  }
  if (isFunction(component)) {
    const props = hasChildren ? { ..._props, children } : _props;
    return wrapElement(() => {
      return untrack(() => component.call(component, props));
    });
  } else if (isString(component)) {
    const isSVG2 = isSVGElement(component);
    const createNode = isSVG2 ? createSVGNode : createHTMLNode;
    return wrapElement(() => {
      const child = createNode(component);
      if (isSVG2)
        child["isSVG"] = true;
      untrack(() => {
        if (_props) {
          setProps(child, _props);
        }
        if (hasChildren) {
          setChild(child, children);
        }
      });
      return child;
    });
  } else if (isNode(component)) {
    return wrapElement(() => component);
  } else {
    throw new Error("Invalid component");
  }
};
function jsx(component, props, ...children) {
  if (typeof children === "string")
    return wrapCloneElement(createElement(component, props ?? {}, children), component, props);
  if (!props)
    props = {};
  if (typeof children === "string")
    Object.assign(props, { children });
  return wrapCloneElement(createElement(component, props, props == null ? void 0 : props.key), component, props);
}
class Root extends Owner {
  /* CONSTRUCTOR */
  constructor(V) {
    super();
    this.parent = OWNER;
    this.context = OWNER.context;
    if (V) {
      const suspense = this.get(SYMBOL_SUSPENSE$1);
      if (suspense) {
        this.A0 = true;
        lazySetAdd(this.parent, "T", this);
      }
    }
  }
  /* API */
  Q(deep) {
    if (this.A0) {
      lazySetDelete(this.parent, "T", this);
    }
    super.Q(deep);
  }
  E(fn) {
    const Q = () => this.Q(true);
    const fnWithDispose = () => fn(Q);
    return super.E(fnWithDispose, this, void 0);
  }
}
const Root$1 = Root;
const root = (fn) => {
  return new Root$1(true).E(fn);
};
const root$1 = root;
const isObservableFrozen = (value) => {
  var _a2, _b2;
  return isFunction$1(value) && (SYMBOL_OBSERVABLE_FROZEN in value || !!((_b2 = (_a2 = value[SYMBOL_OBSERVABLE_READABLE]) == null ? void 0 : _a2.parent) == null ? void 0 : _b2.disposed));
};
const isUntracked = (value) => {
  return isFunction$1(value) && (SYMBOL_UNTRACKED in value || SYMBOL_UNTRACKED_UNWRAPPED in value);
};
class Memo extends Observer {
  /* CONSTRUCTOR */
  constructor(fn, options2) {
    super();
    this.fn = fn;
    this.observable = new Observable(UNINITIALIZED, options2, this);
    if ((options2 == null ? void 0 : options2.sync) === true) {
      this.sync = true;
      this.C();
    }
  }
  /* API */
  run() {
    const G = super.H(this.fn);
    if (!this.disposed && this.A.empty()) {
      this.disposed = true;
    }
    if (G !== UNAVAILABLE) {
      this.observable.set(G);
    }
  }
  I(J) {
    const statusPrev = this.J;
    if (statusPrev >= J)
      return;
    this.J = J;
    if (statusPrev === DIRTY_MAYBE_YES)
      return;
    this.observable.I(DIRTY_MAYBE_YES);
  }
}
const memo = (fn, options2) => {
  if (isObservableFrozen(fn)) {
    return fn;
  } else if (isUntracked(fn)) {
    return frozen(fn());
  } else {
    const memo2 = new Memo(fn, options2);
    const observable2 = readable(memo2.observable);
    return observable2;
  }
};
frozen(-1);
frozen(-1);
function observable(value, options2) {
  return writable(new Observable(value, options2));
}
var n = function(t2, s, r, e) {
  var u;
  s[0] = 0;
  for (var h = 1; h < s.length; h++) {
    var p = s[h++], a = s[h] ? (s[0] |= p ? 1 : 2, r[s[h++]]) : s[++h];
    3 === p ? e[0] = a : 4 === p ? e[1] = Object.assign(e[1] || {}, a) : 5 === p ? (e[1] = e[1] || {})[s[++h]] = a : 6 === p ? e[1][s[++h]] += a + "" : p ? (u = t2.apply(a, n(t2, a, r, ["", null])), e.push(u), a[0] ? s[0] |= 2 : (s[h - 2] = 0, s[h] = u)) : e.push(a);
  }
  return e;
}, t = /* @__PURE__ */ new Map();
function htm(s) {
  var r = t.get(this);
  return r || (r = /* @__PURE__ */ new Map(), t.set(this, r)), (r = n(this, r.get(s) || (r.set(s, r = function(n2) {
    for (var t2, s2, r2 = 1, e = "", u = "", h = [0], p = function(n3) {
      1 === r2 && (n3 || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h.push(0, n3, e) : 3 === r2 && (n3 || e) ? (h.push(3, n3, e), r2 = 2) : 2 === r2 && "..." === e && n3 ? h.push(4, n3, 0) : 2 === r2 && e && !n3 ? h.push(5, 0, true, e) : r2 >= 5 && ((e || !n3 && 5 === r2) && (h.push(r2, 0, e, s2), r2 = 6), n3 && (h.push(r2, n3, 0, s2), r2 = 6)), e = "";
    }, a = 0; a < n2.length; a++) {
      a && (1 === r2 && p(), p(a));
      for (var l = 0; l < n2[a].length; l++)
        t2 = n2[a][l], 1 === r2 ? "<" === t2 ? (p(), h = [h], r2 = 3) : e += t2 : 4 === r2 ? "--" === e && ">" === t2 ? (r2 = 1, e = "") : e = t2 + e[0] : u ? t2 === u ? u = "" : e += t2 : '"' === t2 || "'" === t2 ? u = t2 : ">" === t2 ? (p(), r2 = 1) : r2 && ("=" === t2 ? (r2 = 5, s2 = e, e = "") : "/" === t2 && (r2 < 5 || ">" === n2[a][l + 1]) ? (p(), 3 === r2 && (h = h[0]), r2 = h, (h = h[0]).push(2, 0, r2), r2 = 0) : " " === t2 || "	" === t2 || "\n" === t2 || "\r" === t2 ? (p(), r2 = 2) : e += t2), 3 === r2 && "!--" === e && (r2 = 4, h = h[0]);
    }
    return p(), h;
  }(s)), r), arguments, [])).length > 1 ? r : r[0];
}
const render = (child, parent) => {
  if (!parent || !(parent instanceof HTMLElement))
    throw new Error("Invalid parent node");
  parent.textContent = "";
  return root$1((dispose) => {
    setChild(parent, child);
    return () => {
      dispose();
      parent.textContent = "";
    };
  });
};
const render$1 = render;
var _a, _b;
!!((_b = (_a = globalThis.CDATASection) == null ? void 0 : _a.toString) == null ? void 0 : _b.call(_a).match(/^\s*function\s+CDATASection\s*\(\s*\)\s*\{\s*\[native code\]\s*\}\s*$/));
_with();
const registry = {};
const h2 = (type, props, ...children) => createElement(registry[type] || type, props, ...children);
const register = (components) => void assign(registry, components);
assign(htm.bind(h2), { register });
const isTemp = (s) => !!s.raw;
const extract = (C, props, classNames) => {
  const { className, ...p } = props;
  const cls = p.class;
  delete p.class;
  return /* @__PURE__ */ jsx(C, { class: [classNames, cls, className], ...p });
};
function style$1(comp) {
  function tw2(strings, ...values) {
    if (isTemp(strings)) {
      const C = comp;
      const r = memo(() => strings.map((str, i) => i < values.length ? str + get(values[i]) : str).join(""));
      return C ? (props) => extract(C, props, r) : r;
    }
    return style$1(strings).tw;
  }
  return { comp, tw: tw2 };
}
const tw = style$1().tw;
const MenuItem = tw("li")`min-h-[auto] bg-transparent cursor-pointer select-none align-middle appearance-none text-inherit font-normal text-base leading-normal tracking-[0.00938em] flex justify-start items-center relative no-underline box-border whitespace-nowrap m-0 px-4 py-1.5 rounded-none border-0 [outline:0px] hover:no-underline hover:bg-[rgba(0,0,0,0.04)]`;
const MenuList = tw("ul")`relative m-0 px-0 py-2 list-none`;
const ListItemIcon = tw("div")`min-w-[56px] text-[rgba(0,0,0,0.54)] shrink-0 inline-flex`;
const ListItemText = ({ primary, secondary, children, ...props }) => /* @__PURE__ */ jsx("div", { class: "flex-auto min-w-0 my-1.5", children: [
  /* @__PURE__ */ jsx("span", { class: "font-normal text-base leading-normal tracking-[0.00938em] block m-0", children: primary ?? children }),
  /* @__PURE__ */ jsx("span", { class: "font-normal text-sm leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.6)] block m-0;", children: secondary })
] });
const Paper = tw("div")`elevation-3`;
const Typography = tw("p")`font-normal text-sm leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.6)] m-0`;
const Divider = tw("hr")`shrink-0 my-2 m-0 [border-width:0px_0px_thin] border-solid border-[rgba(0,0,0,0.12)]`;
observable(false);
const App = () => /* @__PURE__ */ jsx("div", { class: "w-[25%]", children: [
  /* @__PURE__ */ jsx("div", { class: "w-full w-max-[360px]", children: [
    /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsx(MenuList, { children: [
      /* @__PURE__ */ jsx(MenuItem, { children: [
        /* @__PURE__ */ jsx(ListItemIcon, { children: /* @__PURE__ */ jsx("svg", { class: "select-none w-[1em] h-[1em] inline-block fill-current shrink-0 text-2xl [transition:fill_200ms_cubic-bezier(0.4,0,0.2,1)0ms]", focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", "data-testid": "InboxIcon", children: /* @__PURE__ */ jsx("path", { d: "M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z" }) }) }),
        /* @__PURE__ */ jsx(ListItemText, { primary: "Inbox" })
      ] }),
      /* @__PURE__ */ jsx(MenuItem, { children: [
        /* @__PURE__ */ jsx(ListItemIcon, { children: /* @__PURE__ */ jsx("svg", { class: "select-none w-[1em] h-[1em] inline-block fill-current shrink-0 text-2xl [transition:fill_200ms_cubic-bezier(0.4,0,0.2,1)0ms]", focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", "data-testid": "DraftsIcon", children: /* @__PURE__ */ jsx("path", { d: "M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-10zM12 13 3.74 7.84 12 3l8.26 4.84L12 13z" }) }) }),
        /* @__PURE__ */ jsx(ListItemText, { primary: "Drafts", secondary: "Jan 7, 2014" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx("nav", { "aria-label": "secondary mailbox folders", children: /* @__PURE__ */ jsx(MenuList, { children: [
      /* @__PURE__ */ jsx(MenuItem, { children: /* @__PURE__ */ jsx(ListItemText, { primary: "Trash" }) }),
      /* @__PURE__ */ jsx(MenuItem, { children: /* @__PURE__ */ jsx(ListItemText, { primary: "Spam" }) })
    ] }) })
  ] }),
  /* @__PURE__ */ jsx(Paper, { class: "w-[320px] w-max-full", children: /* @__PURE__ */ jsx(MenuList, { children: [
    /* @__PURE__ */ jsx(MenuItem, { children: [
      /* @__PURE__ */ jsx(ListItemIcon, { onClick: () => alert("clickd"), children: /* @__PURE__ */ jsx("svg", { class: "select-none w-[1em] h-[1em] inline-block fill-current shrink-0 transition-[fill] duration-200 ease-in-out delay-[0ms] text-xl", focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", "data-testid": "ContentCutIcon", children: /* @__PURE__ */ jsx("path", { d: "M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z" }) }) }),
      /* @__PURE__ */ jsx(ListItemText, { children: "Cut" }),
      /* @__PURE__ */ jsx(Typography, { children: "⌘X" })
    ] }),
    /* @__PURE__ */ jsx(MenuItem, { children: [
      /* @__PURE__ */ jsx(ListItemIcon, { children: /* @__PURE__ */ jsx("svg", { class: "select-none w-[1em] h-[1em] inline-block fill-current shrink-0 transition-[fill] duration-200 ease-in-out delay-[0ms] text-xl", focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", "data-testid": "ContentCopyIcon", children: /* @__PURE__ */ jsx("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }) }) }),
      /* @__PURE__ */ jsx(ListItemText, { children: "Copy" }),
      /* @__PURE__ */ jsx(Typography, { children: "⌘C" })
    ] }),
    /* @__PURE__ */ jsx(MenuItem, { children: [
      /* @__PURE__ */ jsx(ListItemIcon, { children: /* @__PURE__ */ jsx("svg", { class: "select-none w-[1em] h-[1em] inline-block fill-current shrink-0 transition-[fill] duration-200 ease-in-out delay-[0ms] text-xl", focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", "data-testid": "ContentPasteIcon", children: /* @__PURE__ */ jsx("path", { d: "M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z" }) }) }),
      /* @__PURE__ */ jsx(ListItemText, { children: "Paste" }),
      /* @__PURE__ */ jsx(Typography, { children: "⌘V" })
    ] }),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx(MenuItem, { children: [
      /* @__PURE__ */ jsx(ListItemIcon, { children: /* @__PURE__ */ jsx("svg", { class: "select-none w-[1em] h-[1em] inline-block fill-current shrink-0 transition-[fill] duration-200 ease-in-out delay-[0ms] text-xl", focusable: "false", "aria-hidden": "true", viewBox: "0 0 24 24", "data-testid": "CloudIcon", children: /* @__PURE__ */ jsx("path", { d: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" }) }) }),
      /* @__PURE__ */ jsx(ListItemText, { children: "Web Clipboard" })
    ] })
  ] }) })
] });
render$1(/* @__PURE__ */ jsx(App, {}), document.getElementById("app"));
