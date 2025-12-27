"use client";

import axios from "axios";

async function handleTokenExpiry() {
  const refreshToken = sessionStorage.getItem("kcrtoken");

  if (!refreshToken) {
    console.error("No refresh token available");
    return false;
  }

  try {
    const response = await axios.post("/api/auth/token/refresh/", {
      refresh: refreshToken
    });

    if (response.data.access) {
      sessionStorage.setItem("kcatoken", response.data.access);
      console.log("Token refreshed successfully");
      return true;
    }

    return false;
  } catch (err) {
    console.error("Token refresh failed:", err);
    return false;
  }
}

function triggerLogout(res: any) {
  // Clear tokens
  sessionStorage.removeItem("kcatoken");
  sessionStorage.removeItem("kcrtoken");

  // Trigger navigation to login page
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export async function get({
  endpoint = "",
  params = {},
}: {
  endpoint: string;
  params?: any;
}) {
  try {
    const response = await axios.get(endpoint, {
      params,

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("kcatoken"),
      },
    });

    return {
      err: false,
      data: response.data,
    };
  } catch (error: any) {
    let err: any = new Error("Error");

    if (error?.response?.data?.message == "Token Expired") {
      const res = await handleTokenExpiry();

      if (res) {
        return await get({ endpoint, params });
      } else {
        triggerLogout(res);
        return {
          err: true,
          data: null,
        };
      }
    } else {
      if (error?.code == "ERR_NETWORK") {
        console.log("Server Offline");
        return {
          err: true,
          data: null,
        };
      } else {
        err.object = error;
        return {
          err: true,
          data: null,
        };
      }
    }
  }
}

export async function post({
  endpoint = "",
  body,
  headers,
}: {
  endpoint: string;
  body: any;
  headers?: any;
}) {
  try {
    const response = await axios.post(endpoint, body, {
      headers: {
        ...headers,
        Authorization: "Bearer " + sessionStorage.getItem("kcatoken"),
      },
    });
    console.log(response);

    return {
      err: false,
      data: response.data,
    };
  } catch (error: any) {
    let err: any = new Error("Error");

    if (error?.response?.data?.message == "Token Expired") {
      const res = await handleTokenExpiry();

      if (res) {
        return await post({ endpoint, body, headers });
      } else {
        triggerLogout(res);
        return {
          err: true,
          data: null,
        };
      }
    } else {
      err.object = error;
      return {
        err: true,
        data: null,
      };
    }
  }
}

export async function patch({
  endpoint = "",
  body,
  headers,
}: {
  endpoint: string;
  body: any;
  headers?: any;
}) {
  try {
    const response = await axios.patch(endpoint, body, {
      headers: {
        ...headers,
        Authorization: "Bearer " + sessionStorage.getItem("kcatoken"),
      },
    });
    return {
      err: false,
      data: response.data,
    };
  } catch (error: any) {
    let err: any = new Error("Error");

    if (error?.response?.data?.message == "Token Expired") {
      const res = await handleTokenExpiry();

      if (res) {
        return await patch({ endpoint, body, headers });
      } else {
        triggerLogout(res);
        return {
          err: true,
          data: null,
        };
      }
    } else {
      err.object = error;
      return {
        err: true,
        data: null,
      };
    }
  }
}

export async function del({
  endpoint = "",
  id,
  headers,
}: {
  endpoint: string;
  headers?: any;
  id: string;
}) {
  try {
    const response = await axios.delete(endpoint + id + "/", {
      headers: {
        ...headers,
        Authorization: "Bearer " + sessionStorage.getItem("kcatoken"),
      },
    });
    return {
      err: false,
      data: response.data,
    };
  } catch (error: any) {
    let err: any = new Error("Error");

    if (error?.response?.data?.message == "Token Expired") {
      const res = await handleTokenExpiry();

      if (res) {
        return await del({ endpoint, id, headers });
      } else {
        triggerLogout(res);
        return {
          err: true,
          data: null,
        };
      }
    } else {
      err.object = error;
      return {
        err: true,
        data: null,
      };
    }
  }
}

export async function login({
  endpoint = "",
  body,
}: {
  endpoint: string;
  body: any;
}) {
  return post({
    endpoint,
    body,
    headers: {
      withCredentials: true,
    },
  });
}
