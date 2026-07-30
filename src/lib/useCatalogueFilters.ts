import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/** Filter state lives in the URL, not in component state, so a filtered view is
 * shareable and survives a back button. A counselor sending a student
 * "/courses?level=bachelor&dept=computing-it" is the whole point. */
export function useCatalogueFilters() {
  const [params, setParams] = useSearchParams();

  const get = useCallback((key: string) => params.get(key) ?? "", [params]);

  const getAll = useCallback(
    (key: string) => params.getAll(key).filter(Boolean),
    [params],
  );

  const setValue = useCallback(
    (key: string, value: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  /** Add or remove one value from a repeated param. */
  const toggleValue = useCallback(
    (key: string, value: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const current = next.getAll(key);
          next.delete(key);
          const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
          updated.forEach((v) => next.append(key, v));
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const clearAll = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams]);

  const activeCount = useMemo(() => {
    let n = 0;
    params.forEach((value, key) => {
      if (value && key !== "sort") n += 1;
    });
    return n;
  }, [params]);

  return { params, get, getAll, setValue, toggleValue, clearAll, activeCount };
}
