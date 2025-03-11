interface AdminButtonProps {
  onClick: () => void;
}

const AdminButton: React.FC<AdminButtonProps> = ({ onClick }) => {
  return (
    <button className="admin-button" onClick={onClick}>
      Admin
    </button>
  );
};

export default AdminButton;
