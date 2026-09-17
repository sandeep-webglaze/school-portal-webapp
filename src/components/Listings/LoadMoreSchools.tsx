"use client";

import { fetchSchools } from "@/actions/fetch-schools";
import { ISchoolFilters, SchoolList, SortFilters } from "@/api/schools";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Schools from "./Schools";
import { VIEW_TYPE } from "@/constants";
import Spinner from "../Spinner";

export function LoadMore({
  view,
  totalCount,
}: {
  view: VIEW_TYPE;
  totalCount: number;
}) {
  const [beers, setBeers] = useState<SchoolList[]>([]);
  const [page, setPage] = useState(1);
  const params = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const classification = searchParams.getAll("classification");
  const schoolBoards = searchParams.getAll("schoolBoards");
  const type = searchParams.getAll("type");
  const minFees = searchParams.get("minFees");
  const maxFees = searchParams.get("maxFees");
  const sortBy = searchParams.get("sortBy");
  const city = searchParams.get("city"); // ✅ city fix — pagination pe city filter maintain karo
  const filters: ISchoolFilters = { classification, schoolBoards, type };
  if (minFees && maxFees) {
    filters.maxFees = Number(maxFees);
    filters.minFees = Number(minFees);
  }
  if (sortBy) filters.sortBy = sortBy as any;
  if (city) filters.city = city; // ✅ city filter pass karo
  const { ref, inView } = useInView();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    setBeers([]);
    // Reset to page 1 when the underlying list changes — without this, page
    // could stay > 1 and we'd skip pages.
    setPage(1);
  }, [totalCount]);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;

    // Function defined inside the effect on purpose — closes over `page`,
    // `loading`, `filters` etc. without forcing them into the dep array
    // (which would re-trigger the IntersectionObserver effect on every
    // state change and load duplicate pages).
    const loadMoreBeers = async () => {
      if (page >= Math.ceil(totalCount / 30) || loading) return;
      setLoading(true);
      await delay(1000);
      const newSchools = await fetchSchools(params as { slug: string }, {
        ...filters,
        page: page + 1,
      });
      if (cancelled) return;
      setLoading(false);
      setBeers((prevSchools: SchoolList[]) => [
        ...prevSchools,
        ...(newSchools?.data?.schools ?? []),
      ]);
      setPage((page) => page + 1);
    };

    loadMoreBeers();
    return () => {
      cancelled = true;
    };
    // We intentionally only depend on `inView`. Adding `page`, `loading`,
    // `filters`, `params` etc. would re-fire this effect mid-load and
    // duplicate fetches. The function reads fresh values via closure on
    // each render that flips inView.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <>
      <Schools view={view} schools={beers} />
      <div ref={ref} />
      {loading && <Spinner size={70} />}
    </>
  );
}