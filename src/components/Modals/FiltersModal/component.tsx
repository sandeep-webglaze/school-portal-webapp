"use client";
import React, { FC } from "react";
import { Modal } from "../BaseModal";
import useSearchModal from "@/hooks/useModal";
import FilterContent from "./FilterContent";
import useFilterStore from "@/hooks/useFiltersStore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SchoolFiltersProps } from "@/components/Listings/SchoolFilters";

const FiltersModal: FC<SchoolFiltersProps> = ({ filtersMap }) => {
  const searchModal = useSearchModal();
  const store = useFilterStore();
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const applyFilters = () => {
    store.applyFilters(slug, router);
    searchModal.onClose();
  };

  // ✅ FIX: modal reset pe city preserve karo
  const handleReset = () => {
    const cityParam = searchParams.get("city") ?? undefined;
    store.resetFilters();
    if (cityParam) store.setFilters({ city: cityParam });
    store.applyFilters(slug, router);
    searchModal.onClose();
  };

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filters"
      actionLabel={"Apply"}
      large={false}
      onSubmit={applyFilters}
      secondaryAction={handleReset}
      secondaryActionLabel={"Reset"}
      onClose={searchModal.onClose}
      body={
        <FilterContent
          filters={store.filters}
          setFilters={store.setFilters}
          filtersMap={filtersMap}
        />
      }
    />
  );
};

export { FiltersModal };