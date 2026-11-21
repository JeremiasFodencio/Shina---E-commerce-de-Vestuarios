import { r as run_all, H as HYDRATION_ERROR, C as COMMENT_NODE, b as HYDRATION_END, c as HYDRATION_START, d as HYDRATION_START_ELSE, f as HYDRATION_START_FAILED, S as STATE_SYMBOL, i as COMPONENT_SYMBOL, o as object_prototype, j as array_prototype, U as UNINITIALIZED, k as get_descriptor, l as get_prototype_of, m as is_array, D as DESTROYED, B as BOUNDARY_EFFECT, p as DESTROYING, R as REACTION_RAN, E as EFFECT, q as CONNECTED, t as CLEAN, M as MAYBE_DIRTY, u as define_property, v as EFFECT_OFFSCREEN, I as INERT, w as BRANCH_EFFECT, x as ROOT_EFFECT, y as EAGER_EFFECT, z as DIRTY, A as DERIVED, F as BLOCK_EFFECT, G as ASSIGNED, J as ERROR_VALUE, K as ASYNC, L as deferred, N as REACTION_IS_UPDATING, O as HAS_ABORT_CONTROLLER, n as noop, P as MANAGED_EFFECT, Q as includes, T as index_of, V as STALE_REACTION, W as HEAD_EFFECT, X as EFFECT_PRESERVED, Y as EFFECT_TRANSPARENT, Z as PAUSED, _ as RENDER_EFFECT, $ as USER_EFFECT, a0 as array_from, a1 as is_passive_event, a2 as LEGACY_PROPS, a3 as render, a4 as setContext, a5 as derived } from "./index.js";
const browser = false;
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}
function effect_update_depth_exceeded() {
  {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function hydration_failed() {
  {
    throw new Error(`https://svelte.dev/e/hydration_failed`);
  }
}
function state_descriptors_fixed() {
  {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
function svelte_boundary_reset_onerror() {
  {
    throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
  }
}
function derived_inert() {
  {
    console.warn(`https://svelte.dev/e/derived_inert`);
  }
}
function hydration_mismatch(location) {
  {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
  }
}
function svelte_boundary_reset_noop() {
  {
    console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
  }
}
let async_mode_flag = false;
let tracing_mode_flag = false;
let micro_tasks = [];
function run_micro_tasks() {
  var tasks = micro_tasks;
  micro_tasks = [];
  run_all(tasks);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0 && !is_flushing_sync) {
    var tasks = micro_tasks;
    queueMicrotask(() => {
      if (tasks === micro_tasks) run_micro_tasks();
    });
  }
  micro_tasks.push(fn);
}
function flush_tasks() {
  while (micro_tasks.length > 0) {
    run_micro_tasks();
  }
}
let hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
let hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = node;
}
function hydrate_next() {
  return set_hydrate_node(/* @__PURE__ */ get_next_sibling(hydrate_node));
}
function next(count = 1) {
  if (hydrating) {
    var i = count;
    var node = hydrate_node;
    while (i--) {
      node = /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(node);
    }
    hydrate_node = node;
  }
}
function skip_nodes(remove = true) {
  var depth = 0;
  var node = hydrate_node;
  while (true) {
    if (node_type(node) === COMMENT_NODE) {
      var data = get_node_value(node) ?? "";
      if (data === HYDRATION_END) {
        if (depth === 0) return node;
        depth -= 1;
      } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE || // "[?" followed by the serialized error, for failed boundaries
      data.startsWith(HYDRATION_START_FAILED) || // "[1", "[2", etc. for if blocks
      data[0] === "[" && !isNaN(Number(data.slice(1)))) {
        depth += 1;
      }
    }
    var next2 = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ get_next_sibling(node)
    );
    if (remove) remove_node(node);
    node = next2;
  }
}
function read_hydration_instruction(node) {
  if (!node || node_type(node) !== COMMENT_NODE) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return get_node_value(node) ?? "";
}
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value || COMPONENT_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = /* @__PURE__ */ new Map();
  var is_proxied_array = is_array(value);
  var version = /* @__PURE__ */ state(0);
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", /* @__PURE__ */ state(
      /** @type {any[]} */
      value.length
    ));
  }
  return new Proxy(
    /** @type {any} */
    value,
    {
      defineProperty(_, prop, descriptor) {
        if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
          state_descriptors_fixed();
        }
        var s = sources.get(prop);
        if (s === void 0) {
          with_parent(() => {
            var s2 = /* @__PURE__ */ state(descriptor.value);
            sources.set(prop, s2);
            return s2;
          });
        } else {
          set(s, descriptor.value, true);
        }
        return true;
      },
      deleteProperty(target, prop) {
        var s = sources.get(prop);
        if (s === void 0) {
          if (prop in target) {
            const s2 = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
            sources.set(prop, s2);
            increment(version);
          }
        } else {
          set(s, UNINITIALIZED);
          increment(version);
        }
        return true;
      },
      get(target, prop, receiver) {
        if (prop === STATE_SYMBOL) {
          return value;
        }
        var s = sources.get(prop);
        var exists = prop in target;
        if (s === void 0 && (!exists || get_descriptor(target, prop)?.writable)) {
          s = with_parent(() => {
            var p = proxy(exists ? target[prop] : UNINITIALIZED);
            var s2 = /* @__PURE__ */ state(p);
            return s2;
          });
          sources.set(prop, s);
        }
        if (s !== void 0) {
          var v = get(s);
          return v === UNINITIALIZED ? void 0 : v;
        }
        return Reflect.get(target, prop, receiver);
      },
      getOwnPropertyDescriptor(target, prop) {
        this.has?.(target, prop);
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
        var s = sources.get(prop);
        if (s !== void 0) {
          var value2 = get(s);
          if (value2 === UNINITIALIZED) {
            return void 0;
          }
          if (descriptor && "value" in descriptor) {
            descriptor.value = value2;
          } else {
            return {
              enumerable: true,
              configurable: true,
              value: value2,
              writable: true
            };
          }
        }
        return descriptor;
      },
      has(target, prop) {
        if (prop === STATE_SYMBOL) {
          return true;
        }
        var s = sources.get(prop);
        var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop);
        if (s !== void 0 || (active_effect !== null || active_reaction !== null) && (!has || get_descriptor(target, prop)?.writable)) {
          if (s === void 0) {
            s = with_parent(() => {
              var p = has ? proxy(target[prop]) : UNINITIALIZED;
              var s2 = /* @__PURE__ */ state(p);
              return s2;
            });
            sources.set(prop, s);
          }
          var value2 = get(s);
          if (value2 === UNINITIALIZED) {
            return false;
          }
        }
        return has;
      },
      set(target, prop, value2, receiver) {
        var s = sources.get(prop);
        var has = prop in target;
        if (is_proxied_array && prop === "length") {
          for (var i = value2; i < /** @type {Source<number>} */
          s.v; i += 1) {
            var other_s = sources.get(i + "");
            if (other_s !== void 0) {
              set(other_s, UNINITIALIZED);
            } else if (i in target) {
              other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED));
              sources.set(i + "", other_s);
            }
          }
        }
        if (s === void 0) {
          if (!has || get_descriptor(target, prop)?.writable) {
            s = with_parent(() => /* @__PURE__ */ state(void 0));
            set(s, proxy(value2));
            sources.set(prop, s);
          }
        } else {
          has = s.v !== UNINITIALIZED;
          var p = with_parent(() => proxy(value2));
          set(s, p);
        }
        var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
        if (descriptor?.set) {
          descriptor.set.call(receiver, value2);
        }
        if (!has) {
          if (is_proxied_array && typeof prop === "string") {
            var ls = (
              /** @type {Source<number>} */
              sources.get("length")
            );
            var n = Number(prop);
            if (Number.isInteger(n) && n >= ls.v) {
              set(ls, n + 1);
            }
          }
          increment(version);
        }
        return true;
      },
      ownKeys(target) {
        get(version);
        var own_keys = Reflect.ownKeys(target).filter((key2) => {
          var source3 = sources.get(key2);
          return source3 === void 0 || source3.v !== UNINITIALIZED;
        });
        for (var [key, source2] of sources) {
          if (source2.v !== UNINITIALIZED && !(key in target)) {
            own_keys.push(key);
          }
        }
        return own_keys;
      },
      setPrototypeOf() {
        state_prototype_fixed();
      }
    }
  );
}
let current_renderer = null;
var first_child_getter;
var next_sibling_getter;
function create_text(value = "") {
  return document.createTextNode(value);
}
// @__NO_SIDE_EFFECTS__
function get_first_child(node) {
  return (
    /** @type {TemplateNode | null} */
    first_child_getter.call(node)
  );
}
// @__NO_SIDE_EFFECTS__
function get_next_sibling(node) {
  return (
    /** @type {TemplateNode | null} */
    next_sibling_getter.call(node)
  );
}
function clear_text_content(node) {
  node.textContent = "";
}
function create_fragment() {
  return document.createDocumentFragment();
}
function node_type(node) {
  if (node == null) return void 0;
  return node.nodeType;
}
function get_parent_node(node) {
  return (
    /** @type {TemplateNode | null} */
    node.parentNode
  );
}
function append_child(parent, child) {
  return parent.appendChild(child);
}
function insert_before(ref_node, new_node) {
  ref_node.before(new_node);
}
function remove_node(node) {
  node.remove();
}
function remove_child(parent, child) {
  return (
    /** @type {ChildNode} */
    parent.removeChild(child)
  );
}
function get_node_value(node) {
  return node.nodeValue;
}
function handle_error(error) {
  var effect = active_effect;
  if (effect === null) {
    return error;
  }
  if ((effect.f & REACTION_RAN) === 0 && (effect.f & EFFECT) === 0) {
    throw error;
  }
  invoke_error_boundary(error, effect);
}
function invoke_error_boundary(error, effect) {
  if (error === HYDRATION_ERROR) {
    throw error;
  }
  if (effect !== null && (effect.f & DESTROYED) !== 0) {
    return;
  }
  while (effect !== null) {
    if ((effect.f & BOUNDARY_EFFECT) !== 0 && (effect.f & (DESTROYED | DESTROYING)) === 0) {
      if ((effect.f & REACTION_RAN) === 0) {
        throw error;
      }
      try {
        effect.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect = effect.parent;
  }
  throw error;
}
const STATUS_MASK = -7169;
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function update_derived_status(derived2) {
  if ((derived2.f & CONNECTED) !== 0 || derived2.edges === null) {
    set_signal_status(derived2, CLEAN);
  } else {
    set_signal_status(derived2, MAYBE_DIRTY);
  }
}
let component_context = null;
function set_component_context(context) {
  component_context = context;
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    i: false,
    c: null,
    e: null,
    s: props,
    x: null,
    r: (
      /** @type {Effect} */
      active_effect
    ),
    l: null
  };
}
function pop(component) {
  var context = (
    /** @type {ComponentContext} */
    component_context
  );
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  context.i = true;
  component_context = context.p;
  return mark_as_component(component);
}
function mark_as_component(component = {}) {
  define_property(component, COMPONENT_SYMBOL, { value: true });
  return component;
}
function is_runes() {
  return true;
}
function merge_target(batch) {
  while (batch.merged !== null) batch = batch.merged;
  return batch;
}
let first_batch = null;
let last_batch = null;
let current_batch = null;
let processing_batch = null;
let teardown_context = null;
function set_teardown_context(context) {
  teardown_context = context;
}
function push_teardown_context(values) {
  var context = teardown_context = {
    reverted_values: new Map(teardown_context?.reverted_values),
    derived_cache: /* @__PURE__ */ new Map(),
    parent: teardown_context
  };
  for (const [source2, value] of values ?? []) context.reverted_values.set(source2, value);
  return context;
}
function teardown_write(source2) {
  for (var context = teardown_context; context !== null; context = context.parent) {
    context.reverted_values.delete(source2);
    context.derived_cache.clear();
  }
}
let batch_values = null;
let view_cache = null;
let view_batch = null;
let last_scheduled_effect = null;
var rebases = /* @__PURE__ */ new Set();
let is_flushing_sync = false;
let collected_effects = null;
let legacy_updates = null;
var flush_count = 0;
var seen = null;
var count_deps = 0;
let uid = 1;
let last_processed = null;
class Batch {
  id = uid++;
  /** True as soon as `#process` was called */
  started = false;
  linked = true;
  /** @type {Batch | null} */
  prev = null;
  /** @type {Batch | null} */
  next = null;
  /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
  async_deriveds = /* @__PURE__ */ new Map();
  /**
   * The current values (and their versions) of any sources that are updated in this batch,
   * including deriveds that were overridden via assignment — until it commits them (see `#commit`).
   * Its keys are those of `this.previous`, plus the sources this batch gave their first value. `e` says whether
   * the value is an error
   * @type {Map<Value, BatchValue>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values (and their versions) of any sources that are updated in this batch _before_ those updates took place.
   * For a derived, `assigned` says whether its value before was assigned, too (otherwise it was computed).
   * A source that this batch gave its first value (e.g. an async expression that resolved for the first time) has
   * no entry: there's no value from before it, so other views can't undo the write, and teardowns don't revert it.
   * @type {Map<Value, BatchValue>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * Results of reactions that belong to this batch rather than to the real world:
   * deriveds evaluated in this batch's view of the world with values that are not the
   * latest ones, and block/async effects that ran while this batch was processed.
   * Effect records become global state when the batch commits (see `promote_record`)
   * @type {Map<Reaction, BatchRecord> | null}
   */
  records = null;
  /**
   * Earlier batches whose changes are part of this batch's view of the world, because
   * they intersect with it (this batch will be merged into them, see `#merge`)
   * @type {Batch[]}
   */
  folded = [];
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks.
   * Each callback maps to the writes that apply in the teardowns it causes, if it was added
   * while block effects re-ran eagerly (see `eager_block_writes`)
   * @type {Map<(batch: Batch) => void, Map<Value, BatchValue> | null>}
   */
  #commit_callbacks = /* @__PURE__ */ new Map();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * (see `#commit_callbacks`)
   * @type {Map<(batch: Batch) => void, Map<Value, BatchValue> | null>}
   */
  #discard_callbacks = /* @__PURE__ */ new Map();
  /**
   * Async effects that are currently in flight
   * @type {Map<Effect, number>}
   */
  #pending = /* @__PURE__ */ new Map();
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #deferred = null;
  /**
   * Effects to (re-)validate when this batch is processed next, and their status (DIRTY or MAYBE_DIRTY):
   * those that were scheduled while it wasn't being processed (see {@link schedule}), and those whose run
   * was deferred because it has pending work (see `#defer_effects`)
   * @type {Map<Effect, number>}
   */
  #unprocessed = /* @__PURE__ */ new Map();
  /**
   * Effects that were scheduled in this batch but not yet 'resolved' into the
   * root effects that need to be flushed. Resolving — the upwards traversal that
   * marks the path to each effect on the shared effect tree (see #resolve) — is
   * deferred until the batch is processed, so that the markers are created and
   * consumed within a single traversal. Scheduling into other batches (which can
   * happen concurrently, e.g. while a batch is committed) can therefore never
   * observe (and be confused by) this batch's markers.
   * May contain duplicates — deduplication happens during resolving
   * @type {Effect[]}
   */
  #scheduled = [];
  /**
   * Branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `#process`
   * @type {Set<Effect>}
   */
  #skipped_branches = /* @__PURE__ */ new Set();
  /**
   * Branches that this batch selected (see `unskip_effect`). A branch that is offscreen until
   * it is committed (see `EFFECT_OFFSCREEN`) only exists in the views of the batches that selected it
   * @type {Set<Effect>}
   */
  #unskipped_branches = /* @__PURE__ */ new Set();
  is_fork = false;
  /**
   * The batch that this one was merged into, if any (see `#merge`). Its async work that is still in flight
   * continues as part of that one
   * @type {Batch | null}
   */
  merged = null;
  /**
   * Batches whose runs this batch aborted. Merge into them before waiting for pending work.
   * Requests belong to this batch because a synchronous derived can abort outside traversal,
   * before an unrelated batch is processed (e.g. a fork being committed).
   * @type {Set<Batch>}
   */
  merge_requests = /* @__PURE__ */ new Set();
  #decrement_queued = false;
  constructor() {
    if (last_batch === null) {
      first_batch = last_batch = this;
    } else {
      last_batch.next = this;
      this.prev = last_batch;
    }
    last_batch = this;
  }
  #is_deferred() {
    if (this.is_fork) return true;
    for (const effect of this.#pending.keys()) {
      if (this.is_blocked_by(effect)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Whether `effect` is a branch that this batch skips, or that only exists offscreen for other batches
   * @param {Effect} effect
   */
  #skips(effect) {
    return this.#skipped_branches.has(effect) || (effect.f & EFFECT_OFFSCREEN) !== 0 && !this.#unskipped_branches.has(effect);
  }
  /**
   * Whether `effect` is inside a branch that this batch skips, i.e. doesn't exist in its view of the world
   * @param {Effect} effect
   */
  is_skipped(effect) {
    for (var e = (
      /** @type {Effect | null} */
      effect
    ); e !== null; e = e.parent) {
      if (this.#skips(e)) return true;
    }
    return false;
  }
  /**
   * Whether async work in `effect` holds up this batch — or, with `root`, the boundary whose content `root` is.
   * It doesn't if the effect is inside a branch that this batch skips (the branch is going to be destroyed),
   * or inside a boundary that is pending (which shows its pending snippet in the meantime).
   * Unlike a skipped branch, the content of a pending boundary does exist in the view of the batch: its
   * effects are still re-validated (see `#revalidate`), they just don't keep the batch from committing
   * @param {Effect} effect
   * @param {Effect | null} [root]
   */
  is_blocked_by(effect, root2 = null) {
    for (var e = (
      /** @type {Effect | null} */
      effect
    ); e !== null && e !== root2; e = e.parent) {
      if (this.#skips(e)) return false;
      if ((e.f & (BOUNDARY_EFFECT | DESTROYED)) === BOUNDARY_EFFECT && /** @type {Boundary} */
      e.b.is_pending) {
        return false;
      }
    }
    return true;
  }
  /**
   * @param {Effect} effect
   */
  skip_effect(effect) {
    this.#skipped_branches.add(effect);
    this.#unskipped_branches.delete(effect);
  }
  /**
   * @param {Effect} effect
   */
  unskip_effect(effect) {
    if (this.#skipped_branches.delete(effect) || !this.#unskipped_branches.has(effect) && ((effect.f & EFFECT_OFFSCREEN) !== 0 || this.folded.some((batch) => batch.#skipped_branches.has(effect)))) {
      this.revalidate_branch(effect);
    }
    this.#unskipped_branches.add(effect);
  }
  /**
   * Like `unskip_effect`, for a branch that was just created offscreen while this batch is processed.
   * Its effects ran in this batch's view of the world when they were created, so there's nothing to re-validate
   * TODO can we skip revalidation in `unskip_effect` in more cases, by detecting whether things changed
   * inside a branch while it was skipped?
   * @param {Effect} effect
   */
  unskip_new_effect(effect) {
    this.#unskipped_branches.add(effect);
  }
  /**
   * @param {Effect} effect
   */
  revalidate_branch(effect) {
    for (var e = effect.first; e !== null; e = e.next) {
      var flags2 = e.f;
      if ((flags2 & (DESTROYED | INERT)) === 0 && !this.#skips(e)) {
        if ((flags2 & (BRANCH_EFFECT | ROOT_EFFECT | EAGER_EFFECT)) === 0 && e.fn !== null) {
          this.schedule(e, MAYBE_DIRTY);
        }
        this.revalidate_branch(e);
      }
    }
  }
  /**
   * Convert the effects that were scheduled in this batch into the root effects
   * that need to be traversed, marking the path to each effect (by clearing the
   * `CLEAN` flag on ancestor branches) so that the traversal can find them.
   * This happens right before traversal rather than at scheduling time, so that
   * the markers left on the (shared) effect tree are created and consumed within
   * a single traversal — scheduling into other batches can never observe them
   * @returns {Effect[]}
   */
  #resolve() {
    var roots = [];
    for (const effect of this.#scheduled) {
      if ((effect.f & DESTROYED) !== 0 || (effect.f & (DIRTY | MAYBE_DIRTY)) === 0) continue;
      var e = effect;
      var covered = false;
      while (e.parent !== null) {
        e = e.parent;
        var flags2 = e.f;
        if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
          if ((flags2 & CLEAN) === 0) {
            covered = true;
            break;
          }
          e.f ^= CLEAN;
        }
      }
      if (!covered) {
        roots.push(e);
      }
    }
    this.#scheduled = [];
    return roots;
  }
  #process() {
    current_batch = processing_batch = this;
    teardown_context?.derived_cache.clear();
    this.started = true;
    last_processed = this.id;
    if (this.#unprocessed.size > 0) {
      for (const [e, status] of this.#unprocessed) this.#add(e, status);
      this.#unprocessed.clear();
    }
    this.activate();
    var effects = collected_effects = [];
    var render_effects = [];
    var revealed_boundaries = [];
    var updates = legacy_updates = [];
    while (this.#scheduled.length > 0) {
      if (flush_count++ > 1e3) {
        this.#unlink();
        infinite_loop_guard();
      }
      for (const root2 of this.#resolve()) {
        try {
          this.#traverse(root2, effects, render_effects, revealed_boundaries);
        } catch (e) {
          reset_branch(root2, true);
          if (!this.#is_deferred()) this.discard();
          throw e;
        }
      }
      if (this.#scheduled.length > 0) {
        for (const effect of render_effects) this.#scheduled.push(effect);
        for (const effect of effects) this.#scheduled.push(effect);
        render_effects.length = 0;
        effects.length = 0;
      }
    }
    current_batch = null;
    if (updates.length > 0) {
      var batch = Batch.ensure();
      for (const e of updates) {
        if ((e.f & CLEAN) === 0) batch.schedule(e, MAYBE_DIRTY);
      }
    }
    collected_effects = null;
    legacy_updates = null;
    if (this.merge_requests.size > 0) {
      const sorted = Array.from(this.merge_requests, merge_target).filter((batch2) => batch2 !== this && batch2.linked && !batch2.is_fork).sort((a, b) => a.id - b.id);
      this.merge_requests.clear();
      if (sorted.length > 0) {
        this.#defer_effects(render_effects);
        this.#defer_effects(effects);
        var target = this;
        var i = sorted.length;
        while (i--) {
          var earlier = sorted[i];
          if (earlier === target) continue;
          earlier.#merge(target);
          target = earlier;
        }
        target.#process();
        return;
      }
    }
    if (this.#is_deferred()) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      for (const e of this.#skipped_branches) {
        reset_branch(e);
      }
      if (updates.length > 0) {
        /** @type {unknown} */
        current_batch.#process();
      }
      return;
    }
    const earlier_batch = this.#find_earlier_batch();
    if (earlier_batch) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      earlier_batch.#merge(this);
      earlier_batch.#process();
      return;
    }
    for (const boundary2 of revealed_boundaries) {
      if (boundary2.is_pending && boundary2.is_ready(this)) {
        boundary2.reveal(effects);
      }
    }
    this.#release_records(true);
    this.#run_callbacks(this.#commit_callbacks);
    var earlier_writes = flush_queued_effects(render_effects);
    flush_queued_effects(effects, earlier_writes);
    this.#deferred?.resolve();
    var next_batch = (
      /** @type {Batch | null} */
      /** @type {unknown} */
      current_batch
    );
    if (this.#pending.size === 0 && (this.#scheduled.length === 0 || next_batch !== null)) {
      this.#unlink();
    }
    if (next_batch !== null) {
      if (teardown_context !== null) {
        for (const [source2, snapshot] of teardown_context.reverted_values) {
          if (next_batch.previous.get(source2)?.wv !== snapshot.wv) {
            teardown_context.reverted_values.delete(source2);
          }
        }
      }
      next_batch.#process();
    }
  }
  /**
   * Schedule the reactions that (transitively) depend on `sources` for re-validation in this batch.
   * They are marked MAYBE_DIRTY, which means that they are only re-run if the exact versions
   * of their dependencies differ from the ones they last saw (in this batch's view of the world)
   * @param {Iterable<Source>} sources
   */
  #revalidate(sources) {
    var values = new Set(sources);
    var effects = /* @__PURE__ */ new Set();
    for (const value of values) {
      var reactions = value.reactions;
      if (reactions === null) continue;
      for (const reaction of reactions) {
        var flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          if ((flags2 & CLEAN) !== 0) set_signal_status(reaction, MAYBE_DIRTY);
          values.add(
            /** @type {Derived} */
            reaction
          );
          continue;
        }
        var effect = (
          /** @type {Effect} */
          reaction
        );
        if (effects.has(effect)) continue;
        effects.add(effect);
        if ((flags2 & (EAGER_EFFECT | INERT | DESTROYED)) === 0 && // branches that this batch skips don't exist in its view of the world
        !this.is_skipped(effect)) {
          this.schedule(effect, MAYBE_DIRTY);
        }
      }
    }
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {Effect[]} effects
   * @param {Effect[]} render_effects
   * @param {Boundary[]} revealed_boundaries
   */
  #traverse(root2, effects, render_effects, revealed_boundaries) {
    root2.f ^= CLEAN;
    var effect = root2.first;
    while (effect !== null) {
      var flags2 = effect.f;
      var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags2 & (INERT | EAGER_EFFECT)) !== 0 || this.#skips(effect);
      if (!skip && effect.fn !== null) {
        if (is_branch) {
          effect.f ^= CLEAN;
        } else if ((flags2 & EFFECT) !== 0) {
          effects.push(effect);
        } else if (is_dirty(effect)) {
          update_effect(effect);
        }
        var child = effect.first;
        if (child !== null) {
          effect = child;
          continue;
        }
      }
      while (effect !== null) {
        if ((effect.f & (BOUNDARY_EFFECT | DESTROYED)) === BOUNDARY_EFFECT) {
          var boundary2 = (
            /** @type {Boundary} */
            effect.b
          );
          if (boundary2.is_pending && boundary2.is_ready(this)) {
            revealed_boundaries.push(boundary2);
          }
        }
        var next2 = effect.next;
        if (next2 !== null) {
          effect = next2;
          break;
        }
        effect = effect.parent;
      }
    }
  }
  #find_earlier_batch() {
    for (var batch = this.prev; batch !== null; batch = batch.prev) {
      if (!batch.is_fork && this.#intersects(batch)) return batch;
    }
    return null;
  }
  /** @param {Batch} batch */
  #intersects(batch) {
    for (const source2 of this.current.keys()) {
      if (batch.current.has(source2)) return true;
    }
    return false;
  }
  /**
   * Take over the writes of a later batch that depends on this one, because it finished first
   * or aborted one of this batch's runs.
   * Values it produced (async results, deriveds) remain valid; block effects select their
   * branches again for this batch, if needed (their selections are keyed by batch)
   * @param {Batch} batch
   */
  #merge(batch) {
    for (const target of batch.merge_requests) this.merge_requests.add(target);
    batch.merge_requests.clear();
    for (const [source2, entry] of batch.current) {
      if (!this.previous.has(source2)) {
        const previous = batch.previous.get(source2);
        if (previous) this.previous.set(source2, previous);
      }
      this.current.set(source2, entry);
    }
    for (const [effect, deferred2] of batch.async_deriveds) {
      const d = this.async_deriveds.get(effect);
      if (d && d !== deferred2) deferred2.promise.then(d.resolve, d.reject);
      this.async_deriveds.set(effect, deferred2);
    }
    for (const [reaction, record] of batch.records ?? []) {
      if ((reaction.f & BLOCK_EFFECT) === 0) {
        var replaced = this.records?.get(reaction);
        (this.records ??= /* @__PURE__ */ new Map()).set(reaction, record);
        batch.records?.delete(reaction);
        abort_record(reaction, replaced);
      }
    }
    batch.async_deriveds.clear();
    if (batch.#pending.size > 0) {
      for (const [effect, count] of batch.#pending) {
        this.#pending.set(effect, (this.#pending.get(effect) ?? 0) + count);
      }
      batch.#pending.clear();
    }
    if (batch.#unprocessed.size > 0) {
      for (const [effect, status] of batch.#unprocessed) {
        this.#add_dirty_effect(effect, status);
      }
      batch.#unprocessed.clear();
    }
    const discard = () => batch.discard();
    this.oncommit(discard);
    this.ondiscard(discard);
    batch.merged = this;
    batch.#unlink();
  }
  /**
   * Note that `effect` needs to be (re-)validated, without downgrading a DIRTY effect to MAYBE_DIRTY
   * @param {Effect} effect
   * @param {number} status DIRTY or MAYBE_DIRTY
   */
  #add_dirty_effect(effect, status) {
    if (status === DIRTY || this.#unprocessed.get(effect) !== DIRTY) {
      this.#unprocessed.set(effect, status);
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #defer_effects(effects) {
    for (var i = 0; i < effects.length; i += 1) {
      var effect = effects[i];
      var status = effect.f & (DIRTY | MAYBE_DIRTY);
      if (status !== 0) {
        this.#add_dirty_effect(effect, effect.dv === null ? MAYBE_DIRTY : status);
        set_signal_status(effect, CLEAN);
      }
    }
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values (and versions).
   * The source itself is only updated if this is its latest value, i.e. unless this
   * is a fork (whose writes only exist in its own view of the world) or a later batch
   * already wrote to it (e.g. because an async expression resolved in an earlier batch).
   * @param {Value} source
   * @param {any} value
   * @param {boolean} same whether the value equals the real one (it can, if this batch sees another one, see
   * `internal_set`) — in which case the source isn't updated, and the value gets the same version
   * @param {boolean} [error] whether the value is an error (thrown when read, see `runtime.js#get`)
   * @param {Effect[] | null} [updated_during_traversal]
   */
  capture(source2, value, same, error = false, updated_during_traversal = null) {
    var previous = this.previous.get(source2);
    var later = later_writer(this, source2);
    if (previous === void 0) {
      previous = later?.previous.get(source2);
      if (previous === void 0 && source2.v !== UNINITIALIZED) {
        previous = {
          v: source2.v,
          wv: source2.wv,
          e: (source2.f & ERROR_VALUE) !== 0,
          assigned: (source2.f & ASSIGNED) !== 0
        };
      }
      if (previous !== void 0) this.previous.set(source2, previous);
    }
    if (is_destroying_effect) {
      teardown_write(source2);
    } else if (previous !== void 0) {
      teardown_context?.reverted_values.set(source2, previous);
      teardown_context?.derived_cache.clear();
    }
    var entry = {
      v: value,
      wv: same ? source2.wv : increment_write_version(),
      e: error,
      // a write to a derived is an assignment
      assigned: (source2.f & DERIVED) !== 0,
      async: (source2.f & ASYNC) !== 0
    };
    this.current.set(source2, entry);
    batch_values?.set(source2, entry);
    view_cache?.delete(
      /** @type {Derived} */
      source2
    );
    if (!this.is_fork && later !== null) later.previous.set(source2, entry);
    if (!this.is_fork && !same && later === null) {
      apply(source2, entry);
    }
    if (!same) {
      seen = null;
      count_deps = 0;
      this.mark(source2, DIRTY, updated_during_traversal);
      seen = null;
      if (eager_effects.size > 0 && !eager_effects_deferred) {
        flush_eager_effects();
      }
    }
  }
  deactivate() {
    current_batch = processing_batch = batch_values = view_cache = view_batch = null;
  }
  flush() {
    var context = push_teardown_context(this.previous);
    try {
      this.#process();
      if (rebases.size > 0) {
        for (const batch of rebases) {
          rebases.delete(batch);
          if (batch.linked && !batch.#decrement_queued) {
            batch.#process();
          }
        }
      }
    } finally {
      flush_count = 0;
      last_scheduled_effect = null;
      collected_effects = null;
      legacy_updates = null;
      teardown_context = context.parent;
      this.deactivate();
    }
  }
  discard() {
    this.#run_callbacks(this.#discard_callbacks);
    for (const deferred2 of this.async_deriveds.values()) {
      deferred2.reject(OBSOLETE);
    }
    this.#unlink();
    this.#deferred?.resolve();
  }
  #commit() {
    for (let batch = first_batch; batch !== null; batch = batch.next) {
      if (batch === this) continue;
      var is_earlier = batch.id < this.id;
      var sources = [];
      for (const [source2, entry] of this.current) {
        var own = batch.current.get(source2);
        if (own !== void 0) {
          if (is_earlier && entry.v !== own.v && !own.async) {
            batch.current.set(source2, entry);
          } else {
            continue;
          }
        }
        sources.push(source2);
      }
      if (!batch.started || batch.current.size === 0) continue;
      var obsolete = true;
      for (const source2 of batch.current.keys()) {
        if (!this.current.has(source2)) {
          obsolete = false;
          break;
        }
      }
      if (obsolete && is_earlier) {
        batch.discard();
      } else if (sources.length > 0) {
        batch.#revalidate(sources);
        rebases.add(batch);
      }
    }
    this.current.clear();
    this.previous.clear();
  }
  /**
   * Make this batch's writes the real world, part of every other batch's view (see `#commit`).
   * If it has pending work it stays linked, coming first from now on (see `#move_to_front`)
   */
  commit_writes() {
    this.#commit();
    if (this.linked && this.prev !== null) this.#move_to_front();
  }
  /**
   * @param {Effect} effect
   */
  increment(effect) {
    var count = this.#pending.get(effect) ?? 0;
    this.#pending.set(effect, count + 1);
  }
  /**
   * @param {Effect} effect
   */
  decrement(effect) {
    var count = this.#pending.get(effect) ?? 0;
    if (count === 1) {
      this.#pending.delete(effect);
    } else {
      this.#pending.set(effect, count - 1);
    }
    if (this.#decrement_queued) return;
    this.#decrement_queued = true;
    queue_micro_task(() => {
      this.#decrement_queued = false;
      if (this.linked) {
        this.flush();
      }
    });
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(fn) {
    this.#commit_callbacks.set(fn, eager_block_writes?.size ? eager_block_writes : null);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(fn) {
    this.#discard_callbacks.set(fn, eager_block_writes?.size ? eager_block_writes : null);
  }
  /**
   * Runs the commit/discard callbacks.
   * A callback that was added while block effects re-ran eagerly detaches the branches that such a run
   * deselected (see `flush_queued_effects`). The teardowns it causes see the writes that applied in the
   * run's view, like they would have during the run: of the values that the current teardown context
   * reverts, the writes of the effects that ran before the one whose writes caused the run are restored.
   * Callbacks run untracked, because a batch can commit while an effect runs (e.g. one that calls `flushSync`)
   * @param {Map<(batch: Batch) => void, Map<Value, BatchValue> | null>} callbacks
   */
  #run_callbacks(callbacks) {
    untrack(() => {
      for (const [fn, writes] of callbacks) {
        if (writes === null) {
          fn(this);
          continue;
        }
        var context = push_teardown_context();
        for (const [source2, write] of writes) {
          if (context.reverted_values.has(source2)) context.reverted_values.set(source2, write);
        }
        try {
          fn(this);
        } finally {
          teardown_context = context.parent;
        }
      }
    });
    callbacks.clear();
  }
  settled() {
    return (this.#deferred ??= deferred()).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new Batch();
      if (processing_batch === null && !is_flushing_sync) {
        queue_micro_task(() => {
          if (!batch.started) {
            batch.flush();
          }
        });
      }
    }
    return current_batch;
  }
  /**
   * Make this the current batch, and its view of the world the active one
   */
  activate() {
    current_batch = this;
    view_batch = this;
    if (last_processed !== this.id) last_processed = null;
    {
      batch_values = view_cache = null;
      return;
    }
  }
  /**
   * The record of `reaction` in this batch's view of the world, i.e. that of this batch
   * or of the (earlier) batches whose changes it includes, if any
   * @param {Reaction} reaction
   * @returns {BatchRecord | undefined}
   */
  get_record(reaction) {
    var record = this.records?.get(reaction);
    var i = this.folded.length;
    while (record === void 0 && i--) {
      record = this.folded[i].records?.get(reaction);
    }
    return record;
  }
  /**
   * @param {Value} signal
   * @param {number} status should be DIRTY or MAYBE_DIRTY
   * @param {Effect[] | null} [updated_during_traversal]
   * @returns {void}
   */
  mark(signal, status, updated_during_traversal = null) {
    var reactions = signal.reactions;
    if (reactions === null) return;
    var length = reactions.length;
    count_deps += length;
    if (count_deps > 1e5 && seen === null) seen = /* @__PURE__ */ new Set();
    if (seen !== null) {
      if (seen.has(signal)) return;
      seen.add(signal);
    }
    for (var i = 0; i < length; i++) {
      var reaction = reactions[i];
      var flags2 = reaction.f;
      var not_dirty = (flags2 & DIRTY) === 0;
      if ((flags2 & EAGER_EFFECT) !== 0) {
        if (!this.is_fork) {
          if (not_dirty) {
            set_signal_status(reaction, status);
          }
          eager_effects.add(
            /** @type {Effect} */
            reaction
          );
        }
      } else if ((flags2 & DERIVED) !== 0) {
        if (not_dirty) {
          set_signal_status(reaction, status);
        }
        var derived2 = (
          /** @type {Derived} */
          reaction
        );
        view_cache?.delete(derived2);
        this.mark(derived2, MAYBE_DIRTY, updated_during_traversal);
      } else if (not_dirty) {
        var effect = (
          /** @type {Effect} */
          reaction
        );
        if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
          set_signal_status(effect, status);
          eager_block_effects.add(effect);
        }
        if (updated_during_traversal !== null) {
          set_signal_status(effect, status);
          updated_during_traversal.push(effect);
        } else {
          this.schedule(effect, status);
        }
      }
    }
  }
  /**
   * Schedule `effect` to be (re-)validated when this batch is processed. Its status only applies right
   * away if this is the batch that the current flush processes (next), or if a reaction is running (which
   * may have read what changed). Otherwise, whether an effect is dirty depends on this batch's view of the
   * world, so other batches (which may be processed first) mustn't see it: it is kept with this batch until
   * it is processed, and then checked against the exact versions of its dependencies (i.e. MAYBE_DIRTY)
   * @param {Effect} effect
   * @param {number} status DIRTY or MAYBE_DIRTY
   */
  schedule(effect, status) {
    last_scheduled_effect = effect;
    if (view_batch !== null && view_batch !== this && effect !== active_reaction) {
      this.#add_dirty_effect(
        effect,
        (effect.f & REACTION_IS_UPDATING) !== 0 ? status : MAYBE_DIRTY
      );
      return;
    }
    if (processing_batch !== this && active_reaction === null) {
      if (this.prev !== null || this.next !== null || this.is_fork) {
        this.#add_dirty_effect(effect, MAYBE_DIRTY);
        return;
      }
      status = MAYBE_DIRTY;
    }
    this.#add(effect, status);
  }
  /**
   * @param {Effect} effect
   * @param {number} status
   */
  #add(effect, status) {
    if ((effect.f & DIRTY) === 0) {
      set_signal_status(effect, status);
    }
    this.#scheduled.push(effect);
  }
  /** @param {boolean} commit whether the effects' runs become global state */
  #release_records(commit = false) {
    var records = this.records;
    if (records === null) return;
    this.records = null;
    for (const [reaction, record] of records) {
      if ((reaction.f & (DERIVED | DESTROYED)) === 0) {
        var replaced = (reaction.f & ASYNC) !== 0 && is_outdated(record) && !is_outdated(reaction);
        if (commit && !replaced) {
          promote_record(reaction, record);
          if ((reaction.f & ASYNC) !== 0) {
            for (let b = first_batch; b !== null; b = b.next) {
              if (b !== this && !b.records?.has(reaction)) {
                b.async_deriveds.get(
                  /** @type {Effect} */
                  reaction
                )?.reject(OBSOLETE);
              }
            }
          }
        }
        prune_edges(reaction);
      }
      abort_record(reaction, record);
    }
  }
  /**
   * A batch that committed while work inside a pending boundary was in flight stays linked, so that the results
   * arrive in it. Its writes are the real world now, part of every other batch's view, so it comes first from now
   * on: This ensures logic about who sees what values in intersects/merge/etc work correctly.
   */
  #move_to_front() {
    var prev = (
      /** @type {Batch} */
      this.prev
    );
    var first = (
      /** @type {Batch} */
      first_batch
    );
    prev.next = this.next;
    if (this.next === null) last_batch = prev;
    else this.next.prev = prev;
    this.prev = null;
    this.next = first;
    first.prev = first_batch = this;
    this.id = first.id - 1;
  }
  #unlink() {
    if (!this.linked) return;
    var prev = this.prev;
    var next2 = this.next;
    if (prev === null) {
      first_batch = next2;
    } else {
      prev.next = next2;
    }
    if (next2 === null) {
      last_batch = prev;
    } else {
      next2.prev = prev;
    }
    this.linked = false;
    this.#release_records();
  }
}
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  var previous_view_batch = view_batch !== current_batch ? view_batch : null;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) ;
    while (true) {
      flush_tasks();
      if (current_batch === null) {
        return (
          /** @type {T} */
          result
        );
      }
      current_batch.flush();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
    view_batch = previous_view_batch;
  }
}
function infinite_loop_guard() {
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
let eager_block_effects = null;
let eager_block_writes = null;
function defer_if_pending(effect) {
  if ((effect.f & (EFFECT | REACTION_RAN)) !== EFFECT) return false;
  for (var boundary2 = effect.b; boundary2 !== null; boundary2 = boundary2.parent) {
    if (boundary2.is_pending) {
      boundary2.defer_effect(effect);
      return true;
    }
  }
  return false;
}
function flush_queued_effects(effects, earlier_writes = null) {
  var length = effects.length;
  if (length === 0) return earlier_writes;
  var i = 0;
  while (i < length) {
    var effect = effects[i++];
    if ((effect.f & (DESTROYED | INERT)) === 0 && // don't run if already marked for destruction in the next batch
    // (this can happen if an effect writes a value which e.g. makes an if block falsy)
    !current_batch?.is_skipped(effect) && !defer_if_pending(effect) && is_dirty(effect)) {
      eager_block_effects = /* @__PURE__ */ new Set();
      var version = write_version;
      update_effect(effect);
      if (effect.edges === null && effect.first === null && effect.nodes === null && effect.teardown === null && effect.ac === null) {
        unlink_effect(effect);
      }
      if (eager_block_effects?.size > 0) {
        var previous_teardown_context = teardown_context;
        if (earlier_writes !== null) push_teardown_context(earlier_writes);
        var previous_eager_block_writes = eager_block_writes;
        eager_block_writes = new Map(earlier_writes);
        try {
          for (const e of eager_block_effects) {
            if ((e.f & (DESTROYED | INERT)) !== 0 || current_batch?.is_skipped(e)) continue;
            const ordered_effects = [e];
            let ancestor = e.parent;
            while (ancestor !== null) {
              if (eager_block_effects.has(ancestor)) {
                eager_block_effects.delete(ancestor);
                ordered_effects.push(ancestor);
              }
              ancestor = ancestor.parent;
            }
            for (let j = ordered_effects.length - 1; j >= 0; j--) {
              const e2 = ordered_effects[j];
              if ((e2.f & (DESTROYED | INERT)) !== 0 || current_batch?.is_skipped(e2)) continue;
              update_effect(e2);
            }
          }
        } finally {
          eager_block_writes = previous_eager_block_writes;
          eager_block_effects?.clear();
          teardown_context = previous_teardown_context;
        }
      }
      if (write_version !== version && current_batch !== null) {
        for (const [value, write] of current_batch.current) {
          if (write.wv > version) {
            (earlier_writes ??= /* @__PURE__ */ new Map()).set(value, write);
          }
        }
      }
    }
  }
  eager_block_effects = null;
  return earlier_writes;
}
function later_writer(batch, source2) {
  var later = batch.next;
  while (later !== null && (later.is_fork || !later.current.has(source2))) {
    later = later.next;
  }
  return later;
}
function apply(source2, entry) {
  source2.v = entry.v;
  source2.wv = entry.wv;
  source2.f = entry.e ? source2.f | ERROR_VALUE : source2.f & ~ERROR_VALUE;
  if ((source2.f & DERIVED) !== 0) {
    source2.f |= ASSIGNED;
    update_derived_status(
      /** @type {Derived} */
      source2
    );
  }
}
function in_real_world(fn) {
  var previous_batch_values = batch_values;
  var previous_view_cache = view_cache;
  var previous_view_batch = view_batch;
  batch_values = view_cache = view_batch = null;
  try {
    fn();
  } finally {
    batch_values = previous_batch_values;
    view_cache = previous_view_cache;
    view_batch = previous_view_batch;
  }
}
function reset_branch(effect, force = false) {
  if (!force && (effect.f & BRANCH_EFFECT) !== 0 && (effect.f & CLEAN) !== 0) {
    return;
  }
  set_signal_status(effect, CLEAN);
  var e = effect.first;
  while (e !== null) {
    reset_branch(e, force);
    e = e.next;
  }
}
let eager_effects = /* @__PURE__ */ new Set();
let eager_effects_deferred = false;
function source(v, stack) {
  var signal = {
    f: 0,
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  return signal;
}
// @__NO_SIDE_EFFECTS__
function state(v, stack) {
  const s = source(v);
  push_reaction_value(s);
  return s;
}
// @__NO_SIDE_EFFECTS__
function mutable_source(initial_value, immutable = false, trackable = true) {
  const s = source(initial_value);
  if (!immutable) {
    s.equals = safe_equals;
  }
  return s;
}
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !current_sources.has(source2))) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  return internal_set(source2, new_value, legacy_updates);
}
function internal_set(source2, value, updated_during_traversal = null) {
  var same = source2.equals(value) && (source2.f & ERROR_VALUE) === 0;
  var entry = batch_values?.get(source2);
  if (!same || entry !== void 0 && (entry.e || !source2.equals.call(entry, value))) {
    var batch = Batch.ensure();
    if ((source2.f & (DERIVED | DIRTY | ASSIGNED)) === (DERIVED | DIRTY)) {
      execute_derived(
        /** @type {Derived} */
        source2
      );
    }
    batch.capture(source2, value, same, false, updated_during_traversal);
    if (active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
  } else if (is_destroying_effect) {
    teardown_write(source2);
  }
  return value;
}
function flush_eager_effects() {
  eager_effects_deferred = false;
  in_real_world(run_eager_effects);
}
function run_eager_effects() {
  for (const effect of eager_effects) {
    if ((effect.f & CLEAN) !== 0) {
      set_signal_status(effect, MAYBE_DIRTY);
    }
    let dirty;
    try {
      dirty = is_dirty(effect);
    } catch {
      dirty = true;
    }
    if (dirty) {
      update_effect(effect);
    }
  }
  eager_effects.clear();
}
function increment(source2) {
  set(source2, source2.v + 1);
}
const OBSOLETE = Symbol("obsolete");
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0; i < effects.length; i += 1) {
      destroy_effect(
        /** @type {Effect} */
        effects[i]
      );
    }
  }
}
function execute_derived(derived2) {
  var prev_active_effect = active_effect;
  var parent = derived2.parent;
  if (!is_destroying_effect && parent !== null && derived2.v !== UNINITIALIZED && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
  (parent.f & (DESTROYED | INERT)) !== 0) {
    derived_inert();
    update_derived_status(derived2);
    return derived2.v;
  }
  set_active_effect(parent);
  try {
    destroy_derived_effects(derived2);
    return update_reaction(derived2);
  } finally {
    set_active_effect(prev_active_effect);
  }
}
function update_derived(signal) {
  var derived2 = (
    /** @type {Derived} */
    signal
  );
  if (!is_dirty(derived2)) return;
  var records = view_batch?.records;
  var record = records?.get(derived2);
  if (record !== void 0 && is_current(record.deps, record.dv)) {
    records.delete(derived2);
    promote_record(derived2, record);
  } else {
    execute_derived(derived2);
  }
}
function get_view(derived2) {
  var cache = (
    /** @type {Map<Derived, Derived | DerivedRecord | BatchValue>} */
    view_cache
  );
  var entry = cache.get(derived2);
  if (entry !== void 0) return entry;
  var batch = (
    /** @type {Batch} */
    view_batch
  );
  var written = (
    /** @type {Map<Value, BatchValue>} */
    batch_values.get(derived2)
  );
  var held = written ?? derived2;
  var assigned = written === void 0 ? (derived2.f & ASSIGNED) !== 0 : written.assigned;
  var record = (
    /** @type {DerivedRecord | undefined} */
    batch.get_record(derived2)
  );
  if (assigned && !changed_since((record ?? derived2).deps, held.wv)) {
    entry = held;
  } else if (record !== void 0 && is_current(record.deps, record.dv)) {
    entry = record;
  } else if (written === void 0 && !assigned && derived2.dv !== null && is_current(derived2.deps, derived2.dv)) {
    entry = derived2;
  } else {
    execute_derived(derived2);
    entry = /** @type {DerivedRecord | undefined} */
    batch.records?.get(derived2) ?? derived2;
  }
  if ((derived2.f & CONNECTED) !== 0) {
    cache.set(derived2, entry);
  }
  return entry;
}
function freeze_derived_effects(derived2) {
  if (derived2.effects === null) return;
  for (const e of derived2.effects) {
    if (e.teardown || (e.f & HAS_ABORT_CONTROLLER) !== 0) {
      e.teardown?.();
      abort_all(e);
      if (e.fn !== null) e.teardown = noop;
      remove_reactions(e);
      destroy_effect_children(e);
    }
  }
}
function unfreeze_derived_effects(derived2) {
  if (derived2.effects === null) return;
  for (const e of derived2.effects) {
    if (e.teardown && e.fn !== null) {
      update_effect(e);
    }
  }
}
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
let is_destroying_effect = false;
let teardown_version = 0;
function set_is_destroying_effect(value, version = write_version) {
  is_destroying_effect = value;
  teardown_version = version;
}
let teardown_run = { v: void 0, wv: 0, e: false, assigned: false };
let active_reaction = null;
let untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
let active_effect = null;
function set_active_effect(effect) {
  active_effect = effect;
}
let current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && ((active_reaction.f & REACTION_IS_UPDATING) !== 0 || (active_reaction.f & DERIVED) !== 0)) {
    (current_sources ??= /* @__PURE__ */ new Set()).add(value);
  }
}
let new_deps = null;
let skipped_deps = 0;
let untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
let write_version = 1;
let read_version = 0;
let update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
function increment_write_version() {
  return ++write_version;
}
function version_of(signal) {
  if (batch_values === null) {
    update_derived(signal);
    return signal.wv;
  }
  if ((signal.f & DERIVED) !== 0) {
    return get_view(
      /** @type {Derived} */
      signal
    ).wv;
  }
  return (batch_values.get(signal) ?? signal).wv;
}
function is_current(deps, dv) {
  if (deps !== null) {
    for (var i = 0; i < dv.length; i++) {
      if (version_of(deps[i]) !== dv[i]) return false;
    }
  }
  return true;
}
function changed_since(deps, wv, unchanged = null) {
  if (deps !== null) {
    for (var i = 0; i < deps.length; i++) {
      var dep = deps[i];
      if ((dep.f & DERIVED) === 0) {
        if (version_of(dep) > wv) return true;
        continue;
      }
      var run = (
        /** @type {Derived} */
        dep
      );
      if (batch_values === null) {
        update_derived(
          /** @type {Derived} */
          dep
        );
      } else {
        run = get_view(
          /** @type {Derived} */
          dep
        );
      }
      if (run.wv > wv) {
        var assigned = run === dep ? (dep.f & ASSIGNED) !== 0 : !("dv" in run);
        if (assigned) return true;
        if (unchanged === null) {
          unchanged = /* @__PURE__ */ new Set();
        } else if (unchanged.has(run)) {
          continue;
        }
        if (changed_since(
          /** @type {DerivedRecord} */
          run.deps,
          wv,
          unchanged
        )) {
          return true;
        }
        unchanged.add(run);
      }
    }
  }
  return false;
}
function run_of(reaction) {
  return (reaction.f & (BLOCK_EFFECT | ASYNC)) !== 0 && view_batch?.get_record(reaction) || reaction;
}
function is_dirty(reaction) {
  var flags2 = reaction.f;
  if ((flags2 & (DIRTY | MAYBE_DIRTY)) === 0) {
    return false;
  }
  if ((flags2 & ASSIGNED) !== 0) {
    if (changed_since(reaction.deps, reaction.wv)) return true;
  } else if ((flags2 & DIRTY) !== 0) {
    return true;
  } else {
    var run = run_of(reaction);
    var deps = run.deps;
    var dv = run.dv;
    if (dv === null) return true;
    if (batch_values === null) {
      for (var i = 0, length = dv.length; i < length; i++) {
        var dependency = (
          /** @type {Value[]} */
          deps[i]
        );
        update_derived(dependency);
        if (dependency.wv !== dv[i]) return true;
      }
    } else if (!is_current(deps, dv)) {
      return true;
    }
  }
  if ((flags2 & CONNECTED) !== 0) {
    set_signal_status(reaction, CLEAN);
  }
  return false;
}
function schedule_possible_effect_self_invalidation(signal, effect, root2 = true) {
  var reactions = signal.reactions;
  if (reactions === null) return;
  if (current_sources !== null && current_sources.has(signal)) {
    return;
  }
  for (var i = 0; i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(
        /** @type {Derived} */
        reaction,
        effect,
        false
      );
    } else if (effect === reaction) {
      current_batch.schedule(
        /** @type {Effect} */
        reaction,
        root2 ? DIRTY : MAYBE_DIRTY
      );
    }
  }
}
let abort_controller = null;
function abort_signal(controller) {
  if (controller) without_reactive_context(() => controller.abort(STALE_REACTION));
}
function abort_record(reaction, record, rerun = false) {
  if (!record?.ac) return;
  for (var b = first_batch; b !== null; b = b.next) {
    if (b.records?.get(reaction) === record && !(rerun && (b === view_batch || supersedes(current_batch, b)))) {
      return;
    }
  }
  abort_signal(record.ac);
  record.ac = null;
}
function abort_replaced(reaction, flags2) {
  var batch = current_batch;
  var is_derived = (flags2 & DERIVED) !== 0;
  if (is_derived && is_destroying_effect) return;
  var real = batch === null || !batch.is_fork;
  abort_record(reaction, view_batch?.records?.get(reaction), true);
  if (is_derived ? batch_values === null || real && is_outdated(reaction) : real) {
    abort_signal(reaction.ac);
  }
  for (var b = first_batch; b !== null; b = b.next) {
    if (supersedes(batch, b)) abort_record(reaction, b.records?.get(reaction), true);
  }
}
function set_global_signal(reaction) {
  abort_signal(reaction.ac);
  reaction.ac = abort_controller;
}
function is_outdated({ deps, dv }) {
  return dv === null || dv.some((version, i) => (
    /** @type {Value[]} */
    deps[i].wv !== version
  ));
}
function supersedes(batch, other) {
  return batch !== null && !batch.is_fork && !other.is_fork && other.id < batch.id && (batch_values === null || other.previous.size === 0 || batch.folded.includes(other));
}
function abort_all(reaction) {
  if ((reaction.f & HAS_ABORT_CONTROLLER) === 0) return false;
  reaction.f ^= HAS_ABORT_CONTROLLER;
  abort_signal(reaction.ac);
  reaction.ac = null;
  for (var b = first_batch; b !== null; b = b.next) {
    var record = b.records?.get(reaction);
    if (record?.ac) {
      abort_signal(record.ac);
      record.ac = null;
    }
  }
  return true;
}
function is_recorded_effect(flags2) {
  if ((flags2 & ASYNC) === 0 && (flags2 & (BLOCK_EFFECT | REACTION_RAN)) !== (BLOCK_EFFECT | REACTION_RAN)) {
    return false;
  }
  return view_batch !== null && view_batch === current_batch;
}
function update_reaction(reaction) {
  const batch = current_batch;
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags2 = reaction.f;
  new_deps = /** @type {null | Value[]} */
  null;
  skipped_deps = 0;
  untracked_writes = null;
  active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  var previous_abort_controller = abort_controller;
  abort_controller = null;
  if ((flags2 & HAS_ABORT_CONTROLLER) !== 0) {
    abort_replaced(reaction, flags2);
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = (
      /** @type {Function} */
      reaction.fn
    );
    var result = fn();
    reaction.f |= REACTION_RAN;
    update_dependencies(reaction, flags2, result, false);
    if (is_runes() && untracked_writes !== null && !untracking && // bail out if the effect didn't read anything
    (new_deps !== null || skipped_deps > 0) && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (var i = 0; i < /** @type {Source[]} */
      untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(
          untracked_writes[i],
          /** @type {Effect} */
          reaction
        );
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (previous_reaction.deps !== null) {
        for (let i2 = 0; i2 < previous_skipped_deps; i2 += 1) {
          previous_reaction.deps[i2].rv = read_version;
        }
      }
      if (previous_deps !== null) {
        for (const dep of previous_deps) {
          dep.rv = read_version;
        }
      }
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(.../** @type {Source[]} */
          untracked_writes);
        }
      }
    }
    return result;
  } catch (error) {
    var value = error;
    try {
      value = handle_error(error);
    } finally {
      update_dependencies(reaction, flags2, value, value === error);
    }
    return value;
  } finally {
    var signal = (
      /** @type {AbortController | null} */
      abort_controller?.signal
    );
    if (batch !== null && signal !== void 0) {
      signal.addEventListener("abort", () => {
        if (current_batch !== null) {
          const target = merge_target(batch);
          if (target !== current_batch && target.linked && !target.is_fork) {
            current_batch.merge_requests.add(target);
          }
        }
      });
    }
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
    abort_controller = previous_abort_controller;
  }
}
function update_dependencies(reaction, flags2, value, error) {
  var deps = reaction.deps;
  var length = skipped_deps + (new_deps === null ? 0 : new_deps.length);
  var dv = reaction.dv;
  if ((reaction.f & DESTROYED) !== 0) {
    abort_signal(abort_controller);
    return;
  }
  if (abort_controller !== null && (reaction.f & HAS_ABORT_CONTROLLER) === 0) {
    abort_signal(abort_controller);
    abort_controller = null;
  }
  if ((flags2 & DERIVED) !== 0 && is_destroying_effect) {
    var wv = 0;
    for (var j = 0; j < length; j++) {
      var dep = j < skipped_deps ? (
        /** @type {Value[]} */
        deps[j]
      ) : (
        /** @type {Value[]} */
        new_deps[j - skipped_deps]
      );
      wv = Math.max(wv, teardown_version_of(dep));
    }
    teardown_run = { v: value, wv, e: error, assigned: (flags2 & ASSIGNED) !== 0 };
    return;
  }
  if ((flags2 & DERIVED) !== 0 && batch_values === null && first_batch !== null && first_batch.next !== null) {
    keep_global_run(
      /** @type {Derived} */
      reaction,
      flags2
    );
  }
  if (new_deps === null && batch_values === null && dv !== null && length === deps?.length && reaction.edges === deps && (flags2 & (BLOCK_EFFECT | ASYNC)) === 0) {
    for (var i = 0; i < length; i++) dv[i] = deps[i].wv;
    if (dv.length !== length) dv.length = length;
    if ((flags2 & DERIVED) !== 0) set_derived_value(
      /** @type {Derived} */
      reaction,
      value,
      error
    );
    if (reaction.ac || abort_controller) set_global_signal(reaction);
    return;
  }
  update_record(reaction, flags2, length, value, error);
}
function set_derived_value(derived2, value, error) {
  var flags2 = derived2.f & ~ASSIGNED;
  if (error || (flags2 & ERROR_VALUE) !== 0 || !derived2.equals(value)) {
    derived2.v = value;
    derived2.wv = increment_write_version();
    flags2 = error ? flags2 | ERROR_VALUE : flags2 & ~ERROR_VALUE;
  }
  derived2.f = flags2;
  update_derived_status(derived2);
}
function update_record(reaction, flags2, length, value, error) {
  var should_record = is_recorded_effect(flags2);
  if (batch_values !== null && (flags2 & DERIVED) !== 0) {
    var written = batch_values.get(
      /** @type {Derived} */
      reaction
    );
    if (written !== void 0 && written.wv !== /** @type {Derived} */
    reaction.wv) {
      should_record = true;
    }
  }
  var deps = reaction.deps;
  var read = deps;
  if (new_deps !== null || skipped_deps !== deps?.length) {
    read = skipped_deps === 0 ? new_deps : (
      /** @type {Value[]} */
      deps.slice(0, skipped_deps).concat(new_deps ?? [])
    );
  }
  var dv = !should_record && batch_values === null && reaction.dv !== null ? reaction.dv : [];
  for (var i = 0; i < length; i++) {
    var dep = (
      /** @type {Value[]} */
      read[i]
    );
    dv[i] = seen_version(dep);
    if (batch_values !== null && (flags2 & DERIVED) !== 0 && (dv[i] !== dep.wv || (dep.f & (DERIVED | CLEAN)) === DERIVED)) {
      should_record = true;
    }
  }
  if (dv.length !== length) dv.length = length;
  if (!should_record && batch_values !== null && (flags2 & DERIVED) !== 0) {
    keep_global_run(
      /** @type {Derived} */
      reaction,
      flags2
    );
  }
  var keep = should_record || has_batch_record(reaction);
  var tracking = effect_tracking() && (reaction.f & CONNECTED) !== 0;
  var edges = reaction.edges;
  if (keep && edges !== null) {
    if (new_deps !== null) {
      reaction.edges = edges = edges.slice();
      for (dep of new_deps) {
        if (!includes.call(edges, dep)) {
          edges.push(dep);
          if (tracking) (dep.reactions ??= []).push(reaction);
        }
      }
    }
  } else {
    if (edges === deps) {
      if (edges !== null) {
        for (i = skipped_deps; i < edges.length; i++) remove_reaction(reaction, edges[i]);
      }
      if (tracking && new_deps !== null) {
        for (dep of new_deps) (dep.reactions ??= []).push(reaction);
      }
    } else {
      var added = new Set(read);
      for (
        dep of
        /** @type {Value[]} */
        edges
      ) {
        if (!added.delete(dep)) remove_reaction(reaction, dep);
      }
      if (tracking) {
        for (dep of added) (dep.reactions ??= []).push(reaction);
      }
    }
    reaction.edges = read;
  }
  if (should_record) {
    var batch = (
      /** @type {Batch} */
      view_batch
    );
    (batch.records ??= /* @__PURE__ */ new Map()).set(
      reaction,
      (flags2 & DERIVED) !== 0 ? {
        deps: read,
        dv,
        v: value,
        e: error,
        wv: derived_version(
          /** @type {Derived} */
          reaction,
          batch,
          value,
          error
        ),
        ac: abort_controller
      } : { deps: read, dv, ac: abort_controller }
    );
  } else {
    reaction.deps = read;
    reaction.dv = dv;
    if (reaction.ac || abort_controller) set_global_signal(reaction);
    if ((flags2 & DERIVED) !== 0) {
      set_derived_value(
        /** @type {Derived} */
        reaction,
        value,
        error
      );
      view_batch?.records?.delete(reaction);
    }
  }
}
function keep_global_run(derived2, flags2) {
  var dv = derived2.dv;
  if (
    // no valid run, or one that doesn't depend on anything — which is only run again if it was invalidated
    dv === null || dv.length === 0 || // an assigned value isn't a run, see `get_view`
    (flags2 & ASSIGNED) !== 0
  ) {
    return;
  }
  var record;
  var ac = derived2.ac;
  var live = ac !== null && current_batch !== null && current_batch.is_fork && !ac.signal.aborted;
  for (var batch = first_batch; batch !== null; batch = batch.next) {
    if (batch !== view_batch && !batch.records?.has(derived2) && // otherwise, the run's signal was aborted when the derived ran again, or is about to be (see `set_global_signal`)
    (ac === null || live || supersedes(current_batch, batch))) {
      record ??= {
        deps: derived2.deps,
        dv: dv.slice(),
        v: derived2.v,
        wv: derived2.wv,
        e: (flags2 & ERROR_VALUE) !== 0
      };
      (batch.records ??= /* @__PURE__ */ new Map()).set(derived2, record);
    }
  }
  if (live && record !== void 0) {
    record.ac = ac;
    derived2.ac = null;
  }
}
function seen_version(signal) {
  if (batch_values === null) return signal.wv;
  if ((signal.f & DERIVED) !== 0) {
    var cache = (
      /** @type {Map<Derived, Derived | DerivedRecord | BatchValue>} */
      view_cache
    );
    return cache.get(
      /** @type {Derived} */
      signal
    )?.wv ?? -1;
  }
  return (batch_values.get(signal) ?? signal).wv;
}
function derived_version(derived2, batch, value, error) {
  if (!error) {
    var previous = (
      /** @type {DerivedRecord | undefined} */
      batch.get_record(derived2)
    );
    if (previous !== void 0 && !previous.e && derived2.equals.call(previous, value)) {
      return previous.wv;
    }
    if ((derived2.f & ERROR_VALUE) === 0 && derived2.equals(value)) return derived2.wv;
  }
  return increment_write_version();
}
function promote_record(reaction, record) {
  reaction.deps = record.deps;
  reaction.dv = (reaction.f & DERIVED) !== 0 ? record.dv.slice() : record.dv;
  if ((reaction.f & DERIVED) !== 0) {
    var derived2 = (
      /** @type {Derived} */
      reaction
    );
    derived2.v = record.v;
    derived2.wv = /** @type {number} */
    record.wv;
    derived2.f = (record.e ? derived2.f | ERROR_VALUE : derived2.f & ~ERROR_VALUE) & ~ASSIGNED;
    update_derived_status(derived2);
  }
  abort_signal(reaction.ac);
  reaction.ac = record.ac ?? null;
  record.ac = null;
}
function has_batch_record(reaction) {
  for (var batch = first_batch; batch !== null; batch = batch.next) {
    if (batch.records?.has(reaction)) return true;
  }
  return false;
}
function prune_edges(effect) {
  var edges = effect.edges;
  var deps = effect.deps;
  if (edges === deps || has_batch_record(effect)) return;
  for (
    var dep of
    /** @type {Value[]} */
    edges
  ) {
    if (deps === null || !includes.call(deps, dep)) remove_reaction(effect, dep);
  }
  effect.edges = deps;
}
function add_reaction(signal, reaction) {
  var reactions = signal.reactions ??= [];
  if (!includes.call(reactions, reaction)) reactions.push(reaction);
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index = index_of.call(reactions, signal);
    if (index !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (new_deps === null || !includes.call(new_deps, dependency))) {
    var derived2 = (
      /** @type {Derived} */
      dependency
    );
    if ((derived2.f & CONNECTED) !== 0) {
      derived2.f ^= CONNECTED;
    }
    if (derived2.v !== UNINITIALIZED) {
      update_derived_status(derived2);
    }
    if (abort_all(derived2)) {
      set_signal_status(derived2, DIRTY);
      derived2.dv = null;
      for (var b = first_batch; b !== null; b = b.next) b.records?.delete(derived2);
      view_cache?.delete(derived2);
    }
    freeze_derived_effects(derived2);
    remove_reactions(derived2);
  }
}
function remove_reactions(signal) {
  var dependencies = signal.edges;
  if (dependencies === null) return;
  for (var i = 0; i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect) {
  var flags2 = effect.f;
  if ((flags2 & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect, CLEAN);
  var previous_effect = active_effect;
  active_effect = effect;
  try {
    if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
      destroy_block_effect_children(effect);
    } else {
      destroy_effect_children(effect);
    }
    execute_effect_teardown(effect);
    var teardown = update_reaction(effect);
    effect.teardown = typeof teardown === "function" ? teardown : null;
    effect.wv = write_version;
    var dep;
    if (browser && tracing_mode_flag && (effect.f & DIRTY) !== 0 && effect.edges !== null) ;
  } finally {
    active_effect = previous_effect;
  }
}
function get(signal) {
  var flags2 = signal.f;
  var is_derived = (flags2 & DERIVED) !== 0;
  var late_reader = null;
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && (current_sources === null || !current_sources.has(signal))) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else {
            new_deps.push(signal);
          }
        }
      } else {
        late_reader = active_reaction;
        var edges = active_reaction.edges;
        if (edges === null || !includes.call(edges, signal)) {
          active_reaction.edges = edges === null ? [signal] : [...edges, signal];
        }
        add_reaction(signal, active_reaction);
      }
    }
  }
  if (is_destroying_effect) {
    var held = teardown_view(signal);
    if (held !== void 0) {
      if (held.e) throw held.v;
      return held.v;
    }
  }
  var view;
  if (is_derived) {
    var derived2 = (
      /** @type {Derived} */
      signal
    );
    var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (active_reaction.f & CONNECTED) !== 0;
    var is_new = (derived2.f & REACTION_RAN) === 0;
    if (should_connect) {
      derived2.f |= CONNECTED;
    }
    if (batch_values !== null) {
      view = get_view(derived2);
    } else {
      update_derived(derived2);
    }
    if (should_connect && !is_new) {
      unfreeze_derived_effects(derived2);
      reconnect(derived2);
    }
  } else if (batch_values !== null) {
    view = batch_values.get(signal);
  }
  if (late_reader !== null) {
    record_late_read(late_reader, signal, view === void 0 ? signal.wv : view.wv);
  }
  if (view !== void 0 && view !== signal) {
    if (view.e) throw view.v;
    return view.v;
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function record_late_read(reaction, signal, version) {
  var run = run_of(reaction);
  var deps = run.deps;
  if (run.dv !== null && (deps === null || !includes.call(deps, signal))) {
    run.deps = deps === null ? [signal] : [...deps, signal];
    run.dv.push(version);
  }
}
function reconnect(derived2) {
  derived2.f |= CONNECTED;
  if (derived2.edges === null) return;
  for (const dep of derived2.edges) {
    add_reaction(dep, derived2);
    if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
      unfreeze_derived_effects(
        /** @type {Derived} */
        dep
      );
      reconnect(
        /** @type {Derived} */
        dep
      );
    }
  }
}
function teardown_view(signal) {
  var written = signal.wv > teardown_version ? void 0 : teardown_context?.reverted_values.get(signal);
  if ((signal.f & DERIVED) === 0) return written;
  var derived2 = (
    /** @type {Derived} */
    signal
  );
  var cache = (teardown_context ?? push_teardown_context()).derived_cache;
  var record = cache.get(derived2);
  if (record !== void 0) return record;
  var held = written ?? batch_values?.get(derived2);
  var assigned = held === void 0 ? (derived2.f & ASSIGNED) !== 0 : held.assigned;
  var dv = held === void 0 && !assigned ? derived2.dv : null;
  var deps = derived2.deps ?? [];
  var holds = assigned || dv !== null;
  var length = dv?.length ?? deps.length;
  held ??= {
    v: derived2.v,
    wv: derived2.wv,
    e: (derived2.f & ERROR_VALUE) !== 0,
    assigned: (derived2.f & ASSIGNED) !== 0
  };
  for (var i = 0; holds && i < length; i++) {
    var version = teardown_version_of(deps[i]);
    holds = dv === null ? version <= held.wv : version === dv[i];
  }
  if (holds) {
    record = held;
  } else {
    execute_derived(derived2);
    record = teardown_run;
    if (held.wv < record.wv && !held.e && !record.e && derived2.equals.call(held, record.v)) {
      record.wv = held.wv;
    }
  }
  cache.set(derived2, record);
  return record;
}
function teardown_version_of(signal) {
  return (teardown_view(signal) ?? batch_values?.get(signal) ?? signal).wv;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
function push_effect(effect, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect;
  } else {
    parent_last.next = effect;
    effect.prev = parent_last;
    parent_effect.last = effect;
  }
}
function create_effect(type, fn) {
  var parent = active_effect;
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect = {
    ctx: component_context,
    deps: null,
    dv: null,
    edges: null,
    nodes: null,
    f: type | DIRTY | CONNECTED,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null,
    r: current_renderer
  };
  var e = effect;
  if ((type & EFFECT) !== 0) {
    if (collected_effects !== null) {
      collected_effects.push(effect);
    } else {
      Batch.ensure().schedule(effect, DIRTY);
    }
  } else if (fn !== null) {
    try {
      update_effect(effect);
    } catch (e2) {
      destroy_effect(effect);
      throw e2;
    }
    if (e.edges === null && e.teardown === null && e.nodes === null && e.first === e.last && // either `null`, or a singular child
    (e.f & EFFECT_PRESERVED) === 0) {
      e = e.first;
      if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
        e.f |= EFFECT_TRANSPARENT;
      }
    }
  }
  if (e !== null) {
    e.parent = parent;
    if (parent !== null) {
      push_effect(e, parent);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
      var derived2 = (
        /** @type {Derived} */
        active_reaction
      );
      (derived2.effects ??= []).push(e);
    }
  }
  return effect;
}
function effect_tracking() {
  return active_reaction !== null && !untracking;
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn);
}
function component_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return (options = {}) => {
    return new Promise((fulfil) => {
      if (options.outro) {
        pause_effect(effect, () => {
          destroy_effect(effect);
          fulfil(void 0);
        });
      } else {
        destroy_effect(effect);
        fulfil(void 0);
      }
    });
  };
}
function render_effect(fn, flags2 = 0) {
  return create_effect(RENDER_EFFECT | flags2, fn);
}
function block(fn, flags2 = 0) {
  var effect = create_effect(BLOCK_EFFECT | flags2, fn);
  return effect;
}
function branch(fn) {
  return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn);
}
function execute_effect_teardown(effect) {
  var teardown = effect.teardown;
  if (teardown !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_teardown_version = teardown_version;
    const previous_teardown_context = teardown_context;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown.call(null);
    } catch (error) {
      invoke_error_boundary(error, effect.parent);
    } finally {
      set_is_destroying_effect(previously_destroying_effect, previous_teardown_version);
      set_teardown_context(previous_teardown_context);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect = signal.first;
  signal.first = signal.last = null;
  while (effect !== null) {
    abort_all(effect);
    var next2 = effect.next;
    if ((effect.f & ROOT_EFFECT) !== 0) {
      effect.parent = null;
    } else {
      destroy_effect(effect, remove_dom);
    }
    effect = next2;
  }
}
function destroy_block_effect_children(signal) {
  var effect = signal.first;
  while (effect !== null) {
    var next2 = effect.next;
    if ((effect.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect);
    }
    effect = next2;
  }
}
function destroy_effect(effect, remove_dom = true) {
  var removed = false;
  try {
    if ((remove_dom || (effect.f & HEAD_EFFECT) !== 0) && effect.nodes !== null && effect.nodes.end !== null) {
      remove_effect_dom(
        effect.nodes.start,
        /** @type {TemplateNode} */
        effect.nodes.end
      );
      removed = true;
    }
    effect.f |= DESTROYING;
    destroy_effect_children(effect, remove_dom && !removed);
    remove_reactions(effect);
    var transitions = effect.nodes && effect.nodes.t;
    if (transitions !== null) {
      for (const transition of transitions) {
        transition.stop();
      }
    }
    execute_effect_teardown(effect);
  } finally {
  }
  effect.f ^= DESTROYING;
  effect.f |= DESTROYED;
  var parent = effect.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect);
  }
  effect.next = effect.prev = effect.teardown = effect.ctx = effect.deps = effect.dv = effect.edges = effect.fn = effect.nodes = effect.ac = effect.b = effect.r = null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next2 = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
    remove_node(
      /** @type {ChildNode} */
      node
    );
    node = next2;
  }
}
function unlink_effect(effect) {
  var parent = effect.parent;
  var prev = effect.prev;
  var next2 = effect.next;
  if (prev !== null) prev.next = next2;
  if (next2 !== null) next2.prev = prev;
  if (parent !== null) {
    if (parent.first === effect) parent.first = next2;
    if (parent.last === effect) parent.last = prev;
  }
}
function pause_effect(effect, callback, destroy = true) {
  var transitions = [];
  effect.f |= PAUSED;
  pause_children(effect, transitions, true);
  var fn = () => {
    if (destroy) destroy_effect(effect);
    if (callback) callback();
  };
  var remaining = transitions.length;
  if (remaining > 0) {
    var context = teardown_context;
    var check = () => {
      if (!--remaining) {
        var previous_context = teardown_context;
        try {
          if (context) {
            context.derived_cache.clear();
            set_teardown_context(context);
          }
          fn();
        } finally {
          if (context) set_teardown_context(previous_context);
        }
      }
    };
    for (var transition of transitions) {
      transition.out(check);
    }
  } else {
    fn();
  }
}
function pause_children(effect, transitions, local) {
  if ((effect.f & INERT) !== 0) return;
  effect.f ^= INERT;
  var t = effect.nodes && effect.nodes.t;
  if (t !== null) {
    for (const transition of t) {
      if (transition.is_global || local) {
        transitions.push(transition);
      }
    }
  }
  var child = effect.first;
  while (child !== null) {
    var sibling = child.next;
    if ((child.f & ROOT_EFFECT) === 0) {
      var transparent = (child.f & EFFECT_TRANSPARENT) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (child.f & BRANCH_EFFECT) !== 0 && (effect.f & BLOCK_EFFECT) !== 0;
      pause_children(child, transitions, transparent ? local : false);
    }
    child = sibling;
  }
}
function move_effect(effect, fragment) {
  if (!effect.nodes) return;
  try {
    var node = effect.nodes.start;
    var end = effect.nodes.end;
    while (node !== null) {
      var next2 = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
      append_child(fragment, node);
      node = next2;
    }
  } finally {
  }
}
const event_symbol = Symbol("events");
const propagation_stopped_at = Symbol("propagation stopped at");
const all_registered_events = /* @__PURE__ */ new Set();
const root_event_handles = /* @__PURE__ */ new Set();
const delegated_listeners = /* @__PURE__ */ new Map();
function listen_to_delegated_events(target) {
  var registered_events = /* @__PURE__ */ new Set();
  var event_handle = (events) => {
    for (var i = 0; i < events.length; i++) {
      var event_name = events[i];
      if (registered_events.has(event_name)) continue;
      registered_events.add(event_name);
      var passive = is_passive_event(event_name);
      for (const node of [target, document]) {
        var counts = delegated_listeners.get(node);
        if (counts === void 0) {
          counts = /* @__PURE__ */ new Map();
          delegated_listeners.set(node, counts);
        }
        var count = counts.get(event_name);
        if (count === void 0) {
          node.addEventListener(event_name, handle_event_propagation, { passive });
          counts.set(event_name, 1);
        } else {
          counts.set(event_name, count + 1);
        }
      }
    }
  };
  event_handle(array_from(all_registered_events));
  root_event_handles.add(event_handle);
  return () => {
    for (var event_name of registered_events) {
      for (const node of [target, document]) {
        var counts = (
          /** @type {Map<string, number>} */
          delegated_listeners.get(node)
        );
        var count = (
          /** @type {number} */
          counts.get(event_name)
        );
        if (--count == 0) {
          node.removeEventListener(event_name, handle_event_propagation);
          counts.delete(event_name);
          if (counts.size === 0) {
            delegated_listeners.delete(node);
          }
        } else {
          counts.set(event_name, count);
        }
      }
    }
    root_event_handles.delete(event_handle);
  };
}
let last_propagated_event = null;
let last_propagated_event_clear_scheduled = false;
function handle_event_propagation(event) {
  var handler_element = this;
  var was_stopped = event.cancelBubble;
  if (was_stopped && event[propagation_stopped_at] === handler_element) return;
  if (!was_stopped) {
    delete event[propagation_stopped_at];
  }
  var owner_document = (
    /** @type {Node} */
    handler_element.ownerDocument
  );
  var event_name = event.type;
  var path = event.composedPath?.() || [];
  var current_target = (
    /** @type {null | Element} */
    path[0] || event.target
  );
  last_propagated_event = event;
  if (!last_propagated_event_clear_scheduled) {
    last_propagated_event_clear_scheduled = true;
    setTimeout(() => {
      last_propagated_event_clear_scheduled = false;
      last_propagated_event = null;
    });
  }
  var path_idx = 0;
  var handled_at = last_propagated_event === event && event[event_symbol];
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === /** @type {any} */
    window)) {
      event[event_symbol] = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = /** @type {Element} */
  path[path_idx] || event.target;
  if (current_target === handler_element) return;
  define_property(event, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      if (current_target === handler_element) break;
      try {
        var delegated = current_target[event_symbol]?.[event_name];
        if (delegated != null && (!/** @type {any} */
        current_target.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
        // -> the target could not have been disabled because it emits the event in the first place
        event.target === current_target)) {
          delegated.call(current_target, event);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event.cancelBubble) {
        if (!was_stopped) {
          event[propagation_stopped_at] = handler_element;
        }
        break;
      }
      path_idx++;
      current_target = path_idx < path.length ? (
        /** @type {Element} */
        path[path_idx]
      ) : null;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event[event_symbol] = handler_element;
    delete event.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function assign_nodes(start, end) {
  var effect = (
    /** @type {Effect} */
    active_effect
  );
  if (effect.nodes === null) {
    effect.nodes = { start, end, a: null, t: null };
  }
}
function createSubscriber(start) {
  let subscribers = 0;
  let version = source(0);
  let stop;
  return () => {
    if (effect_tracking()) {
      get(version);
      render_effect(() => {
        if (subscribers === 0) {
          stop = untrack(() => start(() => increment(version)));
        }
        subscribers += 1;
        return () => {
          queue_micro_task(() => {
            subscribers -= 1;
            if (subscribers === 0) {
              stop?.();
              stop = void 0;
              increment(version);
            }
          });
        };
      });
    }
  };
}
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
function boundary(node, props, children, transform_error) {
  new Boundary(node, props, children, transform_error);
}
class Boundary {
  /** @type {Boundary | null} */
  parent;
  is_pending = false;
  /**
   * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
   * Inherited from parent boundary, or defaults to identity.
   * @type {(error: unknown) => unknown}
   */
  transform_error;
  /** @type {TemplateNode} */
  #anchor;
  /** @type {TemplateNode | null} */
  #hydrate_open = hydrating ? hydrate_node : null;
  /** @type {BoundaryProps} */
  #props;
  /** @type {((anchor: Node) => void)} */
  #children;
  /** @type {Effect} */
  #effect;
  /** @type {Effect | null} */
  #main_effect = null;
  /** @type {Effect | null} */
  #pending_effect = null;
  /** @type {Effect | null} */
  #failed_effect = null;
  /** @type {DocumentFragment | null} */
  #offscreen_fragment = null;
  #local_pending_count = 0;
  #pending_count_update_queued = false;
  /**
   * User effects created inside this boundary. They will run when the boundary is revealed
   * @type {Effect[]}
   */
  #effects = [];
  /**
   * Async effects that are currently in flight, grouped by the batch that started them.
   * A speculative fork's work must not hold up the real world's boundary.
   * @type {Map<Batch, Map<Effect, number>>}
   */
  #pending = /* @__PURE__ */ new Map();
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #effect_pending = null;
  #effect_pending_subscriber = createSubscriber(() => {
    this.#effect_pending = source(this.#local_pending_count);
    return () => {
      this.#effect_pending = null;
    };
  });
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(node, props, children, transform_error) {
    this.#anchor = node;
    this.#props = props;
    this.#children = (anchor) => {
      var effect = (
        /** @type {Effect} */
        active_effect
      );
      effect.b = this;
      effect.f |= BOUNDARY_EFFECT;
      children(anchor);
    };
    this.parent = /** @type {Effect} */
    active_effect.b;
    this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
    this.#effect = block(() => {
      if (hydrating) {
        const comment_data = read_hydration_instruction(
          /** @type {TemplateNode} */
          this.#hydrate_open
        );
        hydrate_next();
        const server_rendered_pending = comment_data === HYDRATION_START_ELSE;
        const server_rendered_failed = comment_data.startsWith(HYDRATION_START_FAILED);
        if (server_rendered_failed) {
          const serialized_error = JSON.parse(comment_data.slice(HYDRATION_START_FAILED.length));
          this.#hydrate_failed_content(serialized_error);
        } else if (server_rendered_pending) {
          this.#hydrate_pending_content();
        } else {
          this.#hydrate_resolved_content();
        }
      } else {
        this.#render();
      }
    }, flags);
    if (hydrating) {
      this.#anchor = hydrate_node;
    }
  }
  #hydrate_resolved_content() {
    try {
      this.#main_effect = branch(() => this.#children(this.#anchor));
    } catch (error) {
      this.error(error);
    }
  }
  /**
   * @param {unknown} error The deserialized error from the server's hydration comment
   */
  #hydrate_failed_content(error) {
    const failed = this.#props.failed;
    const { reset, invoke_onerror } = this.#create_reset(error);
    queue_micro_task(invoke_onerror);
    if (!failed) return;
    this.#failed_effect = branch(() => {
      failed(
        this.#anchor,
        () => error,
        () => reset
      );
    });
  }
  /**
   * Creates the `reset` function for a failed boundary, along with a function
   * that invokes `onerror` with it (if provided)
   * @param {unknown} error
   * @returns {{ reset: () => void, invoke_onerror: () => void }}
   */
  #create_reset(error) {
    var did_reset = false;
    var calling_on_error = false;
    const reset = () => {
      if (this.#is_destroyed()) return;
      if (did_reset) {
        svelte_boundary_reset_noop();
        return;
      }
      did_reset = true;
      if (calling_on_error) {
        svelte_boundary_reset_onerror();
      }
      if (this.#failed_effect !== null) {
        pause_effect(this.#failed_effect, () => {
          this.#failed_effect = null;
        });
      }
      this.#run(() => {
        this.#render();
      });
    };
    const invoke_onerror = () => {
      if (this.#is_destroyed()) return;
      try {
        calling_on_error = true;
        this.#props.onerror?.(error, reset);
        calling_on_error = false;
      } catch (err) {
        invoke_error_boundary(err, this.#effect && this.#effect.parent);
      }
    };
    return { reset, invoke_onerror };
  }
  #is_destroyed() {
    return (this.#effect.f & (DESTROYED | DESTROYING)) !== 0;
  }
  #hydrate_pending_content() {
    const pending = this.#props.pending;
    if (!pending) return;
    this.is_pending = true;
    this.#pending_effect = branch(() => pending(this.#anchor));
    queue_micro_task(() => {
      if (this.#is_destroyed()) return;
      try {
        var fragment = this.#offscreen_fragment = create_fragment();
        var anchor = create_text();
        append_child(fragment, anchor);
        this.#main_effect = this.#run(() => {
          try {
            return branch(() => this.#children(anchor));
          } catch (error) {
            try {
              this.error(error);
            } catch (error2) {
              invoke_error_boundary(error2, this.#effect.parent);
            }
            return null;
          }
        });
        if (this.#main_effect !== null && this.#pending.size === 0) {
          this.is_pending = false;
          insert_before(this.#anchor, fragment);
          this.#offscreen_fragment = null;
          pause_effect(
            /** @type {Effect} */
            this.#pending_effect,
            () => {
              this.#pending_effect = null;
            }
          );
        }
      } finally {
      }
    });
  }
  #render() {
    try {
      this.is_pending = this.has_pending_snippet();
      this.#local_pending_count = 0;
      this.#main_effect = branch(() => {
        this.#children(this.#anchor);
      });
      if (this.#pending.size === 0) {
        this.is_pending = false;
      } else {
        const pending = this.#props.pending;
        if (pending) {
          var fragment = this.#offscreen_fragment = create_fragment();
          move_effect(this.#main_effect, fragment);
          this.#pending_effect = branch(() => pending(this.#anchor));
        }
      }
    } catch (error) {
      this.error(error);
    }
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(effect) {
    this.#effects.push(effect);
  }
  has_pending_snippet() {
    return !!this.#props.pending;
  }
  /**
   * @template T
   * @param {() => T} fn
   */
  #run(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(this.#effect);
    set_active_reaction(this.#effect);
    set_component_context(this.#effect.ctx);
    try {
      Batch.ensure();
      return fn();
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  }
  /**
   * @param {Batch} batch
   */
  is_ready(batch) {
    if (batch.is_fork && this.#pending.size > 0) {
      return false;
    }
    for (const [owner, pending] of this.#pending) {
      if (owner.is_fork) continue;
      for (const effect of pending.keys()) {
        if (batch.is_blocked_by(effect, this.#main_effect)) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * @param {Effect[]} effects
   */
  reveal(effects) {
    this.is_pending = false;
    for (const effect of this.#effects) {
      set_signal_status(effect, DIRTY);
      effects.push(effect);
    }
    this.#effects.length = 0;
    if (this.#pending_effect) {
      pause_effect(this.#pending_effect, () => {
        this.#pending_effect = null;
      });
    }
    if (this.#offscreen_fragment) {
      try {
        insert_before(this.#anchor, this.#offscreen_fragment);
        this.#offscreen_fragment = null;
      } finally {
      }
    }
  }
  /**
   * @param {Effect} effect
   * @param {Batch} batch
   */
  increment(effect, batch) {
    var pending = this.#pending.get(batch);
    if (pending === void 0) {
      this.#pending.set(batch, pending = /* @__PURE__ */ new Map());
    }
    var count = pending.get(effect) ?? 0;
    pending.set(effect, count + 1);
  }
  /**
   * @param {Effect} effect
   * @param {Batch} batch
   */
  decrement(effect, batch) {
    var pending = (
      /** @type {Map<Effect, number>} */
      this.#pending.get(batch)
    );
    var count = (
      /** @type {number} */
      pending.get(effect)
    );
    if (count === 1) {
      pending.delete(effect);
      if (pending.size === 0) {
        this.#pending.delete(batch);
      }
      queue_micro_task(() => {
        if (this.is_pending && !this.#is_destroyed()) {
          Batch.ensure().schedule(this.#effect, MAYBE_DIRTY);
        }
      });
    } else {
      pending.set(effect, count - 1);
    }
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary.
   * Do not call from inside the class
   * @param {1 | -1} d
   */
  update_effect_pending(d) {
    this.#local_pending_count += d;
    if (!this.#effect_pending || this.#pending_count_update_queued) return;
    this.#pending_count_update_queued = true;
    queue_micro_task(() => {
      this.#pending_count_update_queued = false;
      if (this.#effect_pending) {
        internal_set(this.#effect_pending, this.#local_pending_count);
      }
    });
  }
  get_effect_pending() {
    this.#effect_pending_subscriber();
    return get(
      /** @type {Source<number>} */
      this.#effect_pending
    );
  }
  /** @param {unknown} error */
  error(error) {
    if (error === HYDRATION_ERROR) {
      throw error;
    }
    if (!this.#props.onerror && !this.#props.failed) {
      throw error;
    }
    if (current_batch?.is_fork) {
      if (this.#main_effect) current_batch.skip_effect(this.#main_effect);
      if (this.#pending_effect) current_batch.skip_effect(this.#pending_effect);
      if (this.#failed_effect) current_batch.skip_effect(this.#failed_effect);
      current_batch.oncommit(() => {
        if (!this.#is_destroyed()) this.#handle_error(error);
      });
    } else {
      this.#handle_error(error);
    }
  }
  /**
   * @param {unknown} error
   */
  #handle_error(error) {
    if (this.#main_effect) {
      destroy_effect(this.#main_effect);
      this.#main_effect = null;
    }
    if (this.#pending_effect) {
      destroy_effect(this.#pending_effect);
      this.#pending_effect = null;
    }
    if (this.#failed_effect) {
      destroy_effect(this.#failed_effect);
      this.#failed_effect = null;
    }
    if (hydrating) {
      set_hydrate_node(
        /** @type {TemplateNode} */
        this.#hydrate_open
      );
      next();
      set_hydrate_node(skip_nodes());
    }
    let failed = this.#props.failed;
    const handle_error_result = (transformed_error) => {
      if (this.#is_destroyed()) return;
      const { reset, invoke_onerror } = this.#create_reset(transformed_error);
      invoke_onerror();
      if (failed && !this.#is_destroyed()) {
        this.#failed_effect = this.#run(() => {
          try {
            return branch(() => {
              var effect = (
                /** @type {Effect} */
                active_effect
              );
              effect.b = this;
              effect.f |= BOUNDARY_EFFECT;
              failed(
                this.#anchor,
                () => transformed_error,
                () => reset
              );
            });
          } catch (error2) {
            invoke_error_boundary(
              error2,
              /** @type {Effect} */
              this.#effect.parent
            );
            return null;
          }
        });
      }
    };
    queue_micro_task(() => {
      if (this.#is_destroyed()) return;
      var result;
      try {
        result = this.transform_error(error);
      } catch (e) {
        invoke_error_boundary(e, this.#effect && this.#effect.parent);
        return;
      }
      if (result !== null && typeof result === "object" && typeof /** @type {any} */
      result.then === "function") {
        result.then(
          handle_error_result,
          /** @param {unknown} e */
          (e) => invoke_error_boundary(e, this.#effect && this.#effect.parent)
        );
      } else {
        handle_error_result(result);
      }
    });
  }
}
function mount(component, options) {
  return _mount(component, options);
}
function hydrate(component, options) {
  options.intro = options.intro ?? false;
  const target = options.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = /* @__PURE__ */ get_first_child(target);
    while (anchor && (node_type(anchor) !== COMMENT_NODE || get_node_value(anchor) !== HYDRATION_START)) {
      anchor = /* @__PURE__ */ get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(
      /** @type {Comment} */
      anchor
    );
    const instance = _mount(component, { ...options, anchor });
    if (async_mode_flag && current_batch !== null) ;
    set_hydrating(false);
    return (
      /**  @type {Exports} */
      instance
    );
  } catch (error) {
    if (error instanceof Error && error.message.split("\n").some((line) => line.startsWith("https://svelte.dev/e/"))) {
      throw error;
    }
    if (error !== HYDRATION_ERROR) {
      console.warn("Failed to hydrate: ", error);
    }
    if (options.recover === false) {
      hydration_failed();
    }
    clear_text_content(target);
    set_hydrating(false);
    return mount(component, options);
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
function _mount(Component, options) {
  return _mount_inner(Component, options);
}
function _mount_inner(Component, { target, anchor, props = {}, events, context, intro = true, transformError, renderer }) {
  var component = void 0;
  var unmount2 = component_root(() => {
    var anchor_node = anchor ?? /** @type {Text} */
    append_child(
      /** @type {Node} */
      target,
      create_text()
    );
    boundary(
      /** @type {TemplateNode} */
      anchor_node,
      {
        pending: () => {
        }
      },
      (anchor_node2) => {
        push({});
        var ctx = (
          /** @type {ComponentContext} */
          component_context
        );
        if (context) ctx.c = context;
        if (events) {
          props.$$events = events;
        }
        if (hydrating) {
          assign_nodes(
            /** @type {TemplateNode} */
            anchor_node2,
            null
          );
        }
        component = Component(anchor_node2, props) || mark_as_component();
        if (hydrating) {
          active_effect.nodes.end = hydrate_node;
          if (hydrate_node === null || node_type(hydrate_node) !== COMMENT_NODE || get_node_value(hydrate_node) !== HYDRATION_END) {
            hydration_mismatch();
            throw HYDRATION_ERROR;
          }
        }
        pop();
      },
      transformError
    );
    var stop_listening = renderer ? null : listen_to_delegated_events(
      /** @type {EventTarget} */
      target
    );
    return () => {
      stop_listening?.();
      if (anchor_node !== anchor) {
        var parent = get_parent_node(
          /** @type {Node} */
          anchor_node
        );
        if (parent) remove_child(
          parent,
          /** @type {ChildNode} */
          anchor_node
        );
      }
    };
  });
  mounted_components.set(component, unmount2);
  return component;
}
let mounted_components = /* @__PURE__ */ new WeakMap();
function unmount(component, options) {
  const fn = mounted_components.get(component);
  if (fn) {
    mounted_components.delete(component);
    return fn(options);
  }
  return Promise.resolve();
}
function asClassComponent$1(component) {
  return class extends Svelte4Component {
    /** @param {any} options */
    constructor(options) {
      super({
        component,
        ...options
      });
    }
  };
}
class Svelte4Component {
  /** @type {any} */
  #events;
  /** @type {Record<string, any>} */
  #instance;
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(options) {
    var sources = /* @__PURE__ */ new Map();
    var add_source = (key, value) => {
      var s = /* @__PURE__ */ mutable_source(value, false, false);
      sources.set(key, s);
      return s;
    };
    const props = new Proxy(
      { ...options.props || {}, $$events: {} },
      {
        get(target, prop) {
          return get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
        },
        has(target, prop) {
          if (prop === LEGACY_PROPS) return true;
          get(sources.get(prop) ?? add_source(prop, Reflect.get(target, prop)));
          return Reflect.has(target, prop);
        },
        set(target, prop, value) {
          set(sources.get(prop) ?? add_source(prop, value), value);
          return Reflect.set(target, prop, value);
        }
      }
    );
    const render_options = {
      target: options.target,
      anchor: options.anchor,
      props,
      context: options.context,
      intro: options.intro ?? false,
      recover: options.recover,
      transformError: options.transformError
    };
    this.#instance = options.hydrate ? hydrate(options.component, render_options) : mount(options.component, render_options);
    if (!options?.props?.$$host || options.sync === false) {
      flushSync();
    }
    this.#events = props.$$events;
    for (const key of Object.keys(this.#instance)) {
      if (key === "$set" || key === "$destroy" || key === "$on") continue;
      define_property(this, key, {
        get() {
          return this.#instance[key];
        },
        /** @param {any} value */
        set(value) {
          this.#instance[key] = value;
        },
        enumerable: true
      });
    }
    this.#instance.$set = /** @param {Record<string, any>} next */
    (next2) => {
      Object.assign(props, next2);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  /** @param {Record<string, any>} props */
  $set(props) {
    this.#instance.$set(props);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(event, callback) {
    this.#events[event] = this.#events[event] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#events[event].push(cb);
    return () => {
      this.#events[event] = this.#events[event].filter(
        /** @param {any} fn */
        (fn) => fn !== cb
      );
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
}
function asClassComponent(component) {
  const component_constructor = asClassComponent$1(component);
  const _render = (props, { context, csp, transformError } = {}) => {
    const result = render(component, { props, context, csp, transformError });
    const munged = Object.defineProperties(
      /** @type {LegacyRenderResult & PromiseLike<LegacyRenderResult>} */
      {},
      {
        css: {
          value: { code: "", map: null }
        },
        head: {
          get: () => result.head
        },
        html: {
          get: () => result.body
        },
        then: {
          /**
           * this is not type-safe, but honestly it's the best I can do right now, and it's a straightforward function.
           *
           * @template TResult1
           * @template [TResult2=never]
           * @param { (value: LegacyRenderResult) => TResult1 } onfulfilled
           * @param { (reason: unknown) => TResult2 } onrejected
           */
          value: (onfulfilled, onrejected) => {
            {
              const user_result = onfulfilled({
                css: munged.css,
                head: munged.head,
                html: munged.html
              });
              return Promise.resolve(user_result);
            }
          }
        }
      }
    );
    return munged;
  };
  component_constructor.render = _render;
  return component_constructor;
}
function Root($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      stores,
      page,
      constructors,
      components = [],
      form,
      data_0 = null,
      data_1 = null
    } = $$props;
    {
      setContext("__svelte__", stores);
    }
    {
      stores.page.set(page);
    }
    const Pyramid_1 = derived(() => constructors[1]);
    if (constructors[1]) {
      $$renderer2.push("<!--[0-->");
      const Pyramid_0 = constructors[0];
      if (Pyramid_0) {
        $$renderer2.push("<!--[-->");
        Pyramid_0($$renderer2, {
          data: data_0,
          form,
          params: page.params,
          children: ($$renderer3) => {
            if (Pyramid_1()) {
              $$renderer3.push("<!--[-->");
              Pyramid_1()($$renderer3, { data: data_1, form, params: page.params });
              $$renderer3.push("<!--]-->");
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push("<!--]-->");
            }
          },
          $$slots: { default: true }
        });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    } else {
      $$renderer2.push("<!--[-1-->");
      const Pyramid_0 = constructors[0];
      if (Pyramid_0) {
        $$renderer2.push("<!--[-->");
        Pyramid_0($$renderer2, { data: data_0, form, params: page.params });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
const root = asClassComponent(Root);
export {
  browser as b,
  root as r,
  safe_not_equal as s
};
