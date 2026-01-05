import { Spin } from "antd";
import { FC } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import Image from "next/image";

type SectionIconProps = {
  iconClass?: string;
  loading?: boolean;
  // New image props
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageClassName?: string;
  type?: IconType;
};

type IconType = "success" | "info" | "error" | "default" | "warning";

const SectionIcon: FC<SectionIconProps> = ({
  iconClass,
  loading = false,
  imageSrc,
  imageAlt = "section image",
  imageWidth = 32,
  imageHeight = 32,
  imageClassName = "",
  type = "default",
}) => {
  const getBorderClass = (type?: IconType) => {
    const borderClasses: Record<IconType, string> = {
      success: "border-success",
      info: "border-info",
      error: "border-error",
      default: "border-neutral-40",
      warning: "border-warning",
    };
    return borderClasses[type ?? "default"];
  };

  const getBgIconColor = (type?: IconType) => {
    const bgIconClasses: Record<IconType, string> = {
      success: "bg-transparent",
      info: "bg-transparent",
      error: "bg-transparent",
      default: "bg-transparent",
      warning: "bg-transparent",
    };
    return bgIconClasses[type ?? "default"];
  };

  const getTextIconColor = (type?: IconType) => {
    const textIconClasses: Record<IconType, string> = {
      success: "text-success",
      info: "text-info",
      error: "text-error",
      default: "text-neutral-40",
      warning: "text-warning",
    };
    return textIconClasses[type ?? "default"];
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Spin indicator={<LoadingOutlined spin size={100} />} size="large" />
      );
    }

    if (imageSrc) {
      return (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className={`object-contain ${imageClassName}`}
        />
      );
    }

    return (
      <i
        className={`${
          iconClass ? iconClass : "ri-checkbox-circle-fill"
        } text-[32px] ${getTextIconColor(type)}`}
      />
    );
  };

  return (
    <div className="relative flex items-center justify-center w-full h-[240px]">
      {[240, 208, 176, 144, 112].map((size, index) => (
        <div
          key={index}
          className={`absolute rounded-full border-[0.5px] ${getBorderClass(
            type
          )}`}
          style={{
            width: size,
            height: size,
            opacity: 0.05 + index * 0.05, // 0.05, 0.10, 0.15, 0.20, 0.25
          }}
        />
      ))}

      <div
        className={`z-10 flex items-center justify-center w-[80px] h-[80px] rounded-full
           border-[0.5px] !border-opacity-25 
           ${getBorderClass(type)}
             ${getBgIconColor(type)}`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default SectionIcon;
