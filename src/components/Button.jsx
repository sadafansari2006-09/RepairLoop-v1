export default function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  as: Component = "button",
  ...props
}) {
  const classes = [
    "btn",
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    variant === "ghost" && "btn-ghost",
    variant === "sage" && "btn-sage",
    size === "sm" && "btn-sm",
    block && "btn-block",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}