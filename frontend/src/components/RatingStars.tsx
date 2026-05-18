interface RatingStarsProps {
  score: number; // nota atual; 0 significa "ainda não avaliado"
  onRate: (score: number) => void;
  disabled?: boolean;
}

function RatingStars({ score, onRate, disabled }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="rating-stars">
      {stars.map((value) => (
        <button
          key={value}
          type="button"
          className={value <= score ? "star star-filled" : "star"}
          onClick={() => onRate(value)}
          disabled={disabled}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default RatingStars;