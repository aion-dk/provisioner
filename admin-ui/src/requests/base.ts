import axios, { AxiosResponse } from "axios";
import { Maybe } from "types";
export const API_URL_BASE =
  process.env.NEXT_PUBLIC_API_URL_BASE || "http://localhost:3009";

const USE_DEFAULT_RETURN = false;

interface optionalParamsType {
  headers?: object;
  defaultReturn?: Maybe<object>;
}

export const post = async (
  path: string,
  data: object = {},
  optionalParams: optionalParamsType = { headers: {} }
): Promise<any> => {
  const { headers, defaultReturn } = optionalParams;
  const url = `${API_URL_BASE}${path}`;
  let response: AxiosResponse;
  try {
    response = await axios.post(url, data, {
      //withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 46294A404E635266556A576E5A723475",
        "Access-Control-Allow-Origin": "*",
        ...headers,
      },
    });
  } catch (err: any) {
    console.error(err);
    console.error(err.response?.data?.detail);
    if (USE_DEFAULT_RETURN && defaultReturn) {
      return defaultReturn;
    } else {
      throw {
        errors: [err.response?.data?.detail],
      };
    }
  }
  if (response.status === 200) {
    return response.data as object;
  } else {
    console.error(response);
    if (USE_DEFAULT_RETURN && defaultReturn) {
      return defaultReturn;
    } else {
      throw response.statusText;
    }
  }
};

export const get = async (
  path: string,
  optionalParams: optionalParamsType = { headers: {} }
): Promise<any> => {
  const { headers, defaultReturn } = optionalParams;
  try {
    const url = `${API_URL_BASE}${path}`;
    const response = await axios.get(url, {
      //withCredentials: true,
      headers: {
        Authorization: "Bearer 46294A404E635266556A576E5A723475",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...headers,
      },
    });
    if (response.status === 500) {
      throw response.statusText;
    }
    return response.data as object;
  } catch (err) {
    console.error(err);
    if (USE_DEFAULT_RETURN && defaultReturn) {
      return defaultReturn;
    } else {
      throw err;
    }
  }
};

function readFileAsync(file: File) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsBinaryString(file);
  });
}

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// In MVP /provisionUpload also saves the file locally and serves it (acting as mock upload)
export const uploadFileNew = async (file: File, _fileName?: string) => {
  const { uploadUrl, fileName } = await post("/provisionUpload", {
    contentType: file.type,
    fileName: _fileName
  })

  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.put(uploadUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(res);

  return fileName;
};

export const unzipFile = async (
  key: string
) => {
  const resp = await post("/unzipProvisionedUpload", {
    key,
  });
  console.log(resp)
  return resp;
}

export const uploadFile = async (
  path: string,
  file: File,
  data: { [k: string]: any } = {},
  optionalParams: optionalParamsType = { headers: {} }
) => {
  // const formData = new FormData();
  // Object.keys(data).forEach((k) => {
  //   if (data[k]) {
  //     formData.append(k, data[k]);
  //   }
  // });
  // formData.append("file", file);
  // const response = await axios.put(uploadUrl, file, {
  //   headers: {
  //     "Content-Type": file.type,
  //   },
  // });
  // if (response) {
  //   return fileName;
  // }
  // const { defaultReturn, headers } = optionalParams;
  // return await post(path, formData, {
  //   headers: {
  //     ...headers,
  //     Authorization: "Bearer 46294A404E635266556A576E5A723475",
  //     "Content-Type": "multipart/form-data",
  //   },
  //   defaultReturn,
  // });

  // 2022-december-demo
  // const response = await axios.put(uploadUrl, file, {
  //   headers: {
  //     "Content-Type": file.type,
  //   },
  // });
  // if (response) {
  //   // start and wait for the unzip process
  //   await unzipFile(fileName);
  //   return fileName;
  // }

  // const { defaultReturn, headers } = optionalParams;
};

export interface SuccessResult {
  success: boolean;
}
