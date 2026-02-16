let wasm;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export4(addHeapObject(e));
    }
}

let heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

const APCAMetricFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_apcametric_free(ptr >>> 0, 1));

const BackgroundContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_backgroundcontext_free(ptr >>> 0, 1));

const BatchEvaluatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_batchevaluator_free(ptr >>> 0, 1));

const BatchMaterialInputFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_batchmaterialinput_free(ptr >>> 0, 1));

const BatchResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_batchresult_free(ptr >>> 0, 1));

const ColorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_color_free(ptr >>> 0, 1));

const ContactShadowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contactshadow_free(ptr >>> 0, 1));

const ContactShadowParamsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contactshadowparams_free(ptr >>> 0, 1));

const ContrastResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contrastresult_free(ptr >>> 0, 1));

const CssBackendFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cssbackend_free(ptr >>> 0, 1));

const ElevationPresetsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_elevationpresets_free(ptr >>> 0, 1));

const ElevationShadowFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_elevationshadow_free(ptr >>> 0, 1));

const EvalMaterialContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_evalmaterialcontext_free(ptr >>> 0, 1));

const EvaluatedMaterialFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_evaluatedmaterial_free(ptr >>> 0, 1));

const GlassLayersFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_glasslayers_free(ptr >>> 0, 1));

const GlassMaterialFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_glassmaterial_free(ptr >>> 0, 1));

const GlassMaterialBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_glassmaterialbuilder_free(ptr >>> 0, 1));

const GlassPhysicsEngineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_glassphysicsengine_free(ptr >>> 0, 1));

const GlassPropertiesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_glassproperties_free(ptr >>> 0, 1));

const GlassRenderOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_glassrenderoptions_free(ptr >>> 0, 1));

const LayerTransmittanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_layertransmittance_free(ptr >>> 0, 1));

const LightingContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_lightingcontext_free(ptr >>> 0, 1));

const LiquidGlassFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_liquidglass_free(ptr >>> 0, 1));

const MaterialContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_materialcontext_free(ptr >>> 0, 1));

const MaterialSurfaceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_materialsurface_free(ptr >>> 0, 1));

const OKLCHFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_oklch_free(ptr >>> 0, 1));

const OpticalPropertiesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_opticalproperties_free(ptr >>> 0, 1));

const PerlinNoiseFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_perlinnoise_free(ptr >>> 0, 1));

const QualityScoreFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_qualityscore_free(ptr >>> 0, 1));

const QualityScorerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_qualityscorer_free(ptr >>> 0, 1));

const RecommendationContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_recommendationcontext_free(ptr >>> 0, 1));

const RenderContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rendercontext_free(ptr >>> 0, 1));

const ThinFilmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_thinfilm_free(ptr >>> 0, 1));

const Vec3Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vec3_free(ptr >>> 0, 1));

const VibrancyEffectFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vibrancyeffect_free(ptr >>> 0, 1));

const ViewContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_viewcontext_free(ptr >>> 0, 1));

const WCAGMetricFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wcagmetric_free(ptr >>> 0, 1));

/**
 * APCA-W3 0.1.9 Contrast metric.
 *
 * Calculates polarity-aware Lc values from -108 to +106.
 * Positive values = dark on light, negative = light on dark.
 */
export class APCAMetric {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        APCAMetricFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_apcametric_free(ptr, 0);
    }
    /**
     * Create a new APCA metric.
     */
    constructor() {
        const ret = wasm.wcagmetric_new();
        this.__wbg_ptr = ret >>> 0;
        APCAMetricFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Evaluate APCA contrast (Lc value) between foreground and background.
     *
     * Returns Lc value:
     * - Positive = dark text on light background
     * - Negative = light text on dark background
     * - Near zero = insufficient contrast
     * @param {Color} foreground
     * @param {Color} background
     * @returns {ContrastResult}
     */
    evaluate(foreground, background) {
        _assertClass(foreground, Color);
        _assertClass(background, Color);
        const ret = wasm.apcametric_evaluate(this.__wbg_ptr, foreground.__wbg_ptr, background.__wbg_ptr);
        return ContrastResult.__wrap(ret);
    }
    /**
     * Evaluate APCA contrast for multiple color pairs (faster than calling evaluate in a loop).
     *
     * # Arguments
     *
     * * `foregrounds` - Array of foreground colors
     * * `backgrounds` - Array of background colors (must match length)
     *
     * # Returns
     *
     * Array of APCA results with Lc values and polarities
     * @param {Color[]} foregrounds
     * @param {Color[]} backgrounds
     * @returns {ContrastResult[]}
     */
    evaluateBatch(foregrounds, backgrounds) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(foregrounds, wasm.__wbindgen_export);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArrayJsValueToWasm0(backgrounds, wasm.__wbindgen_export);
            const len1 = WASM_VECTOR_LEN;
            wasm.apcametric_evaluateBatch(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v3 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 4, 4);
            return v3;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) APCAMetric.prototype[Symbol.dispose] = APCAMetric.prototype.free;

/**
 * Background context (what's behind the material)
 */
export class BackgroundContext {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BackgroundContext.prototype);
        obj.__wbg_ptr = ptr;
        BackgroundContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BackgroundContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_backgroundcontext_free(ptr, 0);
    }
    /**
     * White background preset
     * @returns {BackgroundContext}
     */
    static white() {
        const ret = wasm.backgroundcontext_white();
        return BackgroundContext.__wrap(ret);
    }
    /**
     * Black background preset
     * @returns {BackgroundContext}
     */
    static black() {
        const ret = wasm.backgroundcontext_black();
        return BackgroundContext.__wrap(ret);
    }
    /**
     * Gray background preset
     * @returns {BackgroundContext}
     */
    static gray() {
        const ret = wasm.backgroundcontext_gray();
        return BackgroundContext.__wrap(ret);
    }
    /**
     * Colorful background preset
     * @returns {BackgroundContext}
     */
    static colorful() {
        const ret = wasm.backgroundcontext_colorful();
        return BackgroundContext.__wrap(ret);
    }
    /**
     * Sky background preset
     * @returns {BackgroundContext}
     */
    static sky() {
        const ret = wasm.backgroundcontext_sky();
        return BackgroundContext.__wrap(ret);
    }
}
if (Symbol.dispose) BackgroundContext.prototype[Symbol.dispose] = BackgroundContext.prototype.free;

/**
 * Batch evaluator for efficient multi-material processing
 */
