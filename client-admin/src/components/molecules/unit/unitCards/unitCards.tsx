import LoadingSpinner from "@/components/atoms/LoadingSpinner/LoadingSpinner";
import DeletePopUp from "@/components/atoms/deletePopup/deletePopup";
import EditButton from "@/components/atoms/unit/editButton/editButton";
import UnitPublished from "@/components/atoms/unit/unitPublished/unitPublished";
import { useUnit } from "@/store/useUnit";
import { IuseUnitStore, useUnitStore } from "@/store/useUnitStore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";

const UnitCards = ({ filterLevel }: { filterLevel: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const open = useUnitStore((S) => S.openAlert);
  const setOpen = useUnitStore((s) => s.setOpenAlert);
  const units = useUnitStore((s) => s.units);
  const setUnits = useUnitStore((s) => s.setUnits);
  const setAllUnits = useUnitStore((s) => s.setAllUnits);

  const filteredUnits = units.filter((unit) =>
    filterLevel ? unit.levels === filterLevel : true
  );
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  const router = useRouter();
  const selectedId = useUnit((s) => s.selectedId);
  const setSelectedId = useUnit((s) => s.setSelectedId);
  function onEditClick(event: any) {
    event.stopPropagation();
  }
  function handleChange(event: any, id: any) {}
  function onClickCard(id: any) {
    console.log("id", id);
    localStorage?.setItem("selectedId", JSON.stringify(id));
    setSelectedId(id);

    let selectedId: any = null;
    if (typeof window !== "undefined") {
      selectedId = JSON.parse(localStorage?.getItem("selectedId") || "null");
    }
    setIsLoading(true);
    if (selectedId === id) {
      router.push(`/auth/units/${selectedId}/`);
    }
    setIsLoading(false);
  }
  const deleteUnit = (selectedId: any) => {
    setOpen(true);
    // Set the selected unit ID to confirm deletion
    setSelectedId(selectedId);
  };

  const handleDeleteConfirmed = async (selectedId: any) => {
    try {
      const unitToDelete = units.find((unit) => unit.id === selectedId);
      if (!unitToDelete) {
        throw new Error(`Unit with id ${selectedId} not found`);
      }

      // Make the DELETE request to delete the unit from the API
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/deleteUnitsId/${selectedId}`,
        {
          mode: "cors",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      // Remove the deleted unit from the units array
      const updatedUnits: IuseUnitStore[] = units.filter(
        (unit) => unit.id !== selectedId
      );
      // setOpenAlert(false);
      // Update the units state with the updated units array
      setAllUnits(updatedUnits);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }

    // setOpenAlert(false);
  };
  const getApi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://staging.api.playalvis.com/v1/getunits`, {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("get", data);
      setUnits(data);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getApi();
  }, []);

  return (
    <>
      {filteredUnits &&
        filteredUnits?.map((unit): any => {
          return (
            <div
              key={unit?.id}
              data-id={unit?.id}
              id={unit?.id}
              className="transition-transform duration-300 hover:scale-110 px-2 py-1 cursor-pointer capitalize font-bold flex flex-col items-center bg-[#FEF3CF] border-2 border-[#D29B01] rounded-lg"
            >
              <div className="h-full relative cursor capitalize font-bold flex flex-col items-center min-h-[15rem] max-h-[20rem] min-w-[15rem] max-w-[20rem] rounded-md">
                <div className="absolute yellow-tab flex items-center justify-center bg-yellow-500 w-full py-3 px-1 mx-1 rounded-lg flex-row gap-10 my-2">
                  <div className="flex flex-row">
                    <span className="pl-3 text-ellipsis w-35 text-white font-bold text-sm">
                      {unit?.levels?.slice(0, 8)}
                      {unit?.levels && unit?.levels?.length > 8 ? "..." : ""}
                    </span>
                    <div className="flex mx-4">
                      <EditButton unit={unit} onClick={onEditClick} />
                      <div className="mx-4 pointer-events-none" id={unit?.id}>
                        <UnitPublished
                          handleChange={handleChange}
                          newUnit={unit}
                        />
                      </div>
                      <div
                        title="Delete"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteUnit(unit?.id);
                        }}
                      >
                        <AiOutlineDelete />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: "180px",
                    width: "200px",
                  }}
                  onClick={() => onClickCard(unit?.id)}
                >
                  <center
                    title={unit?.unitName}
                    className="absolute top-1/2 left-3 text-md"
                  >
                    {unit?.unitName?.slice(0, 20)}
                    {unit?.unitName && unit?.unitName?.length > 20 ? "..." : ""}
                    <span className="text-black mx-2">-</span>
                    {unit?.unitNumber}
                  </center>
                  {isLoading && <LoadingSpinner />}
                </div>
              </div>
            </div>
          );
        })}
      <DeletePopUp
        open={open}
        onClose={() => setOpen(false)}
        onDelete={() => handleDeleteConfirmed(selectedId)}
      />
    </>
  );
};

export default UnitCards;
