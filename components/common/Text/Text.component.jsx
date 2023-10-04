import clsx from "clsx";
import PropTypes from "prop-types";

const variants = {
  body: "text-primaryText text-lg font-PoppinsRegular",
  label: "text-primaryText text-m font-500",
  title: "text-primaryText text-xl font-PoppinsBold",
  hint: "text-paperTertiary text-xs font-PoppinsRegular",
  caption: "text-primaryText text-base font-PoppinsBold",
  h1: "text-primaryText text-6xl font-PoppinsRegular",
  h2: "text-primaryText text-5xl font-PoppinsRegular",
  h3: "text-primaryText text-4xl font-PoppinsRegular",
  h4: "text-primaryText text-3xl font-PoppinsRegular",
  h5: "text-primaryText text-xl font-PoppinsRegular",
  h6: "text-primaryText text-lg font-PoppinsRegular",
  inverse: "text-inverse text-base font-PoppinsRegular",
  error: "text-sm font-PoppinsRegular text-error"
};

const Text = ({
  children,
  variant = "body",
  as = "p",
  className,
  style,
  onClick
}) => {
  const classes = clsx(variants[variant], className);
  const As = as;
  return (
    <As className={classes} style={style} onClick={onClick}>
      {children}
    </As>
  );
};

export default Text;

Text.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  variant: PropTypes.oneOf(Object.keys(variants)),
  as: PropTypes.string,
  onClick: PropTypes.func
};
