import ConfirmIcon from "../../assets/ConfirmIcon";

interface SaveButtonProps {
  onClick: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <ConfirmIcon />
    </button>
  );
};
export default SaveButton;
