import CancelIcon from "../../assets/CancelIcon";

interface CancelButtonProps {
  onClick: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <CancelIcon />
    </button>
  );
};
export default CancelButton;
