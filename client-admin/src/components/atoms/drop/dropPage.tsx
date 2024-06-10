import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChessElements,
  ImageData,
  getChessImageSrc,
} from "@/store/ChessElements";
import Chessboard from "@/components/atoms/drop/chessboard";
import useDrop, { Option } from "@/store/useDrop";
import { isEmpty } from "lodash";
import { Alert } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { usePieceHistory } from "@/store/usePieceHistory";
const DropPage = () => {
  const [popUp, setPopUp] = useState(false);
  // calling the select page id
  let selectPageId: any = null;
  if (typeof window !== "undefined") {
    selectPageId = JSON.parse(localStorage?.getItem("selectPageId") || "null");
  }
  let token: any = null;
  if (typeof window !== "undefined") {
    token = localStorage?.getItem("token") || "null";
  }

  const selectedSquare = useDrop((s) => s.selectedSquare);
  const setSelectedSquare = useDrop((s) => s.setSelectedSquare);
  const [draggedImage, setDraggedImage] = useState<ImageData | null>(null);
  const [options, setOptions] = useState(0);
  const [droppedImages, setDroppedImages] = useState<ImageData[][]>(
    Array.from({ length: options }, () => [])
  );
  // storing the pieceDrop
  const [storeOptions, setStoreOptions] = useState<Option[]>([]); // Update the initial state type
  const fenString = usePieceHistory((s) => s.fenString);
  const setFenString = usePieceHistory((s) => s.setFenString);
  const handleDragStart = (
    event: React.DragEvent<HTMLImageElement>,
    image: ImageData
  ) => {
    event.dataTransfer.setData("text/plain", image.id.toString());
    event.dataTransfer.setDragImage(event.target as HTMLImageElement, 0, 0);
    setDraggedImage(image);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    optionIndex: number
  ) => {
    event.preventDefault();
    const imageId = parseInt(event.dataTransfer.getData("text/plain"));
    const droppedImage = ChessElements.find((image) => image.id === imageId);
    console.log(`Dropped image on option ${optionIndex}:`, droppedImage);

    setDroppedImages((prevDroppedImages) => {
      const newDroppedImages = [...prevDroppedImages];
      if (droppedImage) {
        newDroppedImages[optionIndex] = [
          ...newDroppedImages[optionIndex],
          droppedImage,
        ];
        // update the image source of the dropped image
        if (newDroppedImages[optionIndex] && newDroppedImages[optionIndex][0]) {
          newDroppedImages[optionIndex][0].src = droppedImage?.src;
        }
        // update the storeOptions state with new Option object
        setStoreOptions((prevStoreOptions: Option[]) => {
          const newStoreOptions = [...prevStoreOptions];
          const newOption = {
            optionNumber: optionIndex + 1, // set id to optionIndex
            isChecked: false, // set checked to true (or any desired value)
            imageName: droppedImage.name, // set imageName to droppedImage name
            location: selectedSquare, // set inputValue to empty string (or any desired value)
          };
          newStoreOptions[optionIndex] = newOption;
          return newStoreOptions;
        });
      }
      localStorage?.setItem("droppedImages", JSON.stringify(droppedImages));
      return newDroppedImages;
    });
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number
  ) => {
    setDroppedImages((prevDroppedImages) => {
      const newDroppedImages = [...prevDroppedImages];
      newDroppedImages[optionIndex] = [newDroppedImages[optionIndex][0]];
      localStorage?.setItem("droppedImages", JSON.stringify(droppedImages));
      return newDroppedImages;
    });
    setStoreOptions((prevStoreoptions) => {
      const newStoreOptions = [...prevStoreoptions];
      const newOption = {
        ...newStoreOptions[optionIndex],
        isChecked: !newStoreOptions[optionIndex]?.isChecked, // toggling checked
      };
      newStoreOptions[optionIndex] = newOption;
      return newStoreOptions;
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    optionIndex: number
  ) => {
    setDroppedImages((prevDroppedImages) => {
      const newDroppedImages = [...prevDroppedImages];
      if (newDroppedImages[optionIndex][0].name) {
        newDroppedImages[optionIndex][0].name = event.target.value;
      }
      localStorage?.setItem("droppedImages", JSON.stringify(droppedImages));
      return newDroppedImages;
    });
    setStoreOptions((prevStoreoptions) => {
      const newStoreOptions = [...prevStoreoptions];
      const newOption = {
        ...newStoreOptions[optionIndex],
        location: selectedSquare,
      };
      newStoreOptions[optionIndex] = newOption;
      return newStoreOptions;
    });
  };
  const addOption = async () => {
    setOptions((prevOptions) => prevOptions + 1);
    setDroppedImages((prevDroppedImages) => [...prevDroppedImages, []]);
    // Update the storeOptions state with a new Option object for the newly added option
    setStoreOptions((prevStoreOptions) => {
      const newStoreOptions = prevStoreOptions ? [...prevStoreOptions] : [];
      const newOption = {
        optionNumber: options, // Set optionNumber to the updated value of options
        isChecked: false, // Set isChecked to false (or any desired value)
        imageName: "", // Set imageName to an empty string (or any desired value)
        location: "", // Set location to an empty string (or any desired value)
      };
      newStoreOptions.push(newOption); // Add the new Option object to the end of the array
      localStorage?.setItem("droppedImages", JSON.stringify(droppedImages));
      return newStoreOptions;
    });
  };
  // clearing the dropPieces option
  const deleteApi = async () => {
    alert("This will clear the board");
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
            dropPieces: [],
          }),
        }
      );
      const res = await response.json();
      console.log("PUT", res);
      if (res.status === 200 || res.status === true) {
        showPopUp(); // Display the popup if the data is successfully stored
      }
      const dropPieces = res.data.dropPieces;
      localStorage?.setItem("dropPieces", JSON.stringify(dropPieces));
      setStoreOptions(dropPieces);
      setSelectedSquare("");
      setOptions(0);
      await getApi();
    } catch (error) {
      console.log(error);
    }
  };
  // update the drop pieces

  const updatePieceDrop = async () => {
    if (isEmpty(storeOptions)) {
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
              dropPieces: storeOptions.map((option) => ({
                optionNumber: option.optionNumber,
                imageName: option.imageName,
                isChecked: option.isChecked,
                location: option.location,
              })),
              board: {},
              pieceMove: [],
            }),
          }
        );
        const res = await response.json();
        console.log("PUT", res);
        if (res.status === 200 || res.status === true) {
          showPopUp(); // Display the popup if the data is successfully stored
        }

        const dropPieces = res.data.dropPieces;
        localStorage?.setItem("dropPieces", JSON.stringify(dropPieces));
        setStoreOptions(dropPieces);
      } catch (error) {
        console.log(error);
      }
    }
  };
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
      const data = await response.json();
      console.log("dp", data);
      const fenString = data?.data?.position[0]?.fenString;
      console.log("fen", fenString);
      setFenString(fenString);
      const dropPieces = data?.data?.dropPieces;
      setStoreOptions(dropPieces);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log("storeOptions", storeOptions);
  }, [storeOptions]);
  useEffect(() => {
    getApi();
  }, []);
  const showPopUp = () => {
    setPopUp(true);
    setTimeout(() => {
      setPopUp(false);
    }, 3000); // Hide the popup after 3 seconds (3000 milliseconds)
  };
  async function saveOption() {
    await updatePieceDrop();
    await getApi();
  }
  async function removeTheOption(e: any, option: Option) {
    setStoreOptions((prevStoreOptions) => {
      let updatedOptions = prevStoreOptions.filter(
        (opt) => opt.optionNumber !== option.optionNumber
      );

      updatedOptions = updatedOptions.map((opt, index) => {
        return { ...opt, optionNumber: index + 1 };
      });

      // Also update droppedImages
      setDroppedImages((prevDroppedImages) => {
        let updatedDroppedImages = prevDroppedImages.filter(
          (img, index) => index + 1 !== option.optionNumber
        );

        // If you also want to re-order droppedImages, you can do so here
        updatedDroppedImages = updatedDroppedImages.map((img, index) => {
          return { ...img, optionNumber: index + 1 };
        });

        localStorage?.setItem(
          "droppedImages",
          JSON.stringify(updatedDroppedImages)
        );

        return updatedDroppedImages;
      });

      removedOptionsApi(updatedOptions);

      return updatedOptions;
    });
  }

  async function removedOptionsApi(updatedOptions: Option[]) {
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
            dropPieces: updatedOptions,
          }),
        }
      );
      const res = await response.json();
      console.log("PUT", res);
      const dropPieces = res.data.dropPieces;
      localStorage?.setItem("dropPieces", JSON.stringify(dropPieces));
      setStoreOptions(dropPieces);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex" id="dropPagePreview">
      <div className="mx-3">
        <Chessboard fen={fenString} />
      </div>
      <div>
        <center className="grid grid-cols-6 border border-1 border-gray-500">
          {ChessElements.map((image) => (
            <div className="m-3" key={image.id}>
              <Image
                priority
                src={image?.src}
                alt={image?.name}
                onDragStart={(event: any) => handleDragStart(event, image)}
                height={image?.src?.height}
                width={image?.src?.width}
              />
            </div>
          ))}
        </center>
        <br />
        <div>
          <p className="font-semibold flex justify-center">
            Add Drop pieces and positions
          </p>
          <br />
          <div className="flex justify-center my-2">
            <button
              onClick={deleteApi}
              className="rounded-md bg-red-400 mx-2 px-3 py-1 text-white"
            >
              Delete All
            </button>
            <button
              onClick={addOption}
              type="button"
              className="bg-indigo-500 px-2 py-1 rounded-md text-white"
            >
              Add Options
            </button>
          </div>
        </div>
        <br />
        <div className="flex flex-col overflow-y-auto h-1/2 border border-1 border-gray-400">
          {storeOptions?.map((option: any, index: number) => (
            <div
              key={index}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, index)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={option?.isChecked}
                    onChange={(event) => handleCheckboxChange(event, index)}
                  />
                  <input
                    type="text"
                    className="border border-1 border-gray-500 py-1 px-2"
                    onChange={(event) => handleInputChange(event, index)}
                    // disabled={droppedImages[index].length === 0}
                    value={option?.location}
                  />
                </div>
                <div className="flex flex-row iterms-center justify-center">
                  <div className="border border-1 border-gray-500 h-[6rem] w-[6rem] p-4">
                    {
                      <Image
                        priority
                        height={100}
                        width={100}
                        src={`${option ? getChessImageSrc(option?.imageName) : ""
                          }`}
                        alt={`${option ? getChessImageSrc(option?.imageName) : ""
                          }`}
                      />
                    }
                  </div>
                  <div className="flex items-center">
                    <button
                      className="mx-2 text-white hover:scale-110 transition-transform duration-300 bg-indigo-500 py-2 px-3 rounded-xl"
                      onClick={saveOption}
                    >
                      save
                    </button>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={(e) => removeTheOption(e, option)}
                      className="bg-red-400 px-3 py-2 my-1 rounded-xl mx-2 text-white hover:scale-110 transition-transform duration-300"
                    >
                      <AiOutlineClose />
                    </button>
                  </div>
                  {popUp && (
                    <div>
                      <Alert severity="success">
                        Data is succesfully stored!
                      </Alert>
                    </div>
                  )}
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DropPage;
