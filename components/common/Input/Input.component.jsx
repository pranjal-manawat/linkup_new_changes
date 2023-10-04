import React, { forwardRef } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Text from "../Text";

const Input = forwardRef((props, ref) => {
  const {
    label = "",
    type = "text",
    placeholder = "Enter value",
    className = "",
    errorMessage = " ",
    itemRequired = false,
    ...rest
  } = props;
  const classes = clsx(
    "border-b border-gray-300 focus:border-gray-500 outline-none py-1 w-full",
    className
  );
  return (
    <>
      <div className="flex mt-2 mb-2">
        <Text variant="label">{label}</Text>
        {itemRequired && <Text variant="error" className="ml-1">*</Text>}
      </div>
      <div className="flex w-full mb-3">
        <input
          type={type}
          placeholder={placeholder}
          className={classes}
          ref={ref}
          {...rest}
        />
      </div>
      <div className="flex">
      <Text variant="error">{errorMessage}</Text>
      </div>
    </>
  );
});

export default Input;
Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
