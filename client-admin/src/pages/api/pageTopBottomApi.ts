import { API_BASE_URL } from "@/config";

let token: any = null;
if (typeof window !== "undefined") {
  token = localStorage?.getItem("token") || "null";
}
let selectedId: any = null;
if (typeof window !== "undefined") {
  selectedId = JSON.parse(localStorage?.getItem("selectedId") || "null");
}
export async function checkResponse(selectPageId: string) {
  try {
    const checkResponse = await fetch(
      `https://staging.api.playalvis.com/v1/bottomPagesection/${selectPageId}`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await checkResponse.json();
    const checkData = data.data;
    console.log("CheckData", checkData);
    return checkData;
  } catch (error) {
    console.log("error", error);
  }
}
export async function checkResponseTop(selectPageId: string) {
  try {
    const checkResponse = await fetch(
      `https://staging.api.playalvis.com/v1/topSectionPage/${selectPageId}`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await checkResponse.json();
    const checkData = data.data;
    console.log("CheckData", checkData);
    return checkData;
  } catch (error) {
    console.log("error", error);
  }
}
export const getUnitsApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/getunits`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log("get", data);
    return data;
  } catch (error) {
    alert(error);
  }
};
export const getChapterApi = async () => {
  try {
    const response = await fetch(
      `https://staging.api.playalvis.com/v1/getchapters?unitId=${selectedId}`,
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
    console.log("get", data);
    return data;
  } catch (error) {
    alert(error);
    console.log(error);
  }
};
