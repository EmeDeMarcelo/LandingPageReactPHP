export default function ThemeCard({
  title,
  subtitle,
  description,
  image,
  theme,
}) {
  return (
    <article
      className="overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        backgroundColor: theme.settings.cardBackgroundColor,
      }}
    >
      {/* Imagen */}
      <div className="h-44 w-full overflow-hidden">
        <img
          src={import.meta.env.VITE_PUBLIC_URL + image}
          alt={title}
          className="h-full w-full object-cover"
        />

      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3
          className="text-lg font-bold mb-1"
          style={{ color: theme.settings.textMainColor }}
        >
          {title}
        </h3>

        <p
          className="text-sm font-medium mb-3"
          style={{ color: theme.settings.primaryColor }}
        >
          {subtitle}
        </p>

        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: theme.settings.textSecondaryColor }}
        >
          {description}
        </p>


      </div>
    </article>
  );
}
