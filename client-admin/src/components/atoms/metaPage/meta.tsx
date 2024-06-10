import React, { useState, ChangeEvent, useCallback, useEffect } from "react";
import Chip from "@mui/material/Chip";

const MetaPage: React.FC = () => {
  const [chipData, setChipData] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }
  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    selectPageId = JSON.parse(localStorage?.getItem("selectPageId") || "null");
  }
  const handleDelete = (chipToDelete: string) => {
    return (event: React.MouseEvent) => {
      event.preventDefault();
      const updatedChips = chipData.filter((chip) => chip !== chipToDelete);

      // Update the chips in the database
      fetch(`https://staging.api.playalvis.com/v1/updatePage/${selectPageId}`, {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          meta: updatedChips,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          console.log("PUT", res);
          const meta = res.data.meta;
          setChipData(meta);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  };

  const onClickEnter = async () => {
    const newChip = inputValue;
    if (chipData.includes(inputValue)) return;
    setChipData((prevChipData) => [...prevChipData, newChip]);
    console.log("Chip", newChip);
    await updateBoard(newChip);
  };

  function handleSelectOption(event: ChangeEvent<HTMLSelectElement>) {
    setInputValue(event.target.value);
  }
  const updateBoard = useCallback(
    async (newChip: string) => {
      console.log("a", newChip);
      if (newChip.length === 0) {
        return;
      } else {
        try {
          const response = await fetch(
            `https://staging.api.playalvis.com/v1/updatePage/${selectPageId}`,
            {
              mode: "cors",
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                meta: [...chipData, newChip],
              }),
            }
          );

          const res = await response.json();
          console.log("PUT", res);
          const meta = res.data.meta;
          setChipData(meta);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [chipData, selectPageId]
  );
  const getApi = async () => {
    try {
      const response = await fetch(
        `https://staging.api.playalvis.com/v1/getPages/${selectPageId}`,
        {
          mode: "cors",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let dataB = await response.json();
      let data = dataB.data;
      const meta = data.meta;
      setChipData(meta);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getApi();
  }, [selectPageId]);
  return (
    <div style={{ display: "flex" }}>
      <div className="bg-[#BDDFF6] flex flex-row ">
        <div className="mx-7 border rounded-xl bg-[#F5FCFD] border-1 h-[20rem] min-w-[25rem]">
          <h1 className="font-bold ml-5 mx-2 my-2 text-2xl">Add meta tags</h1>
          <select
            className="px-3 py-1 bg-[#E1E1E1] rounded-none w-80 mx-4 my-2 border border-1 border-black"
            value={inputValue}
            onChange={handleSelectOption}
          >
            <option>select option</option>
            <option value="Opening">Opening</option>
            <option value="middlegame">middlegame</option>
            <option value="endgame">endgame</option>
            <option value="tactics">tactics</option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
          <button
            className="bg-indigo-500 px-4 py-2 text-white mx-3 rounded-md hover:scale-110 transition-transform duration-300"
            onClick={onClickEnter}
          >
            Enter
          </button>
          <div className="mx-2 px-2 my-4">
            {chipData.map((data, index) => (
              <Chip key={index} label={data} onDelete={handleDelete(data)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaPage;
