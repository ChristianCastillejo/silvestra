"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOption {
  title: string;
  param: string;
}

interface Props {
  readonly triggerText: string;
  readonly options: SortOption[];
  readonly defaultValue?: string;
}

export default function SortSelect({
  triggerText,
  options,
  defaultValue,
}: Props) {
  const router = useRouter();
  const t = useTranslations("Collections");

  const handleValueChange = (value: string) => {
    router.push(value);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-base text-gray-900">{t("sortBy")}:</label>
      <Select defaultValue={defaultValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-fit min-w-[140px] shadow-none">
          <SelectValue placeholder={triggerText} />
        </SelectTrigger>
        <SelectContent align="end">
          {options.map((item) => (
            <SelectItem key={item.title} value={item.param}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
