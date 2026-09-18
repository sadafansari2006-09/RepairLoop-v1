export default function Photo({ src, gradientClass = "photo-generic", alt = "", className = "" }) {
  return (
    <div className={`photo ${gradientClass} ${className}`.trim()}>
      {src && <img src={src} alt={alt} className="photo-img" />}
    </div>
  );
}