import { useMemo } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

/* @zuclubit/momoto-ui - Color Intelligence Design System */

var SIZE_MAP = {
  sm: { dimension: 32, fontSize: 10 },
  md: { dimension: 48, fontSize: 12 },
  lg: { dimension: 64, fontSize: 14 },
  xl: { dimension: 96, fontSize: 16 }
};
var SHAPE_MAP = {
  square: 0,
  rounded: 8,
  circle: "50%"
};
function ColorSwatch({
  color,
  size = "md",
  showValue = false,
  showLabel = false,
  label,
  selectable = false,
  selected = false,
  onSelect,
  shape = "rounded",
  bordered = false,
  className = ""
}) {
  const textColor = useMemo(() => {
    return color.oklch.l > 0.6 ? "#000000" : "#ffffff";
  }, [color]);
  const backgroundColor = useMemo(() => color.hex, [color]);
  const contrastInfo = useMemo(() => {
    const l = color.oklch.l;
    const contrastRatio = l > 0.6 ? (l + 0.05) / 0.05 : 1.05 / (l + 0.05);
    return {
      wcag: contrastRatio.toFixed(2),
      apca: Math.round(Math.abs(l - 0.5) * 200).toString()
      // Aproximación APCA
    };
  }, [color]);
  const sizeConfig = SIZE_MAP[size];
  const borderRadius = SHAPE_MAP[shape];
  const swatchStyle = {
    width: sizeConfig.dimension,
    height: sizeConfig.dimension,
    backgroundColor,
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    border: bordered ? "1px solid currentColor" : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: selectable ? "pointer" : "default",
    position: "relative",
    transition: "transform 150ms ease, box-shadow 150ms ease",
    boxShadow: selected ? `0 0 0 2px ${backgroundColor}, 0 0 0 4px currentColor` : void 0
  };
  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(color);
    }
  };
  const handleKeyDown = (e) => {
    if (selectable && onSelect && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect(color);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `color-swatch ${className}`, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        role: selectable ? "button" : "presentation",
        tabIndex: selectable ? 0 : void 0,
        "aria-pressed": selectable ? selected : void 0,
        "aria-label": label ?? `Color ${backgroundColor}`,
        style: swatchStyle,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        children: showValue && size !== "sm" && /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              color: textColor,
              fontSize: sizeConfig.fontSize,
              fontFamily: "monospace",
              fontWeight: 500
            },
            children: backgroundColor.toUpperCase()
          }
        )
      }
    ),
    showLabel && label && /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          marginTop: 4,
          fontSize: sizeConfig.fontSize,
          textAlign: "center",
          maxWidth: sizeConfig.dimension,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        },
        children: label
      }
    ),
    showValue && contrastInfo && size !== "sm" && /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          marginTop: 2,
          fontSize: sizeConfig.fontSize - 2,
          textAlign: "center",
          opacity: 0.7
        },
        children: [
          "WCAG: ",
          contrastInfo.wcag,
          " | APCA: ",
          contrastInfo.apca
        ]
      }
    )
  ] });
}
function ColorSwatchGroup({
  children,
  orientation = "horizontal",
  gap = 8,
  className = ""
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `color-swatch-group ${className}`,
      style: {
        display: "flex",
        flexDirection: orientation === "horizontal" ? "row" : "column",
        gap,
        flexWrap: "wrap"
      },
      children
    }
  );
}
function ColorScale({
  colors,
  size = "md",
  showValues = false,
  showLabels = true,
  className = ""
}) {
  return /* @__PURE__ */ jsx(ColorSwatchGroup, { className, children: colors.map((item, index) => /* @__PURE__ */ jsx(
    ColorSwatch,
    {
      color: item.color,
      size,
      showValue: showValues,
      showLabel: showLabels,
      label: item.label
    },
    index
  )) });
}
function TokenDisplay({
  token,
  collection,
  filterType,
  showMetadata = false,
  showPath = true,
  format = "list",
  textSize = "md",
  className = ""
}) {
  const tokens = useMemo(() => {
    if (token) {
      return [token];
    }
    if (collection) {
      let allTokens = collection.getAll();
      if (filterType) {
        allTokens = allTokens.filter((t) => {
          const tokenData = t;
          return tokenData.type === filterType;
        });
      }
      return allTokens;
    }
    return [];
  }, [token, collection, filterType]);
  const fontSizeMap = {
    sm: 12,
    md: 14,
    lg: 16
  };
  const fontSize = fontSizeMap[textSize];
  if (format === "grid") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `token-display token-display--grid ${className}`,
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16
        },
        children: tokens.map((t, index) => /* @__PURE__ */ jsx(
          TokenCard,
          {
            token: t,
            showMetadata,
            showPath,
            fontSize
          },
          index
        ))
      }
    );
  }
  if (format === "table") {
    return /* @__PURE__ */ jsx("div", { className: `token-display token-display--table ${className}`, children: /* @__PURE__ */ jsxs(
      "table",
      {
        style: {
          width: "100%",
          borderCollapse: "collapse",
          fontSize
        },
        children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
            showPath && /* @__PURE__ */ jsx("th", { style: tableHeaderStyle, children: "Path" }),
            /* @__PURE__ */ jsx("th", { style: tableHeaderStyle, children: "Value" }),
            /* @__PURE__ */ jsx("th", { style: tableHeaderStyle, children: "Type" }),
            showMetadata && /* @__PURE__ */ jsx("th", { style: tableHeaderStyle, children: "Description" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: tokens.map((t, index) => /* @__PURE__ */ jsx(
            TokenTableRow,
            {
              token: t,
              showMetadata,
              showPath
            },
            index
          )) })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `token-display token-display--list ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      },
      children: tokens.map((t, index) => /* @__PURE__ */ jsx(
        TokenListItem,
        {
          token: t,
          showMetadata,
          showPath,
          fontSize
        },
        index
      ))
    }
  );
}
var tableHeaderStyle = {
  textAlign: "left",
  padding: "8px 12px",
  borderBottom: "2px solid currentColor",
  opacity: 0.9
};
function getTokenData(token) {
  const data = token;
  return {
    path: data.path ?? token.path,
    value: data.value,
    type: data.type ?? "unknown",
    description: data.description
  };
}
function TokenCard({ token, showMetadata, showPath, fontSize }) {
  const data = getTokenData(token);
  const isColor = data.type === "color" || typeof data.value === "string" && (String(data.value).startsWith("#") || String(data.value).startsWith("rgb") || String(data.value).startsWith("oklch"));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        border: "1px solid currentColor",
        borderRadius: 8,
        padding: 12,
        opacity: 0.9
      },
      children: [
        isColor && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "100%",
              height: 48,
              backgroundColor: String(data.value),
              borderRadius: 4,
              marginBottom: 8
            }
          }
        ),
        showPath && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              fontFamily: "monospace",
              fontSize: fontSize ? fontSize - 2 : 12,
              opacity: 0.7,
              marginBottom: 4
            },
            children: data.path
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              fontFamily: "monospace",
              fontSize,
              fontWeight: 600
            },
            children: formatValue(data.value)
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              fontSize: fontSize ? fontSize - 2 : 12,
              opacity: 0.6,
              marginTop: 4
            },
            children: data.type
          }
        ),
        showMetadata && data.description && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              fontSize: fontSize ? fontSize - 2 : 12,
              opacity: 0.8,
              marginTop: 8,
              fontStyle: "italic"
            },
            children: data.description
          }
        )
      ]
    }
  );
}
function TokenListItem({ token, showMetadata, showPath, fontSize }) {
  const data = getTokenData(token);
  const isColor = data.type === "color" || typeof data.value === "string" && (String(data.value).startsWith("#") || String(data.value).startsWith("rgb"));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 0",
        borderBottom: "1px solid currentColor",
        opacity: 0.9
      },
      children: [
        isColor && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: 24,
              height: 24,
              backgroundColor: String(data.value),
              borderRadius: 4,
              flexShrink: 0
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          showPath && /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                fontFamily: "monospace",
                fontSize: fontSize ? fontSize - 2 : 12,
                opacity: 0.7
              },
              children: data.path
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "monospace",
                      fontSize,
                      fontWeight: 600
                    },
                    children: formatValue(data.value)
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      fontSize: fontSize ? fontSize - 2 : 12,
                      opacity: 0.6
                    },
                    children: [
                      "(",
                      data.type,
                      ")"
                    ]
                  }
                )
              ]
            }
          ),
          showMetadata && data.description && /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                fontSize: fontSize ? fontSize - 2 : 12,
                opacity: 0.8,
                fontStyle: "italic"
              },
              children: data.description
            }
          )
        ] })
      ]
    }
  );
}
function TokenTableRow({ token, showMetadata, showPath }) {
  const data = getTokenData(token);
  const isColor = data.type === "color" || typeof data.value === "string" && (String(data.value).startsWith("#") || String(data.value).startsWith("rgb"));
  const cellStyle = {
    padding: "8px 12px",
    borderBottom: "1px solid currentColor",
    opacity: 0.8
  };
  return /* @__PURE__ */ jsxs("tr", { children: [
    showPath && /* @__PURE__ */ jsx("td", { style: { ...cellStyle, fontFamily: "monospace" }, children: data.path }),
    /* @__PURE__ */ jsx("td", { style: cellStyle, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      isColor && /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            width: 16,
            height: 16,
            backgroundColor: String(data.value),
            borderRadius: 2
          }
        }
      ),
      /* @__PURE__ */ jsx("code", { children: formatValue(data.value) })
    ] }) }),
    /* @__PURE__ */ jsx("td", { style: cellStyle, children: data.type }),
    showMetadata && /* @__PURE__ */ jsx("td", { style: cellStyle, children: data.description ?? "-" })
  ] });
}
function formatValue(value) {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

export { ColorScale, ColorSwatch, ColorSwatchGroup, TokenDisplay };
//# sourceMappingURL=chunk-EC4PNEXC.mjs.map
//# sourceMappingURL=chunk-EC4PNEXC.mjs.map