import ThemeCard from "./ThemeCard";

export default function ThemeCardSlider({ cards, theme }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <ThemeCard
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          theme={theme}
        />
      ))}
    </div>
  );
}
