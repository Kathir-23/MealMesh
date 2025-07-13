import PropTypes from 'prop-types';

const Button = ({ label, onClick, className, type = "button", disabled = false }) => {
  return (
    <button 
      onClick={onClick}
      className={className}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;