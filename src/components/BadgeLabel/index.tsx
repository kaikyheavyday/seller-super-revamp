"use client";

import Typography, { TypographyVariant } from "@/components/Typography";

type ColorType =
  | "error"
  | "warning"
  | "success"
  | "info"
  | "brand"
  | "purple"
  | "productCategory"
  | "neutral";

type SizeType = "small" | "middle" | "large";
type RoundingType = "rounded" | "pill";
type VariantType = "outlined" | "solid" | "ghost" | "modern";

interface BadgeLabelProps {
  color?: ColorType;
  size?: SizeType;
  rounding?: RoundingType;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  variant?: VariantType;
  noBorder?: boolean;
  text?: string;
  icon?: React.ReactNode;
  maxLength?: number | null;
}

const colorToVar = (arg: ColorType): string => {
  switch (arg) {
    case "error":
      return "var(--color-error)";
    case "warning":
      return "var(--color-warning)";
    case "success":
      return "var(--color-success)";
    case "info":
      return "var(--color-info)";
    case "brand":
      return "var(--color-brand-00)";
    case "purple":
      return "var(--color-lavender-purple-20)";
    case "productCategory":
      return "#C1E0F5";
    default:
      return "var(--color-neutral-40)";
  }
};

const resolveMinWidth = (arg: SizeType): number => {
  switch (arg) {
    case "small":
      return 20;
    case "middle":
      return 24;
    case "large":
      return 28;
    default:
      return 24;
  }
};

const BadgeLabel = ({
  color,
  size = "middle",
  rounding = "rounded",
  prefix,
  suffix,
  variant = "outlined",
  noBorder = false,
  text = "",
  icon,
  maxLength = null,
}: BadgeLabelProps) => {
  const borderRadiusMapStyle: Record<SizeType, Record<RoundingType, string>> = {
    small: {
      rounded: "4px",
      pill: "9999px",
    },
    middle: {
      rounded: "4px",
      pill: "9999px",
    },
    large: {
      rounded: "6px",
      pill: "9999px",
    },
  };

  const resolveBackgroundGhost = (color: ColorType): string => {
    switch (color) {
      case "neutral":
        return "var(--color-neutral-p-95)";
      case "brand":
        return "var(--color-info-p-90)";
      case "purple":
        return "var(--color-lavender-purple-p-90)";
      case "warning":
        return "var(--color-warning-p-90)";
      case "error":
        return "var(--color-error-p-90)";
      case "info":
        return "var(--color-info-p-90)";
      case "success":
        return "var(--color-success-p-90)";
      case "productCategory":
        return "var(--color-info-p-90)";
      default:
        return "none";
    }
  };

  const resolveBorderColor = (color: ColorType): string => {
    switch (color) {
      case "neutral":
        return "var(--color-neutral-p-80)";
      case "brand":
        return "var(--color-brand-p-60)";
      case "purple":
        return "var(--color-lavender-purple-p-60)";
      case "warning":
        return "var(--color-warning-p-60)";
      case "error":
        return "var(--color-error-p-60)";
      case "info":
        return "var(--color-info-p-60)";
      case "success":
        return "var(--color-success-p-60)";
      case "productCategory":
        return "var(--color-info-p-60)";
      default:
        return "none";
    }
  };

  const backgroundMapStyle: Record<VariantType, string> = {
    outlined: "transparent",
    solid: colorToVar(color || "neutral"),
    ghost: resolveBackgroundGhost(color || "neutral"),
    modern: "var(--color-neutral-p-90)",
  };

  const textColorClassName: Record<VariantType, Record<ColorType, string>> = {
    outlined: {
      neutral: "!text-neutral",
      brand: "!text-brand",
      warning: "!text-warning-p20",
      error: "!text-error",
      info: "!text-info",
      purple: "!text-purple",
      success: "!text-success",
      productCategory: "!text-[#508EB9]",
    },
    solid: {
      neutral: "!text-white",
      brand: "!text-white",
      warning: "!text-white",
      error: "!text-white",
      info: "!text-white",
      purple: "!text-white",
      success: "!text-white",
      productCategory: "",
    },
    ghost: {
      neutral: "!text-neutral",
      brand: "!text-[#508EB9]",
      warning: "!text-warning",
      error: "!text-error",
      info: "!text-info",
      purple: "!text-purple",
      success: "!text-success",
      productCategory: "!text-[#508EB9]",
    },
    modern: {
      neutral: "!text-neutral",
      brand: "!text-brand",
      warning: "!text-warning",
      error: "!text-error",
      info: "!text-info",
      purple: "!text-purple",
      success: "!text-success",
      productCategory: "",
    },
  };

  const getTypographyVariant = (): TypographyVariant => {
    if (size === "small") return "paragraph-extra-small";
    if (size === "middle") return "paragraph-small";
    return "paragraph-medium";
  };

  return (
    <div
      style={{
        background: backgroundMapStyle[variant],
        minWidth: resolveMinWidth(size),
        flexShrink: 0,
        height: resolveMinWidth(size),
        paddingLeft: "8px",
        paddingRight: "8px",
        borderRadius: borderRadiusMapStyle[size][rounding],
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        border: noBorder
          ? "none"
          : `1px solid ${
              variant === "modern"
                ? "#DEE1E6"
                : resolveBorderColor(color || "neutral")
            }`,
        cursor: "pointer",
        width: "fit-content",
        maxWidth: "100%",
      }}
    >
      {prefix && <>{prefix}</>}
      {icon && <>{icon}</>}
      <Typography
        variant={getTypographyVariant()}
        className={`font-regular whitespace-nowrap overflow-hidden text-ellipsis ${
          variant === "modern"
            ? "!text-neutral-40"
            : textColorClassName[variant][color || "neutral"]
        }`}
      >
        {maxLength && text && text.length > maxLength
          ? `${text.substring(0, maxLength)}...`
          : text || "Label"}
      </Typography>
      {suffix && <>{suffix}</>}
    </div>
  );
};

export default BadgeLabel;
