'use strict';

var chunkLLXCPT4B_js = require('./chunk-LLXCPT4B.js');
var chunkX3KESCNX_js = require('./chunk-X3KESCNX.js');
var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

/* @zuclubit/momoto-ui - Color Intelligence Design System */
var GovernanceContext = react.createContext(null);
function GovernanceProvider({
  children,
  mode: initialMode = "default",
  enableAuditLog = false,
  customPolicies = [],
  failFast = true,
  autoFix = false
}) {
  const [mode, setMode] = react.useState(initialMode);
  const [policySet, setPolicySet] = react.useState(() => {
    const baseSet = getPolicySetForMode(initialMode);
    let result = baseSet;
    for (const policy of customPolicies) {
      result = result.add(policy);
    }
    return result;
  });
  const [complianceHistory, setComplianceHistory] = react.useState([]);
  const governance = react.useMemo(() => {
    if (mode === "disabled") return null;
    const config = {
      policySet,
      failFast,
      autoFix,
      auditPort: enableAuditLog ? new chunkLLXCPT4B_js.ConsoleAuditAdapter() : new chunkLLXCPT4B_js.NoOpAuditAdapter()
    };
    return new chunkLLXCPT4B_js.EnforceEnterpriseGovernance(config);
  }, [mode, policySet, failFast, autoFix, enableAuditLog]);
  const handleSetMode = react.useCallback((newMode) => {
    setMode(newMode);
    if (newMode !== "disabled") {
      const baseSet = getPolicySetForMode(newMode);
      let result = baseSet;
      for (const policy of customPolicies) {
        result = result.add(policy);
      }
      setPolicySet(result);
    }
  }, [customPolicies]);
  const addPolicy = react.useCallback((policy) => {
    setPolicySet((prev) => prev.add(policy));
  }, []);
  const removePolicy = react.useCallback((policyId) => {
    setPolicySet((prev) => prev.remove(policyId));
  }, []);
  const enablePolicy = react.useCallback((policyId) => {
    setPolicySet((prev) => {
      const policy = prev.get(policyId);
      if (!policy) return prev;
      return prev.remove(policyId).add(policy.withEnabled(true));
    });
  }, []);
  const disablePolicy = react.useCallback((policyId) => {
    setPolicySet((prev) => {
      const policy = prev.get(policyId);
      if (!policy) return prev;
      return prev.remove(policyId).add(policy.withEnabled(false));
    });
  }, []);
  const checkColor = react.useCallback(async (colorHex, purpose) => {
    if (!governance) return null;
    const colorResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(colorHex);
    if (!colorResult.success) return null;
    const result = await governance.execute({
      subject: {
        type: "color",
        color: colorResult.value,
        purpose
      }
    });
    if (result.success) {
      setComplianceHistory((prev) => [...prev.slice(-99), result.value.complianceScore]);
      return result.value;
    }
    return null;
  }, [governance]);
  const checkAccessibility = react.useCallback(async (foregroundHex, backgroundHex) => {
    if (!governance) return null;
    const fgResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(foregroundHex);
    const bgResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(backgroundHex);
    if (!fgResult.success || !bgResult.success) return null;
    const fg = fgResult.value;
    const bg = bgResult.value;
    const fgLum = fg.oklch.l;
    const bgLum = bg.oklch.l;
    const lighter = Math.max(fgLum, bgLum);
    const darker = Math.min(fgLum, bgLum);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);
    const apcaValue = Math.abs(bgLum - fgLum) * 100;
    const result = await governance.execute({
      subject: {
        type: "accessibility",
        foreground: fg,
        background: bg,
        contrastRatio,
        apcaValue
      }
    });
    if (result.success) {
      setComplianceHistory((prev) => [...prev.slice(-99), result.value.complianceScore]);
      return result.value;
    }
    return null;
  }, [governance]);
  const checkTokens = react.useCallback(async (tokens) => {
    if (!governance) return null;
    const result = await governance.execute({
      subject: {
        type: "tokens",
        tokens
      }
    });
    if (result.success) {
      setComplianceHistory((prev) => [...prev.slice(-99), result.value.complianceScore]);
      return result.value;
    }
    return null;
  }, [governance]);
  const checkTheme = react.useCallback(async (config) => {
    if (!governance) return null;
    let brandColor;
    if (config.brandColorHex) {
      const colorResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(config.brandColorHex);
      if (colorResult.success) {
        brandColor = colorResult.value;
      }
    }
    const result = await governance.execute({
      subject: {
        type: "theme",
        hasLightMode: config.hasLightMode,
        hasDarkMode: config.hasDarkMode,
        brandColor
      }
    });
    if (result.success) {
      setComplianceHistory((prev) => [...prev.slice(-99), result.value.complianceScore]);
      return result.value;
    }
    return null;
  }, [governance]);
  const checkComponent = react.useCallback(async (componentName, tokens, brandColorHex) => {
    if (!governance) return null;
    let brandColor;
    if (brandColorHex) {
      const colorResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(brandColorHex);
      if (colorResult.success) {
        brandColor = colorResult.value;
      }
    }
    const result = await governance.execute({
      subject: {
        type: "component",
        componentName,
        tokens,
        brandColor
      }
    });
    if (result.success) {
      setComplianceHistory((prev) => [...prev.slice(-99), result.value.complianceScore]);
      return result.value;
    }
    return null;
  }, [governance]);
  const isColorCompliant = react.useCallback(async (colorHex) => {
    const result = await checkColor(colorHex);
    return result?.compliant ?? true;
  }, [checkColor]);
  const isAccessibilityCompliant = react.useCallback(async (fg, bg) => {
    const result = await checkAccessibility(fg, bg);
    return result?.compliant ?? true;
  }, [checkAccessibility]);
  const getPoliciesByScope = react.useCallback((scope) => {
    return policySet.byScope(scope);
  }, [policySet]);
  const getComplianceScore = react.useCallback(() => {
    if (complianceHistory.length === 0) return 100;
    const sum = complianceHistory.reduce((a, b) => a + b, 0);
    return sum / complianceHistory.length;
  }, [complianceHistory]);
  const contextValue = react.useMemo(() => ({
    // State
    mode,
    policySet,
    isEnabled: mode !== "disabled",
    // Actions
    setMode: handleSetMode,
    addPolicy,
    removePolicy,
    enablePolicy,
    disablePolicy,
    // Enforcement
    checkColor,
    checkAccessibility,
    checkTokens,
    checkTheme,
    checkComponent,
    // Quick checks
    isColorCompliant,
    isAccessibilityCompliant,
    // Utilities
    getPoliciesByScope,
    getComplianceScore
  }), [
    mode,
    policySet,
    handleSetMode,
    addPolicy,
    removePolicy,
    enablePolicy,
    disablePolicy,
    checkColor,
    checkAccessibility,
    checkTokens,
    checkTheme,
    checkComponent,
    isColorCompliant,
    isAccessibilityCompliant,
    getPoliciesByScope,
    getComplianceScore
  ]);
  return /* @__PURE__ */ jsxRuntime.jsx(GovernanceContext.Provider, { value: contextValue, children });
}
function useGovernance() {
  const context = react.useContext(GovernanceContext);
  if (!context) {
    throw new Error("useGovernance must be used within a GovernanceProvider");
  }
  return context;
}
function useColorGovernance(colorHex, purpose) {
  const { checkColor, isEnabled } = useGovernance();
  const [result, setResult] = react.useState(null);
  const [loading, setLoading] = react.useState(false);
  const check = react.useCallback(async () => {
    if (!isEnabled) return;
    setLoading(true);
    const res = await checkColor(colorHex, purpose);
    setResult(res);
    setLoading(false);
  }, [checkColor, colorHex, purpose, isEnabled]);
  react.useEffect(() => {
    check();
  }, [check]);
  return {
    isCompliant: result?.compliant ?? true,
    result,
    loading,
    check
  };
}
function useAccessibilityGovernance(foregroundHex, backgroundHex) {
  const { checkAccessibility, isEnabled } = useGovernance();
  const [result, setResult] = react.useState(null);
  const [loading, setLoading] = react.useState(false);
  const check = react.useCallback(async () => {
    if (!isEnabled) return;
    setLoading(true);
    const res = await checkAccessibility(foregroundHex, backgroundHex);
    setResult(res);
    setLoading(false);
  }, [checkAccessibility, foregroundHex, backgroundHex, isEnabled]);
  react.useEffect(() => {
    check();
  }, [check]);
  return {
    isCompliant: result?.compliant ?? true,
    result,
    loading,
    check
  };
}
function useComplianceStatus() {
  const { getComplianceScore, policySet, mode } = useGovernance();
  const score = getComplianceScore();
  const status = score >= 90 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "fair" : "poor";
  return {
    score,
    status,
    mode,
    totalPolicies: policySet.size,
    enabledPolicies: policySet.enabled().length
  };
}
function getPolicySetForMode(mode) {
  switch (mode) {
    case "strict":
      return chunkX3KESCNX_js.createStrictPolicySet();
    case "lenient":
      return chunkX3KESCNX_js.createLenientPolicySet();
    case "disabled":
      return new chunkX3KESCNX_js.PolicySet([]);
    default:
      return chunkX3KESCNX_js.createDefaultPolicySet();
  }
}

exports.GovernanceContext = GovernanceContext;
exports.GovernanceProvider = GovernanceProvider;
exports.useAccessibilityGovernance = useAccessibilityGovernance;
exports.useColorGovernance = useColorGovernance;
exports.useComplianceStatus = useComplianceStatus;
exports.useGovernance = useGovernance;
//# sourceMappingURL=chunk-ZOXFJ3DQ.js.map
//# sourceMappingURL=chunk-ZOXFJ3DQ.js.map