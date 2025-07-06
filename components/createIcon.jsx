const createIcon = (svgEl) => {
  const IconComponent = ({ color = "#fff", size = 24, className = "", ...props }) => (
    <svg
      fill="currentColor"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      {...props}
    >
      {svgEl()}
    </svg>
  )

  return IconComponent
}

export default createIcon
