import { API_BASE_URL } from "@/config";

// calling top, bottom, page api from this file
const token =
  typeof window !== "undefined"
    ? localStorage?.getItem("token") || "null"
    : null;
export async function getApi() {
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
    return data;
  } catch (error) {
    alert(error);
  }
}
export async function getUnitsWithUnitId(unitId: string) {
  console.log("unitID", unitId);
  try {
    const response = await fetch(`${API_BASE_URL}/v1/units/${unitId}`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const dataB = await response.json();
    console.log("dataB", dataB);
    const data = dataB.data;
    console.log("data api", data);
    return data;
  } catch (error) {
    alert(error);
  }
}
export async function getChapterApi(unitId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/getChaptersUnit/${unitId}`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const dataB = await response.json();
    const data = dataB.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getChPages(selectChapterId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/getChPages/${selectChapterId}`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const dataB = await response.json();
    const data = dataB.data;
    console.log("get", data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getBottomApi(nextPageId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/bottomPagesection/${nextPageId}`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const dataB = await response.json();
    const data = dataB.data;
    console.log("bottom", data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getTopApi(nextPageId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/topSectionPage/${nextPageId}`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const dataB = await response.json();
    const data = dataB.data;
    console.log("top", data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUnitChapterNames(id: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/page/${id}/unit-chapter/`,
      {
        mode: "cors",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const dataB = await response.json();
    const data = dataB.data;
    console.log("unitnames", data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getChapterPoints(selectChapterId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/chapterPoints/${selectChapterId}`,
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
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function getStudentApi(studentId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/student/${studentId}`, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const dataB = await response.json();
    const data = dataB.data;
    return data;
  } catch (error) {
    console.log("Error", error);
  }
}
