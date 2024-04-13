import React from "react";

interface EditButtonProps {
  onClick: () => void;
}

export const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <div className="hover:cursor-pointer" onClick={onClick}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.1719 0C14.4481 0 13.7244 0.275625 13.1719 0.828125L12.7071 1.29289C12.3166 1.68342 12.3166 2.31658 12.7071 2.70711L15.2929 5.29289C15.6834 5.68342 16.3166 5.68342 16.7071 5.29289L17.1719 4.82812C18.2759 3.72413 18.2759 1.93313 17.1719 0.828125C16.6194 0.275625 15.8956 0 15.1719 0ZM12.2071 3.20711C11.8166 2.81658 11.1834 2.81658 10.7929 3.20711L0.292894 13.7071C0.105357 13.8946 0 14.149 0 14.4142V17C0 17.5523 0.447715 18 1 18H3.58579C3.851 18 4.10536 17.8946 4.29289 17.7071L14.7929 7.20711C15.1834 6.81658 15.1834 6.18342 14.7929 5.79289L12.2071 3.20711Z"
          fill="#4E4E4E"
        />
      </svg>
    </div>
  );
};

export default EditButton;
