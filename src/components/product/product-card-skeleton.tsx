import {
  Card,
  CardHeader,
  CardContent,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="group/card">
      <CardHeader className="!w-full h-auto aspect-[3/4] relative overflow-hidden">
        <Skeleton className="h-full w-full" />
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
