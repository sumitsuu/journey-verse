import { usePathname, useRouter } from "@/src/i18n/routing";
import { useSearchParams } from "next/navigation";

export default function useUrlSearchParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateMultipleUrlSearchParams = (data: Record<string, string | number | null | Date | string[]>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(data).forEach(([key, value]) => {
      if (value == null || value === "") {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((item) => {
          params.append(key, item);
        });
      } else if (value instanceof Date) {
        params.set(key, value.toISOString());
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearUrlSearchParams = (keys?: string[]) => {
    if (!keys) {
      router.push(pathname, { scroll: false });
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    keys.forEach((key) => params.delete(key));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const processUrlSearchParams = (params: string) => {
    const paramsObj = new URLSearchParams(params);
    const result: Record<string, any> = {};

    for (const key of paramsObj.keys()) {
      const values = paramsObj.getAll(key).map((val) => (isNaN(Number(val)) ? val : Number(val)));

      result[key] = values.length === 1 ? values[0] : values;
    }

    return result;
  };

  return {
    updateMultipleUrlSearchParams,
    clearUrlSearchParams,
    searchParams,
    pathname,
    router,
    processUrlSearchParams,
  };
}
