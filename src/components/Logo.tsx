import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  linkTo?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { mark: 28, text: "text-lg" },
  md: { mark: 34, text: "text-xl" },
  lg: { mark: 44, text: "text-2xl" },
};

export const Logo = ({ className = "", linkTo = "/", size = "md" }: LogoProps) => {
  const s = sizes[size];

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 40 40"
        fill="none"
        className="flex-shrink-0 transition-transform duration-500 group-hover:rotate-45"
      >
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const colors = ["#FF6B35", "#F7931E", "#FFC9B5", "#FF6B35", "#F7931E", "#FFC9B5"];
          return (
            <ellipse
              key={i}
              cx="20"
              cy="9"
              rx="6"
              ry="9"
              fill={colors[i]}
              transform={`rotate(${angle} 20 20)`}
              opacity="0.92"
            />
          );
        })}
        <circle cx="20" cy="20" r="4" fill="#FFF8F2" />
      </svg>
      <span
        className={`${s.text} font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300`}
        style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.02em" }}
      >
        PixelCraft
      </span>
    </div>
  );

  if (linkTo) return <Link to={linkTo}>{content}</Link>;
  return content;
};
