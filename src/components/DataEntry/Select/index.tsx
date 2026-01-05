'use client';

import { Select, SelectProps, Form } from "antd";
import { FC } from "react";
import "./custom.css";
import { useDataTestIdWithPath } from "@/utils/DataTestId/data-test-id.utils";
import { usePathname } from "next/navigation";

export interface SelectFieldProps extends Omit<SelectProps, "size"> {
  dataTestId?: string;
  size?: "small" | "middle" | "large";
  name?: string | (string | number)[];
  label?: React.ReactNode;
  rules?: any[];
  vertical?: boolean;
  formItemProps?: Omit<
    React.ComponentProps<typeof Form.Item>,
    | 'name'
    | 'label'
    | 'rules'
    | 'labelCol'
    | 'wrapperCol'
    | 'required'
    | 'labelAlign'
    | 'labelWrap'
  >;
  validateStatus?:
    | ''
    | 'warning'
    | 'error'
    | 'success'
    | 'validating'
    | undefined;
  help?: string;
  variant?: 'outlined' | 'borderless' | 'filled';
  required?: boolean;
}

const SelectField: FC<SelectFieldProps> = ({
  dataTestId,
  size = "middle",
  placeholder = "",
  disabled = false,
  allowClear = false,
  className = '',
  name,
  label,
  rules,
  vertical = false,
  formItemProps,
  validateStatus,
  help,
  variant,
  required,
  options,
  children,
  ...rest
}) => {
  // Determine select size classes
  let sizeClass = '';
  if (size === 'large') {
    sizeClass =
      '!h-[48px] !text-base [&_.ant-select-selector]:!h-[48px] [&_.ant-select-selector]:!py-3 [&_.ant-select-selector]:!px-4';
  } else if (size === 'middle') {
    sizeClass =
      '!h-[40px] !text-base [&_.ant-select-selector]:!h-[40px] [&_.ant-select-selector]:!py-2 [&_.ant-select-selector]:!px-4 &_.ant-select-selector]:!text-base';
  } else if (size === 'small') {
    sizeClass =
      '!h-[32px] !text-sm [&_.ant-select-selector]:!h-[32px] [&_.ant-select-selector]:!py-1 [&_.ant-select-selector]:!px-3';
  }

  const useDataTestId = useDataTestIdWithPath(usePathname(), 'select', name?.toString() || null, dataTestId);

  const selectNode = (
    <Select
      data-testid={useDataTestId}
      className={`${sizeClass} ${className}`}
      placeholder={placeholder}
      disabled={disabled}
      allowClear={allowClear}
      variant={variant}
      options={options}
      {...rest}
    >
      {children}
    </Select>
  );

  // Detect if any rule is required
  const isRequired =
    (Array.isArray(rules) && rules.some((rule) => rule.required === true)) ||
    required;

  // Prepare label with asterisk after, using Tailwind for error color and margin
  const renderLabel = () => {
    if (label) {
      return (
        <span>
          {label}
          {isRequired && <span className="text-error ml-1 text-xs">*</span>}
        </span>
      );
    }
    return undefined;
  };

  // If name or label or rules provided, wrap with Form.Item
  if (name || label || rules) {
    const labelCol = vertical ? { span: 24 } : undefined;
    const wrapperCol = vertical ? { span: 24 } : undefined;
    return (
      <Form.Item
        name={name}
        label={renderLabel()}
        rules={rules}
        required={false} // managed in custom label
        colon={false} // remove default colon
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        validateStatus={validateStatus}
        help={help}
        className="!mb-0"
        {...formItemProps}
      >
        {selectNode}
      </Form.Item>
    );
  }

  return selectNode;
};

export default SelectField;
