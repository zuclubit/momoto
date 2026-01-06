'use strict';

var chunkX3KESCNX_js = require('./chunk-X3KESCNX.js');
var chunk5YMPXU57_js = require('./chunk-5YMPXU57.js');
var chunkZM4FIU5F_js = require('./chunk-ZM4FIU5F.js');

/* @zuclubit/momoto-ui - Color Intelligence Design System */

// domain/ux/value-objects/UIState.ts
var UI_STATES = [
  "idle",
  "hover",
  "active",
  "focus",
  "disabled",
  "loading",
  "error",
  "success"
];
var STATE_TRANSITIONS = {
  idle: ["hover", "focus", "active", "disabled", "loading", "error", "success"],
  hover: ["idle", "active", "focus", "disabled"],
  active: ["idle", "hover", "focus", "loading", "error", "success"],
  focus: ["idle", "hover", "active", "disabled", "loading"],
  disabled: ["idle", "loading"],
  loading: ["idle", "error", "success", "disabled"],
  error: ["idle", "hover", "focus", "active", "loading"],
  success: ["idle", "hover", "focus", "active", "loading"]
};
var STATE_PRIORITY = {
  disabled: 100,
  // Siempre gana
  loading: 90,
  error: 80,
  success: 75,
  active: 60,
  focus: 50,
  hover: 40,
  idle: 0
};
var STATE_METADATA = {
  idle: {
    requiresContrast: true,
    suggestedLightnessShift: 0,
    suggestedChromaShift: 0,
    suggestedOpacity: 1,
    animation: "none",
    focusIndicator: false
  },
  hover: {
    requiresContrast: true,
    suggestedLightnessShift: 0.05,
    suggestedChromaShift: 0.02,
    suggestedOpacity: 1,
    animation: "subtle",
    focusIndicator: false
  },
  active: {
    requiresContrast: true,
    suggestedLightnessShift: -0.08,
    suggestedChromaShift: 0.03,
    suggestedOpacity: 1,
    animation: "medium",
    focusIndicator: false
  },
  focus: {
    requiresContrast: true,
    suggestedLightnessShift: 0,
    suggestedChromaShift: 0,
    suggestedOpacity: 1,
    animation: "subtle",
    focusIndicator: true
  },
  disabled: {
    requiresContrast: false,
    // Reduced requirements for disabled
    suggestedLightnessShift: 0.2,
    suggestedChromaShift: -0.1,
    suggestedOpacity: 0.5,
    animation: "none",
    focusIndicator: false
  },
  loading: {
    requiresContrast: true,
    suggestedLightnessShift: 0,
    suggestedChromaShift: -0.05,
    suggestedOpacity: 0.7,
    animation: "prominent",
    focusIndicator: false
  },
  error: {
    requiresContrast: true,
    suggestedLightnessShift: 0,
    suggestedChromaShift: 0.1,
    suggestedOpacity: 1,
    animation: "medium",
    focusIndicator: false
  },
  success: {
    requiresContrast: true,
    suggestedLightnessShift: 0,
    suggestedChromaShift: 0.05,
    suggestedOpacity: 1,
    animation: "subtle",
    focusIndicator: false
  }
};
var UIState = class _UIState {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Private)
  // ─────────────────────────────────────────────────────────────────────────
  constructor(value) {
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE STATE
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "_value");
    this._value = value;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // STATIC FACTORIES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Crea desde un string.
   */
  static from(value) {
    if (!UI_STATES.includes(value)) {
      return chunk5YMPXU57_js.failure(new Error(`Invalid UI state: ${value}`));
    }
    return chunk5YMPXU57_js.success(new _UIState(value));
  }
  /**
   * Crea un UIState sin validación (usar solo con valores conocidos).
   */
  static of(value) {
    return new _UIState(value);
  }
  // Named constructors for each state
  static idle() {
    return new _UIState("idle");
  }
  static hover() {
    return new _UIState("hover");
  }
  static active() {
    return new _UIState("active");
  }
  static focus() {
    return new _UIState("focus");
  }
  static disabled() {
    return new _UIState("disabled");
  }
  static loading() {
    return new _UIState("loading");
  }
  static error() {
    return new _UIState("error");
  }
  static success() {
    return new _UIState("success");
  }
  /**
   * Obtiene todos los estados posibles.
   */
  static all() {
    return UI_STATES.map((s) => new _UIState(s));
  }
  /**
   * Combina múltiples estados, retornando el de mayor prioridad.
   */
  static combine(states) {
    if (states.length === 0) {
      return _UIState.idle();
    }
    return states.reduce(
      (highest, current) => current.priority > highest.priority ? current : highest
    );
  }
  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Valor del estado.
   */
  get value() {
    return this._value;
  }
  /**
   * Prioridad del estado.
   */
  get priority() {
    return STATE_PRIORITY[this._value];
  }
  /**
   * Metadatos perceptuales del estado.
   */
  get metadata() {
    return STATE_METADATA[this._value];
  }
  /**
   * Estados a los que se puede transicionar.
   */
  get validTransitions() {
    return STATE_TRANSITIONS[this._value];
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PREDICADOS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Verifica si es el estado idle.
   */
  get isIdle() {
    return this._value === "idle";
  }
  /**
   * Verifica si es un estado interactivo (hover, active, focus).
   */
  get isInteractive() {
    return ["hover", "active", "focus"].includes(this._value);
  }
  /**
   * Verifica si es un estado de feedback (error, success, loading).
   */
  get isFeedback() {
    return ["error", "success", "loading"].includes(this._value);
  }
  /**
   * Verifica si el estado requiere alto contraste.
   */
  get requiresHighContrast() {
    return this.metadata.requiresContrast;
  }
  /**
   * Verifica si el estado necesita indicador de focus.
   */
  get needsFocusIndicator() {
    return this.metadata.focusIndicator;
  }
  /**
   * Verifica si el estado tiene animación.
   */
  get hasAnimation() {
    return this.metadata.animation !== "none";
  }
  // ─────────────────────────────────────────────────────────────────────────
  // TRANSICIONES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Verifica si puede transicionar a otro estado.
   */
  canTransitionTo(target) {
    return this.validTransitions.includes(target.value);
  }
  /**
   * Transiciona a otro estado si es válido.
   */
  transitionTo(target) {
    if (!this.canTransitionTo(target)) {
      return chunk5YMPXU57_js.failure(
        new Error(
          `Invalid transition from '${this._value}' to '${target.value}'`
        )
      );
    }
    return chunk5YMPXU57_js.success(target);
  }
  /**
   * Fuerza transición (sin validación).
   * Usar solo cuando se sabe que es correcto.
   */
  forceTransitionTo(target) {
    return target;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // COMPARACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Verifica igualdad.
   */
  equals(other) {
    return this._value === other._value;
  }
  /**
   * Compara por prioridad.
   * Retorna positivo si this tiene mayor prioridad.
   */
  comparePriority(other) {
    return this.priority - other.priority;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // SERIALIZACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  toString() {
    return this._value;
  }
  toJSON() {
    return this._value;
  }
};
var UIStateMachine = class {
  constructor(initial = UIState.idle(), maxHistory = 10) {
    chunkZM4FIU5F_js.__publicField(this, "_current");
    chunkZM4FIU5F_js.__publicField(this, "_history", []);
    chunkZM4FIU5F_js.__publicField(this, "_maxHistory");
    this._current = initial;
    this._maxHistory = maxHistory;
  }
  /**
   * Estado actual.
   */
  get current() {
    return this._current;
  }
  /**
   * Historial de estados.
   */
  get history() {
    return [...this._history];
  }
  /**
   * Intenta transicionar a un nuevo estado.
   */
  transition(target) {
    const result = this._current.transitionTo(target);
    if (result.success) {
      this._history.push(this._current);
      if (this._history.length > this._maxHistory) {
        this._history.shift();
      }
      this._current = result.value;
    }
    return result;
  }
  /**
   * Fuerza transición (sin validación).
   */
  forceTransition(target) {
    this._history.push(this._current);
    if (this._history.length > this._maxHistory) {
      this._history.shift();
    }
    this._current = target;
  }
  /**
   * Retrocede al estado anterior.
   */
  back() {
    if (this._history.length === 0) {
      return chunk5YMPXU57_js.failure(new Error("No previous state in history"));
    }
    const previous = this._history.pop();
    this._current = previous;
    return chunk5YMPXU57_js.success(previous);
  }
  /**
   * Resetea al estado inicial.
   */
  reset() {
    this._history.length = 0;
    this._current = UIState.idle();
  }
};

// domain/ux/value-objects/UIRole.ts
var UI_ROLES = [
  "background",
  "surface",
  "surface-elevated",
  "text-primary",
  "text-secondary",
  "text-muted",
  "text-inverse",
  "icon",
  "icon-muted",
  "accent",
  "accent-muted",
  "border",
  "border-subtle",
  "divider",
  "overlay",
  "shadow",
  "focus-ring"
];
var ROLE_CATEGORIES = {
  "background": "background",
  "surface": "background",
  "surface-elevated": "background",
  "text-primary": "text",
  "text-secondary": "text",
  "text-muted": "text",
  "text-inverse": "text",
  "icon": "icon",
  "icon-muted": "icon",
  "accent": "accent",
  "accent-muted": "accent",
  "border": "structural",
  "border-subtle": "structural",
  "divider": "structural",
  "overlay": "decorative",
  "shadow": "decorative",
  "focus-ring": "structural"
};
var ROLE_ACCESSIBILITY = {
  "background": {
    minApcaLevel: "minimum",
    requiresContrastAgainst: [],
    isDecorative: true,
    fontSizeDependent: false
  },
  "surface": {
    minApcaLevel: "minimum",
    requiresContrastAgainst: ["background"],
    isDecorative: false,
    fontSizeDependent: false
  },
  "surface-elevated": {
    minApcaLevel: "minimum",
    requiresContrastAgainst: ["surface", "background"],
    isDecorative: false,
    fontSizeDependent: false
  },
  "text-primary": {
    minApcaLevel: "body",
    requiresContrastAgainst: ["background", "surface", "surface-elevated"],
    isDecorative: false,
    fontSizeDependent: true
  },
  "text-secondary": {
    minApcaLevel: "body",
    requiresContrastAgainst: ["background", "surface"],
    isDecorative: false,
    fontSizeDependent: true
  },
  "text-muted": {
    minApcaLevel: "large",
    requiresContrastAgainst: ["background", "surface"],
    isDecorative: false,
    fontSizeDependent: true
  },
  "text-inverse": {
    minApcaLevel: "body",
    requiresContrastAgainst: ["accent"],
    isDecorative: false,
    fontSizeDependent: true
  },
  "icon": {
    minApcaLevel: "spot",
    requiresContrastAgainst: ["background", "surface"],
    isDecorative: false,
    fontSizeDependent: false
  },
  "icon-muted": {
    minApcaLevel: "minimum",
    requiresContrastAgainst: ["background", "surface"],
    isDecorative: true,
    fontSizeDependent: false
  },
  "accent": {
    minApcaLevel: "spot",
    requiresContrastAgainst: ["background", "surface"],
    isDecorative: false,
    fontSizeDependent: false
  },
  "accent-muted": {
    minApcaLevel: "minimum",
    requiresContrastAgainst: ["background"],
    isDecorative: true,
    fontSizeDependent: false
  },
  "border": {
    minApcaLevel: "minimum",
    requiresContrastAgainst: ["background", "surface"],
    isDecorative: false,
    fontSizeDependent: false
  },
  "border-subtle": {
    minApcaLevel: "minimum",
    requiresContrastAgainst: [],
    isDecorative: true,
    fontSizeDependent: false
  },
  "divider": {
    minApcaLevel: "minimum",
    requiresContrastAgainst: [],
    isDecorative: true,
    fontSizeDependent: false
  },
  "overlay": {
    minApcaLevel: "minimum",
    requiresContrastAgainst: [],
    isDecorative: true,
    fontSizeDependent: false
  },
  "shadow": {
    minApcaLevel: "fail",
    // No contrast requirements
    requiresContrastAgainst: [],
    isDecorative: true,
    fontSizeDependent: false
  },
  "focus-ring": {
    minApcaLevel: "spot",
    requiresContrastAgainst: ["background", "surface", "accent"],
    isDecorative: false,
    fontSizeDependent: false
  }
};
var ROLE_RELATIONSHIPS = {
  "background": {
    pairedWith: ["text-primary", "text-secondary", "border"],
    derivableFrom: [],
    overrides: []
  },
  "surface": {
    pairedWith: ["text-primary", "border"],
    derivableFrom: ["background"],
    overrides: ["background"]
  },
  "surface-elevated": {
    pairedWith: ["text-primary", "shadow"],
    derivableFrom: ["surface"],
    overrides: ["surface"]
  },
  "text-primary": {
    pairedWith: ["background", "surface"],
    derivableFrom: [],
    overrides: []
  },
  "text-secondary": {
    pairedWith: ["background", "surface"],
    derivableFrom: ["text-primary"],
    overrides: []
  },
  "text-muted": {
    pairedWith: ["background"],
    derivableFrom: ["text-secondary"],
    overrides: []
  },
  "text-inverse": {
    pairedWith: ["accent"],
    derivableFrom: ["text-primary"],
    overrides: []
  },
  "icon": {
    pairedWith: ["background", "surface"],
    derivableFrom: ["text-primary"],
    overrides: []
  },
  "icon-muted": {
    pairedWith: ["background"],
    derivableFrom: ["icon"],
    overrides: []
  },
  "accent": {
    pairedWith: ["text-inverse", "background"],
    derivableFrom: [],
    overrides: []
  },
  "accent-muted": {
    pairedWith: ["background"],
    derivableFrom: ["accent"],
    overrides: []
  },
  "border": {
    pairedWith: ["surface", "background"],
    derivableFrom: ["text-muted"],
    overrides: []
  },
  "border-subtle": {
    pairedWith: ["surface"],
    derivableFrom: ["border"],
    overrides: []
  },
  "divider": {
    pairedWith: ["surface"],
    derivableFrom: ["border-subtle"],
    overrides: []
  },
  "overlay": {
    pairedWith: ["background"],
    derivableFrom: [],
    overrides: []
  },
  "shadow": {
    pairedWith: ["surface-elevated"],
    derivableFrom: [],
    overrides: []
  },
  "focus-ring": {
    pairedWith: ["accent"],
    derivableFrom: ["accent"],
    overrides: []
  }
};
var UIRole = class _UIRole {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Private)
  // ─────────────────────────────────────────────────────────────────────────
  constructor(value) {
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE STATE
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "_value");
    this._value = value;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // STATIC FACTORIES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Crea desde un string.
   */
  static from(value) {
    if (!UI_ROLES.includes(value)) {
      return chunk5YMPXU57_js.failure(new Error(`Invalid UI role: ${value}`));
    }
    return chunk5YMPXU57_js.success(new _UIRole(value));
  }
  /**
   * Crea un UIRole sin validación.
   */
  static of(value) {
    return new _UIRole(value);
  }
  // Named constructors
  static background() {
    return new _UIRole("background");
  }
  static surface() {
    return new _UIRole("surface");
  }
  static surfaceElevated() {
    return new _UIRole("surface-elevated");
  }
  static textPrimary() {
    return new _UIRole("text-primary");
  }
  static textSecondary() {
    return new _UIRole("text-secondary");
  }
  static textMuted() {
    return new _UIRole("text-muted");
  }
  static textInverse() {
    return new _UIRole("text-inverse");
  }
  static icon() {
    return new _UIRole("icon");
  }
  static iconMuted() {
    return new _UIRole("icon-muted");
  }
  static accent() {
    return new _UIRole("accent");
  }
  static accentMuted() {
    return new _UIRole("accent-muted");
  }
  static border() {
    return new _UIRole("border");
  }
  static borderSubtle() {
    return new _UIRole("border-subtle");
  }
  static divider() {
    return new _UIRole("divider");
  }
  static overlay() {
    return new _UIRole("overlay");
  }
  static shadow() {
    return new _UIRole("shadow");
  }
  static focusRing() {
    return new _UIRole("focus-ring");
  }
  /**
   * Obtiene todos los roles.
   */
  static all() {
    return UI_ROLES.map((r) => new _UIRole(r));
  }
  /**
   * Obtiene roles por categoría.
   */
  static byCategory(category) {
    return UI_ROLES.filter((r) => ROLE_CATEGORIES[r] === category).map((r) => new _UIRole(r));
  }
  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Valor del rol.
   */
  get value() {
    return this._value;
  }
  /**
   * Categoría del rol.
   */
  get category() {
    return ROLE_CATEGORIES[this._value];
  }
  /**
   * Requisitos de accesibilidad.
   */
  get accessibilityRequirements() {
    return ROLE_ACCESSIBILITY[this._value];
  }
  /**
   * Nivel APCA mínimo requerido.
   */
  get minApcaLevel() {
    return ROLE_ACCESSIBILITY[this._value].minApcaLevel;
  }
  /**
   * Roles contra los que debe contrastar.
   */
  get requiresContrastAgainst() {
    return ROLE_ACCESSIBILITY[this._value].requiresContrastAgainst;
  }
  /**
   * Relaciones con otros roles.
   */
  get relationships() {
    return ROLE_RELATIONSHIPS[this._value];
  }
  /**
   * Roles con los que suele usarse en conjunto.
   */
  get pairedWith() {
    return ROLE_RELATIONSHIPS[this._value].pairedWith;
  }
  /**
   * Roles de los que puede derivarse.
   */
  get derivableFrom() {
    return ROLE_RELATIONSHIPS[this._value].derivableFrom;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PREDICADOS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Es un rol de fondo.
   */
  get isBackground() {
    return this.category === "background";
  }
  /**
   * Es un rol de texto.
   */
  get isText() {
    return this.category === "text";
  }
  /**
   * Es un rol de icono.
   */
  get isIcon() {
    return this.category === "icon";
  }
  /**
   * Es un rol de acento.
   */
  get isAccent() {
    return this.category === "accent";
  }
  /**
   * Es decorativo (no requiere contraste estricto).
   */
  get isDecorative() {
    return ROLE_ACCESSIBILITY[this._value].isDecorative;
  }
  /**
   * Depende del tamaño de fuente para requisitos de contraste.
   */
  get isFontSizeDependent() {
    return ROLE_ACCESSIBILITY[this._value].fontSizeDependent;
  }
  /**
   * Verifica si está emparejado con otro rol.
   */
  isPairedWith(other) {
    return this.pairedWith.includes(other.value);
  }
  /**
   * Verifica si puede derivarse de otro rol.
   */
  canDeriveFrom(other) {
    return this.derivableFrom.includes(other.value);
  }
  /**
   * Verifica si debe contrastar con otro rol.
   */
  mustContrastWith(other) {
    return this.requiresContrastAgainst.includes(other.value);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // TRANSFORMACIONES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Obtiene el rol "muted" correspondiente.
   */
  toMuted() {
    switch (this._value) {
      case "text-primary":
      case "text-secondary":
        return _UIRole.textMuted();
      case "icon":
        return _UIRole.iconMuted();
      case "accent":
        return _UIRole.accentMuted();
      case "border":
        return _UIRole.borderSubtle();
      default:
        return null;
    }
  }
  /**
   * Obtiene el rol "inverso" (para uso sobre accent).
   */
  toInverse() {
    switch (this._value) {
      case "text-primary":
      case "text-secondary":
        return _UIRole.textInverse();
      default:
        return null;
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // COMPARACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  equals(other) {
    return this._value === other._value;
  }
  /**
   * Verifica si comparten categoría.
   */
  sameCategory(other) {
    return this.category === other.category;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // SERIALIZACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  toString() {
    return this._value;
  }
  toJSON() {
    return this._value;
  }
  /**
   * Convierte a nombre de variable CSS.
   */
  toCssVar() {
    return `--${this._value}`;
  }
  /**
   * Convierte a nombre de token.
   */
  toTokenName() {
    return `color.${this._value.replace(/-/g, ".")}`;
  }
};
var RolePair = class _RolePair {
  constructor(foreground, background) {
    this.foreground = foreground;
    this.background = background;
  }
  /**
   * Verifica si el par requiere validación de contraste.
   */
  get requiresContrastValidation() {
    return this.foreground.mustContrastWith(this.background);
  }
  /**
   * Obtiene el nivel APCA mínimo requerido para este par.
   */
  get requiredApcaLevel() {
    return this.foreground.minApcaLevel;
  }
  /**
   * Verifica si es un par válido (roles que van juntos).
   */
  get isValidPair() {
    return this.foreground.isPairedWith(this.background);
  }
  equals(other) {
    return this.foreground.equals(other.foreground) && this.background.equals(other.background);
  }
  /**
   * Invierte el par (útil para verificación bidireccional).
   */
  invert() {
    return new _RolePair(this.background, this.foreground);
  }
  toString() {
    return `${this.foreground.value}/${this.background.value}`;
  }
};

// domain/ux/value-objects/ComponentIntent.ts
var COMPONENT_INTENTS = [
  "navigation",
  "action",
  "action-destructive",
  "action-secondary",
  "status-info",
  "status-success",
  "status-warning",
  "status-error",
  "data-entry",
  "data-display",
  "feedback",
  "decoration"
];
var INTENT_CATEGORIES = {
  "navigation": "navigation",
  "action": "action",
  "action-destructive": "action",
  "action-secondary": "action",
  "status-info": "status",
  "status-success": "status",
  "status-warning": "status",
  "status-error": "status",
  "data-entry": "data",
  "data-display": "data",
  "feedback": "feedback",
  "decoration": "decoration"
};
var INTENT_SEVERITY = {
  "navigation": "neutral",
  "action": "info",
  "action-destructive": "error",
  "action-secondary": "neutral",
  "status-info": "info",
  "status-success": "success",
  "status-warning": "warning",
  "status-error": "error",
  "data-entry": "neutral",
  "data-display": "neutral",
  "feedback": "info",
  "decoration": "neutral"
};
var INTENT_VARIANTS = {
  "navigation": ["ghost", "soft"],
  "action": ["solid", "outline", "soft"],
  "action-destructive": ["solid", "outline"],
  "action-secondary": ["outline", "ghost", "soft"],
  "status-info": ["soft", "outline"],
  "status-success": ["soft", "outline"],
  "status-warning": ["soft", "outline"],
  "status-error": ["soft", "outline", "solid"],
  "data-entry": ["outline", "soft"],
  "data-display": ["ghost", "soft"],
  "feedback": ["soft", "glass"],
  "decoration": ["ghost", "soft", "gradient"]
};
var INTENT_ROLES = {
  "navigation": ["text-secondary", "icon", "background"],
  "action": ["accent", "text-inverse", "border"],
  "action-destructive": ["accent", "text-inverse"],
  "action-secondary": ["border", "text-primary"],
  "status-info": ["accent-muted", "text-primary", "border"],
  "status-success": ["accent-muted", "text-primary", "border"],
  "status-warning": ["accent-muted", "text-primary", "border"],
  "status-error": ["accent-muted", "text-primary", "border"],
  "data-entry": ["border", "text-primary", "surface"],
  "data-display": ["text-primary", "text-secondary", "surface"],
  "feedback": ["surface-elevated", "text-primary", "shadow"],
  "decoration": ["background", "border-subtle"]
};
var INTENT_STATES = {
  "navigation": ["idle", "hover", "active", "focus", "disabled"],
  "action": ["idle", "hover", "active", "focus", "disabled", "loading"],
  "action-destructive": ["idle", "hover", "active", "focus", "disabled", "loading"],
  "action-secondary": ["idle", "hover", "active", "focus", "disabled"],
  "status-info": ["idle"],
  "status-success": ["idle"],
  "status-warning": ["idle"],
  "status-error": ["idle", "active"],
  "data-entry": ["idle", "focus", "error", "disabled"],
  "data-display": ["idle"],
  "feedback": ["idle", "success", "error", "loading"],
  "decoration": ["idle"]
};
var INTENT_INTERACTIVITY = {
  "navigation": {
    isInteractive: true,
    isFocusable: true,
    supportsKeyboard: true,
    requiresPointer: false
  },
  "action": {
    isInteractive: true,
    isFocusable: true,
    supportsKeyboard: true,
    requiresPointer: false
  },
  "action-destructive": {
    isInteractive: true,
    isFocusable: true,
    supportsKeyboard: true,
    requiresPointer: false
  },
  "action-secondary": {
    isInteractive: true,
    isFocusable: true,
    supportsKeyboard: true,
    requiresPointer: false
  },
  "status-info": {
    isInteractive: false,
    isFocusable: false,
    supportsKeyboard: false,
    requiresPointer: false
  },
  "status-success": {
    isInteractive: false,
    isFocusable: false,
    supportsKeyboard: false,
    requiresPointer: false
  },
  "status-warning": {
    isInteractive: false,
    isFocusable: false,
    supportsKeyboard: false,
    requiresPointer: false
  },
  "status-error": {
    isInteractive: false,
    isFocusable: false,
    supportsKeyboard: false,
    requiresPointer: false
  },
  "data-entry": {
    isInteractive: true,
    isFocusable: true,
    supportsKeyboard: true,
    requiresPointer: false
  },
  "data-display": {
    isInteractive: false,
    isFocusable: false,
    supportsKeyboard: false,
    requiresPointer: false
  },
  "feedback": {
    isInteractive: false,
    isFocusable: true,
    // For accessibility
    supportsKeyboard: true,
    // Dismiss with Escape
    requiresPointer: false
  },
  "decoration": {
    isInteractive: false,
    isFocusable: false,
    supportsKeyboard: false,
    requiresPointer: false
  }
};
var ComponentIntent = class _ComponentIntent {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Private)
  // ─────────────────────────────────────────────────────────────────────────
  constructor(value) {
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE STATE
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "_value");
    this._value = value;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // STATIC FACTORIES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Crea desde un string.
   */
  static from(value) {
    if (!COMPONENT_INTENTS.includes(value)) {
      return chunk5YMPXU57_js.failure(new Error(`Invalid component intent: ${value}`));
    }
    return chunk5YMPXU57_js.success(new _ComponentIntent(value));
  }
  /**
   * Crea sin validación.
   */
  static of(value) {
    return new _ComponentIntent(value);
  }
  // Named constructors
  static navigation() {
    return new _ComponentIntent("navigation");
  }
  static action() {
    return new _ComponentIntent("action");
  }
  static actionDestructive() {
    return new _ComponentIntent("action-destructive");
  }
  static actionSecondary() {
    return new _ComponentIntent("action-secondary");
  }
  static statusInfo() {
    return new _ComponentIntent("status-info");
  }
  static statusSuccess() {
    return new _ComponentIntent("status-success");
  }
  static statusWarning() {
    return new _ComponentIntent("status-warning");
  }
  static statusError() {
    return new _ComponentIntent("status-error");
  }
  static dataEntry() {
    return new _ComponentIntent("data-entry");
  }
  static dataDisplay() {
    return new _ComponentIntent("data-display");
  }
  static feedback() {
    return new _ComponentIntent("feedback");
  }
  static decoration() {
    return new _ComponentIntent("decoration");
  }
  /**
   * Obtiene todas las intenciones.
   */
  static all() {
    return COMPONENT_INTENTS.map((i) => new _ComponentIntent(i));
  }
  /**
   * Obtiene intenciones por categoría.
   */
  static byCategory(category) {
    return COMPONENT_INTENTS.filter((i) => INTENT_CATEGORIES[i] === category).map((i) => new _ComponentIntent(i));
  }
  /**
   * Crea intención de status desde severidad.
   */
  static fromSeverity(severity) {
    switch (severity) {
      case "info":
        return _ComponentIntent.statusInfo();
      case "success":
        return _ComponentIntent.statusSuccess();
      case "warning":
        return _ComponentIntent.statusWarning();
      case "error":
        return _ComponentIntent.statusError();
      case "neutral":
        return _ComponentIntent.dataDisplay();
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Valor de la intención.
   */
  get value() {
    return this._value;
  }
  /**
   * Categoría de la intención.
   */
  get category() {
    return INTENT_CATEGORIES[this._value];
  }
  /**
   * Severidad asociada.
   */
  get severity() {
    return INTENT_SEVERITY[this._value];
  }
  /**
   * Variantes recomendadas.
   */
  get recommendedVariants() {
    return INTENT_VARIANTS[this._value];
  }
  /**
   * Variante por defecto.
   */
  get defaultVariant() {
    return INTENT_VARIANTS[this._value][0];
  }
  /**
   * Roles primarios asociados.
   */
  get primaryRoles() {
    return INTENT_ROLES[this._value];
  }
  /**
   * Estados relevantes.
   */
  get relevantStates() {
    return INTENT_STATES[this._value];
  }
  /**
   * Información de interactividad.
   */
  get interactivity() {
    return INTENT_INTERACTIVITY[this._value];
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PREDICADOS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Es una acción.
   */
  get isAction() {
    return this.category === "action";
  }
  /**
   * Es un estado/status.
   */
  get isStatus() {
    return this.category === "status";
  }
  /**
   * Es navegación.
   */
  get isNavigation() {
    return this.category === "navigation";
  }
  /**
   * Es interactivo.
   */
  get isInteractive() {
    return INTENT_INTERACTIVITY[this._value].isInteractive;
  }
  /**
   * Es focusable.
   */
  get isFocusable() {
    return INTENT_INTERACTIVITY[this._value].isFocusable;
  }
  /**
   * Es destructivo.
   */
  get isDestructive() {
    return this._value === "action-destructive";
  }
  /**
   * Requiere confirmación (acciones peligrosas).
   */
  get requiresConfirmation() {
    return this._value === "action-destructive";
  }
  /**
   * Soporta estado de carga.
   */
  get supportsLoading() {
    return this.relevantStates.includes("loading");
  }
  /**
   * Soporta estado de error.
   */
  get supportsError() {
    return this.relevantStates.includes("error");
  }
  // ─────────────────────────────────────────────────────────────────────────
  // MÉTODOS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Verifica si una variante es válida para esta intención.
   */
  supportsVariant(variant) {
    return this.recommendedVariants.includes(variant);
  }
  /**
   * Verifica si un estado es relevante para esta intención.
   */
  hasState(state) {
    return this.relevantStates.includes(state.value);
  }
  /**
   * Obtiene los UIRoles como Value Objects.
   */
  getRoles() {
    return this.primaryRoles.map((r) => UIRole.of(r));
  }
  /**
   * Obtiene los UIStates como Value Objects.
   */
  getStates() {
    return this.relevantStates.map((s) => UIState.of(s));
  }
  // ─────────────────────────────────────────────────────────────────────────
  // COMPARACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  equals(other) {
    return this._value === other._value;
  }
  /**
   * Verifica si comparten categoría.
   */
  sameCategory(other) {
    return this.category === other.category;
  }
  /**
   * Verifica si comparten severidad.
   */
  sameSeverity(other) {
    return this.severity === other.severity;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // SERIALIZACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  toString() {
    return this._value;
  }
  toJSON() {
    return this._value;
  }
  /**
   * Genera un nombre de clase CSS.
   */
  toCssClass() {
    return `intent-${this._value}`;
  }
};

// domain/ux/entities/UXDecision.ts
var UXDecision = class _UXDecision {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Private)
  // ─────────────────────────────────────────────────────────────────────────
  constructor(id, request, tokens, governance, config) {
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE STATE
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "_id");
    chunkZM4FIU5F_js.__publicField(this, "_request");
    chunkZM4FIU5F_js.__publicField(this, "_tokens");
    chunkZM4FIU5F_js.__publicField(this, "_governance");
    chunkZM4FIU5F_js.__publicField(this, "_config");
    chunkZM4FIU5F_js.__publicField(this, "_createdAt");
    chunkZM4FIU5F_js.__publicField(this, "_status");
    chunkZM4FIU5F_js.__publicField(this, "_auditTrail");
    this._id = id;
    this._request = request;
    this._governance = governance;
    this._config = config;
    this._createdAt = /* @__PURE__ */ new Date();
    this._status = "pending";
    this._auditTrail = [];
    this._tokens = /* @__PURE__ */ new Map();
    for (const token of tokens) {
      const key = this.tokenKey(token.role, token.state);
      this._tokens.set(key, token);
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // STATIC FACTORIES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Crea una nueva decisión.
   * Nota: En producción, esto delegaría a Color Intelligence.
   */
  static create(request, config = DEFAULT_CONFIG) {
    const id = chunk5YMPXU57_js.BrandConstructors.decisionId();
    const tokens = _UXDecision.generateTokens(request);
    const governance = _UXDecision.evaluateGovernance(tokens, config);
    return new _UXDecision(id, request, tokens, governance, config);
  }
  /**
   * Genera tokens para la solicitud.
   * Esto es una implementación simplificada - en producción usaría Color Intelligence.
   */
  static generateTokens(request) {
    const tokens = [];
    const { brandColor, states, roles, intent } = request;
    for (const state of states) {
      for (const role of roles) {
        const color = _UXDecision.deriveColor(brandColor, role, state, intent);
        const accessibility = _UXDecision.calculateAccessibility(color, role);
        tokens.push({
          role: role.value,
          state: state.value,
          color,
          cssValue: color.toCssOklch(),
          accessibility,
          derivedFrom: brandColor.hex
        });
      }
    }
    return tokens;
  }
  /**
   * Deriva un color basado en rol, estado e intención.
   */
  static deriveColor(brand, role, state, intent) {
    let color = brand;
    switch (role.value) {
      case "accent":
        break;
      case "text-inverse":
        const analysis = brand.analyze();
        color = analysis.contrastMode === "light-content" ? chunkX3KESCNX_js.PerceptualColor.fromOklch(0.98, 0, 0) : chunkX3KESCNX_js.PerceptualColor.fromOklch(0.15, 0, 0);
        break;
      case "border":
        color = brand.darken(0.1).desaturate(0.05);
        break;
      case "background":
        color = brand.lighten(0.4).desaturate(0.15);
        break;
      case "surface":
        color = chunkX3KESCNX_js.PerceptualColor.fromOklch(0.98, 0.01, brand.hue);
        break;
      case "text-primary":
        color = chunkX3KESCNX_js.PerceptualColor.fromOklch(0.2, 0.02, brand.hue);
        break;
      case "text-secondary":
        color = chunkX3KESCNX_js.PerceptualColor.fromOklch(0.4, 0.02, brand.hue);
        break;
      case "text-muted":
        color = chunkX3KESCNX_js.PerceptualColor.fromOklch(0.55, 0.01, brand.hue);
        break;
      case "icon":
        color = brand.desaturate(0.02);
        break;
      case "accent-muted":
        color = brand.withAlpha(0.15);
        break;
      case "focus-ring":
        color = brand.saturate(0.05).withAlpha(0.5);
        break;
    }
    const metadata = state.metadata;
    if (metadata.suggestedLightnessShift !== 0) {
      color = metadata.suggestedLightnessShift > 0 ? color.lighten(Math.abs(metadata.suggestedLightnessShift)) : color.darken(Math.abs(metadata.suggestedLightnessShift));
    }
    if (metadata.suggestedChromaShift !== 0) {
      color = metadata.suggestedChromaShift > 0 ? color.saturate(Math.abs(metadata.suggestedChromaShift)) : color.desaturate(Math.abs(metadata.suggestedChromaShift));
    }
    if (metadata.suggestedOpacity < 1) {
      color = color.withAlpha(metadata.suggestedOpacity);
    }
    if (intent.isDestructive && role.isAccent) {
      color = chunkX3KESCNX_js.PerceptualColor.fromOklch(0.55, 0.22, 25);
    }
    return color;
  }
  /**
   * Calcula metadatos de accesibilidad para un color.
   */
  static calculateAccessibility(color, role) {
    const l = color.lightness;
    const estimatedLc = Math.abs(l - 0.5) * 150;
    const apcaLevel = estimatedLc >= 90 ? "excellent" : estimatedLc >= 75 ? "fluent" : estimatedLc >= 60 ? "body" : estimatedLc >= 45 ? "large" : estimatedLc >= 30 ? "spot" : estimatedLc >= 15 ? "minimum" : "fail";
    const meetsRequirement = (() => {
      const required = role.minApcaLevel;
      const levels = ["fail", "minimum", "spot", "large", "body", "fluent", "excellent"];
      return levels.indexOf(apcaLevel) >= levels.indexOf(required);
    })();
    return {
      wcagLevel: estimatedLc >= 70 ? "AAA" : estimatedLc >= 45 ? "AA" : "Fail",
      wcag3Tier: estimatedLc >= 90 ? "Platinum" : estimatedLc >= 75 ? "Gold" : estimatedLc >= 60 ? "Silver" : estimatedLc >= 45 ? "Bronze" : "Fail",
      apcaLc: estimatedLc,
      apcaLevel,
      contrastRatio: Math.min(21, Math.max(1, estimatedLc / 5)),
      meetsRequirement
    };
  }
  /**
   * Evalúa gobernanza de tokens.
   */
  static evaluateGovernance(tokens, config) {
    const violations = [];
    const warnings = [];
    for (const token of tokens) {
      if (!token.accessibility.meetsRequirement) {
        if (config.enforcementLevel === "strict") {
          violations.push({
            id: chunk5YMPXU57_js.BrandConstructors.violationId(),
            policyId: "apca-minimum",
            policyName: "APCA Minimum Contrast",
            severity: "error",
            message: `Token ${token.role}/${token.state} does not meet APCA requirements`,
            affectedTokens: [`${token.role}-${token.state}`],
            suggestedFix: "Increase contrast by adjusting lightness"
          });
        } else {
          warnings.push({
            id: chunk5YMPXU57_js.BrandConstructors.violationId(),
            policyId: "apca-minimum",
            policyName: "APCA Minimum Contrast",
            severity: "warning",
            message: `Token ${token.role}/${token.state} has suboptimal contrast`,
            affectedTokens: [`${token.role}-${token.state}`]
          });
        }
      }
    }
    const isCompliant = violations.length === 0;
    const score = Math.max(0, 100 - violations.length * 20 - warnings.length * 5);
    return {
      isCompliant,
      score,
      violations,
      warnings,
      appliedAdjustments: [],
      timestamp: /* @__PURE__ */ new Date()
    };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * ID único de la decisión.
   */
  get id() {
    return this._id;
  }
  /**
   * Solicitud original.
   */
  get request() {
    return this._request;
  }
  /**
   * Evaluación de gobernanza.
   */
  get governance() {
    return this._governance;
  }
  /**
   * Configuración aplicada.
   */
  get config() {
    return this._config;
  }
  /**
   * Estado actual de la decisión.
   */
  get status() {
    return this._status;
  }
  /**
   * Fecha de creación.
   */
  get createdAt() {
    return this._createdAt;
  }
  /**
   * Trail de auditoría.
   */
  get auditTrail() {
    return [...this._auditTrail];
  }
  /**
   * Todos los tokens.
   */
  get tokens() {
    return Array.from(this._tokens.values());
  }
  /**
   * Número de tokens.
   */
  get tokenCount() {
    return this._tokens.size;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PREDICADOS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Verifica si la decisión es compliant.
   */
  get isCompliant() {
    return this._governance.isCompliant;
  }
  /**
   * Verifica si todos los tokens son accesibles.
   */
  get isFullyAccessible() {
    return this.tokens.every((t) => t.accessibility.meetsRequirement);
  }
  /**
   * Verifica si tiene advertencias.
   */
  get hasWarnings() {
    return this._governance.warnings.length > 0;
  }
  /**
   * Verifica si fue aplicada.
   */
  get isApplied() {
    return this._status === "applied";
  }
  // ─────────────────────────────────────────────────────────────────────────
  // MÉTODOS DE ACCESO A TOKENS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Genera la clave para un token.
   */
  tokenKey(role, state) {
    return `${role}::${state}`;
  }
  /**
   * Obtiene un token específico.
   */
  getToken(role, state) {
    return this._tokens.get(this.tokenKey(role, state));
  }
  /**
   * Obtiene tokens por rol.
   */
  getTokensByRole(role) {
    return this.tokens.filter((t) => t.role === role);
  }
  /**
   * Obtiene tokens por estado.
   */
  getTokensByState(state) {
    return this.tokens.filter((t) => t.state === state);
  }
  /**
   * Obtiene el color CSS para un rol y estado.
   */
  getCssValue(role, state) {
    return this.getToken(role, state)?.cssValue;
  }
  /**
   * Obtiene todos los tokens para un estado como mapa de roles.
   */
  getStateTokens(state) {
    const result = /* @__PURE__ */ new Map();
    for (const token of this.getTokensByState(state)) {
      result.set(token.role, token.cssValue);
    }
    return result;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // MUTADORES (con auditoría)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Marca la decisión como aplicada.
   */
  markApplied() {
    if (this._status === "applied") return;
    const previousStatus = this._status;
    this._status = "applied";
    if (this._config.auditEnabled) {
      this._auditTrail.push({
        id: chunk5YMPXU57_js.BrandConstructors.auditId(),
        timestamp: /* @__PURE__ */ new Date(),
        action: "status_change",
        source: "component-default",
        details: { from: previousStatus, to: "applied" },
        previousValue: previousStatus,
        newValue: "applied"
      });
    }
  }
  /**
   * Rechaza la decisión.
   */
  reject(reason) {
    this._status = "rejected";
    if (this._config.auditEnabled) {
      this._auditTrail.push({
        id: chunk5YMPXU57_js.BrandConstructors.auditId(),
        timestamp: /* @__PURE__ */ new Date(),
        action: "rejected",
        source: "user-override",
        details: { reason },
        previousValue: this._status,
        newValue: "rejected"
      });
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXPORTACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Exporta como variables CSS.
   */
  toCssVariables(prefix = "ux") {
    const vars = {};
    for (const token of this.tokens) {
      const varName = `--${prefix}-${token.role}-${token.state}`;
      vars[varName] = token.cssValue;
    }
    return vars;
  }
  /**
   * Exporta como string CSS.
   */
  toCssString(prefix = "ux", selector = ":root") {
    const vars = this.toCssVariables(prefix);
    const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
    return `${selector} {
${lines.join("\n")}
}`;
  }
  /**
   * Exporta como design tokens (W3C DTCG format).
   */
  toDesignTokens() {
    const tokens = {};
    for (const token of this.tokens) {
      const path = `${token.role}.${token.state}`;
      tokens[path] = {
        $type: "color",
        $value: token.cssValue,
        $description: `${token.role} color for ${token.state} state`,
        $extensions: {
          "momoto-ui": {
            role: token.role,
            state: token.state,
            accessibility: token.accessibility
          }
        }
      };
    }
    return {
      color: tokens
    };
  }
  /**
   * Crea un snapshot para auditoría.
   */
  toSnapshot() {
    return {
      id: this._id,
      timestamp: this._createdAt,
      request: this._request,
      tokens: this.tokens,
      governance: this._governance,
      config: this._config
    };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // SERIALIZACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  toJSON() {
    return {
      id: this._id,
      request: {
        componentId: this._request.componentId,
        intent: this._request.intent.value,
        brandColor: this._request.brandColor.hex,
        states: this._request.states.map((s) => s.value),
        roles: this._request.roles.map((r) => r.value)
      },
      tokens: this.tokens.map((t) => ({
        role: t.role,
        state: t.state,
        cssValue: t.cssValue,
        accessibility: t.accessibility
      })),
      governance: this._governance,
      status: this._status,
      createdAt: this._createdAt.toISOString()
    };
  }
};
var DEFAULT_CONFIG = {
  enforcementLevel: "moderate",
  accessibilityTarget: "aaa",
  allowOverrides: true,
  auditEnabled: true
};

// domain/tokens/value-objects/DesignToken.ts
var DesignToken = class _DesignToken {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Private)
  // ─────────────────────────────────────────────────────────────────────────
  constructor(name, value, category, description, context, provenance, deprecated = false, deprecationMessage) {
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE STATE
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "_name");
    chunkZM4FIU5F_js.__publicField(this, "_value");
    chunkZM4FIU5F_js.__publicField(this, "_category");
    chunkZM4FIU5F_js.__publicField(this, "_description");
    chunkZM4FIU5F_js.__publicField(this, "_context");
    chunkZM4FIU5F_js.__publicField(this, "_provenance");
    chunkZM4FIU5F_js.__publicField(this, "_deprecated");
    chunkZM4FIU5F_js.__publicField(this, "_deprecationMessage");
    this._name = name;
    this._value = value;
    this._category = category;
    this._description = description;
    this._context = context;
    this._provenance = provenance;
    this._deprecated = deprecated;
    this._deprecationMessage = deprecationMessage;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // STATIC FACTORIES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Crea un token de color desde PerceptualColor.
   */
  static color(name, color, context = {}, description = "") {
    const coords = color.oklch;
    const value = {
      type: "color",
      value: color.hex,
      perceptual: {
        oklch: { l: coords.l, c: coords.c, h: coords.h }
      }
    };
    return new _DesignToken(
      name,
      value,
      _DesignToken.inferCategory(context),
      description,
      context,
      _DesignToken.createProvenance()
    );
  }
  /**
   * Crea un token de color desde hex string.
   */
  static colorFromHex(name, hex, context = {}, description = "") {
    const colorResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(hex);
    if (!colorResult.success) {
      return chunk5YMPXU57_js.failure(colorResult.error);
    }
    return chunk5YMPXU57_js.success(_DesignToken.color(name, colorResult.value, context, description));
  }
  /**
   * Crea un token de dimensión.
   */
  static dimension(name, value, unit, context = {}, description = "") {
    const tokenValue = {
      type: "dimension",
      value,
      unit
    };
    return new _DesignToken(
      name,
      tokenValue,
      _DesignToken.inferCategory(context),
      description,
      context,
      _DesignToken.createProvenance()
    );
  }
  /**
   * Crea un token de sombra.
   */
  static shadow(name, shadows, context = {}, description = "") {
    const value = {
      type: "shadow",
      value: shadows
    };
    return new _DesignToken(
      name,
      value,
      _DesignToken.inferCategory(context),
      description,
      context,
      _DesignToken.createProvenance()
    );
  }
  /**
   * Crea un token de gradiente.
   */
  static gradient(name, gradientDef, context = {}, description = "") {
    const value = {
      type: "gradient",
      value: gradientDef
    };
    return new _DesignToken(
      name,
      value,
      _DesignToken.inferCategory(context),
      description,
      context,
      _DesignToken.createProvenance()
    );
  }
  /**
   * Crea un token compuesto.
   */
  static composite(name, values, context = {}, description = "") {
    const value = {
      type: "composite",
      value: values
    };
    return new _DesignToken(
      name,
      value,
      _DesignToken.inferCategory(context),
      description,
      context,
      _DesignToken.createProvenance()
    );
  }
  /**
   * Infiere categoría desde contexto.
   */
  static inferCategory(context) {
    if (context.state) return "state";
    if (context.component) return "component";
    if (context.role || context.intent) return "semantic";
    return "primitive";
  }
  /**
   * Crea provenance inicial.
   */
  static createProvenance(derivedFrom) {
    return {
      derivedFrom,
      transformations: [],
      createdAt: /* @__PURE__ */ new Date(),
      version: "1.0.0",
      generator: "momoto-ui/domain"
    };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────────────────────────────────────
  get name() {
    return this._name;
  }
  get value() {
    return this._value;
  }
  get type() {
    return this._value.type;
  }
  get category() {
    return this._category;
  }
  get description() {
    return this._description;
  }
  get context() {
    return this._context;
  }
  get provenance() {
    return this._provenance;
  }
  get deprecated() {
    return this._deprecated;
  }
  get deprecationMessage() {
    return this._deprecationMessage;
  }
  /**
   * Nombre como variable CSS.
   */
  get cssVariableName() {
    return `--${this._name.replace(/\./g, "-")}`;
  }
  /**
   * Path jerárquico.
   */
  get path() {
    return this._name.split(".");
  }
  /**
   * Namespace (primer segmento del path).
   */
  get namespace() {
    return this.path[0] || "";
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PREDICADOS
  // ─────────────────────────────────────────────────────────────────────────
  get isColor() {
    return this._value.type === "color";
  }
  get isDimension() {
    return this._value.type === "dimension";
  }
  get isShadow() {
    return this._value.type === "shadow";
  }
  get isGradient() {
    return this._value.type === "gradient";
  }
  get isComposite() {
    return this._value.type === "composite";
  }
  get isPrimitive() {
    return this._category === "primitive";
  }
  get isSemantic() {
    return this._category === "semantic";
  }
  get isComponent() {
    return this._category === "component";
  }
  get isState() {
    return this._category === "state";
  }
  // ─────────────────────────────────────────────────────────────────────────
  // TRANSFORMACIONES (Inmutables)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Crea copia con nuevo nombre.
   */
  rename(newName) {
    return new _DesignToken(
      newName,
      this._value,
      this._category,
      this._description,
      this._context,
      this.addTransformation(`renamed from ${this._name}`),
      this._deprecated,
      this._deprecationMessage
    );
  }
  /**
   * Crea copia con nueva descripción.
   */
  describe(description) {
    return new _DesignToken(
      this._name,
      this._value,
      this._category,
      description,
      this._context,
      this._provenance,
      this._deprecated,
      this._deprecationMessage
    );
  }
  /**
   * Marca como deprecado.
   */
  deprecate(message) {
    return new _DesignToken(
      this._name,
      this._value,
      this._category,
      this._description,
      this._context,
      this._provenance,
      true,
      message
    );
  }
  /**
   * Crea copia con contexto adicional.
   */
  withContext(additionalContext) {
    return new _DesignToken(
      this._name,
      this._value,
      _DesignToken.inferCategory({ ...this._context, ...additionalContext }),
      this._description,
      { ...this._context, ...additionalContext },
      this.addTransformation("context updated"),
      this._deprecated,
      this._deprecationMessage
    );
  }
  /**
   * Deriva un token de estado desde este token.
   */
  deriveState(state, color) {
    if (this._value.type !== "color") {
      throw new Error("Can only derive state from color tokens");
    }
    const stateSuffix = state.value;
    const newName = `${this._name}.${stateSuffix}`;
    return _DesignToken.color(
      newName,
      color,
      { ...this._context, state: state.value },
      `${this._description} - ${stateSuffix} state`
    );
  }
  /**
   * Agrega transformación al provenance.
   */
  addTransformation(transformation) {
    return {
      ...this._provenance,
      transformations: [...this._provenance.transformations, transformation]
    };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXPORTACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Exporta a variable CSS.
   */
  toCssVariable() {
    return `${this.cssVariableName}: ${this.toCssValue()};`;
  }
  /**
   * Exporta a valor CSS.
   */
  toCssValue() {
    switch (this._value.type) {
      case "color":
        return this._value.value;
      case "dimension":
        return `${this._value.value}${this._value.unit}`;
      case "shadow":
        return this._value.value.map(
          (s) => `${s.inset ? "inset " : ""}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`
        ).join(", ");
      case "gradient": {
        const g = this._value.value;
        const stops = g.stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ");
        if (g.type === "linear") {
          return `linear-gradient(${g.angle ?? 180}deg, ${stops})`;
        } else if (g.type === "radial") {
          return `radial-gradient(${stops})`;
        } else {
          return `conic-gradient(${stops})`;
        }
      }
      case "composite":
        return "";
    }
  }
  /**
   * Exporta a formato W3C DTCG.
   */
  toW3C() {
    const base = {
      $value: this.getW3CValue(),
      $type: this.getW3CType(),
      $description: this._description || void 0,
      $extensions: {
        "com.momoto-ui": {
          category: this._category,
          context: this._context,
          provenance: {
            derivedFrom: this._provenance.derivedFrom,
            generator: this._provenance.generator,
            version: this._provenance.version
          },
          deprecated: this._deprecated ? {
            message: this._deprecationMessage
          } : void 0
        }
      }
    };
    return base;
  }
  /**
   * Obtiene valor en formato W3C.
   */
  getW3CValue() {
    switch (this._value.type) {
      case "color":
        return this._value.value;
      case "dimension":
        return `${this._value.value}${this._value.unit}`;
      case "shadow":
        return this._value.value.map((s) => ({
          offsetX: `${s.offsetX}px`,
          offsetY: `${s.offsetY}px`,
          blur: `${s.blur}px`,
          spread: `${s.spread}px`,
          color: s.color,
          inset: s.inset
        }));
      case "gradient":
        return this._value.value;
      case "composite":
        return this._value.value;
    }
  }
  /**
   * Obtiene tipo W3C.
   */
  getW3CType() {
    return this._value.type;
  }
  /**
   * Exporta a formato Tailwind.
   */
  toTailwindConfig() {
    const key = this._name.replace(/\./g, "-");
    return { key, value: this.toCssValue() };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // COMPARACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Verifica igualdad estructural.
   */
  equals(other) {
    return this._name === other._name && JSON.stringify(this._value) === JSON.stringify(other._value);
  }
  /**
   * Verifica si es del mismo tipo.
   */
  sameType(other) {
    return this._value.type === other._value.type;
  }
  /**
   * Verifica si comparten namespace.
   */
  sameNamespace(other) {
    return this.namespace === other.namespace;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // SERIALIZACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  toString() {
    return `${this._name}: ${this.toCssValue()}`;
  }
  toJSON() {
    return {
      name: this._name,
      value: this._value,
      category: this._category,
      description: this._description,
      context: this._context,
      provenance: {
        ...this._provenance,
        createdAt: this._provenance.createdAt.toISOString()
      },
      deprecated: this._deprecated,
      deprecationMessage: this._deprecationMessage
    };
  }
};

// domain/tokens/entities/TokenCollection.ts
var TokenCollection = class _TokenCollection {
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE CONSTRUCTOR (use static factories)
  // ─────────────────────────────────────────────────────────────────────────
  constructor(name, description, version, tokens, createdAt, updatedAt) {
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE READONLY STATE
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "_name");
    chunkZM4FIU5F_js.__publicField(this, "_description");
    chunkZM4FIU5F_js.__publicField(this, "_version");
    chunkZM4FIU5F_js.__publicField(this, "_tokens");
    chunkZM4FIU5F_js.__publicField(this, "_createdAt");
    chunkZM4FIU5F_js.__publicField(this, "_updatedAt");
    this._name = name;
    this._description = description;
    this._version = version;
    this._tokens = tokens;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    Object.freeze(this);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // STATIC FACTORIES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Crea una nueva colección vacía.
   * @param optionsOrName - Options object o simplemente el nombre.
   */
  static create(optionsOrName) {
    const options = typeof optionsOrName === "string" ? { name: optionsOrName } : optionsOrName;
    const now = /* @__PURE__ */ new Date();
    return new _TokenCollection(
      options.name,
      options.description ?? "",
      options.version ?? "1.0.0",
      /* @__PURE__ */ new Map(),
      now,
      now
    );
  }
  /**
   * Crea colección vacía (alias de create).
   */
  static empty(name) {
    return _TokenCollection.create({ name });
  }
  /**
   * Crea colección desde array de tokens.
   */
  static from(name, tokens, description = "") {
    const tokenMap = /* @__PURE__ */ new Map();
    for (const token of tokens) {
      tokenMap.set(token.name, token);
    }
    const now = /* @__PURE__ */ new Date();
    return new _TokenCollection(name, description, "1.0.0", tokenMap, now, now);
  }
  /**
   * Merge múltiples colecciones en una nueva.
   */
  static merge(name, collections) {
    const tokenMap = /* @__PURE__ */ new Map();
    for (const collection of collections) {
      for (const token of collection.all()) {
        tokenMap.set(token.name, token);
      }
    }
    const now = /* @__PURE__ */ new Date();
    return new _TokenCollection(name, "", "1.0.0", tokenMap, now, now);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS (readonly access)
  // ─────────────────────────────────────────────────────────────────────────
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
  get version() {
    return this._version;
  }
  get size() {
    return this._tokens.size;
  }
  get isEmpty() {
    return this._tokens.size === 0;
  }
  get createdAt() {
    return new Date(this._createdAt.getTime());
  }
  get updatedAt() {
    return new Date(this._updatedAt.getTime());
  }
  /**
   * Obtiene todos los namespaces únicos.
   */
  get namespaces() {
    const namespaces = /* @__PURE__ */ new Set();
    for (const token of this._tokens.values()) {
      namespaces.add(token.namespace);
    }
    return Object.freeze(Array.from(namespaces).sort());
  }
  // ─────────────────────────────────────────────────────────────────────────
  // IMMUTABLE CRUD OPERATIONS (return new instances)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Agrega un token. Retorna NUEVA colección.
   */
  add(token) {
    const newTokens = new Map(this._tokens);
    newTokens.set(token.name, token);
    return new _TokenCollection(
      this._name,
      this._description,
      this._version,
      newTokens,
      this._createdAt,
      /* @__PURE__ */ new Date()
    );
  }
  /**
   * Agrega múltiples tokens. Retorna NUEVA colección.
   */
  addAll(tokens) {
    const newTokens = new Map(this._tokens);
    for (const token of tokens) {
      newTokens.set(token.name, token);
    }
    return new _TokenCollection(
      this._name,
      this._description,
      this._version,
      newTokens,
      this._createdAt,
      /* @__PURE__ */ new Date()
    );
  }
  /**
   * Obtiene un token por nombre.
   */
  get(name) {
    return this._tokens.get(name);
  }
  /**
   * Verifica si existe un token.
   */
  has(name) {
    return this._tokens.has(name);
  }
  /**
   * Elimina un token. Retorna NUEVA colección.
   * Si el token no existe, retorna la misma instancia (sin cambios).
   */
  remove(name) {
    if (!this._tokens.has(name)) {
      return this;
    }
    const newTokens = new Map(this._tokens);
    newTokens.delete(name);
    return new _TokenCollection(
      this._name,
      this._description,
      this._version,
      newTokens,
      this._createdAt,
      /* @__PURE__ */ new Date()
    );
  }
  /**
   * Reemplaza un token. Retorna Result con NUEVA colección o error.
   */
  replace(token) {
    if (!this._tokens.has(token.name)) {
      return chunk5YMPXU57_js.failure(new Error(`Token '${token.name}' not found`));
    }
    const newTokens = new Map(this._tokens);
    newTokens.set(token.name, token);
    return chunk5YMPXU57_js.success(
      new _TokenCollection(
        this._name,
        this._description,
        this._version,
        newTokens,
        this._createdAt,
        /* @__PURE__ */ new Date()
      )
    );
  }
  /**
   * Actualiza o agrega un token. Retorna NUEVA colección.
   */
  upsert(token) {
    const newTokens = new Map(this._tokens);
    newTokens.set(token.name, token);
    return new _TokenCollection(
      this._name,
      this._description,
      this._version,
      newTokens,
      this._createdAt,
      /* @__PURE__ */ new Date()
    );
  }
  /**
   * Limpia la colección. Retorna NUEVA colección vacía.
   */
  clear() {
    if (this._tokens.size === 0) {
      return this;
    }
    return new _TokenCollection(
      this._name,
      this._description,
      this._version,
      /* @__PURE__ */ new Map(),
      this._createdAt,
      /* @__PURE__ */ new Date()
    );
  }
  /**
   * Actualiza metadatos. Retorna NUEVA colección.
   */
  withMetadata(options) {
    return new _TokenCollection(
      options.name ?? this._name,
      options.description ?? this._description,
      options.version ?? this._version,
      this._tokens,
      this._createdAt,
      /* @__PURE__ */ new Date()
    );
  }
  // ─────────────────────────────────────────────────────────────────────────
  // QUERY OPERATIONS (read-only, return copies)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Obtiene todos los tokens (copia defensiva).
   */
  all() {
    return Object.freeze(Array.from(this._tokens.values()));
  }
  /**
   * Alias de all() para compatibilidad.
   * @deprecated Usar all() en su lugar.
   */
  getAll() {
    return this.all();
  }
  /**
   * Obtiene tokens por prefijo de path (e.g., 'color.brand').
   */
  getByPath(pathPrefix) {
    const normalizedPrefix = pathPrefix.endsWith(".") ? pathPrefix : `${pathPrefix}.`;
    const results = Array.from(this._tokens.values()).filter((token) => {
      return token.name.startsWith(normalizedPrefix) || token.name === pathPrefix || token.name.startsWith(pathPrefix);
    });
    return Object.freeze(results);
  }
  /**
   * Filtra tokens según criterios.
   */
  filter(criteria) {
    let results = Array.from(this._tokens.values());
    if (criteria.name) {
      if (criteria.name instanceof RegExp) {
        results = results.filter((t) => criteria.name instanceof RegExp && criteria.name.test(t.name));
      } else {
        results = results.filter((t) => t.name.includes(criteria.name));
      }
    }
    if (criteria.type) {
      results = results.filter((t) => t.type === criteria.type);
    }
    if (criteria.category) {
      results = results.filter((t) => t.category === criteria.category);
    }
    if (criteria.namespace) {
      results = results.filter((t) => t.namespace === criteria.namespace);
    }
    if (criteria.role) {
      results = results.filter((t) => t.context.role === criteria.role);
    }
    if (criteria.state) {
      results = results.filter((t) => t.context.state === criteria.state);
    }
    if (criteria.component) {
      results = results.filter((t) => t.context.component === criteria.component);
    }
    if (!criteria.includeDeprecated) {
      results = results.filter((t) => !t.deprecated);
    }
    return Object.freeze(results);
  }
  /**
   * Retorna nueva colección con solo los tokens que cumplen criterios.
   */
  filterToCollection(criteria) {
    const filtered = this.filter(criteria);
    return _TokenCollection.from(this._name, filtered, this._description);
  }
  /**
   * Encuentra el primer token que cumple criterios.
   */
  find(criteria) {
    return this.filter(criteria)[0];
  }
  /**
   * Verifica si algún token cumple criterios.
   */
  some(criteria) {
    return this.filter(criteria).length > 0;
  }
  /**
   * Verifica si todos los tokens cumplen criterios.
   */
  every(criteria) {
    const all = this.all();
    const filtered = this.filter(criteria);
    return all.length === filtered.length;
  }
  /**
   * Obtiene tokens por tipo.
   */
  byType(type) {
    return this.filter({ type });
  }
  /**
   * Obtiene tokens por categoría.
   */
  byCategory(category) {
    return this.filter({ category });
  }
  /**
   * Obtiene tokens por namespace.
   */
  byNamespace(namespace) {
    return this.filter({ namespace });
  }
  /**
   * Obtiene tokens por componente.
   */
  byComponent(component) {
    return this.filter({ component });
  }
  // ─────────────────────────────────────────────────────────────────────────
  // GROUPING OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Agrupa tokens por tipo.
   */
  groupByType() {
    const groups = /* @__PURE__ */ new Map();
    for (const token of this._tokens.values()) {
      const existing = groups.get(token.type) || [];
      existing.push(token);
      groups.set(token.type, existing);
    }
    const frozen = /* @__PURE__ */ new Map();
    for (const [key, value] of groups) {
      frozen.set(key, Object.freeze(value));
    }
    return frozen;
  }
  /**
   * Agrupa tokens por categoría.
   */
  groupByCategory() {
    const groups = /* @__PURE__ */ new Map();
    for (const token of this._tokens.values()) {
      const existing = groups.get(token.category) || [];
      existing.push(token);
      groups.set(token.category, existing);
    }
    const frozen = /* @__PURE__ */ new Map();
    for (const [key, value] of groups) {
      frozen.set(key, Object.freeze(value));
    }
    return frozen;
  }
  /**
   * Agrupa tokens por namespace.
   */
  groupByNamespace() {
    const groups = /* @__PURE__ */ new Map();
    for (const token of this._tokens.values()) {
      const existing = groups.get(token.namespace) || [];
      existing.push(token);
      groups.set(token.namespace, existing);
    }
    const frozen = /* @__PURE__ */ new Map();
    for (const [key, value] of groups) {
      frozen.set(key, Object.freeze(value));
    }
    return frozen;
  }
  /**
   * Construye estructura jerárquica desde paths.
   */
  toHierarchy() {
    const root = {};
    for (const token of this._tokens.values()) {
      const parts = token.path;
      let current = root;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current)) {
          current[part] = {};
        }
        current = current[part];
      }
      const lastPart = parts[parts.length - 1];
      current[lastPart] = token;
    }
    return Object.freeze(root);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXPORT OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Exporta la colección en el formato especificado.
   */
  export(options) {
    const tokens = options.includeDeprecated ? Array.from(this._tokens.values()) : Array.from(this.filter({ includeDeprecated: false }));
    switch (options.format) {
      case "css":
        return this.exportToCss(tokens, options);
      case "scss":
        return this.exportToScss(tokens, options);
      case "json":
        return this.exportToJson(tokens, options);
      case "w3c":
        return this.exportToW3C(tokens, options);
      case "tailwind":
        return this.exportToTailwind(tokens, options);
      case "figma":
        return this.exportToFigma(tokens, options);
      default:
        throw new Error(`Unknown export format: ${options.format}`);
    }
  }
  /**
   * Exporta a CSS variables.
   */
  exportToCss(tokens, options) {
    const prefix = options.prefix || "";
    const indent = " ".repeat(options.indent || 2);
    const lines = [":root {"];
    for (const token of tokens) {
      const varName = prefix ? `--${prefix}-${token.name.replace(/\./g, "-")}` : token.cssVariableName;
      lines.push(`${indent}${varName}: ${token.toCssValue()};`);
    }
    lines.push("}");
    return lines.join("\n");
  }
  /**
   * Exporta a SCSS variables.
   */
  exportToScss(tokens, options) {
    const prefix = options.prefix || "";
    return tokens.map((token) => {
      const varName = prefix ? `$${prefix}-${token.name.replace(/\./g, "-")}` : `$${token.name.replace(/\./g, "-")}`;
      return `${varName}: ${token.toCssValue()};`;
    }).join("\n");
  }
  /**
   * Exporta a JSON.
   */
  exportToJson(tokens, options) {
    const data = options.includeMetadata ? tokens.map((t) => t.toJSON()) : tokens.reduce((acc, t) => {
      acc[t.name] = t.toCssValue();
      return acc;
    }, {});
    return JSON.stringify(data, null, options.indent || 2);
  }
  /**
   * Exporta a formato W3C DTCG.
   */
  exportToW3C(tokens, options) {
    const hierarchy = {};
    for (const token of tokens) {
      const parts = token.path;
      let current = hierarchy;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in current)) {
          current[part] = {};
        }
        current = current[part];
      }
      const lastPart = parts[parts.length - 1];
      current[lastPart] = token.toW3C();
    }
    return JSON.stringify(hierarchy, null, options.indent || 2);
  }
  /**
   * Exporta a configuración Tailwind.
   */
  exportToTailwind(tokens, options) {
    const colors = {};
    const spacing = {};
    const shadows = {};
    for (const token of tokens) {
      const { key, value } = token.toTailwindConfig();
      if (token.isColor) {
        const parts = key.split("-");
        const colorName = parts[0];
        const shade = parts.slice(1).join("-") || "DEFAULT";
        if (!colors[colorName]) {
          colors[colorName] = {};
        }
        colors[colorName][shade] = value;
      } else if (token.isDimension) {
        spacing[key] = value;
      } else if (token.isShadow) {
        shadows[key] = value;
      }
    }
    const config = {
      theme: {
        extend: {
          colors,
          spacing,
          boxShadow: shadows
        }
      }
    };
    return `module.exports = ${JSON.stringify(config, null, options.indent || 2)}`;
  }
  /**
   * Exporta a formato Figma Tokens.
   */
  exportToFigma(tokens, options) {
    const figmaTokens = {};
    for (const token of tokens) {
      figmaTokens[token.name] = {
        value: token.toCssValue(),
        type: token.type,
        description: token.description
      };
    }
    return JSON.stringify(figmaTokens, null, options.indent || 2);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Valida la colección.
   */
  validate() {
    const errors = [];
    const warnings = [];
    for (const token of this._tokens.values()) {
      if (!token.description) {
        warnings.push({
          tokenName: token.name,
          code: "MISSING_DESCRIPTION",
          message: "Token lacks description"
        });
      }
      if (!/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(token.name)) {
        warnings.push({
          tokenName: token.name,
          code: "INVALID_NAME_FORMAT",
          message: "Token name should follow lowercase dot notation"
        });
      }
      if (token.isColor) {
        const colorValue = token.value;
        if (!colorValue.perceptual) {
          warnings.push({
            tokenName: token.name,
            code: "MISSING_PERCEPTUAL",
            message: "Color token lacks perceptual metadata"
          });
        }
      }
      if (token.deprecated && !token.deprecationMessage) {
        warnings.push({
          tokenName: token.name,
          code: "DEPRECATED_NO_MESSAGE",
          message: "Deprecated token lacks deprecation message"
        });
      }
    }
    return Object.freeze({
      valid: errors.length === 0,
      errors: Object.freeze(errors),
      warnings: Object.freeze(warnings)
    });
  }
  /**
   * Obtiene estadísticas de la colección.
   */
  stats() {
    const byType = {
      color: 0,
      dimension: 0,
      fontFamily: 0,
      fontWeight: 0,
      duration: 0,
      cubicBezier: 0,
      shadow: 0,
      gradient: 0,
      typography: 0,
      border: 0,
      transition: 0,
      composite: 0
    };
    const byCategory = {
      primitive: 0,
      semantic: 0,
      component: 0,
      state: 0
    };
    const byNamespace = {};
    const uniqueColors = /* @__PURE__ */ new Set();
    let deprecatedCount = 0;
    for (const token of this._tokens.values()) {
      byType[token.type]++;
      byCategory[token.category]++;
      byNamespace[token.namespace] = (byNamespace[token.namespace] || 0) + 1;
      if (token.deprecated) {
        deprecatedCount++;
      }
      if (token.isColor) {
        uniqueColors.add(token.toCssValue());
      }
    }
    return Object.freeze({
      totalTokens: this._tokens.size,
      byType: Object.freeze(byType),
      byCategory: Object.freeze(byCategory),
      byNamespace: Object.freeze(byNamespace),
      deprecatedCount,
      uniqueColors: uniqueColors.size
    });
  }
  // ─────────────────────────────────────────────────────────────────────────
  // ITERATION (read-only)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Itera sobre tokens.
   */
  forEach(callback) {
    for (const token of this._tokens.values()) {
      callback(token);
    }
  }
  /**
   * Mapea tokens a nuevo tipo.
   */
  map(callback) {
    return Object.freeze(this.all().map(callback));
  }
  /**
   * Reduce tokens.
   */
  reduce(callback, initial) {
    return Array.from(this._tokens.values()).reduce(callback, initial);
  }
  /**
   * Iterator support.
   */
  [Symbol.iterator]() {
    return this._tokens.values();
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EQUALITY & COMPARISON
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Compara dos colecciones por contenido.
   */
  equals(other) {
    if (this._tokens.size !== other._tokens.size) {
      return false;
    }
    for (const [name, token] of this._tokens) {
      const otherToken = other._tokens.get(name);
      if (!otherToken || token.name !== otherToken.name) {
        return false;
      }
    }
    return true;
  }
  /**
   * Calcula diff entre colecciones.
   */
  diff(other) {
    const added = [];
    const removed = [];
    const changed = [];
    for (const [name, token] of other._tokens) {
      if (!this._tokens.has(name)) {
        added.push(name);
      } else {
        const existing = this._tokens.get(name);
        if (existing.toCssValue() !== token.toCssValue()) {
          changed.push(name);
        }
      }
    }
    for (const name of this._tokens.keys()) {
      if (!other._tokens.has(name)) {
        removed.push(name);
      }
    }
    return Object.freeze({
      added: Object.freeze(added),
      removed: Object.freeze(removed),
      changed: Object.freeze(changed)
    });
  }
  // ─────────────────────────────────────────────────────────────────────────
  // SERIALIZATION
  // ─────────────────────────────────────────────────────────────────────────
  toJSON() {
    return Object.freeze({
      name: this._name,
      description: this._description,
      version: this._version,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      tokens: Object.freeze(this.all().map((t) => t.toJSON()))
    });
  }
  /**
   * Reconstituye desde JSON.
   */
  static fromJSON(json, tokenDeserializer) {
    const tokens = json.tokens.map(tokenDeserializer);
    return _TokenCollection.from(json.name, tokens, json.description ?? "");
  }
};

// domain/tokens/services/TokenDerivationService.ts
var DEFAULT_DERIVATION_CONFIG = {
  states: ["idle", "hover", "active", "focus", "disabled"],
  roles: ["background", "surface", "accent", "text-primary", "text-secondary", "border"],
  variants: ["solid", "soft", "outline", "ghost"],
  generateAccessibilityPairs: true,
  generateScaleSteps: true,
  scaleSteps: 9
};
var STATE_DERIVATION_RULES = {
  idle: {
    state: "idle",
    lightnessAdjust: 0,
    chromaAdjust: 0,
    opacityMultiplier: 1
  },
  hover: {
    state: "hover",
    lightnessAdjust: 0.05,
    chromaAdjust: 0.02,
    opacityMultiplier: 1
  },
  active: {
    state: "active",
    lightnessAdjust: -0.08,
    chromaAdjust: 0.03,
    opacityMultiplier: 1
  },
  focus: {
    state: "focus",
    lightnessAdjust: 0,
    chromaAdjust: 0.01,
    opacityMultiplier: 1
  },
  disabled: {
    state: "disabled",
    lightnessAdjust: 0.2,
    chromaAdjust: -0.08,
    opacityMultiplier: 0.5
  },
  loading: {
    state: "loading",
    lightnessAdjust: 0,
    chromaAdjust: -0.05,
    opacityMultiplier: 0.7
  },
  error: {
    state: "error",
    lightnessAdjust: 0,
    chromaAdjust: 0.1,
    opacityMultiplier: 1
  },
  success: {
    state: "success",
    lightnessAdjust: 0,
    chromaAdjust: 0.05,
    opacityMultiplier: 1
  }
};
var LIGHTNESS_SCALE = {
  50: 0.97,
  100: 0.94,
  200: 0.88,
  300: 0.8,
  400: 0.7,
  500: 0.55,
  // Base
  600: 0.45,
  700: 0.35,
  800: 0.25,
  900: 0.18,
  950: 0.12
};
var TokenDerivationService = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(config = {}) {
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE STATE
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "_config");
    chunkZM4FIU5F_js.__publicField(this, "_stateRules");
    this._config = { ...DEFAULT_DERIVATION_CONFIG, ...config };
    this._stateRules = new Map(
      Object.entries(STATE_DERIVATION_RULES)
    );
  }
  // ─────────────────────────────────────────────────────────────────────────
  // STATE DERIVATION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Deriva tokens de estado desde un color base.
   */
  deriveStates(baseName, baseColor, context = {}) {
    const tokens = [];
    for (const state of this._config.states) {
      const rule = this._stateRules.get(state);
      if (!rule) continue;
      const derivedColor = this.applyStateRule(baseColor, rule);
      const tokenName = `${baseName}.${state}`;
      tokens.push(
        DesignToken.color(
          tokenName,
          derivedColor,
          { ...context, state },
          `${baseName} in ${state} state`
        )
      );
    }
    return tokens;
  }
  /**
   * Aplica regla de estado a un color.
   */
  applyStateRule(color, rule) {
    let result = color;
    if (rule.lightnessAdjust !== 0) {
      result = rule.lightnessAdjust > 0 ? result.lighten(Math.abs(rule.lightnessAdjust)) : result.darken(Math.abs(rule.lightnessAdjust));
    }
    if (rule.chromaAdjust !== 0) {
      result = rule.chromaAdjust > 0 ? result.saturate(Math.abs(rule.chromaAdjust)) : result.desaturate(Math.abs(rule.chromaAdjust));
    }
    return result;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // SCALE DERIVATION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Deriva una escala completa de luminosidad (50-950).
   */
  deriveScale(baseName, baseColor, context = {}) {
    const tokens = [];
    const baseOklch = baseColor.oklch;
    for (const [step, lightness] of Object.entries(LIGHTNESS_SCALE)) {
      const chromaMultiplier = this.calculateChromaMultiplier(lightness, baseOklch.l);
      const adjustedChroma = baseOklch.c * chromaMultiplier;
      const scaledColor = chunkX3KESCNX_js.PerceptualColor.fromOklch(
        lightness,
        Math.min(adjustedChroma, 0.4),
        // Cap chroma
        baseOklch.h
      );
      const tokenName = `${baseName}.${step}`;
      tokens.push(
        DesignToken.color(
          tokenName,
          scaledColor,
          context,
          `${baseName} at ${step} lightness`
        )
      );
    }
    return tokens;
  }
  /**
   * Calcula multiplicador de croma para preservar percepción.
   */
  calculateChromaMultiplier(targetL, _baseL) {
    if (targetL > 0.9 || targetL < 0.2) {
      return 0.5;
    }
    if (targetL > 0.4 && targetL < 0.7) {
      return 1;
    }
    return 0.75;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY PAIR DERIVATION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Genera pares de colores con contraste garantizado.
   */
  deriveAccessibilityPairs(baseName, baseColor, context = {}) {
    const pairs = [];
    const scale = this.deriveScale(baseName, baseColor);
    const lightSteps = [50, 100, 200];
    const darkSteps = [800, 900, 950];
    for (const bgStep of lightSteps) {
      for (const fgStep of darkSteps) {
        const bgToken = scale.find((t) => t.name.endsWith(`.${bgStep}`));
        const fgToken = scale.find((t) => t.name.endsWith(`.${fgStep}`));
        if (bgToken && fgToken) {
          const pair = this.createAccessibilityPair(
            `${baseName}.pair.${bgStep}-${fgStep}`,
            bgToken,
            fgToken,
            context
          );
          if (pair) pairs.push(pair);
        }
      }
    }
    for (const bgStep of darkSteps) {
      for (const fgStep of lightSteps) {
        const bgToken = scale.find((t) => t.name.endsWith(`.${bgStep}`));
        const fgToken = scale.find((t) => t.name.endsWith(`.${fgStep}`));
        if (bgToken && fgToken) {
          const pair = this.createAccessibilityPair(
            `${baseName}.pair.${bgStep}-${fgStep}`,
            bgToken,
            fgToken,
            context
          );
          if (pair) pairs.push(pair);
        }
      }
    }
    return pairs;
  }
  /**
   * Crea un par de accesibilidad con métricas.
   */
  createAccessibilityPair(_name, bgToken, fgToken, _context) {
    const bgColorResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(bgToken.toCssValue());
    const fgColorResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(fgToken.toCssValue());
    if (!bgColorResult.success || !fgColorResult.success) {
      return null;
    }
    const bgColor = bgColorResult.value;
    const fgColor = fgColorResult.value;
    const bgRgb = bgColor.rgb;
    const fgRgb = fgColor.rgb;
    const wcagRatio = chunkX3KESCNX_js.accessibilityService.calculateWcagContrast(bgRgb, fgRgb);
    const apcaContrast = chunkX3KESCNX_js.accessibilityService.calculateApcaContrast(bgRgb, fgRgb);
    return {
      background: bgToken,
      foreground: fgToken,
      apcaContrast,
      wcagRatio,
      passes: {
        apcaBody: Math.abs(apcaContrast) >= 60,
        apcaHeading: Math.abs(apcaContrast) >= 45,
        wcagAA: wcagRatio >= 4.5,
        wcagAAA: wcagRatio >= 7
      }
    };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // COMPONENT TOKEN DERIVATION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Deriva una colección completa de tokens para un componente.
   */
  deriveComponentTokens(componentName, brandColor, intent) {
    const allTokens = [];
    const baseName = `${componentName}.${intent.value}`;
    const stateTokens = this.deriveStates(baseName, brandColor, {
      component: componentName,
      intent: intent.value
    });
    allTokens.push(...stateTokens);
    for (const variant of intent.recommendedVariants) {
      const variantTokens = this.deriveVariantTokens(
        componentName,
        brandColor,
        intent,
        variant
      );
      allTokens.push(...variantTokens);
    }
    for (const role of intent.primaryRoles) {
      const roleColor = this.deriveRoleColor(brandColor, UIRole.of(role));
      const roleToken = DesignToken.color(
        `${baseName}.${role}`,
        roleColor,
        { role, component: componentName, intent: intent.value },
        `${componentName} ${role} color`
      );
      allTokens.push(roleToken);
    }
    return TokenCollection.from(componentName, allTokens);
  }
  /**
   * Deriva tokens para una variante específica.
   */
  deriveVariantTokens(componentName, brandColor, intent, variant) {
    const tokens = [];
    const baseName = `${componentName}.${intent.value}.${variant}`;
    switch (variant) {
      case "solid": {
        tokens.push(
          DesignToken.color(baseName + ".bg", brandColor, {
            component: componentName,
            variant,
            role: "accent"
          }),
          DesignToken.color(baseName + ".text", this.deriveContrastText(brandColor), {
            component: componentName,
            variant,
            role: "text-inverse"
          })
        );
        break;
      }
      case "soft": {
        const softBg = brandColor.lighten(0.35);
        const softText = brandColor.darken(0.15);
        tokens.push(
          DesignToken.color(baseName + ".bg", softBg, {
            component: componentName,
            variant,
            role: "accent-muted"
          }),
          DesignToken.color(baseName + ".text", softText, {
            component: componentName,
            variant,
            role: "text-primary"
          })
        );
        break;
      }
      case "outline": {
        tokens.push(
          DesignToken.color(baseName + ".border", brandColor, {
            component: componentName,
            variant,
            role: "border"
          }),
          DesignToken.color(baseName + ".text", brandColor, {
            component: componentName,
            variant,
            role: "text-primary"
          })
        );
        break;
      }
      case "ghost": {
        tokens.push(
          DesignToken.color(baseName + ".text", brandColor, {
            component: componentName,
            variant,
            role: "text-primary"
          }),
          DesignToken.color(baseName + ".bg-hover", brandColor.lighten(0.4), {
            component: componentName,
            variant,
            role: "background",
            state: "hover"
          })
        );
        break;
      }
      case "glass": {
        const glassBg = brandColor.lighten(0.3);
        tokens.push(
          DesignToken.color(baseName + ".bg", glassBg, {
            component: componentName,
            variant,
            role: "surface-elevated"
          }),
          DesignToken.color(baseName + ".border", brandColor.lighten(0.2), {
            component: componentName,
            variant,
            role: "border-subtle"
          })
        );
        break;
      }
      case "gradient": {
        const gradientEnd = chunkX3KESCNX_js.PerceptualColor.fromOklch(
          brandColor.oklch.l,
          brandColor.oklch.c,
          (brandColor.oklch.h + 30) % 360
        );
        tokens.push(
          DesignToken.gradient(
            baseName + ".bg",
            {
              type: "linear",
              angle: 135,
              stops: [
                { color: brandColor.hex, position: 0 },
                { color: gradientEnd.hex, position: 1 }
              ]
            },
            { component: componentName, variant }
          )
        );
        break;
      }
    }
    return tokens;
  }
  /**
   * Deriva color de texto con contraste adecuado.
   */
  deriveContrastText(backgroundColor) {
    const bgL = backgroundColor.oklch.l;
    if (bgL < 0.55) {
      return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.98, 0, 0);
    } else {
      return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.15, 0, 0);
    }
  }
  /**
   * Deriva color para un rol específico.
   */
  deriveRoleColor(brandColor, role) {
    const oklch = brandColor.oklch;
    switch (role.value) {
      case "background":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.99, 5e-3, oklch.h);
      case "surface":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.97, 8e-3, oklch.h);
      case "surface-elevated":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.98, 0.01, oklch.h);
      case "accent":
        return brandColor;
      case "accent-muted":
        return brandColor.lighten(0.25);
      case "text-primary":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.2, 0.01, oklch.h);
      case "text-secondary":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.45, 0.02, oklch.h);
      case "text-muted":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.6, 0.015, oklch.h);
      case "text-inverse":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.98, 5e-3, oklch.h);
      case "border":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.85, 0.02, oklch.h);
      case "border-subtle":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.92, 0.01, oklch.h);
      case "icon":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.4, oklch.c * 0.5, oklch.h);
      case "shadow":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.1, 0.02, oklch.h);
      case "overlay":
        return chunkX3KESCNX_js.PerceptualColor.fromOklch(0.15, 0.01, oklch.h);
      case "focus-ring":
        return brandColor.saturate(0.1);
      default:
        return brandColor;
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // FULL THEME DERIVATION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Deriva un tema completo desde un color de marca.
   */
  deriveTheme(themeName, brandColor, options = {}) {
    const allTokens = [];
    const brandScale = this.deriveScale("brand", brandColor);
    allTokens.push(...brandScale);
    if (options.includeSemanticColors !== false) {
      const semanticColors = this.deriveSemanticColors(brandColor);
      allTokens.push(...semanticColors);
    }
    const neutrals = this.deriveNeutrals(brandColor);
    allTokens.push(...neutrals);
    if (options.includeShadows !== false) {
      const shadows = this.deriveShadows(brandColor);
      allTokens.push(...shadows);
    }
    return TokenCollection.from(themeName, allTokens);
  }
  /**
   * Deriva colores semánticos (success, warning, error, info).
   */
  deriveSemanticColors(brandColor) {
    const tokens = [];
    const brandH = brandColor.oklch.h;
    const successBase = chunkX3KESCNX_js.PerceptualColor.fromOklch(0.55, 0.15, 145);
    tokens.push(...this.deriveScale("success", successBase));
    const warningBase = chunkX3KESCNX_js.PerceptualColor.fromOklch(0.55, 0.15, 85);
    tokens.push(...this.deriveScale("warning", warningBase));
    const errorBase = chunkX3KESCNX_js.PerceptualColor.fromOklch(0.55, 0.2, 25);
    tokens.push(...this.deriveScale("error", errorBase));
    const infoH = Math.abs(brandH - 250) < 40 ? brandH : 250;
    const infoBase = chunkX3KESCNX_js.PerceptualColor.fromOklch(0.55, 0.15, infoH);
    tokens.push(...this.deriveScale("info", infoBase));
    return tokens;
  }
  /**
   * Deriva grises con tinte del brand.
   */
  deriveNeutrals(brandColor) {
    const tokens = [];
    const brandH = brandColor.oklch.h;
    for (const [step, lightness] of Object.entries(LIGHTNESS_SCALE)) {
      const neutralColor = chunkX3KESCNX_js.PerceptualColor.fromOklch(
        lightness,
        5e-3,
        // Casi sin saturación
        brandH
      );
      tokens.push(
        DesignToken.color(
          `neutral.${step}`,
          neutralColor,
          { role: lightness > 0.5 ? "background" : "text-primary" },
          `Neutral gray at ${step}`
        )
      );
    }
    return tokens;
  }
  /**
   * Deriva sombras coherentes con el tema.
   */
  deriveShadows(brandColor) {
    const shadowColor = chunkX3KESCNX_js.PerceptualColor.fromOklch(
      0.15,
      0.02,
      brandColor.oklch.h
    ).hex;
    return [
      DesignToken.shadow("shadow.xs", [
        { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: `${shadowColor}10` }
      ]),
      DesignToken.shadow("shadow.sm", [
        { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: `${shadowColor}15` },
        { offsetX: 0, offsetY: 1, blur: 2, spread: -1, color: `${shadowColor}10` }
      ]),
      DesignToken.shadow("shadow.md", [
        { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: `${shadowColor}15` },
        { offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: `${shadowColor}10` }
      ]),
      DesignToken.shadow("shadow.lg", [
        { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: `${shadowColor}15` },
        { offsetX: 0, offsetY: 4, blur: 6, spread: -4, color: `${shadowColor}10` }
      ]),
      DesignToken.shadow("shadow.xl", [
        { offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: `${shadowColor}20` },
        { offsetX: 0, offsetY: 8, blur: 10, spread: -6, color: `${shadowColor}10` }
      ]),
      DesignToken.shadow("shadow.2xl", [
        { offsetX: 0, offsetY: 25, blur: 50, spread: -12, color: `${shadowColor}30` }
      ])
    ];
  }
};

