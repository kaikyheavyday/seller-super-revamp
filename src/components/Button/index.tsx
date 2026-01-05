"use client";

import React from "react";
import { Button } from "antd";
import { usePathname } from "next/navigation";
import { useDataTestIdWithPath } from "@/utils/DataTestId/data-test-id.utils";

type Variant = "outlined" | "dashed" | "solid" | "ghost" | "link";
type Size = "small" | "middle" | "large";
type Color = "primary" | "error" | "neutral";
type Bold = "400" | "500" | "600" | "700";

interface CustomButtonProps {
  dataTestId?: string;
  name?: string;
  fullWidth?: boolean;
  variant?: Variant;
  size?: Size;
  color?: Color;
  bold?: Bold;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
  htmlType?: "button" | "submit" | "reset";
  fitContent?: boolean;
  rounding?: "full" | "standard";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  dataTestId,
  name,
  fullWidth = false,
  size = "middle",
  color = "primary",
  variant = "solid",
  bold = "600",
  icon,
  iconPosition = "start",
  disabled = false,
  loading = false,
  onClick,
  children,
  className,
  htmlType,
  fitContent = false,
  rounding = "standard",
}) => {
  const useDataTestId = useDataTestIdWithPath(
    usePathname(),
    "button",
    name,
    dataTestId
  );
  const colorMap: Record<Color, Record<Variant, string>> = {
    primary: {
      solid:
        "!text-white !bg-primary hover:!bg-primary !border !border-primary hover:!border-primary",
      outlined:
        "!text-primary hover:!text-primary-dark !bg-transparent hover:!bg-primary-hover !border !border-primary hover:!border-primary-dark",
      ghost:
        "!text-primary hover:!text-primary-dark hover:!bg-primary-hover !bg-transparent !border-none",
      dashed:
        "!text-primary !border !border-dashed !border-primary hover:!bg-primary-hover",
      link: "!text-primary hover:!text-primary-dark !bg-transparent !border-none",
    },
    error: {
      solid:
        "!text-white !bg-error hover:!bg-error-dark !border !border-error hover:!border-error-dark",
      outlined:
        "!text-error hover:!text-error-dark !bg-transparent hover:!bg-error-hover !border !border-error hover:!border-error-dark",
      ghost:
        "!text-error !bg-transparent hover:!bg-error-hover hover:!text-error-dark !border-none",
      dashed:
        "!text-error !border !border-dashed !border-error hover:!bg-error-hover",
      link: "!text-error !bg-transparent hover:!bg-error-hover !border-none",
    },
    neutral: {
      solid: "!text-white !bg-neutral-text !border !border-neutral-bg",
      outlined:
        "!text-neutral-text hover:!text-hover-text !bg-transparent hover:!bg-neutral-bg !border !border-neutral-border hover:!border-[#BDC3CD]",
      ghost:
        "!text-neutral-text hover:!text-hover-text !bg-transparent hover:!bg-neutral-bg !border-0",
      dashed:
        "!text-neutral-text hover:!text-hover-text hover:!bg-neutral-bg !border !border-dashed !border-neutral-border hover:!border-[#BDC3CD]",
      link: "!text-neutral-text hover:!text-hover-text !bg-transparent !border-0",
    },
  };

  const classNameMapping = colorMap[color]?.[variant] ?? "";
  const disabledClass =
    variant !== "ghost"
      ? "!bg-disabled-background !text-disabled-text !border-0 cursor-not-allowed"
      : "!bg-transparent !border-0";
  const sizeClass = fitContent
    ? "!h-fit !w-fit !text-base !p-0"
    : size === "large"
    ? "!text-xl !min-w-[48px] !h-[48px]"
    : size === "small"
    ? "!text-sm !min-w-[32px] !h-[32px]"
    : "!text-base !min-w-[40px] !h-[40px]";
  const boldClass =
    bold === "500"
      ? "!font-medium"
      : bold === "600"
      ? "!font-semibold"
      : bold === "700"
      ? "!font-bold"
      : "!font-normal";

  return (
    <Button
      data-testid={useDataTestId}
      name={name}
      ghost={variant === "ghost"}
      block={fullWidth}
      size={size}
      icon={iconPosition === "start" ? icon : undefined}
      iconPosition={iconPosition}
      disabled={disabled}
      loading={loading}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => onClick?.(e)}
      htmlType={htmlType}
      className={`${
        rounding === "full" ? "!rounded-full" : "!rounded-lg"
      } !shadow-none ${
        disabled ? disabledClass : classNameMapping
      } ${sizeClass} ${boldClass} ${className ?? ""}`}
    >
      {iconPosition === "end" && icon ? (
        <span className="flex items-center gap-2">
          {children}
          {icon}
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
