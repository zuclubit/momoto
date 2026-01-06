import { ConsoleAuditAdapter, NoOpAuditAdapter, EnforceEnterpriseGovernance } from './chunk-IGKANFHZ.mjs';
import { PerceptualColor, createDefaultPolicySet, PolicySet, createLenientPolicySet, createStrictPolicySet } from './chunk-QN62TTT3.mjs';
import { createContext, useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { jsx } from 'react/jsx-runtime';

/* @zuclubit/momoto-ui - Color Intelligence Design System */
var GovernanceContext = createContext(null);
function GovernanceProvider({
  children,
  mode: initialMode = "default",
  enableAuditLog = false,
  customPolicies = [],
  failFast = true,
  autoFix = false
}) {
  const [mode, setMode] = useState(initialMode);
  const [policySet, setPolicySet] = useState(() => {
    const baseSet = getPolicySetForMode(initialMode);
    let result = baseSet;
    for (const policy of customPolicies) {
      result = result.add(policy);
    }
    return result;
  });
  const [complianceHistory, setComplianceHistory] = useState([]);
  const governance = useMemo(() => {
    if (mode === "disabled") return null;
    const config = {
      policySet,
      failFast,
      autoFix,
      auditPort: enableAuditLog ? new ConsoleAuditAdapter() : new NoOpAuditAdapter()
    };
    return new EnforceEnterpriseGovernance(config);
  }, [mode, policySet, failFast, autoFix, enableAuditLog]);
  const handleSetMode = useCallback((newMode) => {
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
  const addPolicy = useCallback((policy) => {
    setPolicySet((prev) => prev.add(policy));
  }, []);
  const removePolicy = useCallback((policyId) => {
    setPolicySet((prev) => prev.remove(policyId));
  }, []);
  const enablePolicy = useCallback((policyId) => {
    setPolicySet((prev) => {
      const policy = prev.get(policyId);
      if (!policy) return prev;
      return prev.remove(policyId).add(policy.withEnabled(true));
    });
  }, []);
  const disablePolicy = useCallback((policyId) => {
    setPolicySet((prev) => {
      const policy = prev.get(policyId);
      if (!policy) return prev;
      return prev.remove(policyId).add(policy.withEnabled(false));
    });
  }, []);
  const checkColor = useCallback(async (colorHex, purpose) => {
    if (!governance) return null;
    const colorResult = PerceptualColor.tryFromHex(colorHex);
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
  const checkAccessibility = useCallback(async (foregroundHex, backgroundHex) => {
    if (!governance) return null;
    const fgResult = PerceptualColor.tryFromHex(foregroundHex);
    const bgResult = PerceptualColor.tryFromHex(backgroundHex);
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
  const checkTokens = useCallback(async (tokens) => {
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
  const checkTheme = useCallback(async (config) => {
    if (!governance) return null;
    let brandColor;
    if (config.brandColorHex) {
      const colorResult = PerceptualColor.tryFromHex(config.brandColorHex);
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
  const checkComponent = useCallback(async (componentName, tokens, brandColorHex) => {
    if (!governance) return null;
    let brandColor;
    if (brandColorHex) {
      const colorResult = PerceptualColor.tryFromHex(brandColorHex);
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
  const isColorCompliant = useCallback(async (colorHex) => {
    const result = await checkColor(colorHex);
    return result?.compliant ?? true;
  }, [checkColor]);
  const isAccessibilityCompliant = useCallback(async (fg, bg) => {
    const result = await checkAccessibility(fg, bg);
    return result?.compliant ?? true;
  }, [checkAccessibility]);
  const getPoliciesByScope = useCallback((scope) => {
    return policySet.byScope(scope);
  }, [policySet]);
  const getComplianceScore = useCallback(() => {
    if (complianceHistory.length === 0) return 100;
    const sum = complianceHistory.reduce((a, b) => a + b, 0);
    return sum / complianceHistory.length;
  }, [complianceHistory]);
  const contextValue = useMemo(() => ({
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
  return /* @__PURE__ */ jsx(GovernanceContext.Provider, { value: contextValue, children });
}
function useGovernance() {
  const context = useContext(GovernanceContext);
  if (!context) {
    throw new Error("useGovernance must be used within a GovernanceProvider");
  }
  return context;
}
function useColorGovernance(colorHex, purpose) {
  const { checkColor, isEnabled } = useGovernance();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const check = useCallback(async () => {
    if (!isEnabled) return;
    setLoading(true);
    const res = await checkColor(colorHex, purpose);
    setResult(res);
    setLoading(false);
  }, [checkColor, colorHex, purpose, isEnabled]);
  useEffect(() => {
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
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const check = useCallback(async () => {
    if (!isEnabled) return;
    setLoading(true);
    const res = await checkAccessibility(foregroundHex, backgroundHex);
    setResult(res);
    setLoading(false);
  }, [checkAccessibility, foregroundHex, backgroundHex, isEnabled]);
  useEffect(() => {
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
      return createStrictPolicySet();
    case "lenient":
      return createLenientPolicySet();
    case "disabled":
      return new PolicySet([]);
    default:
      return createDefaultPolicySet();
  }
}

export { GovernanceContext, GovernanceProvider, useAccessibilityGovernance, useColorGovernance, useComplianceStatus, useGovernance };
//# sourceMappingURL=chunk-F26NCOEL.mjs.map
//# sourceMappingURL=chunk-F26NCOEL.mjs.map