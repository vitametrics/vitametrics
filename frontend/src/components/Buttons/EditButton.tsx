import EditIcon from "../../assets/EditIcon";

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <EditIcon />
    </button>
  );
};
export default EditButton;
