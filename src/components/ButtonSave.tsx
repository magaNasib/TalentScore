import { Icon } from "@iconify/react";
import { addSelect } from "state/dataSlice";

interface ILinkButton {
  label?: string;
  type?: btnType;
  nav?: navType;
  className?: string;
  haveIcon?: boolean;
  disabled?: boolean;
  trigger?: any;
  onClick?: any;
}

type btnType = "outline";

type navType = {
  path: { slugName?: string; subSlugName?: string };
  state: { subStageName?: string; stageName?: string };
};

const ButtonSave = ({
  disabled,
  label,
  className,
  type,
  onClick,
  trigger,
  haveIcon = true,
}: ILinkButton) => {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        type="submit"
        className={`w-[180px] flex rounded-full justify-center items-center py-3.5 gap-4 ${
          type === "outline"
            ? "flex-row-reverse border border-qss-secondary text-qss-secondary bg-transparent"
            : "bg-qss-secondary flex-row text-white"
        }`}
        disabled={disabled}
      >
        {label}
        {haveIcon && (
          <Icon
            icon="material-symbols:arrow-right-alt-rounded"
            className={type === "outline" ? "rotate-180" : "rotate-0"}
            width="1.5rem"
          />
        )}
      </button>
    </div>
  );
};

export default ButtonSave;
