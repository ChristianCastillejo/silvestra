import { Badge } from "./ui/badge";

interface Props {
  readonly price: string | number;
  readonly compareAtPrice: string | number;
  readonly className?: string;
}

export default function DiscountBadge({
  price,
  compareAtPrice,
  className,
}: Props) {
  const priceNum = Number(price);
  const compareAtPriceNum = Number(compareAtPrice);
  const discountPercentage =
    compareAtPriceNum > priceNum
      ? Math.round(((compareAtPriceNum - priceNum) / compareAtPriceNum) * 100)
      : null;

  if (discountPercentage === null) {
    return null;
  }

  return (
    <Badge
      variant="default"
      className={className}
      role="status"
      aria-label={`${discountPercentage}% discount`}
    >
      -{discountPercentage}%
    </Badge>
  );
}