exports.COMPONENT_INTENTS = COMPONENT_INTENTS;
exports.ComponentIntent = ComponentIntent;
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
exports.DEFAULT_DERIVATION_CONFIG = DEFAULT_DERIVATION_CONFIG;
exports.DesignToken = DesignToken;
exports.INTENT_CATEGORIES = INTENT_CATEGORIES;
exports.INTENT_SEVERITY = INTENT_SEVERITY;
exports.INTENT_VARIANTS = INTENT_VARIANTS;
exports.LIGHTNESS_SCALE = LIGHTNESS_SCALE;
exports.ROLE_ACCESSIBILITY = ROLE_ACCESSIBILITY;
exports.RolePair = RolePair;
exports.STATE_DERIVATION_RULES = STATE_DERIVATION_RULES;
exports.STATE_PRIORITY = STATE_PRIORITY;
exports.STATE_TRANSITIONS = STATE_TRANSITIONS;
exports.TokenCollection = TokenCollection;
exports.TokenDerivationService = TokenDerivationService;
exports.UIRole = UIRole;
exports.UIState = UIState;
exports.UIStateMachine = UIStateMachine;
exports.UI_ROLES = UI_ROLES;
exports.UI_STATES = UI_STATES;
exports.UXDecision = UXDecision;
//# sourceMappingURL=chunk-UQITNDIL.js.map
//# sourceMappingURL=chunk-UQITNDIL.js.map