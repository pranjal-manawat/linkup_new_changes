import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Text from "../Text";
import clsx from "clsx";

const Modal = memo(
    ({ open = false, handleClose, children, title = "", className = "" }) => {
    const [showModal, setShowModal] = useState(open);

    const classes = clsx(className, "relative my-6 mx-auto max-w-3xl");

    useEffect(() => {
      setShowModal(open);
    }, [open]);
    return showModal ? (
      <>
        <div className="justify-center w-full h-full items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className={classes}>
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <Text variant="h5">{title}</Text>
                <Text
                  as="span"
                  className="cursor-pointer !text-2xl"
                  onClick={() => handleClose()}
                >
                  x
                </Text>
              </div>
              <div className="relative p-4 flex-auto overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    ) : null;
  }
);

export default Modal;

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
};
