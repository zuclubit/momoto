/* @zuclubit/momoto-ui - Color Intelligence Design System */

// domain/types/branded.ts
var BrandConstructors = {
  /**
   * Crea un HexColor validado.
   * @throws {Error} Si el string no es un hex color válido.
   */
  hexColor(value) {
    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
    if (!hexRegex.test(value)) {
      throw new Error(`Invalid hex color: ${value}`);
    }
    return value;
  },
  /**
   * Crea un OklchLightness validado.
   * @throws {Error} Si el valor está fuera del rango [0, 1].
   */
  oklchLightness(value) {
    if (value < 0 || value > 1) {
      throw new Error(`OKLCH Lightness must be in range [0, 1], got: ${value}`);
    }
    return value;
  },
  /**
   * Crea un OklchChroma validado.
   * @throws {Error} Si el valor es negativo.
   */
  oklchChroma(value) {
    if (value < 0) {
      throw new Error(`OKLCH Chroma must be non-negative, got: ${value}`);
    }
    return value;
  },
  /**
   * Crea un OklchHue validado (normalizado a 0-360).
   */
  oklchHue(value) {
    const normalized = (value % 360 + 360) % 360;
    return normalized;
  },
  /**
   * Crea un HctTone validado.
   * @throws {Error} Si el valor está fuera del rango [0, 100].
   */
  hctTone(value) {
    if (value < 0 || value > 100) {
      throw new Error(`HCT Tone must be in range [0, 100], got: ${value}`);
    }
    return value;
  },
  /**
   * Crea un ApcaLc validado.
   * @throws {Error} Si el valor está fuera del rango [-108, 108].
   */
  apcaLc(value) {
    if (value < -108 || value > 108) {
      throw new Error(`APCA Lc must be in range [-108, 108], got: ${value}`);
    }
    return value;
  },
  /**
   * Crea un WcagRatio validado.
   * @throws {Error} Si el valor está fuera del rango [1, 21].
   */
  wcagRatio(value) {
    if (value < 1 || value > 21) {
      throw new Error(`WCAG Ratio must be in range [1, 21], got: ${value}`);
    }
    return value;
  },
  /**
   * Crea un TokenId validado.
   */
  tokenId(value) {
    if (!value || value.length === 0) {
      throw new Error("TokenId cannot be empty");
    }
    return value;
  },
  /**
   * Crea un TokenName siguiendo naming convention.
   * Formato esperado: lowercase con guiones, ej: "color-primary-hover"
   */
  tokenName(value) {
    const tokenNameRegex = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
    if (!tokenNameRegex.test(value)) {
      throw new Error(
        `TokenName must be lowercase with hyphens, got: ${value}`
      );
    }
    return value;
  },
  /**
   * Crea un ConfidenceLevel validado.
   * @throws {Error} Si el valor está fuera del rango [0, 1].
   */
  confidenceLevel(value) {
    if (value < 0 || value > 1) {
      throw new Error(`ConfidenceLevel must be in range [0, 1], got: ${value}`);
    }
    return value;
  },
  /**
   * Crea un PolicyPriority validado.
   * @throws {Error} Si el valor está fuera del rango [1, 1000].
   */
  policyPriority(value) {
    if (value < 1 || value > 1e3) {
      throw new Error(`PolicyPriority must be in range [1, 1000], got: ${value}`);
    }
    return value;
  },
  /**
   * Crea un PolicyId validado.
   */
  policyId(value) {
    if (!value || value.length === 0) {
      throw new Error("PolicyId cannot be empty");
    }
    return value;
  },
  /**
   * Crea un PolicyVersion validado (semver).
   */
  policyVersion(value) {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9]+)?$/;
    if (!semverRegex.test(value)) {
      throw new Error(`PolicyVersion must be semver format, got: ${value}`);
    }
    return value;
  },
  /**
   * Crea IDs únicos.
   */
  generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  /**
   * Crea un DecisionId único.
   */
  decisionId() {
    return this.generateId("dec");
  },
  /**
   * Crea un AuditId único.
   */
  auditId() {
    return this.generateId("aud");
  },
  /**
   * Crea un ViolationId único.
   */
  violationId() {
    return this.generateId("vio");
  },
  /**
   * Crea un ComponentId único.
   */
  componentId(name) {
    return `cmp_${name}_${Date.now()}`;
  }
};
var TypeGuards = {
  isHexColor(value) {
    if (typeof value !== "string") return false;
    return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(value);
  },
  isOklchLightness(value) {
    return typeof value === "number" && value >= 0 && value <= 1;
  },
  isApcaLc(value) {
    return typeof value === "number" && value >= -108 && value <= 108;
  },
  isConfidenceLevel(value) {
    return typeof value === "number" && value >= 0 && value <= 1;
  },
  isTokenName(value) {
    if (typeof value !== "string") return false;
    return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(value);
  }
};
function validationSuccess(value) {
  return { success: true, value };
}
function validationFailure(error) {
  return { success: false, error };
}
function tryBrand(constructor, value) {
  try {
    return validationSuccess(constructor(value));
  } catch (e) {
    return validationFailure(e.message);
  }
}

// domain/types/index.ts
function success(value) {
  return { success: true, value };
}
function failure(error) {
  return { success: false, error };
}
function unwrap(result) {
  if (result.success) {
    return result.value;
  }
  throw result.error;
}
function unwrapOr(result, defaultValue) {
  return result.success ? result.value : defaultValue;
}

export { BrandConstructors, TypeGuards, failure, success, tryBrand, unwrap, unwrapOr, validationFailure, validationSuccess };
//# sourceMappingURL=chunk-445P5ZF2.mjs.map
//# sourceMappingURL=chunk-445P5ZF2.mjs.map