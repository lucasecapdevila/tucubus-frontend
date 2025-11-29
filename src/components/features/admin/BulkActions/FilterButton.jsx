import { Button } from 'antd';

const FilterButton = ({ label, onClick, isActive, size = 'small' }) => {
  return (
    <Button
      size={size}
      onClick={onClick}
      style={
        isActive
          ? {
              backgroundColor: '#0c5392',
              color: '#fff',
              borderColor: '#0c5392',
            }
          : {}
      }
    >
      {label}
    </Button>
  );
};

export default FilterButton;
