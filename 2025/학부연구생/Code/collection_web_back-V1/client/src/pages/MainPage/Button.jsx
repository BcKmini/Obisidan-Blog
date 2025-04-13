import React from 'react';

const Button = ({ label }) => {
  return (
    <div className='min-w-[80px] h-[36px] flex items-center justify-center gap-2 bg-[#E3EBE7] rounded-md hover:bg-[#758C80] hover:text-[#fff] cursor-pointer'>
      <span className='flex items-center'>{label}</span>
    </div>
  );
};

export default Button;