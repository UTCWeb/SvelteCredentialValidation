var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* App.svelte generated by Svelte v3.55.1 */

    const { console: console_1 } = globals;
    const file = "App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (55:4) {#if array.length > 0 && array[0].CeDiplomaID === ""}
    function create_if_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "We cannot validate the Credential at this time. Please contact\n        apostille@utc.edu for assistance. When you do, please provide the\n        student name and CeDiD";
    			attr_dev(p, "class", "svelte-3vj0ex");
    			add_location(p, file, 56, 6, 1563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(55:4) {#if array.length > 0 && array[0].CeDiplomaID === \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (67:62) 
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let each_value = /*array*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*array, dateTime*/ 6) {
    				each_value = /*array*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(67:62) ",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if idkey === " " || idkey === ""}
    function create_if_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Make sure to enter a valid ID for example 222G-MI3O-ZZZZ";
    			attr_dev(p, "class", "svelte-3vj0ex");
    			add_location(p, file, 63, 6, 1810);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(63:4) {#if idkey === \\\" \\\" || idkey === \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (68:6) {#each array as index}
    function create_each_block(ctx) {
    	let tbody;
    	let tr0;
    	let td0;
    	let b0;
    	let t0;
    	let b1;
    	let t1;
    	let td1;
    	let tr1;
    	let td2;
    	let b2;
    	let td3;
    	let t4_value = /*index*/ ctx[6].CeDiplomaID + "";
    	let t4;
    	let tr2;
    	let td4;
    	let b3;
    	let td5;
    	let t6_value = /*index*/ ctx[6].Name + "";
    	let t6;
    	let tr3;
    	let td6;
    	let b4;
    	let td7;
    	let t8_value = /*index*/ ctx[6].ConferralDate + "";
    	let t8;
    	let tr4;
    	let td8;
    	let b5;
    	let td9;
    	let t10_value = /*index*/ ctx[6].Degree1 + "";
    	let t10;

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			tr0 = element("tr");
    			td0 = element("td");
    			b0 = element("b");
    			t0 = text("This is a valid credential");
    			b1 = element("b");
    			t1 = space();
    			td1 = element("td");
    			td1.textContent = `${/*dateTime*/ ctx[2]}`;
    			tr1 = element("tr");
    			td2 = element("td");
    			b2 = element("b");
    			b2.textContent = "CeDiD:";
    			td3 = element("td");
    			t4 = text(t4_value);
    			tr2 = element("tr");
    			td4 = element("td");
    			b3 = element("b");
    			b3.textContent = "Name:";
    			td5 = element("td");
    			t6 = text(t6_value);
    			tr3 = element("tr");
    			td6 = element("td");
    			b4 = element("b");
    			b4.textContent = "Conferral Date: ";
    			td7 = element("td");
    			t8 = text(t8_value);
    			tr4 = element("tr");
    			td8 = element("td");
    			b5 = element("b");
    			b5.textContent = "Credential:";
    			td9 = element("td");
    			t10 = text(t10_value);
    			add_location(b0, file, 75, 19, 2283);
    			add_location(b1, file, 75, 50, 2314);
    			attr_dev(td0, "class", "svelte-3vj0ex");
    			add_location(td0, file, 75, 15, 2279);
    			attr_dev(td1, "class", "svelte-3vj0ex");
    			add_location(td1, file, 75, 61, 2325);
    			attr_dev(tr0, "class", "svelte-3vj0ex");
    			add_location(tr0, file, 74, 12, 2260);
    			add_location(b2, file, 78, 21, 2402);
    			attr_dev(td2, "class", "svelte-3vj0ex");
    			add_location(td2, file, 78, 17, 2398);
    			attr_dev(td3, "class", "svelte-3vj0ex");
    			add_location(td3, file, 78, 39, 2420);
    			attr_dev(tr1, "class", "svelte-3vj0ex");
    			add_location(tr1, file, 78, 13, 2394);
    			add_location(b3, file, 79, 19, 2476);
    			attr_dev(td4, "class", "svelte-3vj0ex");
    			add_location(td4, file, 79, 15, 2472);
    			attr_dev(td5, "class", "svelte-3vj0ex");
    			add_location(td5, file, 79, 36, 2493);
    			attr_dev(tr2, "class", "svelte-3vj0ex");
    			add_location(tr2, file, 78, 72, 2453);
    			add_location(b4, file, 81, 19, 2555);
    			attr_dev(td6, "class", "svelte-3vj0ex");
    			add_location(td6, file, 81, 15, 2551);
    			attr_dev(td7, "class", "svelte-3vj0ex");
    			add_location(td7, file, 81, 47, 2583);
    			attr_dev(tr3, "class", "svelte-3vj0ex");
    			add_location(tr3, file, 80, 13, 2532);
    			add_location(b5, file, 83, 21, 2654);
    			attr_dev(td8, "class", "svelte-3vj0ex");
    			add_location(td8, file, 83, 17, 2650);
    			attr_dev(td9, "class", "svelte-3vj0ex");
    			add_location(td9, file, 83, 44, 2677);
    			attr_dev(tr4, "class", "svelte-3vj0ex");
    			add_location(tr4, file, 83, 13, 2646);
    			add_location(tbody, file, 72, 10, 2198);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr0);
    			append_dev(tr0, td0);
    			append_dev(td0, b0);
    			append_dev(td0, t0);
    			append_dev(td0, b1);
    			append_dev(td0, t1);
    			append_dev(tr0, td1);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td2);
    			append_dev(td2, b2);
    			append_dev(tr1, td3);
    			append_dev(td3, t4);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td4);
    			append_dev(td4, b3);
    			append_dev(tr2, td5);
    			append_dev(td5, t6);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td6);
    			append_dev(td6, b4);
    			append_dev(tr3, td7);
    			append_dev(td7, t8);
    			append_dev(tbody, tr4);
    			append_dev(tr4, td8);
    			append_dev(td8, b5);
    			append_dev(tr4, td9);
    			append_dev(td9, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*array*/ 2 && t4_value !== (t4_value = /*index*/ ctx[6].CeDiplomaID + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*array*/ 2 && t6_value !== (t6_value = /*index*/ ctx[6].Name + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*array*/ 2 && t8_value !== (t8_value = /*index*/ ctx[6].ConferralDate + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*array*/ 2 && t10_value !== (t10_value = /*index*/ ctx[6].Degree1 + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(68:6) {#each array as index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let form;
    	let div0;
    	let h2;
    	let t1;
    	let div3;
    	let div1;
    	let label;
    	let t3;
    	let input;
    	let t4;
    	let button;
    	let t6;
    	let div2;
    	let t7;
    	let t8;
    	let p;
    	let t9;
    	let a;
    	let mounted;
    	let dispose;
    	let if_block0 = /*array*/ ctx[1].length > 0 && /*array*/ ctx[1][0].CeDiplomaID === "" && create_if_block_2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*idkey*/ ctx[0] === " " || /*idkey*/ ctx[0] === "") return create_if_block;
    		if (/*array*/ ctx[1].length > 0 && /*array*/ ctx[1][0].CeDiplomaID !== "") return create_if_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Credential Validation";
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "CeDiD*";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Validate";
    			t6 = space();
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t7 = space();
    			if (if_block1) if_block1.c();
    			t8 = space();
    			p = element("p");
    			t9 = text("Powered by ");
    			a = element("a");
    			a.textContent = "CeCredentialTrust";
    			attr_dev(h2, "class", "credentialvalidationtitle");
    			add_location(h2, file, 38, 4, 867);
    			attr_dev(div0, "class", "credentialvalidation_form_title svelte-3vj0ex");
    			add_location(div0, file, 37, 2, 817);
    			attr_dev(label, "for", "ceDiD");
    			attr_dev(label, "class", "ceDiDlabel svelte-3vj0ex");
    			add_location(label, file, 44, 6, 1082);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "utccredential");
    			add_location(input, file, 45, 6, 1141);
    			attr_dev(button, "class", "button btn--lightblue button--sm button cevalidatebutton svelte-3vj0ex");
    			attr_dev(button, "type", "submit");
    			add_location(button, file, 46, 6, 1207);
    			attr_dev(div1, "class", "cegrid gap-x-4 max-w-xs svelte-3vj0ex");
    			add_location(div1, file, 43, 4, 1038);
    			attr_dev(div2, "class", "credential_validation_result_message cepr-32 svelte-3vj0ex");
    			add_location(div2, file, 53, 4, 1366);
    			attr_dev(div3, "class", "credentialvalidation_form ceflex credential_validation_result_message svelte-3vj0ex");
    			add_location(div3, file, 40, 2, 943);
    			attr_dev(a, "href", "https://secure.cecredentialtrust.com/");
    			add_location(a, file, 92, 15, 2840);
    			attr_dev(p, "class", "credentialvalidation_form_footer svelte-3vj0ex");
    			add_location(p, file, 91, 2, 2780);
    			attr_dev(form, "class", "credentialvalidationform col-end-2 svelte-3vj0ex");
    			add_location(form, file, 33, 0, 713);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, h2);
    			append_dev(form, t1);
    			append_dev(form, div3);
    			append_dev(div3, div1);
    			append_dev(div1, label);
    			append_dev(div1, t3);
    			append_dev(div1, input);
    			set_input_value(input, /*idkey*/ ctx[0]);
    			append_dev(div1, t4);
    			append_dev(div1, button);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t7);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(form, t8);
    			append_dev(form, p);
    			append_dev(p, t9);
    			append_dev(p, a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[4]),
    					listen_dev(
    						form,
    						"submit",
    						prevent_default(function () {
    							if (is_function(/*handleSubmit*/ ctx[3](/*idkey*/ ctx[0]))) /*handleSubmit*/ ctx[3](/*idkey*/ ctx[0]).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*idkey*/ 1 && input.value !== /*idkey*/ ctx[0]) {
    				set_input_value(input, /*idkey*/ ctx[0]);
    			}

    			if (/*array*/ ctx[1].length > 0 && /*array*/ ctx[1][0].CeDiplomaID === "") {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div2, t7);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (if_block0) if_block0.d();

    			if (if_block1) {
    				if_block1.d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let idkey = " ";
    	let array = [];
    	let today = new Date();
    	let dateTime = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    	function handleSubmit(idkey) {
    		if (idkey == " " || idkey == "") {
    			return;
    		}

    		console.log(idkey);
    		fetch("https://secure.cecredentialtrust.com:8086/api/webapi/v3/CeCredentialValidate/95848d1d-07d0-4667-91f5-96887d32c64c/" + idkey).then(response => response.json()).then(data => $$invalidate(1, array = data));
    		$$invalidate(1, array);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		idkey = this.value;
    		$$invalidate(0, idkey);
    	}

    	$$self.$capture_state = () => ({
    		idkey,
    		array,
    		today,
    		dateTime,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('idkey' in $$props) $$invalidate(0, idkey = $$props.idkey);
    		if ('array' in $$props) $$invalidate(1, array = $$props.array);
    		if ('today' in $$props) today = $$props.today;
    		if ('dateTime' in $$props) $$invalidate(2, dateTime = $$props.dateTime);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [idkey, array, dateTime, handleSubmit, input_input_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.getElementById("utccredentialapi")
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
