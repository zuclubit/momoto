'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');

/* @zuclubit/momoto-ui - Color Intelligence Design System */

var SIZE_CONFIG = {
  xs: { height: 24, paddingX: 8, fontSize: 11, borderRadius: 4, iconSize: 12, gap: 4 },
  sm: { height: 32, paddingX: 12, fontSize: 13, borderRadius: 6, iconSize: 14, gap: 6 },
  md: { height: 40, paddingX: 16, fontSize: 14, borderRadius: 8, iconSize: 16, gap: 8 },
  lg: { height: 48, paddingX: 20, fontSize: 16, borderRadius: 10, iconSize: 18, gap: 8 },
  xl: { height: 56, paddingX: 24, fontSize: 18, borderRadius: 12, iconSize: 20, gap: 10 }
};
var AccessibleButton = react.forwardRef(
  function AccessibleButton2({
    baseColor,
    variant = "solid",
    size = "md",
    intent = "action",
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    iconOnly = false,
    stateColors,
    disabled,
    children,
    className = "",
    style,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onFocus,
    onBlur,
    ...rest
  }, ref) {
    const [buttonState, setButtonState] = react.useState("idle");
    const colors = react.useMemo(() => {
      const getStateColor = (state) => {
        if (stateColors?.[state]) {
          return stateColors[state];
        }
        switch (state) {
          case "hover":
            return baseColor.lighten(0.1);
          case "active":
            return baseColor.darken(0.1);
          case "focus":
            return baseColor;
          case "disabled":
            return baseColor.desaturate(0.5);
          case "idle":
          default:
            return baseColor;
        }
      };
      const currentState = disabled ? "disabled" : buttonState;
      const currentColor = getStateColor(currentState);
      const textColor = currentColor.oklch.l > 0.6 ? "#000000" : "#ffffff";
      let background;
      let text;
      let border;
      switch (variant) {
        case "outline":
          background = "transparent";
          text = currentColor.hex;
          border = currentColor.hex;
          break;
        case "ghost":
          background = currentState === "hover" || currentState === "active" ? currentColor.withAlpha(0.1).hex : "transparent";
          text = currentColor.hex;
          border = "transparent";
          break;
        case "link":
          background = "transparent";
          text = currentColor.hex;
          border = "transparent";
          break;
        case "solid":
        default:
          background = currentColor.hex;
          text = textColor;
          border = currentColor.hex;
          break;
      }
      return {
        background,
        text,
        border,
        focusRing: baseColor.hex,
        opacity: currentState === "disabled" ? 0.5 : 1
      };
    }, [baseColor, buttonState, variant, stateColors, disabled]);
    const handleMouseEnter = react.useCallback(
      (e) => {
        if (!disabled && !loading) {
          setButtonState("hover");
        }
        onMouseEnter?.(e);
      },
      [disabled, loading, onMouseEnter]
    );
    const handleMouseLeave = react.useCallback(
      (e) => {
        if (!disabled && !loading) {
          setButtonState("idle");
        }
        onMouseLeave?.(e);
      },
      [disabled, loading, onMouseLeave]
    );
    const handleMouseDown = react.useCallback(
      (e) => {
        if (!disabled && !loading) {
          setButtonState("active");
        }
        onMouseDown?.(e);
      },
      [disabled, loading, onMouseDown]
    );
    const handleMouseUp = react.useCallback(
      (e) => {
        if (!disabled && !loading) {
          setButtonState("hover");
        }
        onMouseUp?.(e);
      },
      [disabled, loading, onMouseUp]
    );
    const handleFocus = react.useCallback(
      (e) => {
        if (!disabled && !loading) {
          setButtonState("focus");
        }
        onFocus?.(e);
      },
      [disabled, loading, onFocus]
    );
    const handleBlur = react.useCallback(
      (e) => {
        if (!disabled && !loading) {
          setButtonState("idle");
        }
        onBlur?.(e);
      },
      [disabled, loading, onBlur]
    );
    const sizeConfig = SIZE_CONFIG[size];
    const buttonStyle = {
      // Layout
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: sizeConfig.gap,
      width: fullWidth ? "100%" : iconOnly ? sizeConfig.height : "auto",
      height: sizeConfig.height,
      padding: iconOnly ? 0 : `0 ${sizeConfig.paddingX}px`,
      // Typography
      fontSize: sizeConfig.fontSize,
      fontWeight: 500,
      fontFamily: "inherit",
      lineHeight: 1,
      textDecoration: variant === "link" ? "underline" : "none",
      // Colors (derivados de Color Intelligence)
      backgroundColor: colors.background,
      color: colors.text,
      border: variant === "outline" ? `1px solid ${colors.border}` : "none",
      borderRadius: sizeConfig.borderRadius,
      opacity: colors.opacity,
      // Interaction
      cursor: disabled || loading ? "not-allowed" : "pointer",
      outline: "none",
      transition: "all 150ms ease-in-out",
      // Focus ring
      boxShadow: buttonState === "focus" ? `0 0 0 2px ${colors.focusRing}40` : "none",
      // Custom
      ...style
    };
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        ref,
        type: "button",
        disabled: disabled || loading,
        className: `accessible-button accessible-button--${variant} accessible-button--${size} ${className}`,
        style: buttonStyle,
        "data-intent": intent,
        "data-state": buttonState,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onFocus: handleFocus,
        onBlur: handleBlur,
        ...rest,
        children: [
          loading && /* @__PURE__ */ jsxRuntime.jsx(LoadingSpinner, { size: sizeConfig.iconSize, color: colors.text }),
          !loading && leftIcon && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "accessible-button__icon accessible-button__icon--left",
              style: { width: sizeConfig.iconSize, height: sizeConfig.iconSize },
              children: leftIcon
            }
          ),
          !iconOnly && children && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "accessible-button__label", children }),
          !loading && rightIcon && /* @__PURE__ */ jsxRuntime.jsx(
            "span",
            {
              className: "accessible-button__icon accessible-button__icon--right",
              style: { width: sizeConfig.iconSize, height: sizeConfig.iconSize },
              children: rightIcon
            }
          )
        ]
      }
    );
  }
);
function LoadingSpinner({ size, color }) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      style: { animation: "spin 1s linear infinite" },
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "10",
            stroke: color,
            strokeWidth: "3",
            strokeLinecap: "round",
            strokeDasharray: "31.4 31.4",
            opacity: 0.25
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "10",
            stroke: color,
            strokeWidth: "3",
            strokeLinecap: "round",
            strokeDasharray: "31.4 31.4",
            strokeDashoffset: "23.55"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("style", { children: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` })
      ]
    }
  );
}

exports.AccessibleButton = AccessibleButton;
//# sourceMappingURL=chunk-WTTLT5UT.js.map
//# sourceMappingURL=chunk-WTTLT5UT.js.map