export class BatchEvaluator {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BatchEvaluator.prototype);
        obj.__wbg_ptr = ptr;
        BatchEvaluatorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BatchEvaluatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_batchevaluator_free(ptr, 0);
    }
    /**
     * Create new batch evaluator with default context
     */
    constructor() {
        const ret = wasm.batchevaluator_new();
        this.__wbg_ptr = ret >>> 0;
        BatchEvaluatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create batch evaluator with custom context
     * @param {MaterialContext} context
     * @returns {BatchEvaluator}
     */
    static withContext(context) {
        _assertClass(context, MaterialContext);
        const ret = wasm.batchevaluator_withContext(context.__wbg_ptr);
        return BatchEvaluator.__wrap(ret);
    }
    /**
     * Evaluate batch of materials
     *
     * Returns result object with arrays for each property.
     * This is 7-10x faster than evaluating materials individually
     * when called from JavaScript (reduces JS↔WASM crossings).
     * @param {BatchMaterialInput} input
     * @returns {BatchResult}
     */
    evaluate(input) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(input, BatchMaterialInput);
            wasm.batchevaluator_evaluate(retptr, this.__wbg_ptr, input.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return BatchResult.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Update context
     * @param {MaterialContext} context
     */
    setContext(context) {
        _assertClass(context, MaterialContext);
        wasm.batchevaluator_setContext(this.__wbg_ptr, context.__wbg_ptr);
    }
}
if (Symbol.dispose) BatchEvaluator.prototype[Symbol.dispose] = BatchEvaluator.prototype.free;

/**
 * Batch material input for efficient multi-material evaluation
 */
export class BatchMaterialInput {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BatchMaterialInputFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_batchmaterialinput_free(ptr, 0);
    }
    /**
     * Create new empty batch input
     */
    constructor() {
        const ret = wasm.batchmaterialinput_new();
        this.__wbg_ptr = ret >>> 0;
        BatchMaterialInputFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Add a material to the batch
     *
     * # Arguments
     *
     * * `ior` - Index of refraction
     * * `roughness` - Surface roughness (0-1)
     * * `thickness` - Thickness in mm
     * * `absorption` - Absorption coefficient per mm
     * @param {number} ior
     * @param {number} roughness
     * @param {number} thickness
     * @param {number} absorption
     */
    push(ior, roughness, thickness, absorption) {
        wasm.batchmaterialinput_push(this.__wbg_ptr, ior, roughness, thickness, absorption);
    }
    /**
     * Get number of materials in batch
     * @returns {number}
     */
    len() {
        const ret = wasm.batchmaterialinput_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Check if batch is empty
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.batchmaterialinput_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
}
if (Symbol.dispose) BatchMaterialInput.prototype[Symbol.dispose] = BatchMaterialInput.prototype.free;

/**
 * Batch evaluation result
 */
export class BatchResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BatchResult.prototype);
        obj.__wbg_ptr = ptr;
        BatchResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BatchResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_batchresult_free(ptr, 0);
    }
    /**
     * Number of materials evaluated
     * @returns {number}
     */
    get count() {
        const ret = wasm.batchresult_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get opacity array
     * @returns {Float64Array}
     */
    getOpacity() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.batchresult_getOpacity(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get blur array
     * @returns {Float64Array}
     */
    getBlur() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.batchresult_getBlur(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get Fresnel normal incidence array
     * @returns {Float64Array}
     */
    getFresnelNormal() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.batchresult_getFresnelNormal(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get Fresnel grazing angle array
     * @returns {Float64Array}
     */
    getFresnelGrazing() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.batchresult_getFresnelGrazing(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get transmittance array
     * @returns {Float64Array}
     */
    getTransmittance() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.batchresult_getTransmittance(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) BatchResult.prototype[Symbol.dispose] = BatchResult.prototype.free;

/**
 * Blur intensity levels matching Apple HIG.
 * @enum {0 | 1 | 2 | 3 | 4}
 */
export const BlurIntensity = Object.freeze({
    /**
     * No blur (0px)
     */
    None: 0, "0": "None",
    /**
     * Light blur (10px)
     */
    Light: 1, "1": "Light",
    /**
     * Medium blur (20px)
     */
    Medium: 2, "2": "Medium",
    /**
     * Heavy blur (30px)
     */
    Heavy: 3, "3": "Heavy",
    /**
     * Extra heavy blur (40px)
     */
    ExtraHeavy: 4, "4": "ExtraHeavy",
});

/**
 * RGB color value.
 *
 * Represents a color in sRGB color space with 8-bit channels.
 */
export class Color {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Color.prototype);
        obj.__wbg_ptr = ptr;
        ColorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof Color)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ColorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_color_free(ptr, 0);
    }
    /**
     * Create a color from RGB values (0-255).
     * @param {number} r
     * @param {number} g
     * @param {number} b
     */
    constructor(r, g, b) {
        const ret = wasm.color_from_rgb(r, g, b);
        this.__wbg_ptr = ret >>> 0;
        ColorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create a color from hex string (e.g., "#FF0000" or "FF0000").
     * @param {string} hex
     * @returns {Color}
     */
    static fromHex(hex) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_export, wasm.__wbindgen_export2);
            const len0 = WASM_VECTOR_LEN;
            wasm.color_fromHex(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Color.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get red channel (0-255).
     * @returns {number}
     */
    get r() {
        const ret = wasm.color_r(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get green channel (0-255).
     * @returns {number}
     */
    get g() {
        const ret = wasm.color_g(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get blue channel (0-255).
     * @returns {number}
     */
    get b() {
        const ret = wasm.color_b(this.__wbg_ptr);
        return ret;
    }
    /**
     * Convert to hex string (e.g., "#FF0000").
     * @returns {string}
     */
    toHex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.color_toHex(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the alpha (opacity) value of this color (0.0-1.0).
     *
     * Returns 1.0 for fully opaque colors.
     * @returns {number}
     */
    get alpha() {
        const ret = wasm.color_alpha(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new Color with the specified alpha (opacity) value.
     *
     * # Arguments
     * * `alpha` - Alpha value (0.0 = transparent, 1.0 = opaque)
     *
     * # Example (JavaScript)
     * ```javascript
     * const color = Color.fromHex("#FF0000");
     * const semiTransparent = color.withAlpha(0.5);
     * console.log(semiTransparent.alpha); // 0.5
     * ```
     * @param {number} alpha
     * @returns {Color}
     */
    withAlpha(alpha) {
        const ret = wasm.color_withAlpha(this.__wbg_ptr, alpha);
        return Color.__wrap(ret);
    }
    /**
     * Make the color lighter by the specified amount.
     *
     * # Arguments
     * * `amount` - Lightness increase (0.0 to 1.0)
     * @param {number} amount
     * @returns {Color}
     */
    lighten(amount) {
        const ret = wasm.color_lighten(this.__wbg_ptr, amount);
        return Color.__wrap(ret);
    }
    /**
     * Make the color darker by the specified amount.
     *
     * # Arguments
     * * `amount` - Lightness decrease (0.0 to 1.0)
     * @param {number} amount
     * @returns {Color}
     */
    darken(amount) {
        const ret = wasm.color_darken(this.__wbg_ptr, amount);
        return Color.__wrap(ret);
    }
    /**
     * Increase the saturation (chroma) of the color.
     *
     * # Arguments
     * * `amount` - Chroma increase
     * @param {number} amount
     * @returns {Color}
     */
    saturate(amount) {
        const ret = wasm.color_saturate(this.__wbg_ptr, amount);
        return Color.__wrap(ret);
    }
    /**
     * Decrease the saturation (chroma) of the color.
     *
     * # Arguments
     * * `amount` - Chroma decrease
     * @param {number} amount
     * @returns {Color}
     */
    desaturate(amount) {
        const ret = wasm.color_desaturate(this.__wbg_ptr, amount);
        return Color.__wrap(ret);
    }
}
if (Symbol.dispose) Color.prototype[Symbol.dispose] = Color.prototype.free;

/**
 * Target compliance level for recommendations.
 * @enum {0 | 1 | 2 | 3}
 */
export const ComplianceTarget = Object.freeze({
    /**
     * WCAG 2.1 Level AA (minimum legal requirement in many jurisdictions)
     */
    WCAG_AA: 0, "0": "WCAG_AA",
    /**
     * WCAG 2.1 Level AAA (enhanced accessibility)
     */
    WCAG_AAA: 1, "1": "WCAG_AAA",
    /**
     * APCA-based recommendations (modern perceptual contrast)
     */
    APCA: 2, "2": "APCA",
    /**
     * Meet both WCAG AA and APCA minimums
     */
    Hybrid: 3, "3": "Hybrid",
});

/**
 * Contact shadow result with computed properties.
 *
 * Represents a calculated contact shadow ready for CSS rendering.
 */
export class ContactShadow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContactShadow.prototype);
        obj.__wbg_ptr = ptr;
        ContactShadowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContactShadowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contactshadow_free(ptr, 0);
    }
    /**
     * Get the shadow color as OKLCH.
     * @returns {OKLCH}
     */
    get color() {
        const ret = wasm.contactshadow_color(this.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
    /**
     * Get blur radius in pixels.
     * @returns {number}
     */
    get blur() {
        const ret = wasm.contactshadow_blur(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get vertical offset in pixels.
     * @returns {number}
     */
    get offsetY() {
        const ret = wasm.contactshadow_offsetY(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get spread in pixels.
     * @returns {number}
     */
    get spread() {
        const ret = wasm.contactshadow_spread(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get opacity (0.0-1.0).
     * @returns {number}
     */
    get opacity() {
        const ret = wasm.color_alpha(this.__wbg_ptr);
        return ret;
    }
    /**
     * Convert to CSS box-shadow string.
     *
     * # Example output
     *
     * `"0 0.5px 2.0px 0.0px oklch(0.050 0.003 240.0 / 0.75)"`
     * @returns {string}
     */
    toCss() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contactshadow_toCss(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ContactShadow.prototype[Symbol.dispose] = ContactShadow.prototype.free;

/**
 * Contact shadow configuration parameters.
 *
 * Contact shadows are the sharp, dark shadows that appear where glass
 * touches the background, creating a sense of physical connection.
 */
export class ContactShadowParams {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContactShadowParams.prototype);
        obj.__wbg_ptr = ptr;
        ContactShadowParamsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContactShadowParamsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contactshadowparams_free(ptr, 0);
    }
    /**
     * Create contact shadow params with custom values.
     *
     * # Arguments
     *
     * * `darkness` - Shadow darkness (0.0 = no shadow, 1.0 = pure black)
     * * `blur_radius` - Blur radius in pixels (typically 1-3px for contact shadows)
     * * `offset_y` - Vertical offset in pixels (typically 0-1px)
     * * `spread` - Shadow spread (typically 0 for contact shadows)
     * @param {number} darkness
     * @param {number} blur_radius
     * @param {number} offset_y
     * @param {number} spread
     */
    constructor(darkness, blur_radius, offset_y, spread) {
        const ret = wasm.contactshadowparams_new(darkness, blur_radius, offset_y, spread);
        this.__wbg_ptr = ret >>> 0;
        ContactShadowParamsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create default contact shadow params (standard glass contact shadow).
     * @returns {ContactShadowParams}
     */
    static default() {
        const ret = wasm.contactshadowparams_default();
        return ContactShadowParams.__wrap(ret);
    }
    /**
     * Standard glass contact shadow preset.
     * @returns {ContactShadowParams}
     */
    static standard() {
        const ret = wasm.contactshadowparams_default();
        return ContactShadowParams.__wrap(ret);
    }
    /**
     * Floating glass preset (lighter contact shadow).
     * @returns {ContactShadowParams}
     */
    static floating() {
        const ret = wasm.contactshadowparams_floating();
        return ContactShadowParams.__wrap(ret);
    }
    /**
     * Grounded glass preset (heavier contact shadow).
     * @returns {ContactShadowParams}
     */
    static grounded() {
        const ret = wasm.contactshadowparams_grounded();
        return ContactShadowParams.__wrap(ret);
    }
    /**
     * Subtle preset (barely visible contact shadow).
     * @returns {ContactShadowParams}
     */
    static subtle() {
        const ret = wasm.contactshadowparams_subtle();
        return ContactShadowParams.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    get darkness() {
        const ret = wasm.contactshadowparams_darkness(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get blurRadius() {
        const ret = wasm.contactshadowparams_blurRadius(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get offsetY() {
        const ret = wasm.contactshadowparams_offsetY(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get spread() {
        const ret = wasm.contactshadow_blur(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) ContactShadowParams.prototype[Symbol.dispose] = ContactShadowParams.prototype.free;

/**
 * Result of a contrast calculation.
 */
export class ContrastResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContrastResult.prototype);
        obj.__wbg_ptr = ptr;
        ContrastResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContrastResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contrastresult_free(ptr, 0);
    }
    /**
     * The contrast value.
     *
     * Interpretation depends on metric:
     * - WCAG: 1.0 to 21.0 (contrast ratio)
     * - APCA: -108 to +106 (Lc value, signed)
     * @returns {number}
     */
    get value() {
        const ret = wasm.__wbg_get_contrastresult_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * The contrast value.
     *
     * Interpretation depends on metric:
     * - WCAG: 1.0 to 21.0 (contrast ratio)
     * - APCA: -108 to +106 (Lc value, signed)
     * @param {number} arg0
     */
    set value(arg0) {
        wasm.__wbg_set_contrastresult_value(this.__wbg_ptr, arg0);
    }
    /**
     * Polarity of the contrast (APCA only).
     *
     * - 1 = dark on light
     * - -1 = light on dark
     * - 0 = not applicable (WCAG)
     * @returns {number}
     */
    get polarity() {
        const ret = wasm.__wbg_get_contrastresult_polarity(this.__wbg_ptr);
        return ret;
    }
    /**
     * Polarity of the contrast (APCA only).
     *
     * - 1 = dark on light
     * - -1 = light on dark
     * - 0 = not applicable (WCAG)
     * @param {number} arg0
     */
    set polarity(arg0) {
        wasm.__wbg_set_contrastresult_polarity(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) ContrastResult.prototype[Symbol.dispose] = ContrastResult.prototype.free;

/**
 * CSS rendering backend
 *
 * Converts evaluated materials to CSS strings with
 * backdrop-filter, background, and other CSS properties.
 */
export class CssBackend {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CssBackendFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cssbackend_free(ptr, 0);
    }
    /**
     * Create new CSS backend
     */
    constructor() {
        const ret = wasm.cssbackend_new();
        this.__wbg_ptr = ret >>> 0;
        CssBackendFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Render evaluated material to CSS string
     *
     * # Arguments
     *
     * * `material` - Evaluated material with resolved properties
     * * `context` - Rendering context
     *
     * # Returns
     *
     * CSS string with all material properties, or error
     *
     * # Example (JavaScript)
     *
     * ```javascript
     * const glass = GlassMaterial.frosted();
     * const evalCtx = EvalMaterialContext.new();
     * const evaluated = glass.evaluate(evalCtx);
     *
     * const backend = new CssBackend();
     * const renderCtx = RenderContext.desktop();
     * const css = backend.render(evaluated, renderCtx);
     * console.log(css); // "backdrop-filter: blur(24px); background: ..."
     * ```
     * @param {EvaluatedMaterial} material
     * @param {RenderContext} context
     * @returns {string}
     */
    render(material, context) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(material, EvaluatedMaterial);
            _assertClass(context, RenderContext);
            wasm.cssbackend_render(retptr, this.__wbg_ptr, material.__wbg_ptr, context.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Get backend name
     * @returns {string}
     */
    name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.cssbackend_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) CssBackend.prototype[Symbol.dispose] = CssBackend.prototype.free;

/**
 * Material Design 3 elevation levels.
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const Elevation = Object.freeze({
    /**
     * Level 0 - Base surface
     */
    Level0: 0, "0": "Level0",
    /**
     * Level 1 - 1dp elevation
     */
    Level1: 1, "1": "Level1",
    /**
     * Level 2 - 3dp elevation
     */
    Level2: 2, "2": "Level2",
    /**
     * Level 3 - 6dp elevation
     */
    Level3: 3, "3": "Level3",
    /**
     * Level 4 - 8dp elevation
     */
    Level4: 4, "4": "Level4",
    /**
     * Level 5 - 12dp elevation
     */
    Level5: 5, "5": "Level5",
});

/**
 * Elevation presets following Apple Liquid Glass patterns
 */
export class ElevationPresets {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ElevationPresetsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_elevationpresets_free(ptr, 0);
    }
    /**
     * Flush with surface (no elevation)
     * @returns {number}
     */
    static get LEVEL_0() {
        const ret = wasm.elevationpresets_LEVEL_0();
        return ret;
    }
    /**
     * Subtle lift (standard buttons)
     * @returns {number}
     */
    static get LEVEL_1() {
        const ret = wasm.elevationpresets_LEVEL_1();
        return ret;
    }
    /**
     * Hover state (interactive lift)
     * @returns {number}
     */
    static get LEVEL_2() {
        const ret = wasm.elevationpresets_LEVEL_2();
        return ret;
    }
    /**
     * Floating cards
     * @returns {number}
     */
    static get LEVEL_3() {
        const ret = wasm.elevationpresets_LEVEL_3();
        return ret;
    }
    /**
     * Modals, sheets
     * @returns {number}
     */
    static get LEVEL_4() {
        const ret = wasm.elevationpresets_LEVEL_4();
        return ret;
    }
    /**
     * Dropdowns, tooltips
     * @returns {number}
     */
    static get LEVEL_5() {
        const ret = wasm.elevationpresets_LEVEL_5();
        return ret;
    }
    /**
     * Drag state (maximum separation)
     * @returns {number}
     */
    static get LEVEL_6() {
        const ret = wasm.elevationpresets_LEVEL_6();
        return ret;
    }
}
if (Symbol.dispose) ElevationPresets.prototype[Symbol.dispose] = ElevationPresets.prototype.free;

/**
 * Elevation shadow result with CSS output
 */
export class ElevationShadow {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ElevationShadow.prototype);
        obj.__wbg_ptr = ptr;
        ElevationShadowFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ElevationShadowFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_elevationshadow_free(ptr, 0);
    }
    /**
     * Get elevation level used
     * @returns {number}
     */
    get elevation() {
        const ret = wasm.elevationshadow_elevation(this.__wbg_ptr);
        return ret;
    }
    /**
     * Convert to CSS box-shadow string
     * @returns {string}
     */
    toCSS() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.elevationshadow_toCSS(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) ElevationShadow.prototype[Symbol.dispose] = ElevationShadow.prototype.free;

/**
 * Material evaluation context for physics-based rendering
 *
 * Defines the viewing and lighting conditions for material evaluation.
 */
export class EvalMaterialContext {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EvalMaterialContext.prototype);
        obj.__wbg_ptr = ptr;
        EvalMaterialContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof EvalMaterialContext)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EvalMaterialContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_evalmaterialcontext_free(ptr, 0);
    }
    /**
     * Create default evaluation context
     *
     * Uses standard viewing angle (0° = looking straight at surface),
     * neutral background, and default lighting.
     */
    constructor() {
        const ret = wasm.evalmaterialcontext_new();
        this.__wbg_ptr = ret >>> 0;
        EvalMaterialContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create context with custom background color
     * @param {OKLCH} background
     * @returns {EvalMaterialContext}
     */
    static withBackground(background) {
        _assertClass(background, OKLCH);
        const ret = wasm.evalmaterialcontext_withBackground(background.__wbg_ptr);
        return EvalMaterialContext.__wrap(ret);
    }
    /**
     * Create context with custom viewing angle
     *
     * # Arguments
     *
     * * `angle_deg` - Viewing angle in degrees (0° = perpendicular, 90° = edge-on)
     * @param {number} angle_deg
     * @returns {EvalMaterialContext}
     */
    static withViewingAngle(angle_deg) {
        const ret = wasm.evalmaterialcontext_withViewingAngle(angle_deg);
        return EvalMaterialContext.__wrap(ret);
    }
    /**
     * Get background color
     * @returns {OKLCH}
     */
    get background() {
        const ret = wasm.contactshadow_color(this.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
    /**
     * Get viewing angle in degrees
     * @returns {number}
     */
    get viewingAngle() {
        const ret = wasm.contactshadow_blur(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get ambient light intensity
     * @returns {number}
     */
    get ambientLight() {
        const ret = wasm.contactshadow_offsetY(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get key light intensity
     * @returns {number}
     */
    get keyLight() {
        const ret = wasm.contactshadow_spread(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) EvalMaterialContext.prototype[Symbol.dispose] = EvalMaterialContext.prototype.free;

/**
 * Evaluated material with all optical properties resolved
 *
 * This is the output of GlassMaterial.evaluate() and contains
 * all computed physics-based properties ready for rendering.
 */
export class EvaluatedMaterial {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EvaluatedMaterial.prototype);
        obj.__wbg_ptr = ptr;
        EvaluatedMaterialFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EvaluatedMaterialFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_evaluatedmaterial_free(ptr, 0);
    }
    /**
     * Get base color (RGB in linear space)
     * @returns {Float64Array}
     */
    baseColor() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.evaluatedmaterial_baseColor(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get final opacity (0.0-1.0)
     * @returns {number}
     */
    get opacity() {
        const ret = wasm.evaluatedmaterial_opacity(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Fresnel reflectance at normal incidence (F0)
     * @returns {number}
     */
    get fresnelF0() {
        const ret = wasm.evaluatedmaterial_fresnelF0(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get edge intensity for Fresnel glow
     * @returns {number}
     */
    get fresnelEdgeIntensity() {
        const ret = wasm.evaluatedmaterial_fresnelEdgeIntensity(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get index of refraction (if applicable)
     * @returns {number | undefined}
     */
    get ior() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.evaluatedmaterial_ior(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : r2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get surface roughness (0.0-1.0)
     * @returns {number}
     */
    get roughness() {
        const ret = wasm.evaluatedmaterial_roughness(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get scattering radius in millimeters (physical property)
     * @returns {number}
     */
    get scatteringRadiusMm() {
        const ret = wasm.evaluatedmaterial_scatteringRadiusMm(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get blur amount in CSS pixels (DEPRECATED)
     *
     * **DEPRECATED:** Use scatteringRadiusMm instead and convert in your renderer.
     * This method assumes 96 DPI and will be removed in v6.0.
     * @returns {number}
     */
    get blurPx() {
        const ret = wasm.evaluatedmaterial_blurPx(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get specular intensity
     * @returns {number}
     */
    get specularIntensity() {
        const ret = wasm.evaluatedmaterial_specularIntensity(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get specular shininess
     * @returns {number}
     */
    get specularShininess() {
        const ret = wasm.evaluatedmaterial_specularShininess(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get thickness in millimeters
     * @returns {number}
     */
    get thicknessMm() {
        const ret = wasm.evaluatedmaterial_thicknessMm(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get absorption coefficients (RGB)
     * @returns {Float64Array}
     */
    get absorption() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.evaluatedmaterial_absorption(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get scattering coefficients (RGB)
     * @returns {Float64Array}
     */
    get scattering() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.evaluatedmaterial_scattering(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) EvaluatedMaterial.prototype[Symbol.dispose] = EvaluatedMaterial.prototype.free;

/**
 * Multi-layer glass composition.
 */
export class GlassLayers {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GlassLayers.prototype);
        obj.__wbg_ptr = ptr;
        GlassLayersFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GlassLayersFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_glasslayers_free(ptr, 0);
    }
    /**
     * Top layer: Specular highlights
     * @returns {OKLCH}
     */
    get highlight() {
        const ret = wasm.__wbg_get_glasslayers_highlight(this.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
    /**
     * Middle layer: Base glass tint
     * @returns {OKLCH}
     */
    get base() {
        const ret = wasm.__wbg_get_glasslayers_base(this.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
    /**
     * Bottom layer: Shadow for depth
     * @returns {OKLCH}
     */
    get shadow() {
        const ret = wasm.__wbg_get_glasslayers_shadow(this.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
}
if (Symbol.dispose) GlassLayers.prototype[Symbol.dispose] = GlassLayers.prototype.free;

/**
 * Physical glass material properties
 */
export class GlassMaterial {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GlassMaterial.prototype);
        obj.__wbg_ptr = ptr;
        GlassMaterialFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof GlassMaterial)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GlassMaterialFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_glassmaterial_free(ptr, 0);
    }
    /**
     * Create glass material with custom properties
     *
     * # Arguments
     *
     * * `ior` - Index of refraction (1.0-2.5, typical glass: 1.5)
     * * `roughness` - Surface roughness (0.0-1.0, 0 = mirror-smooth)
     * * `thickness` - Thickness in millimeters
     * * `noise_scale` - Frosted texture amount (0.0-1.0)
     * * `base_color` - Material tint color
     * * `edge_power` - Fresnel edge sharpness (1.0-4.0)
     * @param {number} ior
     * @param {number} roughness
     * @param {number} thickness
     * @param {number} noise_scale
     * @param {OKLCH} base_color
     * @param {number} edge_power
     */
    constructor(ior, roughness, thickness, noise_scale, base_color, edge_power) {
        _assertClass(base_color, OKLCH);
        const ret = wasm.glassmaterial_new(ior, roughness, thickness, noise_scale, base_color.__wbg_ptr, edge_power);
        this.__wbg_ptr = ret >>> 0;
        GlassMaterialFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create clear glass preset
     * IOR: 1.5, Roughness: 0.05, Thickness: 2mm
     * @returns {GlassMaterial}
     */
    static clear() {
        const ret = wasm.glassmaterial_clear();
        return GlassMaterial.__wrap(ret);
    }
    /**
     * Create regular glass preset (Apple-like)
     * IOR: 1.5, Roughness: 0.15, Thickness: 5mm
     * @returns {GlassMaterial}
     */
    static regular() {
        const ret = wasm.glassmaterial_regular();
        return GlassMaterial.__wrap(ret);
    }
    /**
     * Create thick glass preset
     * IOR: 1.52, Roughness: 0.25, Thickness: 10mm
     * @returns {GlassMaterial}
     */
    static thick() {
        const ret = wasm.glassmaterial_thick();
        return GlassMaterial.__wrap(ret);
    }
    /**
     * Create frosted glass preset
     * IOR: 1.5, Roughness: 0.6, Thickness: 8mm
     * @returns {GlassMaterial}
     */
    static frosted() {
        const ret = wasm.glassmaterial_frosted();
        return GlassMaterial.__wrap(ret);
    }
    /**
     * Get index of refraction
     * @returns {number}
     */
    get ior() {
        const ret = wasm.contactshadowparams_darkness(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get surface roughness
     * @returns {number}
     */
    get roughness() {
        const ret = wasm.contactshadowparams_blurRadius(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get thickness in millimeters
     * @returns {number}
     */
    get thickness() {
        const ret = wasm.contactshadowparams_offsetY(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get noise scale
     * @returns {number}
     */
    get noiseScale() {
        const ret = wasm.contactshadow_blur(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get base color
     * @returns {OKLCH}
     */
    get baseColor() {
        const ret = wasm.glassmaterial_baseColor(this.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
    /**
     * Get edge power
     * @returns {number}
     */
    get edgePower() {
        const ret = wasm.glassmaterial_edgePower(this.__wbg_ptr);
        return ret;
    }
    /**
     * Calculate Blinn-Phong shininess from roughness
     * @returns {number}
     */
    shininess() {
        const ret = wasm.glassmaterial_shininess(this.__wbg_ptr);
        return ret;
    }
    /**
     * Calculate scattering radius in millimeters (physical property)
     * @returns {number}
     */
    scatteringRadiusMm() {
        const ret = wasm.glassmaterial_scatteringRadiusMm(this.__wbg_ptr);
        return ret;
    }
    /**
     * Calculate blur amount in pixels (DEPRECATED)
     *
     * **DEPRECATED:** Use scatteringRadiusMm() instead and convert in your renderer.
     * This assumes 96 DPI and will be removed in v6.0.
     * @returns {number}
     */
    blurAmount() {
        const ret = wasm.glassmaterial_blurAmount(this.__wbg_ptr);
        return ret;
    }
    /**
     * Calculate translucency (opacity 0-1)
     * @returns {number}
     */
    translucency() {
        const ret = wasm.glassmaterial_translucency(this.__wbg_ptr);
        return ret;
    }
    /**
     * Evaluate material properties based on context (Phase 3 pipeline)
     *
     * Performs full physics-based evaluation including Fresnel reflectance,
     * Beer-Lambert absorption, and subsurface scattering.
     *
     * # Arguments
     *
     * * `context` - Material evaluation context (lighting, viewing angle, background)
     *
     * # Returns
     *
     * EvaluatedMaterial with all optical properties resolved
     *
     * # Example (JavaScript)
     *
     * ```javascript
     * const glass = GlassMaterial.frosted();
     * const context = EvalMaterialContext.default();
     * const evaluated = glass.evaluate(context);
     * console.log(`Opacity: ${evaluated.opacity}`);
     * console.log(`Scattering: ${evaluated.scatteringRadiusMm}mm`);
     * ```
     * @param {EvalMaterialContext} context
     * @returns {EvaluatedMaterial}
     */
    evaluate(context) {
        _assertClass(context, EvalMaterialContext);
        const ret = wasm.glassmaterial_evaluate(this.__wbg_ptr, context.__wbg_ptr);
        return EvaluatedMaterial.__wrap(ret);
    }
    /**
     * Create a builder for custom glass materials (Gap 5 - P1).
     *
     * Provides a fluent API for creating glass materials with custom properties.
     * Unset properties default to the "regular" preset values.
     *
     * # Example (JavaScript)
     *
     * ```javascript
     * const custom = GlassMaterial.builder()
     *     .ior(1.45)
     *     .roughness(0.3)
     *     .thickness(8.0)
     *     .build();
     * ```
     * @returns {GlassMaterialBuilder}
     */
    static builder() {
        const ret = wasm.glassmaterial_builder();
        return GlassMaterialBuilder.__wrap(ret);
    }
}
if (Symbol.dispose) GlassMaterial.prototype[Symbol.dispose] = GlassMaterial.prototype.free;

/**
 * Builder for creating custom GlassMaterial instances.
 *
 * Provides a fluent API for creating glass materials with custom properties.
 * All unset properties default to the "regular" glass preset values.
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * // Create a custom material
 * const custom = GlassMaterial.builder()
 *     .ior(1.45)
 *     .roughness(0.3)
 *     .thickness(8.0)
 *     .baseColor(new OKLCH(0.9, 0.05, 200.0))
 *     .build();
 *
 * // Or start from a preset and modify
 * const variant = GlassMaterial.builder()
 *     .presetFrosted()
 *     .thickness(12.0)
 *     .build();
 * ```
 */
export class GlassMaterialBuilder {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GlassMaterialBuilder.prototype);
        obj.__wbg_ptr = ptr;
        GlassMaterialBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GlassMaterialBuilderFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_glassmaterialbuilder_free(ptr, 0);
    }
    /**
     * Create a new builder with no preset values.
     */
    constructor() {
        const ret = wasm.glassmaterial_builder();
        this.__wbg_ptr = ret >>> 0;
        GlassMaterialBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Start from the "clear" preset.
     * @returns {GlassMaterialBuilder}
     */
    presetClear() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_presetClear(ptr);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Start from the "regular" preset.
     * @returns {GlassMaterialBuilder}
     */
    presetRegular() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_presetRegular(ptr);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Start from the "thick" preset.
     * @returns {GlassMaterialBuilder}
     */
    presetThick() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_presetThick(ptr);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Start from the "frosted" preset.
     * @returns {GlassMaterialBuilder}
     */
    presetFrosted() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_presetFrosted(ptr);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Set the index of refraction (IOR).
     *
     * Valid range: 1.0 - 2.5
     * @param {number} ior
     * @returns {GlassMaterialBuilder}
     */
    ior(ior) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_ior(ptr, ior);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Set the surface roughness.
     *
     * Valid range: 0.0 - 1.0
     * @param {number} roughness
     * @returns {GlassMaterialBuilder}
     */
    roughness(roughness) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_roughness(ptr, roughness);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Set the glass thickness in millimeters.
     * @param {number} mm
     * @returns {GlassMaterialBuilder}
     */
    thickness(mm) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_thickness(ptr, mm);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Set the noise scale for frosted texture.
     *
     * Valid range: 0.0 - 1.0
     * @param {number} scale
     * @returns {GlassMaterialBuilder}
     */
    noiseScale(scale) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_noiseScale(ptr, scale);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Set the base color tint.
     * @param {OKLCH} color
     * @returns {GlassMaterialBuilder}
     */
    baseColor(color) {
        const ptr = this.__destroy_into_raw();
        _assertClass(color, OKLCH);
        const ret = wasm.glassmaterialbuilder_baseColor(ptr, color.__wbg_ptr);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Set the edge power for Fresnel glow.
     *
     * Valid range: 1.0 - 4.0
     * @param {number} power
     * @returns {GlassMaterialBuilder}
     */
    edgePower(power) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_edgePower(ptr, power);
        return GlassMaterialBuilder.__wrap(ret);
    }
    /**
     * Build the GlassMaterial.
     *
     * Any unset properties default to the "regular" preset values.
     * @returns {GlassMaterial}
     */
    build() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.glassmaterialbuilder_build(ptr);
        return GlassMaterial.__wrap(ret);
    }
}
if (Symbol.dispose) GlassMaterialBuilder.prototype[Symbol.dispose] = GlassMaterialBuilder.prototype.free;

/**
 * High-level glass physics engine combining all calculations
 */
export class GlassPhysicsEngine {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GlassPhysicsEngine.prototype);
        obj.__wbg_ptr = ptr;
        GlassPhysicsEngineFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GlassPhysicsEngineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_glassphysicsengine_free(ptr, 0);
    }
    /**
     * Create new glass physics engine with material preset
     *
     * # Arguments
     *
     * * `preset` - "clear", "regular", "thick", or "frosted"
     * @param {string} preset
     */
    constructor(preset) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(preset, wasm.__wbindgen_export, wasm.__wbindgen_export2);
            const len0 = WASM_VECTOR_LEN;
            wasm.glassphysicsengine_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            GlassPhysicsEngineFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create with custom material and noise
     * @param {GlassMaterial} material
     * @param {PerlinNoise} noise
     * @returns {GlassPhysicsEngine}
     */
    static withCustom(material, noise) {
        _assertClass(material, GlassMaterial);
        _assertClass(noise, PerlinNoise);
        const ret = wasm.glassphysicsengine_withCustom(material.__wbg_ptr, noise.__wbg_ptr);
        return GlassPhysicsEngine.__wrap(ret);
    }
    /**
     * Get material
     * @returns {GlassMaterial}
     */
    get material() {
        const ret = wasm.glassphysicsengine_material(this.__wbg_ptr);
        return GlassMaterial.__wrap(ret);
    }
    /**
     * Calculate complete glass properties for rendering
     *
     * Returns object with all CSS-ready values:
     * - opacity: Material translucency (0-1)
     * - blur: Blur amount in pixels
     * - fresnel: Array of gradient stops [position, intensity, ...]
     * - specular: Array of layer data [intensity, x, y, size, ...]
     * - noise: Noise texture scale
     * @param {Vec3} normal
     * @param {Vec3} light_dir
     * @param {Vec3} view_dir
     * @returns {object}
     */
    calculateProperties(normal, light_dir, view_dir) {
        _assertClass(normal, Vec3);
        _assertClass(light_dir, Vec3);
        _assertClass(view_dir, Vec3);
        const ret = wasm.glassphysicsengine_calculateProperties(this.__wbg_ptr, normal.__wbg_ptr, light_dir.__wbg_ptr, view_dir.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Generate noise texture
     * @param {number} width
     * @param {number} height
     * @param {number} scale
     * @returns {Uint8Array}
     */
    generateNoiseTexture(width, height, scale) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.glassphysicsengine_generateNoiseTexture(retptr, this.__wbg_ptr, width, height, scale);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) GlassPhysicsEngine.prototype[Symbol.dispose] = GlassPhysicsEngine.prototype.free;

/**
 * Glass properties defining the multi-layer composition.
 */
export class GlassProperties {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GlassProperties.prototype);
        obj.__wbg_ptr = ptr;
        GlassPropertiesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GlassPropertiesFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_glassproperties_free(ptr, 0);
    }
    /**
     * Create default glass properties.
     */
    constructor() {
        const ret = wasm.glassproperties_new();
        this.__wbg_ptr = ret >>> 0;
        GlassPropertiesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get base tint color.
     * @returns {OKLCH}
     */
    getBaseTint() {
        const ret = wasm.contactshadow_color(this.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
    /**
     * Set base tint color.
     * @param {OKLCH} tint
     */
    setBaseTint(tint) {
        _assertClass(tint, OKLCH);
        wasm.glassproperties_setBaseTint(this.__wbg_ptr, tint.__wbg_ptr);
    }
    /**
     * Get opacity (0.0 = transparent, 1.0 = opaque).
     * @returns {number}
     */
    get opacity() {
        const ret = wasm.contactshadow_blur(this.__wbg_ptr);
        return ret;
    }
    /**
     * Set opacity.
     * @param {number} value
     */
    set opacity(value) {
        wasm.glassproperties_set_opacity(this.__wbg_ptr, value);
    }
    /**
     * Get blur radius in pixels.
     * @returns {number}
     */
    get blurRadius() {
        const ret = wasm.contactshadow_offsetY(this.__wbg_ptr);
        return ret;
    }
    /**
     * Set blur radius.
     * @param {number} value
     */
    set blurRadius(value) {
        wasm.glassproperties_set_blurRadius(this.__wbg_ptr, value);
    }
    /**
     * Get reflectivity (0.0 = none, 1.0 = mirror).
     * @returns {number}
     */
    get reflectivity() {
        const ret = wasm.contactshadow_spread(this.__wbg_ptr);
        return ret;
    }
    /**
     * Set reflectivity.
     * @param {number} value
     */
    set reflectivity(value) {
        wasm.glassproperties_set_reflectivity(this.__wbg_ptr, value);
    }
    /**
     * Get refraction index.
     * @returns {number}
     */
    get refraction() {
        const ret = wasm.color_alpha(this.__wbg_ptr);
        return ret;
    }
    /**
     * Set refraction index.
     * @param {number} value
     */
    set refraction(value) {
        wasm.glassproperties_set_refraction(this.__wbg_ptr, value);
    }
    /**
     * Get depth/thickness.
     * @returns {number}
     */
    get depth() {
        const ret = wasm.glassmaterial_edgePower(this.__wbg_ptr);
        return ret;
    }
    /**
     * Set depth/thickness.
     * @param {number} value
     */
    set depth(value) {
        wasm.glassproperties_set_depth(this.__wbg_ptr, value);
    }
    /**
     * Get noise scale.
     * @returns {number}
     */
    get noiseScale() {
        const ret = wasm.glassproperties_noiseScale(this.__wbg_ptr);
        return ret;
    }
    /**
     * Set noise scale.
     * @param {number} value
     */
    set noiseScale(value) {
        wasm.glassproperties_set_noiseScale(this.__wbg_ptr, value);
    }
    /**
     * Get specular intensity.
     * @returns {number}
     */
    get specularIntensity() {
        const ret = wasm.glassproperties_specularIntensity(this.__wbg_ptr);
        return ret;
    }
    /**
     * Set specular intensity.
     * @param {number} value
     */
    set specularIntensity(value) {
        wasm.glassproperties_set_specularIntensity(this.__wbg_ptr, value);
    }
}
if (Symbol.dispose) GlassProperties.prototype[Symbol.dispose] = GlassProperties.prototype.free;

/**
 * Configuration for enhanced glass CSS rendering.
 *
 * Controls all physics-based visual effects:
 * - Specular highlights (Blinn-Phong)
 * - Fresnel edge glow
 * - Inner highlights
 * - Multi-layer elevation shadows
 * - Backdrop saturation
 */
export class GlassRenderOptions {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(GlassRenderOptions.prototype);
        obj.__wbg_ptr = ptr;
        GlassRenderOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GlassRenderOptionsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_glassrenderoptions_free(ptr, 0);
    }
    /**
     * Create options with default settings.
     */
    constructor() {
        const ret = wasm.glassrenderoptions_new();
        this.__wbg_ptr = ret >>> 0;
        GlassRenderOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create minimal preset (no visual effects).
     * @returns {GlassRenderOptions}
     */
    static minimal() {
        const ret = wasm.glassrenderoptions_minimal();
        return GlassRenderOptions.__wrap(ret);
    }
    /**
     * Create premium preset (Apple Liquid Glass quality).
     * @returns {GlassRenderOptions}
     */
    static premium() {
        const ret = wasm.glassrenderoptions_premium();
        return GlassRenderOptions.__wrap(ret);
    }
    /**
     * Create modal preset (floating dialogs).
     * @returns {GlassRenderOptions}
     */
    static modal() {
        const ret = wasm.glassrenderoptions_modal();
        return GlassRenderOptions.__wrap(ret);
    }
    /**
     * Create subtle preset (content-focused cards).
     * @returns {GlassRenderOptions}
     */
    static subtle() {
        const ret = wasm.glassrenderoptions_subtle();
        return GlassRenderOptions.__wrap(ret);
    }
    /**
     * Create dark mode preset.
     * @returns {GlassRenderOptions}
     */
    static darkMode() {
        const ret = wasm.glassrenderoptions_darkMode();
        return GlassRenderOptions.__wrap(ret);
    }
    /**
     * Enable or disable specular highlights.
     * @param {boolean} value
     */
    set specularEnabled(value) {
        wasm.glassrenderoptions_set_specularEnabled(this.__wbg_ptr, value);
    }
    /**
     * Set specular highlight intensity (0.0-1.0).
     * @param {number} value
     */
    set specularIntensity(value) {
        wasm.glassrenderoptions_set_specularIntensity(this.__wbg_ptr, value);
    }
    /**
     * Enable or disable Fresnel edge glow.
     * @param {boolean} value
     */
    set fresnelEnabled(value) {
        wasm.glassrenderoptions_set_fresnelEnabled(this.__wbg_ptr, value);
    }
    /**
     * Set Fresnel edge intensity (0.0-1.0).
     * @param {number} value
     */
    set fresnelIntensity(value) {
        wasm.glassrenderoptions_set_fresnelIntensity(this.__wbg_ptr, value);
    }
    /**
     * Set elevation level (0-6).
     * @param {number} value
     */
    set elevation(value) {
        wasm.glassrenderoptions_set_elevation(this.__wbg_ptr, value);
    }
    /**
     * Enable or disable backdrop saturation boost.
     * @param {boolean} value
     */
    set saturate(value) {
        wasm.glassrenderoptions_set_saturate(this.__wbg_ptr, value);
    }
    /**
     * Set border radius in pixels.
     * @param {number} value
     */
    set borderRadius(value) {
        wasm.glassproperties_set_noiseScale(this.__wbg_ptr, value);
    }
    /**
     * Set light mode (true) or dark mode (false).
     * @param {boolean} value
     */
    set lightMode(value) {
        wasm.glassrenderoptions_set_lightMode(this.__wbg_ptr, value);
    }
    /**
     * Enable or disable inner highlight.
     * @param {boolean} value
     */
    set innerHighlightEnabled(value) {
        wasm.glassrenderoptions_set_innerHighlightEnabled(this.__wbg_ptr, value);
    }
    /**
     * Enable or disable border.
     * @param {boolean} value
     */
    set borderEnabled(value) {
        wasm.glassrenderoptions_set_borderEnabled(this.__wbg_ptr, value);
    }
}
if (Symbol.dispose) GlassRenderOptions.prototype[Symbol.dispose] = GlassRenderOptions.prototype.free;

/**
 * Glass variant defines the visual behavior of Liquid Glass.
 * @enum {0 | 1}
 */
export const GlassVariant = Object.freeze({
    /**
     * Regular glass - adaptive, most versatile
     */
    Regular: 0, "0": "Regular",
    /**
     * Clear glass - permanently more transparent
     */
    Clear: 1, "1": "Clear",
});

/**
 * Multi-layer transmittance result
 */
export class LayerTransmittance {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LayerTransmittance.prototype);
        obj.__wbg_ptr = ptr;
        LayerTransmittanceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LayerTransmittanceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_layertransmittance_free(ptr, 0);
    }
    /**
     * Surface layer (edge highlight) - High reflectivity, bright
     * @returns {number}
     */
    get surface() {
        const ret = wasm.contactshadowparams_darkness(this.__wbg_ptr);
        return ret;
    }
    /**
     * Volume layer (glass body) - Main transmittance value
     * @returns {number}
     */
    get volume() {
        const ret = wasm.contactshadowparams_blurRadius(this.__wbg_ptr);
        return ret;
    }
    /**
     * Substrate layer (deep contact) - Darkest layer, creates depth
     * @returns {number}
     */
    get substrate() {
        const ret = wasm.contactshadowparams_offsetY(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) LayerTransmittance.prototype[Symbol.dispose] = LayerTransmittance.prototype.free;

/**
 * Lighting context for material evaluation
 */
export class LightingContext {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LightingContext.prototype);
        obj.__wbg_ptr = ptr;
        LightingContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LightingContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_lightingcontext_free(ptr, 0);
    }
    /**
     * Create studio lighting preset
     * @returns {LightingContext}
     */
    static studio() {
        const ret = wasm.lightingcontext_studio();
        return LightingContext.__wrap(ret);
    }
    /**
     * Create outdoor lighting preset
     * @returns {LightingContext}
     */
    static outdoor() {
        const ret = wasm.lightingcontext_outdoor();
        return LightingContext.__wrap(ret);
    }
    /**
     * Create dramatic lighting preset
     * @returns {LightingContext}
     */
    static dramatic() {
        const ret = wasm.lightingcontext_dramatic();
        return LightingContext.__wrap(ret);
    }
    /**
     * Create soft lighting preset
     * @returns {LightingContext}
     */
    static soft() {
        const ret = wasm.lightingcontext_soft();
        return LightingContext.__wrap(ret);
    }
    /**
     * Create neutral lighting preset
     * @returns {LightingContext}
     */
    static neutral() {
        const ret = wasm.lightingcontext_neutral();
        return LightingContext.__wrap(ret);
    }
}
if (Symbol.dispose) LightingContext.prototype[Symbol.dispose] = LightingContext.prototype.free;

/**
 * Liquid Glass surface with adaptive behavior.
 *
 * Implementation of Apple's Liquid Glass material system from WWDC 2025.
 */
export class LiquidGlass {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LiquidGlass.prototype);
        obj.__wbg_ptr = ptr;
        LiquidGlassFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LiquidGlassFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_liquidglass_free(ptr, 0);
    }
    /**
     * Create new Liquid Glass with specified variant.
     * @param {GlassVariant} variant
     */
    constructor(variant) {
        const ret = wasm.liquidglass_new(variant);
        this.__wbg_ptr = ret >>> 0;
        LiquidGlassFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create with custom properties.
     * @param {GlassVariant} variant
     * @param {GlassProperties} properties
     * @returns {LiquidGlass}
     */
    static withProperties(variant, properties) {
        _assertClass(properties, GlassProperties);
        const ret = wasm.liquidglass_withProperties(variant, properties.__wbg_ptr);
        return LiquidGlass.__wrap(ret);
    }
    /**
     * Calculate effective color when glass is over background.
     * @param {Color} background
     * @returns {Color}
     */
    effectiveColor(background) {
        _assertClass(background, Color);
        const ret = wasm.liquidglass_effectiveColor(this.__wbg_ptr, background.__wbg_ptr);
        return Color.__wrap(ret);
    }
    /**
     * Recommend text color for maximum readability.
     *
     * # Arguments
     *
     * * `background` - Background color behind the glass
     * * `prefer_white` - Whether to prefer white text over dark text
     * @param {Color} background
     * @param {boolean} prefer_white
     * @returns {Color}
     */
    recommendTextColor(background, prefer_white) {
        _assertClass(background, Color);
        const ret = wasm.liquidglass_recommendTextColor(this.__wbg_ptr, background.__wbg_ptr, prefer_white);
        return Color.__wrap(ret);
    }
    /**
     * Decompose into multi-layer structure.
     * @param {Color} background
     * @returns {GlassLayers}
     */
    getLayers(background) {
        _assertClass(background, Color);
        const ret = wasm.liquidglass_getLayers(this.__wbg_ptr, background.__wbg_ptr);
        return GlassLayers.__wrap(ret);
    }
    /**
     * Adapt glass properties for dark mode.
     */
    adaptForDarkMode() {
        wasm.liquidglass_adaptForDarkMode(this.__wbg_ptr);
    }
    /**
     * Adapt glass properties for light mode.
     */
    adaptForLightMode() {
        wasm.liquidglass_adaptForLightMode(this.__wbg_ptr);
    }
    /**
     * Get variant.
     * @returns {GlassVariant}
     */
    get variant() {
        const ret = wasm.liquidglass_variant(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get properties.
     * @returns {GlassProperties}
     */
    get properties() {
        const ret = wasm.liquidglass_properties(this.__wbg_ptr);
        return GlassProperties.__wrap(ret);
    }
}
if (Symbol.dispose) LiquidGlass.prototype[Symbol.dispose] = LiquidGlass.prototype.free;

/**
 * Complete material context (lighting + background + view)
 */
export class MaterialContext {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MaterialContext.prototype);
        obj.__wbg_ptr = ptr;
        MaterialContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MaterialContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_materialcontext_free(ptr, 0);
    }
    /**
     * Create studio preset context
     * @returns {MaterialContext}
     */
    static studio() {
        const ret = wasm.materialcontext_studio();
        return MaterialContext.__wrap(ret);
    }
    /**
     * Create outdoor preset context
     * @returns {MaterialContext}
     */
    static outdoor() {
        const ret = wasm.materialcontext_outdoor();
        return MaterialContext.__wrap(ret);
    }
    /**
     * Create dramatic preset context
     * @returns {MaterialContext}
     */
    static dramatic() {
        const ret = wasm.materialcontext_dramatic();
        return MaterialContext.__wrap(ret);
    }
    /**
     * Create neutral preset context
     * @returns {MaterialContext}
     */
    static neutral() {
        const ret = wasm.materialcontext_neutral();
        return MaterialContext.__wrap(ret);
    }
    /**
     * Create showcase preset context
     * @returns {MaterialContext}
     */
    static showcase() {
        const ret = wasm.materialcontext_showcase();
        return MaterialContext.__wrap(ret);
    }
}
if (Symbol.dispose) MaterialContext.prototype[Symbol.dispose] = MaterialContext.prototype.free;

/**
 * Material surface with elevation and optional glass effect.
 */
export class MaterialSurface {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MaterialSurface.prototype);
        obj.__wbg_ptr = ptr;
        MaterialSurfaceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MaterialSurfaceFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_materialsurface_free(ptr, 0);
    }
    /**
     * Create material surface from elevation and theme color.
     * @param {Elevation} elevation
     * @param {OKLCH} theme_primary
     */
    constructor(elevation, theme_primary) {
        _assertClass(theme_primary, OKLCH);
        const ret = wasm.materialsurface_new(elevation, theme_primary.__wbg_ptr);
        this.__wbg_ptr = ret >>> 0;
        MaterialSurfaceFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Apply glass overlay to elevated surface.
     * @param {LiquidGlass} glass
     * @returns {MaterialSurface}
     */
    withGlass(glass) {
        const ptr = this.__destroy_into_raw();
        _assertClass(glass, LiquidGlass);
        const ret = wasm.materialsurface_withGlass(ptr, glass.__wbg_ptr);
        return MaterialSurface.__wrap(ret);
    }
    /**
     * Calculate final surface color over base.
     * @param {Color} base_surface
     * @returns {Color}
     */
    surfaceColor(base_surface) {
        _assertClass(base_surface, Color);
        const ret = wasm.materialsurface_surfaceColor(this.__wbg_ptr, base_surface.__wbg_ptr);
        return Color.__wrap(ret);
    }
    /**
     * Get elevation.
     * @returns {Elevation}
     */
    get elevation() {
        const ret = wasm.materialsurface_elevation(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get surface tint.
     * @returns {OKLCH}
     */
    get surfaceTint() {
        const ret = wasm.contactshadow_color(this.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
}
if (Symbol.dispose) MaterialSurface.prototype[Symbol.dispose] = MaterialSurface.prototype.free;

/**
 * OKLCH color space value.
 *
 * Perceptually uniform cylindrical color space.
 */
export class OKLCH {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OKLCH.prototype);
        obj.__wbg_ptr = ptr;
        OKLCHFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OKLCHFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_oklch_free(ptr, 0);
    }
    /**
     * Create OKLCH color from L, C, H values.
     *
     * # Arguments
     *
     * * `l` - Lightness (0.0 to 1.0)
     * * `c` - Chroma (0.0 to ~0.4)
     * * `h` - Hue (0.0 to 360.0 degrees)
     * @param {number} l
     * @param {number} c
     * @param {number} h
     */
    constructor(l, c, h) {
        const ret = wasm.oklch_new(l, c, h);
        this.__wbg_ptr = ret >>> 0;
        OKLCHFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Convert RGB color to OKLCH.
     * @param {Color} color
     * @returns {OKLCH}
     */
    static fromColor(color) {
        _assertClass(color, Color);
        const ret = wasm.oklch_fromColor(color.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
    /**
     * Convert OKLCH to RGB color.
     * @returns {Color}
     */
    toColor() {
        const ret = wasm.oklch_toColor(this.__wbg_ptr);
        return Color.__wrap(ret);
    }
    /**
     * Get lightness (0.0 to 1.0).
     * @returns {number}
     */
    get l() {
        const ret = wasm.contactshadowparams_darkness(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get chroma (0.0 to ~0.4).
     * @returns {number}
     */
    get c() {
        const ret = wasm.contactshadowparams_blurRadius(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get hue (0.0 to 360.0).
     * @returns {number}
     */
    get h() {
        const ret = wasm.contactshadowparams_offsetY(this.__wbg_ptr);
        return ret;
    }
    /**
     * Make color lighter by delta.
     * @param {number} delta
     * @returns {OKLCH}
     */
    lighten(delta) {
        const ret = wasm.oklch_lighten(this.__wbg_ptr, delta);
        return OKLCH.__wrap(ret);
    }
    /**
     * Make color darker by delta.
     * @param {number} delta
     * @returns {OKLCH}
     */
    darken(delta) {
        const ret = wasm.oklch_darken(this.__wbg_ptr, delta);
        return OKLCH.__wrap(ret);
    }
    /**
     * Increase chroma (saturation) by factor.
     * @param {number} factor
     * @returns {OKLCH}
     */
    saturate(factor) {
        const ret = wasm.oklch_saturate(this.__wbg_ptr, factor);
        return OKLCH.__wrap(ret);
    }
    /**
     * Decrease chroma (saturation) by factor.
     * @param {number} factor
     * @returns {OKLCH}
     */
    desaturate(factor) {
        const ret = wasm.oklch_desaturate(this.__wbg_ptr, factor);
        return OKLCH.__wrap(ret);
    }
    /**
     * Rotate hue by degrees.
     * @param {number} degrees
     * @returns {OKLCH}
     */
    rotateHue(degrees) {
        const ret = wasm.oklch_rotateHue(this.__wbg_ptr, degrees);
        return OKLCH.__wrap(ret);
    }
    /**
     * Map to sRGB gamut by reducing chroma if necessary.
     * @returns {OKLCH}
     */
    mapToGamut() {
        const ret = wasm.oklch_mapToGamut(this.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
    /**
     * Calculate perceptual difference (Delta E) between two colors.
     * @param {OKLCH} other
     * @returns {number}
     */
    deltaE(other) {
        _assertClass(other, OKLCH);
        const ret = wasm.oklch_deltaE(this.__wbg_ptr, other.__wbg_ptr);
        return ret;
    }
    /**
     * Interpolate between two OKLCH colors.
     *
     * # Arguments
     *
     * * `a` - Start color
     * * `b` - End color
     * * `t` - Interpolation factor (0.0 to 1.0)
     * * `hue_path` - "shorter" or "longer"
     * @param {OKLCH} a
     * @param {OKLCH} b
     * @param {number} t
     * @param {string} hue_path
     * @returns {OKLCH}
     */
    static interpolate(a, b, t, hue_path) {
        _assertClass(a, OKLCH);
        _assertClass(b, OKLCH);
        const ptr0 = passStringToWasm0(hue_path, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.oklch_interpolate(a.__wbg_ptr, b.__wbg_ptr, t, ptr0, len0);
        return OKLCH.__wrap(ret);
    }
}
if (Symbol.dispose) OKLCH.prototype[Symbol.dispose] = OKLCH.prototype.free;

/**
 * Optical properties of glass material
 */
export class OpticalProperties {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OpticalProperties.prototype);
        obj.__wbg_ptr = ptr;
        OpticalPropertiesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OpticalPropertiesFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_opticalproperties_free(ptr, 0);
    }
    /**
     * Create with custom optical properties
     * @param {number} absorption_coefficient
     * @param {number} scattering_coefficient
     * @param {number} thickness
     * @param {number} refractive_index
     */
    constructor(absorption_coefficient, scattering_coefficient, thickness, refractive_index) {
        const ret = wasm.opticalproperties_new(absorption_coefficient, scattering_coefficient, thickness, refractive_index);
        this.__wbg_ptr = ret >>> 0;
        OpticalPropertiesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create default optical properties
     * @returns {OpticalProperties}
     */
    static default() {
        const ret = wasm.opticalproperties_default();
        return OpticalProperties.__wrap(ret);
    }
    /**
     * Get absorption coefficient
     * @returns {number}
     */
    get absorptionCoefficient() {
        const ret = wasm.contactshadowparams_darkness(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get scattering coefficient
     * @returns {number}
     */
    get scatteringCoefficient() {
        const ret = wasm.contactshadowparams_blurRadius(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get thickness
     * @returns {number}
     */
    get thickness() {
        const ret = wasm.contactshadowparams_offsetY(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get refractive index
     * @returns {number}
     */
    get refractiveIndex() {
        const ret = wasm.contactshadow_blur(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) OpticalProperties.prototype[Symbol.dispose] = OpticalProperties.prototype.free;

/**
 * Perlin noise generator for frosted glass textures
 */
export class PerlinNoise {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PerlinNoise.prototype);
        obj.__wbg_ptr = ptr;
        PerlinNoiseFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PerlinNoiseFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_perlinnoise_free(ptr, 0);
    }
    /**
     * Create new Perlin noise generator
     *
     * # Arguments
     *
     * * `seed` - Random seed for reproducibility
     * * `octaves` - Number of noise layers (1-8)
     * * `persistence` - Amplitude decrease per octave (0.0-1.0)
     * * `lacunarity` - Frequency increase per octave (typically 2.0)
     * @param {number} seed
     * @param {number} octaves
     * @param {number} persistence
     * @param {number} lacunarity
     */
    constructor(seed, octaves, persistence, lacunarity) {
        const ret = wasm.perlinnoise_new(seed, octaves, persistence, lacunarity);
        this.__wbg_ptr = ret >>> 0;
        PerlinNoiseFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Generate 2D noise value at position
     *
     * Returns value in range [-1.0, 1.0]
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    noise2D(x, y) {
        const ret = wasm.perlinnoise_noise2D(this.__wbg_ptr, x, y);
        return ret;
    }
    /**
     * Generate fractal (multi-octave) 2D noise
     *
     * Returns value in range [-1.0, 1.0]
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    fractalNoise2D(x, y) {
        const ret = wasm.perlinnoise_fractalNoise2D(this.__wbg_ptr, x, y);
        return ret;
    }
    /**
     * Generate RGBA texture buffer
     *
     * # Arguments
     *
     * * `width` - Texture width in pixels
     * * `height` - Texture height in pixels
     * * `scale` - Noise scale factor (typical: 0.01-0.1)
     *
     * # Returns
     *
     * Uint8Array with RGBA values (width * height * 4 bytes)
     * @param {number} width
     * @param {number} height
     * @param {number} scale
     * @returns {Uint8Array}
     */
    generateTexture(width, height, scale) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.perlinnoise_generateTexture(retptr, this.__wbg_ptr, width, height, scale);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create clear glass noise preset (1 octave)
     * @returns {PerlinNoise}
     */
    static clearGlass() {
        const ret = wasm.perlinnoise_clearGlass();
        return PerlinNoise.__wrap(ret);
    }
    /**
     * Create regular glass noise preset (3 octaves)
     * @returns {PerlinNoise}
     */
    static regularGlass() {
        const ret = wasm.perlinnoise_regularGlass();
        return PerlinNoise.__wrap(ret);
    }
    /**
     * Create thick glass noise preset (4 octaves)
     * @returns {PerlinNoise}
     */
    static thickGlass() {
        const ret = wasm.perlinnoise_thickGlass();
        return PerlinNoise.__wrap(ret);
    }
    /**
     * Create frosted glass noise preset (6 octaves)
     * @returns {PerlinNoise}
     */
    static frostedGlass() {
        const ret = wasm.perlinnoise_frostedGlass();
        return PerlinNoise.__wrap(ret);
    }
}
if (Symbol.dispose) PerlinNoise.prototype[Symbol.dispose] = PerlinNoise.prototype.free;

/**
 * Score for a color combination (0.0 to 1.0).
 */
export class QualityScore {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QualityScore.prototype);
        obj.__wbg_ptr = ptr;
        QualityScoreFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QualityScoreFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_qualityscore_free(ptr, 0);
    }
    /**
     * Overall quality score (0.0 to 1.0)
     * @returns {number}
     */
    get overall() {
        const ret = wasm.__wbg_get_contrastresult_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * Compliance score (0.0 = fails, 1.0 = exceeds)
     * @returns {number}
     */
    get compliance() {
        const ret = wasm.__wbg_get_qualityscore_compliance(this.__wbg_ptr);
        return ret;
    }
    /**
     * Perceptual quality score (0.0 = poor, 1.0 = optimal)
     * @returns {number}
     */
    get perceptual() {
        const ret = wasm.__wbg_get_qualityscore_perceptual(this.__wbg_ptr);
        return ret;
    }
    /**
     * Context appropriateness score (0.0 = inappropriate, 1.0 = perfect fit)
     * @returns {number}
     */
    get appropriateness() {
        const ret = wasm.__wbg_get_qualityscore_appropriateness(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns whether this score indicates the combination passes requirements.
     * @returns {boolean}
     */
    passes() {
        const ret = wasm.qualityscore_passes(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Returns a qualitative assessment of the score.
     *
     * Returns: "Excellent", "Good", "Acceptable", "Marginal", or "Poor"
     * @returns {string}
     */
    assessment() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.qualityscore_assessment(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get confidence level (0.0 to 1.0).
     *
     * Higher confidence means the score is more reliable.
     * For now, returns compliance score as proxy for confidence.
     * @returns {number}
     */
    confidence() {
        const ret = wasm.qualityscore_confidence(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get human-readable explanation of the score.
     * @returns {string}
     */
    explanation() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.qualityscore_explanation(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) QualityScore.prototype[Symbol.dispose] = QualityScore.prototype.free;

/**
 * Scorer for evaluating color combination quality.
 */
export class QualityScorer {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QualityScorerFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_qualityscorer_free(ptr, 0);
    }
    /**
     * Create a new quality scorer.
     */
    constructor() {
        const ret = wasm.wcagmetric_new();
        this.__wbg_ptr = ret >>> 0;
        QualityScorerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Score a color combination for a given context.
     *
     * # Arguments
     *
     * * `foreground` - Foreground color
     * * `background` - Background color
     * * `context` - Usage context
     *
     * # Returns
     *
     * Quality score with overall, compliance, perceptual, and appropriateness scores
     * @param {Color} foreground
     * @param {Color} background
     * @param {RecommendationContext} context
     * @returns {QualityScore}
     */
    score(foreground, background, context) {
        _assertClass(foreground, Color);
        _assertClass(background, Color);
        _assertClass(context, RecommendationContext);
        const ret = wasm.qualityscorer_score(this.__wbg_ptr, foreground.__wbg_ptr, background.__wbg_ptr, context.__wbg_ptr);
        return QualityScore.__wrap(ret);
    }
}
if (Symbol.dispose) QualityScorer.prototype[Symbol.dispose] = QualityScorer.prototype.free;

/**
 * Context for intelligent color recommendations.
 */
export class RecommendationContext {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RecommendationContext.prototype);
        obj.__wbg_ptr = ptr;
        RecommendationContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RecommendationContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_recommendationcontext_free(ptr, 0);
    }
    /**
     * Create a new recommendation context.
     * @param {UsageContext} usage
     * @param {ComplianceTarget} target
     */
    constructor(usage, target) {
        const ret = wasm.recommendationcontext_new(usage, target);
        this.__wbg_ptr = ret >>> 0;
        RecommendationContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create context for body text (WCAG AA).
     * @returns {RecommendationContext}
     */
    static bodyText() {
        const ret = wasm.recommendationcontext_bodyText();
        return RecommendationContext.__wrap(ret);
    }
    /**
     * Create context for large text (WCAG AA).
     * @returns {RecommendationContext}
     */
    static largeText() {
        const ret = wasm.recommendationcontext_largeText();
        return RecommendationContext.__wrap(ret);
    }
    /**
     * Create context for interactive elements (WCAG AA).
     * @returns {RecommendationContext}
     */
    static interactive() {
        const ret = wasm.recommendationcontext_interactive();
        return RecommendationContext.__wrap(ret);
    }
    /**
     * Create context for decorative elements (no requirements).
     * @returns {RecommendationContext}
     */
    static decorative() {
        const ret = wasm.recommendationcontext_decorative();
        return RecommendationContext.__wrap(ret);
    }
}
if (Symbol.dispose) RecommendationContext.prototype[Symbol.dispose] = RecommendationContext.prototype.free;

/**
 * Rendering context for backend rendering
 *
 * Defines the target environment and capabilities for rendering.
 */
export class RenderContext {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RenderContext.prototype);
        obj.__wbg_ptr = ptr;
        RenderContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof RenderContext)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RenderContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rendercontext_free(ptr, 0);
    }
    /**
     * Create desktop rendering context (1920x1080, sRGB)
     * @returns {RenderContext}
     */
    static desktop() {
        const ret = wasm.rendercontext_desktop();
        return RenderContext.__wrap(ret);
    }
    /**
     * Create mobile rendering context (375x667, Display P3 if supported)
     * @returns {RenderContext}
     */
    static mobile() {
        const ret = wasm.rendercontext_mobile();
        return RenderContext.__wrap(ret);
    }
    /**
     * Create 4K rendering context
     * @returns {RenderContext}
     */
    static fourK() {
        const ret = wasm.rendercontext_fourK();
        return RenderContext.__wrap(ret);
    }
    /**
     * Create custom rendering context
     *
     * # Arguments
     *
     * * `viewport_width` - Viewport width in CSS pixels
     * * `viewport_height` - Viewport height in CSS pixels
     * * `pixel_density` - Device pixel density (1.0 = standard, 2.0 = retina)
     * @param {number} viewport_width
     * @param {number} viewport_height
     * @param {number} pixel_density
     */
    constructor(viewport_width, viewport_height, pixel_density) {
        const ret = wasm.rendercontext_new(viewport_width, viewport_height, pixel_density);
        this.__wbg_ptr = ret >>> 0;
        RenderContextFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get viewport width
     * @returns {number}
     */
    get viewportWidth() {
        const ret = wasm.rendercontext_viewportWidth(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get viewport height
     * @returns {number}
     */
    get viewportHeight() {
        const ret = wasm.rendercontext_viewportHeight(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get pixel density
     * @returns {number}
     */
    get pixelDensity() {
        const ret = wasm.contactshadow_offsetY(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) RenderContext.prototype[Symbol.dispose] = RenderContext.prototype.free;

/**
 * Thin-film interference coating parameters.
 *
 * Models iridescent effects from thin transparent films like soap bubbles,
 * oil slicks, and anti-reflective coatings.
 *
 * ## Physical Background
 *
 * When light reflects from both surfaces of a thin transparent layer,
 * the path difference creates constructive or destructive interference
 * depending on wavelength and viewing angle.
 *
 * ## Example (JavaScript)
 *
 * ```javascript
 * // Create a soap bubble thin film
 * const film = ThinFilm.soapBubbleThin();
 * console.log(`Thickness: ${film.thicknessNm}nm`);
 *
 * // Calculate reflectance at 550nm (green)
 * const r = film.reflectance(550.0, 1.0, 1.0);  // normal incidence
 * console.log(`Reflectance at 550nm: ${r}`);
 *
 * // Get RGB reflectance (for rendering)
 * const rgb = film.reflectanceRgb(1.0, 0.8);  // n_substrate=1.0, cos_theta=0.8
 * console.log(`RGB: [${rgb[0]}, ${rgb[1]}, ${rgb[2]}]`);
 *
 * // Generate CSS for visual effect
 * const css = film.toCssSoapBubble(100.0);
 * element.style.background = css;
 * ```
 */
export class ThinFilm {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ThinFilm.prototype);
        obj.__wbg_ptr = ptr;
        ThinFilmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ThinFilmFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_thinfilm_free(ptr, 0);
    }
    /**
     * Create a new thin film with custom parameters.
     *
     * # Arguments
     *
     * * `n_film` - Film refractive index (typically 1.3-1.7)
     * * `thickness_nm` - Film thickness in nanometers (typically 50-500nm)
     *
     * # Example
     *
     * ```javascript
     * // Custom thin film: n=1.45, thickness=180nm
     * const film = new ThinFilm(1.45, 180.0);
     * ```
     * @param {number} n_film
     * @param {number} thickness_nm
     */
    constructor(n_film, thickness_nm) {
        const ret = wasm.thinfilm_new(n_film, thickness_nm);
        this.__wbg_ptr = ret >>> 0;
        ThinFilmFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Thin soap bubble (~100nm water film).
     *
     * Creates subtle blue-violet interference colors.
     * @returns {ThinFilm}
     */
    static soapBubbleThin() {
        const ret = wasm.thinfilm_soapBubbleThin();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Medium soap bubble (~200nm water film).
     *
     * Creates balanced rainbow interference colors.
     * @returns {ThinFilm}
     */
    static soapBubbleMedium() {
        const ret = wasm.thinfilm_soapBubbleMedium();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Thick soap bubble (~400nm water film).
     *
     * Creates stronger yellow-red interference colors.
     * @returns {ThinFilm}
     */
    static soapBubbleThick() {
        const ret = wasm.thinfilm_soapBubbleThick();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Thin oil slick on water (~150nm).
     *
     * Oil (n≈1.5) on water (n≈1.33) creates classic rainbow effect.
     * @returns {ThinFilm}
     */
    static oilThin() {
        const ret = wasm.thinfilm_oilThin();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Medium oil slick (~300nm).
     * @returns {ThinFilm}
     */
    static oilMedium() {
        const ret = wasm.thinfilm_oilMedium();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Thick oil slick (~500nm).
     * @returns {ThinFilm}
     */
    static oilThick() {
        const ret = wasm.thinfilm_oilThick();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Anti-reflective coating (MgF2 on glass).
     *
     * Quarter-wave thickness at 550nm for minimal reflection.
     * @returns {ThinFilm}
     */
    static arCoating() {
        const ret = wasm.thinfilm_arCoating();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Thin oxide layer (SiO2 on silicon, ~50nm).
     *
     * Creates characteristic chip colors.
     * @returns {ThinFilm}
     */
    static oxideThin() {
        const ret = wasm.thinfilm_oxideThin();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Medium oxide layer (~150nm).
     * @returns {ThinFilm}
     */
    static oxideMedium() {
        const ret = wasm.thinfilm_oxideMedium();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Thick oxide layer (~300nm).
     * @returns {ThinFilm}
     */
    static oxideThick() {
        const ret = wasm.thinfilm_oxideThick();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Beetle shell coating (chitin-like material).
     *
     * Creates natural iridescence seen in jewel beetles.
     * @returns {ThinFilm}
     */
    static beetleShell() {
        const ret = wasm.thinfilm_beetleShell();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Pearl nacre (aragonite layers).
     *
     * Creates lustrous pearl iridescence.
     * @returns {ThinFilm}
     */
    static nacre() {
        const ret = wasm.thinfilm_nacre();
        return ThinFilm.__wrap(ret);
    }
    /**
     * Film refractive index.
     * @returns {number}
     */
    get nFilm() {
        const ret = wasm.contactshadowparams_darkness(this.__wbg_ptr);
        return ret;
    }
    /**
     * Film thickness in nanometers.
     * @returns {number}
     */
    get thicknessNm() {
        const ret = wasm.contactshadowparams_blurRadius(this.__wbg_ptr);
        return ret;
    }
    /**
     * Calculate optical path difference for given viewing angle.
     *
     * OPD = 2 * n_film * d * cos(theta_film)
     *
     * # Arguments
     *
     * * `cos_theta_air` - Cosine of incidence angle in air (1.0 = normal)
     *
     * # Returns
     *
     * Optical path difference in nanometers
     * @param {number} cos_theta_air
     * @returns {number}
     */
    opticalPathDifference(cos_theta_air) {
        const ret = wasm.thinfilm_opticalPathDifference(this.__wbg_ptr, cos_theta_air);
        return ret;
    }
    /**
     * Calculate phase difference for a given wavelength.
     *
     * delta = 2 * PI * OPD / lambda
     *
     * # Arguments
     *
     * * `wavelength_nm` - Wavelength in nanometers (visible: 400-700nm)
     * * `cos_theta` - Cosine of incidence angle (1.0 = normal)
     *
     * # Returns
     *
     * Phase difference in radians
     * @param {number} wavelength_nm
     * @param {number} cos_theta
     * @returns {number}
     */
    phaseDifference(wavelength_nm, cos_theta) {
        const ret = wasm.thinfilm_phaseDifference(this.__wbg_ptr, wavelength_nm, cos_theta);
        return ret;
    }
    /**
     * Calculate reflectance at a single wavelength using the Airy formula.
     *
     * This is the core physics calculation that accounts for:
     * - Fresnel reflection at both interfaces
     * - Phase difference from optical path
     * - Interference between reflected rays
     *
     * # Arguments
     *
     * * `wavelength_nm` - Wavelength in nanometers (visible: 400-700nm)
     * * `n_substrate` - Substrate refractive index (air=1.0, water=1.33, glass=1.52)
     * * `cos_theta` - Cosine of incidence angle (1.0 = normal, 0.0 = grazing)
     *
     * # Returns
     *
     * Reflectance (0.0-1.0)
     *
     * # Example
     *
     * ```javascript
     * const film = ThinFilm.soapBubbleMedium();
     *
     * // Green light at normal incidence, air substrate
     * const rGreen = film.reflectance(550.0, 1.0, 1.0);
     *
     * // Same but at 60° angle
     * const rAngled = film.reflectance(550.0, 1.0, 0.5);  // cos(60°) = 0.5
     * ```
     * @param {number} wavelength_nm
     * @param {number} n_substrate
     * @param {number} cos_theta
     * @returns {number}
     */
    reflectance(wavelength_nm, n_substrate, cos_theta) {
        const ret = wasm.thinfilm_reflectance(this.__wbg_ptr, wavelength_nm, n_substrate, cos_theta);
        return ret;
    }
    /**
     * Calculate RGB reflectance (R=650nm, G=550nm, B=450nm).
     *
     * Returns reflectance values for rendering colored interference.
     *
     * # Arguments
     *
     * * `n_substrate` - Substrate refractive index
     * * `cos_theta` - Cosine of incidence angle
     *
     * # Returns
     *
     * Array of 3 reflectance values [R, G, B] in range 0.0-1.0
     *
     * # Example
     *
     * ```javascript
     * const film = ThinFilm.oilMedium();
     * const rgb = film.reflectanceRgb(1.33, 0.8);  // oil on water
     * console.log(`R=${rgb[0]}, G=${rgb[1]}, B=${rgb[2]}`);
     * ```
     * @param {number} n_substrate
     * @param {number} cos_theta
     * @returns {Float64Array}
     */
    reflectanceRgb(n_substrate, cos_theta) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.thinfilm_reflectanceRgb(retptr, this.__wbg_ptr, n_substrate, cos_theta);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Calculate full spectrum reflectance (8 wavelengths: 400-750nm).
     *
     * Returns wavelengths and corresponding reflectances for spectral rendering.
     *
     * # Arguments
     *
     * * `n_substrate` - Substrate refractive index
     * * `cos_theta` - Cosine of incidence angle
     *
     * # Returns
     *
     * Object with `wavelengths` (8 values) and `reflectances` (8 values)
     * @param {number} n_substrate
     * @param {number} cos_theta
     * @returns {object}
     */
    reflectanceSpectrum(n_substrate, cos_theta) {
        const ret = wasm.thinfilm_reflectanceSpectrum(this.__wbg_ptr, n_substrate, cos_theta);
        return takeObject(ret);
    }
    /**
     * Find wavelength of maximum constructive interference.
     *
     * For first-order maximum: OPD = lambda
     *
     * # Arguments
     *
     * * `cos_theta` - Cosine of incidence angle
     *
     * # Returns
     *
     * Wavelength in nanometers where reflectance is maximized
     * @param {number} cos_theta
     * @returns {number}
     */
    maxWavelength(cos_theta) {
        const ret = wasm.thinfilm_maxWavelength(this.__wbg_ptr, cos_theta);
        return ret;
    }
    /**
     * Find wavelength of maximum destructive interference.
     *
     * For first-order minimum: OPD = lambda/2
     *
     * # Arguments
     *
     * * `cos_theta` - Cosine of incidence angle
     *
     * # Returns
     *
     * Wavelength in nanometers where reflectance is minimized
     * @param {number} cos_theta
     * @returns {number}
     */
    minWavelength(cos_theta) {
        const ret = wasm.thinfilm_minWavelength(this.__wbg_ptr, cos_theta);
        return ret;
    }
    /**
     * Generate CSS for soap bubble effect.
     *
     * Creates a radial gradient that simulates angle-dependent
     * interference colors with a highlight at the center.
     *
     * # Arguments
     *
     * * `size_percent` - Size scaling percentage (100 = full size)
     *
     * # Returns
     *
     * CSS radial-gradient string
     *
     * # Example
     *
     * ```javascript
     * const film = ThinFilm.soapBubbleMedium();
     * const css = film.toCssSoapBubble(100.0);
     * element.style.background = css;
     * ```
     * @param {number} size_percent
     * @returns {string}
     */
    toCssSoapBubble(size_percent) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.thinfilm_toCssSoapBubble(retptr, this.__wbg_ptr, size_percent);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Generate CSS for oil slick effect.
     *
     * Creates a linear gradient that simulates rainbow-like
     * interference patterns seen on oil films.
     *
     * # Returns
     *
     * CSS linear-gradient string
     *
     * # Example
     *
     * ```javascript
     * const film = ThinFilm.oilMedium();
     * const css = film.toCssOilSlick();
     * element.style.background = css;
     * ```
     * @returns {string}
     */
    toCssOilSlick() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.thinfilm_toCssOilSlick(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Generate CSS for general iridescent gradient.
     *
     * Creates a gradient with angle-dependent color shift over a base color.
     *
     * # Arguments
     *
     * * `n_substrate` - Substrate refractive index
     * * `base_color` - Base CSS color string (e.g., "#000000")
     *
     * # Returns
     *
     * CSS gradient string
     * @param {number} n_substrate
     * @param {string} base_color
     * @returns {string}
     */
    toCssIridescentGradient(n_substrate, base_color) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(base_color, wasm.__wbindgen_export, wasm.__wbindgen_export2);
            const len0 = WASM_VECTOR_LEN;
            wasm.thinfilm_toCssIridescentGradient(retptr, this.__wbg_ptr, n_substrate, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred2_0 = r0;
            deferred2_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Convert thin-film reflectance to RGB color for given conditions.
     *
     * # Arguments
     *
     * * `n_substrate` - Substrate refractive index
     * * `cos_theta` - Cosine of incidence angle
     *
     * # Returns
     *
     * Array [r, g, b] with values 0-255
     * @param {number} n_substrate
     * @param {number} cos_theta
     * @returns {Uint8Array}
     */
    toRgb(n_substrate, cos_theta) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.thinfilm_toRgb(retptr, this.__wbg_ptr, n_substrate, cos_theta);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) ThinFilm.prototype[Symbol.dispose] = ThinFilm.prototype.free;

/**
 * Usage context for color recommendations.
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const UsageContext = Object.freeze({
    /**
     * Body text - primary content (18px or less, normal weight)
     */
    BodyText: 0, "0": "BodyText",
    /**
     * Large text - headings, titles (18pt+ or 14pt+ bold)
     */
    LargeText: 1, "1": "LargeText",
    /**
     * Interactive elements - buttons, links, form inputs
     */
    Interactive: 2, "2": "Interactive",
    /**
     * Decorative - non-essential visual elements
     */
    Decorative: 3, "3": "Decorative",
    /**
     * Icons and graphics - functional imagery
     */
    IconsGraphics: 4, "4": "IconsGraphics",
    /**
     * Disabled state - reduced emphasis
     */
    Disabled: 5, "5": "Disabled",
});

/**
 * 3D vector for light direction and surface normals
 */
export class Vec3 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Vec3.prototype);
        obj.__wbg_ptr = ptr;
        Vec3Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Vec3Finalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vec3_free(ptr, 0);
    }
    /**
     * Create a new 3D vector
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x, y, z) {
        const ret = wasm.vec3_new(x, y, z);
        this.__wbg_ptr = ret >>> 0;
        Vec3Finalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get x component
     * @returns {number}
     */
    get x() {
        const ret = wasm.contactshadowparams_darkness(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get y component
     * @returns {number}
     */
    get y() {
        const ret = wasm.contactshadowparams_blurRadius(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get z component
     * @returns {number}
     */
    get z() {
        const ret = wasm.contactshadowparams_offsetY(this.__wbg_ptr);
        return ret;
    }
    /**
     * Normalize vector to unit length
     * @returns {Vec3}
     */
    normalize() {
        const ret = wasm.vec3_normalize(this.__wbg_ptr);
        return Vec3.__wrap(ret);
    }
    /**
     * Calculate dot product with another vector
     * @param {Vec3} other
     * @returns {number}
     */
    dot(other) {
        _assertClass(other, Vec3);
        const ret = wasm.vec3_dot(this.__wbg_ptr, other.__wbg_ptr);
        return ret;
    }
    /**
     * Reflect vector around normal
     * @param {Vec3} normal
     * @returns {Vec3}
     */
    reflect(normal) {
        _assertClass(normal, Vec3);
        const ret = wasm.vec3_reflect(this.__wbg_ptr, normal.__wbg_ptr);
        return Vec3.__wrap(ret);
    }
}
if (Symbol.dispose) Vec3.prototype[Symbol.dispose] = Vec3.prototype.free;

/**
 * Vibrancy effect applies background color to foreground.
 */
export class VibrancyEffect {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VibrancyEffectFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vibrancyeffect_free(ptr, 0);
    }
    /**
     * Create new vibrancy effect.
     * @param {VibrancyLevel} level
     */
    constructor(level) {
        const ret = wasm.vibrancyeffect_new(level);
        this.__wbg_ptr = ret >>> 0;
        VibrancyEffectFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Apply vibrancy to foreground color given background.
     * @param {OKLCH} foreground
     * @param {OKLCH} background
     * @returns {OKLCH}
     */
    apply(foreground, background) {
        _assertClass(foreground, OKLCH);
        _assertClass(background, OKLCH);
        const ret = wasm.vibrancyeffect_apply(this.__wbg_ptr, foreground.__wbg_ptr, background.__wbg_ptr);
        return OKLCH.__wrap(ret);
    }
    /**
     * Get vibrancy level.
     * @returns {VibrancyLevel}
     */
    get level() {
        const ret = wasm.vibrancyeffect_level(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) VibrancyEffect.prototype[Symbol.dispose] = VibrancyEffect.prototype.free;

/**
 * Vibrancy level determines how much background color bleeds through.
 * @enum {0 | 1 | 2 | 3}
 */
export const VibrancyLevel = Object.freeze({
    /**
     * Primary vibrancy - most color through (75%)
     */
    Primary: 0, "0": "Primary",
    /**
     * Secondary vibrancy - moderate color (50%)
     */
    Secondary: 1, "1": "Secondary",
    /**
     * Tertiary vibrancy - subtle color (30%)
     */
    Tertiary: 2, "2": "Tertiary",
    /**
     * Divider vibrancy - minimal color (15%)
     */
    Divider: 3, "3": "Divider",
});

/**
 * View context (observer perspective)
 */
export class ViewContext {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ViewContext.prototype);
        obj.__wbg_ptr = ptr;
        ViewContextFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ViewContextFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_viewcontext_free(ptr, 0);
    }
    /**
     * Perpendicular view preset
     * @returns {ViewContext}
     */
    static perpendicular() {
        const ret = wasm.viewcontext_perpendicular();
        return ViewContext.__wrap(ret);
    }
    /**
     * Oblique view preset (45° angle)
     * @returns {ViewContext}
     */
    static oblique() {
        const ret = wasm.viewcontext_oblique();
        return ViewContext.__wrap(ret);
    }
    /**
     * Grazing angle view preset
     * @returns {ViewContext}
     */
    static grazing() {
        const ret = wasm.viewcontext_grazing();
        return ViewContext.__wrap(ret);
    }
}
if (Symbol.dispose) ViewContext.prototype[Symbol.dispose] = ViewContext.prototype.free;

/**
 * WCAG 2.1 Contrast Ratio metric.
 *
 * Calculates symmetric contrast ratios from 1.0 (no contrast) to 21.0 (maximum).
 */
export class WCAGMetric {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WCAGMetricFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wcagmetric_free(ptr, 0);
    }
    /**
     * Create a new WCAG metric.
     */
    constructor() {
        const ret = wasm.wcagmetric_new();
        this.__wbg_ptr = ret >>> 0;
        WCAGMetricFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Evaluate contrast between foreground and background colors.
     *
     * Returns a contrast ratio from 1.0 to 21.0.
     * @param {Color} foreground
     * @param {Color} background
     * @returns {ContrastResult}
     */
    evaluate(foreground, background) {
        _assertClass(foreground, Color);
        _assertClass(background, Color);
        const ret = wasm.wcagmetric_evaluate(this.__wbg_ptr, foreground.__wbg_ptr, background.__wbg_ptr);
        return ContrastResult.__wrap(ret);
    }
    /**
     * Evaluate contrast for multiple color pairs (faster than calling evaluate in a loop).
     *
     * # Arguments
     *
     * * `foregrounds` - Array of foreground colors
     * * `backgrounds` - Array of background colors (must match length)
     *
     * # Returns
     *
     * Array of contrast results
     * @param {Color[]} foregrounds
     * @param {Color[]} backgrounds
     * @returns {ContrastResult[]}
     */
    evaluateBatch(foregrounds, backgrounds) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(foregrounds, wasm.__wbindgen_export);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArrayJsValueToWasm0(backgrounds, wasm.__wbindgen_export);
            const len1 = WASM_VECTOR_LEN;
            wasm.wcagmetric_evaluateBatch(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v3 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export3(r0, r1 * 4, 4);
            return v3;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Check if contrast ratio passes WCAG level for text size.
     *
     * # Arguments
     *
     * * `ratio` - Contrast ratio to check
     * * `level` - "AA" or "AAA"
     * * `is_large_text` - Whether text is large (18pt+ or 14pt+ bold)
     * @param {number} ratio
     * @param {string} level
     * @param {boolean} is_large_text
     * @returns {boolean}
     */
    static passes(ratio, level, is_large_text) {
        const ptr0 = passStringToWasm0(level, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wcagmetric_passes(ratio, ptr0, len0, is_large_text);
        return ret !== 0;
    }
}
if (Symbol.dispose) WCAGMetric.prototype[Symbol.dispose] = WCAGMetric.prototype.free;

/**
 * Fast Beer-Lambert attenuation using lookup table
 *
 * 4x faster than exp() calculation with <1% error.
 *
 * # Arguments
 *
 * * `absorption` - Absorption coefficient per mm (0.0 to 1.0)
 * * `distance` - Path length in mm (0.0 to 100.0)
 *
 * # Returns
 *
 * Transmittance (0.0 to 1.0)
 * @param {number} absorption
 * @param {number} distance
 * @returns {number}
 */
export function beerLambertFast(absorption, distance) {
    const ret = wasm.beerLambertFast(absorption, distance);
    return ret;
}

/**
 * Calculate Blinn-Phong specular highlight
 *
 * Uses halfway vector for faster and more accurate specular than Phong model.
 *
 * # Arguments
 *
 * * `normal` - Surface normal vector
 * * `light_dir` - Light direction vector (from surface to light)
 * * `view_dir` - View direction vector (from surface to camera)
 * * `shininess` - Material shininess (1-256, higher = sharper highlight)
 *
 * # Returns
 *
 * Specular intensity (0.0 to 1.0)
 * @param {Vec3} normal
 * @param {Vec3} light_dir
 * @param {Vec3} view_dir
 * @param {number} shininess
 * @returns {number}
 */
export function blinnPhongSpecular(normal, light_dir, view_dir, shininess) {
    _assertClass(normal, Vec3);
    _assertClass(light_dir, Vec3);
    _assertClass(view_dir, Vec3);
    const ret = wasm.blinnPhongSpecular(normal.__wbg_ptr, light_dir.__wbg_ptr, view_dir.__wbg_ptr, shininess);
    return ret;
}

/**
 * Calculate Brewster's angle (minimum reflectance for p-polarization)
 *
 * # Arguments
 *
 * * `ior1` - Refractive index of first medium
 * * `ior2` - Refractive index of second medium
 *
 * # Returns
 *
 * Brewster's angle in degrees
 * @param {number} ior1
 * @param {number} ior2
 * @returns {number}
 */
export function brewsterAngle(ior1, ior2) {
    const ret = wasm.brewsterAngle(ior1, ior2);
    return ret;
}

/**
 * Calculate optimal AR coating thickness for a given wavelength.
 *
 * For quarter-wave AR coating: d = lambda / (4 * n_film)
 *
 * # Arguments
 *
 * * `wavelength_nm` - Design wavelength in nanometers (typically 550nm for visible)
 * * `n_film` - Film refractive index
 *
 * # Returns
 *
 * Optimal thickness in nanometers
 *
 * # Example
 *
 * ```javascript
 * // AR coating for green light on MgF2
 * const thickness = calculateArCoatingThickness(550.0, 1.38);
 * console.log(`Optimal thickness: ${thickness}nm`);  // ~99.6nm
 * ```
 * @param {number} wavelength_nm
 * @param {number} n_film
 * @returns {number}
 */
export function calculateArCoatingThickness(wavelength_nm, n_film) {
    const ret = wasm.calculateArCoatingThickness(wavelength_nm, n_film);
    return ret;
}

/**
 * Calculate contact shadow for a glass element.
 *
 * Generates a sharp, dark shadow at the point where glass meets background.
 *
 * # Arguments
 *
 * * `params` - Contact shadow configuration
 * * `background` - Background color in OKLCH (affects shadow visibility)
 * * `glass_depth` - Perceived thickness of glass (affects shadow intensity, 0.0-2.0)
 *
 * # Returns
 *
 * Calculated contact shadow ready for CSS rendering.
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const params = ContactShadowParams.standard();
 * const background = new OKLCH(0.95, 0.01, 240.0); // Light background
 * const shadow = calculateContactShadow(params, background, 1.0);
 *
 * element.style.boxShadow = shadow.toCss();
 * ```
 * @param {ContactShadowParams} params
 * @param {OKLCH} background
 * @param {number} glass_depth
 * @returns {ContactShadow}
 */
export function calculateContactShadow(params, background, glass_depth) {
    _assertClass(params, ContactShadowParams);
    _assertClass(background, OKLCH);
    const ret = wasm.calculateContactShadow(params.__wbg_ptr, background.__wbg_ptr, glass_depth);
    return ContactShadow.__wrap(ret);
}

/**
 * Calculate elevation shadow for glass element
 *
 * # Arguments
 *
 * * `elevation` - Elevation level (0-24)
 * * `background` - Background color in OKLCH
 * * `glass_depth` - Perceived thickness of glass (0.0-2.0)
 *
 * # Returns
 *
 * Complete shadow system as CSS box-shadow string
 * @param {number} elevation
 * @param {OKLCH} background
 * @param {number} glass_depth
 * @returns {ElevationShadow}
 */
export function calculateElevationShadow(elevation, background, glass_depth) {
    _assertClass(background, OKLCH);
    const ret = wasm.calculateElevationShadow(elevation, background.__wbg_ptr, glass_depth);
    return ElevationShadow.__wrap(ret);
}

/**
 * Calculate CSS position for highlight from light direction
 *
 * # Arguments
 *
 * * `light_dir` - Light direction vector
 *
 * # Returns
 *
 * Array of [x, y] in percentage (-50 to 150)
 * @param {Vec3} light_dir
 * @returns {Float64Array}
 */
export function calculateHighlightPosition(light_dir) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(light_dir, Vec3);
        wasm.calculateHighlightPosition(retptr, light_dir.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v1 = getArrayF64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export3(r0, r1 * 8, 8);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Calculate multi-layer transmittance for realistic glass rendering
 *
 * # Arguments
 *
 * * `optical_props` - Optical properties of the glass
 * * `incident_intensity` - Incoming light intensity (0.0-1.0)
 *
 * # Returns
 *
 * Layer-separated transmittance values
 * @param {OpticalProperties} optical_props
 * @param {number} incident_intensity
 * @returns {LayerTransmittance}
 */
export function calculateMultiLayerTransmittance(optical_props, incident_intensity) {
    _assertClass(optical_props, OpticalProperties);
    const ret = wasm.calculateMultiLayerTransmittance(optical_props.__wbg_ptr, incident_intensity);
    return LayerTransmittance.__wrap(ret);
}

/**
 * Calculate multi-layer specular highlights
 *
 * Generates 4 layers: main, secondary, top edge, left edge
 *
 * # Arguments
 *
 * * `normal` - Surface normal vector
 * * `light_dir` - Light direction vector
 * * `view_dir` - View direction vector
 * * `base_shininess` - Base material shininess
 *
 * # Returns
 *
 * Flat array of [intensity1, x1, y1, size1, intensity2, x2, y2, size2, ...]
 * @param {Vec3} normal
 * @param {Vec3} light_dir
 * @param {Vec3} view_dir
 * @param {number} base_shininess
 * @returns {Float64Array}
 */
export function calculateSpecularLayers(normal, light_dir, view_dir, base_shininess) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(normal, Vec3);
        _assertClass(light_dir, Vec3);
        _assertClass(view_dir, Vec3);
        wasm.calculateSpecularLayers(retptr, normal.__wbg_ptr, light_dir.__wbg_ptr, view_dir.__wbg_ptr, base_shininess);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v1 = getArrayF64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export3(r0, r1 * 8, 8);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Calculate view angle between normal and view direction
 *
 * # Arguments
 *
 * * `normal` - Surface normal vector
 * * `view_dir` - View direction vector
 *
 * # Returns
 *
 * Cosine of angle (for use in Fresnel calculations)
 * @param {Vec3} normal
 * @param {Vec3} view_dir
 * @returns {number}
 */
export function calculateViewAngle(normal, view_dir) {
    _assertClass(normal, Vec3);
    _assertClass(view_dir, Vec3);
    const ret = wasm.calculateViewAngle(normal.__wbg_ptr, view_dir.__wbg_ptr);
    return ret;
}

/**
 * Calculate edge intensity for edge glow effect
 *
 * # Arguments
 *
 * * `cos_theta` - Cosine of view angle
 * * `edge_power` - Power curve exponent (1.0-4.0, higher = sharper edge)
 *
 * # Returns
 *
 * Edge intensity (0.0 at center to 1.0 at edge)
 * @param {number} cos_theta
 * @param {number} edge_power
 * @returns {number}
 */
export function edgeIntensity(cos_theta, edge_power) {
    const ret = wasm.edgeIntensity(cos_theta, edge_power);
    return ret;
}

/**
 * Evaluate and render glass material to CSS in one call (convenience function)
 *
 * This is a shortcut for:
 * 1. glass.evaluate(materialContext)
 * 2. backend.render(evaluated, renderContext)
 *
 * # Arguments
 *
 * * `glass` - Glass material to render
 * * `material_context` - Evaluation context (viewing angle, background, etc.)
 * * `render_context` - Rendering context (viewport, pixel ratio, etc.)
 *
 * # Returns
 *
 * CSS string ready to apply to DOM element
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const glass = GlassMaterial.frosted();
 * const materialCtx = EvalMaterialContext.new();
 * const renderCtx = RenderContext.desktop();
 *
 * const css = evaluateAndRenderCss(glass, materialCtx, renderCtx);
 * document.getElementById('panel').style.cssText = css;
 * ```
 * @param {GlassMaterial} glass
 * @param {EvalMaterialContext} material_context
 * @param {RenderContext} render_context
 * @returns {string}
 */
export function evaluateAndRenderCss(glass, material_context, render_context) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(glass, GlassMaterial);
        _assertClass(material_context, EvalMaterialContext);
        _assertClass(render_context, RenderContext);
        wasm.evaluateAndRenderCss(retptr, glass.__wbg_ptr, material_context.__wbg_ptr, render_context.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Batch evaluate and render multiple materials to CSS strings.
 *
 * This is significantly more efficient than calling `evaluateAndRenderCss`
 * in a loop, especially for large numbers of materials.
 *
 * # Arguments
 *
 * * `materials` - Array of GlassMaterial instances
 * * `material_contexts` - Array of EvalMaterialContext instances (same length)
 * * `render_context` - Single RenderContext to use for all materials
 *
 * # Returns
 *
 * Array of CSS strings, one per material
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const materials = [
 *     GlassMaterial.clear(),
 *     GlassMaterial.frosted(),
 *     GlassMaterial.thick()
 * ];
 * const contexts = materials.map(() => EvalMaterialContext.default());
 * const renderCtx = RenderContext.desktop();
 *
 * const cssArray = evaluateAndRenderCssBatch(materials, contexts, renderCtx);
 * cssArray.forEach((css, i) => {
 *     document.getElementById(`panel-${i}`).style.cssText = css;
 * });
 * ```
 * @param {GlassMaterial[]} materials
 * @param {EvalMaterialContext[]} material_contexts
 * @param {RenderContext} render_context
 * @returns {string[]}
 */
export function evaluateAndRenderCssBatch(materials, material_contexts, render_context) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayJsValueToWasm0(materials, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(material_contexts, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        _assertClass(render_context, RenderContext);
        wasm.evaluateAndRenderCssBatch(retptr, ptr0, len0, ptr1, len1, render_context.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_export3(r0, r1 * 4, 4);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Batch evaluate and render with individual render contexts.
 *
 * More flexible version that allows different render contexts per material.
 *
 * # Arguments
 *
 * * `materials` - Array of GlassMaterial instances
 * * `material_contexts` - Array of EvalMaterialContext instances
 * * `render_contexts` - Array of RenderContext instances (all arrays must match length)
 *
 * # Returns
 *
 * Array of CSS strings, one per material
 * @param {GlassMaterial[]} materials
 * @param {EvalMaterialContext[]} material_contexts
 * @param {RenderContext[]} render_contexts
 * @returns {string[]}
 */
export function evaluateAndRenderCssBatchFull(materials, material_contexts, render_contexts) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayJsValueToWasm0(materials, wasm.__wbindgen_export);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(material_contexts, wasm.__wbindgen_export);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayJsValueToWasm0(render_contexts, wasm.__wbindgen_export);
        const len2 = WASM_VECTOR_LEN;
        wasm.evaluateAndRenderCssBatchFull(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_export3(r0, r1 * 4, 4);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Find the dominant (brightest) wavelength for a thin film.
 *
 * Returns the wavelength with maximum reflectance in the visible range.
 *
 * # Arguments
 *
 * * `film` - ThinFilm parameters
 * * `n_substrate` - Substrate refractive index
 * * `cos_theta` - Cosine of incidence angle
 *
 * # Returns
 *
 * Dominant wavelength in nanometers (400-700nm)
 *
 * # Example
 *
 * ```javascript
 * const film = ThinFilm.soapBubbleMedium();
 * const lambda = findDominantWavelength(film, 1.0, 1.0);
 * console.log(`Dominant color wavelength: ${lambda}nm`);
 * ```
 * @param {ThinFilm} film
 * @param {number} n_substrate
 * @param {number} cos_theta
 * @returns {number}
 */
export function findDominantWavelength(film, n_substrate, cos_theta) {
    _assertClass(film, ThinFilm);
    const ret = wasm.findDominantWavelength(film.__wbg_ptr, n_substrate, cos_theta);
    return ret;
}

/**
 * Fast Fresnel calculation using lookup table
 *
 * 5x faster than direct calculation with <1% error.
 * Ideal for batch processing or performance-critical paths.
 *
 * # Arguments
 *
 * * `ior` - Index of refraction (1.0 to 2.5)
 * * `cos_theta` - Cosine of view angle (0.0 to 1.0)
 *
 * # Returns
 *
 * Fresnel reflectance (0.0 to 1.0)
 * @param {number} ior
 * @param {number} cos_theta
 * @returns {number}
 */
export function fresnelFast(ior, cos_theta) {
    const ret = wasm.fresnelFast(ior, cos_theta);
    return ret;
}

/**
 * Calculate full Fresnel equations (s and p polarization)
 *
 * More accurate than Schlick's approximation but slower.
 *
 * # Arguments
 *
 * * `ior1` - Refractive index of first medium
 * * `ior2` - Refractive index of second medium
 * * `cos_theta_i` - Cosine of incident angle
 *
 * # Returns
 *
 * Tuple of (Rs, Rp) - reflectance for s and p polarization
 * @param {number} ior1
 * @param {number} ior2
 * @param {number} cos_theta_i
 * @returns {Float64Array}
 */
export function fresnelFull(ior1, ior2, cos_theta_i) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.fresnelFull(retptr, ior1, ior2, cos_theta_i);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v1 = getArrayF64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export3(r0, r1 * 8, 8);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Calculate Fresnel reflectance using Schlick's approximation
 *
 * Fast approximation of angle-dependent reflectivity (<4% error vs full Fresnel).
 *
 * # Arguments
 *
 * * `ior1` - Refractive index of first medium (e.g., 1.0 for air)
 * * `ior2` - Refractive index of second medium (e.g., 1.5 for glass)
 * * `cos_theta` - Cosine of view angle (0 = grazing, 1 = perpendicular)
 *
 * # Returns
 *
 * Reflectance value (0.0 to 1.0)
 * @param {number} ior1
 * @param {number} ior2
 * @param {number} cos_theta
 * @returns {number}
 */
export function fresnelSchlick(ior1, ior2, cos_theta) {
    const ret = wasm.fresnelSchlick(ior1, ior2, cos_theta);
    return ret;
}

/**
 * Generate CSS-ready Fresnel gradient
 *
 * # Arguments
 *
 * * `ior` - Index of refraction (e.g., 1.5 for glass)
 * * `samples` - Number of gradient stops (typically 8-16)
 * * `edge_power` - Edge sharpness (1.0-4.0)
 *
 * # Returns
 *
 * Flat array of [position, intensity, position, intensity, ...]
 * @param {number} ior
 * @param {number} samples
 * @param {number} edge_power
 * @returns {Float64Array}
 */
export function generateFresnelGradient(ior, samples, edge_power) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generateFresnelGradient(retptr, ior, samples, edge_power);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v1 = getArrayF64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export3(r0, r1 * 8, 8);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Generate Fresnel edge gradient CSS.
 *
 * Creates a radial gradient that simulates angle-dependent reflection
 * (Schlick's approximation). Edges appear brighter than center.
 *
 * # Arguments
 *
 * * `intensity` - Edge glow intensity (0.0-1.0)
 * * `light_mode` - Whether to use light mode colors
 *
 * # Returns
 *
 * CSS radial-gradient string
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const gradient = generateFresnelGradientCss(0.3, true);
 * element.style.background = gradient;
 * ```
 * @param {number} intensity
 * @param {boolean} light_mode
 * @returns {string}
 */
export function generateFresnelGradientCss(intensity, light_mode) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generateFresnelGradientCss(retptr, intensity, light_mode);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Generate inner top highlight CSS.
 *
 * Creates a linear gradient from top that simulates
 * light hitting the top edge.
 *
 * # Arguments
 *
 * * `intensity` - Highlight intensity (0.0-1.0)
 * * `light_mode` - Whether to use light mode colors
 *
 * # Returns
 *
 * CSS linear-gradient string
 * @param {number} intensity
 * @param {boolean} light_mode
 * @returns {string}
 */
export function generateInnerHighlightCss(intensity, light_mode) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generateInnerHighlightCss(retptr, intensity, light_mode);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Generate secondary specular (fill light) CSS.
 *
 * Creates a weaker highlight at bottom-right to simulate
 * ambient/fill lighting.
 *
 * # Arguments
 *
 * * `intensity` - Highlight intensity (0.0-1.0)
 * * `size` - Highlight size as percentage (15-40)
 *
 * # Returns
 *
 * CSS radial-gradient string
 * @param {number} intensity
 * @param {number} size
 * @returns {string}
 */
export function generateSecondarySpecularCss(intensity, size) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generateSecondarySpecularCss(retptr, intensity, size);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Generate specular highlight CSS.
 *
 * Creates a positioned radial gradient for light reflection
 * based on Blinn-Phong model.
 *
 * # Arguments
 *
 * * `intensity` - Highlight intensity (0.0-1.0)
 * * `size` - Highlight size as percentage (20-60)
 * * `pos_x` - Horizontal position percentage (0-100)
 * * `pos_y` - Vertical position percentage (0-100)
 *
 * # Returns
 *
 * CSS radial-gradient string
 * @param {number} intensity
 * @param {number} size
 * @param {number} pos_x
 * @param {number} pos_y
 * @returns {string}
 */
export function generateSpecularHighlightCss(intensity, size, pos_x, pos_y) {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generateSpecularHighlightCss(retptr, intensity, size, pos_x, pos_y);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Get all thin-film presets with their names and recommended substrates.
 *
 * # Returns
 *
 * Array of objects with { name, nFilm, thicknessNm, suggestedSubstrate }
 *
 * # Example
 *
 * ```javascript
 * const presets = getThinFilmPresets();
 * for (const preset of presets) {
 *     console.log(`${preset.name}: n=${preset.nFilm}, d=${preset.thicknessNm}nm`);
 * }
 * ```
 * @returns {Array<any>}
 */
export function getThinFilmPresets() {
    const ret = wasm.getThinFilmPresets();
    return takeObject(ret);
}

export function init() {
    wasm.init();
}

/**
 * Render enhanced glass CSS with physics-based effects.
 *
 * This generates complete CSS with:
 * - Multi-layer backgrounds with gradients
 * - Specular highlights (Blinn-Phong)
 * - Fresnel edge glow
 * - 4-layer elevation shadows
 * - Backdrop blur with saturation
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const glass = GlassMaterial.regular();
 * const ctx = EvalMaterialContext.new();
 * const rctx = RenderContext.desktop();
 * const options = GlassRenderOptions.premium();
 *
 * const css = renderEnhancedGlassCss(glass, ctx, rctx, options);
 * document.getElementById('panel').style.cssText = css;
 * ```
 * @param {GlassMaterial} glass
 * @param {EvalMaterialContext} material_context
 * @param {RenderContext} _render_context
 * @param {GlassRenderOptions} options
 * @returns {string}
 */
export function renderEnhancedGlassCss(glass, material_context, _render_context, options) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(glass, GlassMaterial);
        _assertClass(material_context, EvalMaterialContext);
        _assertClass(_render_context, RenderContext);
        _assertClass(options, GlassRenderOptions);
        wasm.renderEnhancedGlassCss(retptr, glass.__wbg_ptr, material_context.__wbg_ptr, _render_context.__wbg_ptr, options.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export3(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Convert PBR roughness to Blinn-Phong shininess
 *
 * Maps roughness (0.0-1.0) to shininess (1-256) using perceptually linear curve.
 *
 * # Arguments
 *
 * * `roughness` - Surface roughness (0.0 = smooth, 1.0 = rough)
 *
 * # Returns
 *
 * Shininess value for Blinn-Phong (1-256)
 * @param {number} roughness
 * @returns {number}
 */
export function roughnessToShininess(roughness) {
    const ret = wasm.roughnessToShininess(roughness);
    return ret;
}

/**
 * Get total LUT memory usage in bytes
 * @returns {number}
 */
export function totalLutMemory() {
    const ret = wasm.totalLutMemory();
    return ret >>> 0;
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_debug_string_adfb662ae34724b6 = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_color_unwrap = function(arg0) {
        const ret = Color.__unwrap(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_contrastresult_new = function(arg0) {
        const ret = ContrastResult.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_export3(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_evalmaterialcontext_unwrap = function(arg0) {
        const ret = EvalMaterialContext.__unwrap(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_glassmaterial_unwrap = function(arg0) {
        const ret = GlassMaterial.__unwrap(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_new_1ba21ce319a06297 = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_25f239778d6112b9 = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_push_7d9be8f38fc13975 = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_rendercontext_unwrap = function(arg0) {
        const ret = RenderContext.__unwrap(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_set_781438a03c0c3c81 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function(arg0) {
        // Cast intrinsic for `F64 -> Externref`.
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('momoto_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
