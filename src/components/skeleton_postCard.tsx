import { Skeleton } from "./ui/skeleton";

const SkeletonPostCard = () => {
  return (
    <div className="flex flex-col space-y-3 h-[445px] w-[384px]">
      <Skeleton className="h-[265px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
};

export default SkeletonPostCard;
