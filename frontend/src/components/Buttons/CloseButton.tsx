import CloseIcon from "../../assets/CloseIcon";

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button className="w-[32px]" onClick={onClick}>
      <CloseIcon />
    </button>
  );
};
export default CloseButton;
