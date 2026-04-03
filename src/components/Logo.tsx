import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  linkTo?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { grid: 14, gap: 2, text: "text-lg" },
  md: { grid: 16, gap: 2, text: "text-xl" },
  lg: { grid: 20, gap: 3, text: "text-2xl" },
};

export const Logo = ({ className = "", linkTo = "/", size = "md" }: LogoProps) => {
  const s = sizes[size];
  const totalSize = s.grid;
  const cellSize = (totalSize - s.gap) / 2;

  const content = (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* 2×2 pixel grid mark */}
      <svg
        width={totalSize}
        height={totalSize}
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        fill="none"
        className="flex-shrink-0"
      >
        <rect x={0} y={0} width={cellSize} height={cellSize} className="fill-gold" rx={1} />
        <rect x={cellSize + s.gap} y={0} width={cellSize} height={cellSize} className="fill-gold/60" rx={1} />
        <rect x={0} y={cellSize + s.gap} width={cellSize} height={cellSize} className="fill-gold/60" rx={1} />
        <rect x={cellSize + s.gap} y={cellSize + s.gap} width={cellSize} height={cellSize} className="fill-gold" rx={1} />
      </svg>
      <div className="flex flex-col leading-none">
        <span className={`font-serif ${s.text} font-semibold tracking-widest text-foreground group-hover:text-gold transition-colors duration-500`}>
          PixelCraft
        </span>
        <span className="accent-line mt-0.5 transition-all duration-500 group-hover:w-full" style={{ width: '100%' }} />
      </div>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};
