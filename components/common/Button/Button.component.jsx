import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Button = ({ onClick, color, style, className = '', text = '', type = 'button' }) => {
  const classes = clsx(
    "inline-flex justify-center text-white bg-primaryBg font-medium leading-tight rounded shadow-md p-2",
    className
  );
  return (
    <div className="flex space-x-2">
      <button
        onClick={onClick}
        color={color}
        style={style}
        type={type}
        className={classes}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;

Button.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  text: PropTypes.string
};
