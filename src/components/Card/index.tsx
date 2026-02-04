import Typography from "@/components/Typography";
import { FC } from "react";

type CardSelectionProps = {
  isSelected: boolean;
  icon: string;
  label: string;
  description?: string;
  isCredit?: boolean;
  fee?: number;
  onClick?: () => void;
  className?: string;
};

const CardSelection: FC<CardSelectionProps> = ({
  isSelected,
  icon,
  label,
  onClick,
  isCredit = false,
  description,
  fee = 0,
  className,
}) => {
  return (
    <div
      className={`${className ? className : "flex-1"} border-[0.5px] ${
        isSelected
          ? "border-primary bg-background-secondary"
          : "border-border-primary"
      } p-3 rounded-2xl cursor-pointer hover:bg-neutral-bg`}
      onClick={onClick}
    >
      <div
        className={`w-8 h-8 ${
          isSelected
            ? "bg-primary text-white"
            : "bg-background-secondary text-icon-quinary"
        } flex justify-center items-center rounded-lg`}
      >
        <i className={icon}></i>
      </div>
      <div className="mt-1">
        <Typography
          variant="paragraph-small"
          className="!text-text-secondary !font-medium"
        >
          {label}
        </Typography>
        {description && (
          <Typography
            variant="paragraph-small"
            className="!text-text-secondary"
          >
            {description}
          </Typography>
        )}
        {isCredit && (
          <Typography variant="paragraph-extra-small">
            <span className="text-primary font-medium">฿40,000</span>
            <span className="text-text-quinary">/100,000</span>
          </Typography>
        )}
        {fee > 0 && (
          <div className="flex flex-col mt-4">
            <Typography
              variant="paragraph-extra-small"
              className="!text-text-placeholder"
            >
              ค่าธรรมเนียม
            </Typography>
            <Typography
              variant="paragraph-extra-small"
              className="!text-primary !font-medium"
            >
              ฿{fee}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSelection;
