import { Button } from 'antd';

const AdminTableHeader = ({ title, onNew }) => {
  return (
    <div className="w-full flex justify-between items-center gap-2 mb-4 px-2">
      <h2 className="text-lg sm:text-xl font-bold text-primary-text">
        {title}
      </h2>
      <Button
        onClick={onNew}
        style={{ backgroundColor: '#0c5392', color: '#fff' }}
        className="self-start sm:self-center w-fit"
      >
        Nuevo {title}
      </Button>
    </div>
  );
};

export default AdminTableHeader;