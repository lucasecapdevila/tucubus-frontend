import { Button } from 'antd';

const FilterButton = ({ label, onClick, size = 'small' }) => {
  return (
    <Button size={size} onClick={onClick}>
      {label}
    </Button>
  );
};

export default FilterButton;