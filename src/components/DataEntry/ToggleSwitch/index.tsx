'use client';

import { Switch } from 'antd';
import { useEffect, useState } from 'react';
import CustomTypography from '../../Typography';
import './custom.css';
import { useDataTestIdWithPath } from '@/utils/DataTestId/data-test-id.utils';
import { usePathname } from 'next/navigation';

interface Props {
  dataTestId?: string;
  name?: string;
  size?: 'small' | 'large';
  showLabel?: boolean;
  color?: 'success' | 'brand';
  isChecked?: boolean;
  isDisabled?: boolean;
  type?: 'default' | 'text';
  title?: string;
  supportingText?: string;
  onChange?: (checked: boolean) => void;
}

const getBackgroundColor = (
  isDisabled: boolean,
  isChecked: boolean,
  color: 'success' | 'brand'
) => {
  if (isChecked && !isDisabled && color === 'success') {
    return 'var(--color-success)';
  }
  if (isChecked && !isDisabled && color === 'brand') {
    return 'var(--color-brand-00)';
  }

  return '#D0D0D0';
};

const ToggleSwitch = ({
  dataTestId,
  name,
  size = 'large',
  showLabel: showText = true,
  color = 'success',
  isChecked = false,
  isDisabled = false,
  type = 'default',
  title,
  supportingText,
  onChange,
}: Props) => {
  const [isCheckedState, setIsCheckedState] = useState(isChecked);

  const useDataTestId = useDataTestIdWithPath(usePathname(), 'toggle-switch', name, dataTestId);

  const handleChange = () => {
    const newCheckedState = !isCheckedState;
    setIsCheckedState(newCheckedState);
    onChange?.(newCheckedState);
  };

  useEffect(() => {
    setIsCheckedState(isChecked);
  }, [isChecked]);

  return (
    <div className="flex gap-3 items-center">
      <Switch
        data-testid={useDataTestId}
        defaultChecked={isChecked}
        checked={isCheckedState}
        onChange={handleChange}
        checkedChildren={showText ? 'ON' : ''}
        unCheckedChildren={showText ? 'OFF' : ''}
        disabled={isDisabled}
        size={size === 'small' ? 'small' : 'default'}
        className={`${color === 'success' ? 'default' : 'brand'} ${
          size === 'small' ? '!h-[20px]' : '!h-[24px]'
        }`}
      />
      {type === 'text' && (
        <div className="flex flex-col gap-1 -mt-0.5">
          {title && (
            <CustomTypography
              variant="paragraph-small"
              className="!font-normal !text-text-secondary"
            >
              {title}
            </CustomTypography>
          )}
          {supportingText && (
            <CustomTypography
              variant="paragraph-medium"
              className="!font-normal !text-text-quinary"
            >
              {supportingText}
            </CustomTypography>
          )}
        </div>
      )}
    </div>
  );
};

export default ToggleSwitch;
