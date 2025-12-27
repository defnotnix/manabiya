import { apiDispatch } from "@settle/core";

async function getRecords({
  endpoint,
  paginationProps = {},
  params = {},
}: {
  endpoint: string;
  paginationProps?: any;
  params?: any;
}): Promise<any> {
  const res: any = await apiDispatch.get({
    endpoint,
    params: {
      ...paginationProps,
      ...params,
    },
  });

  return res.err ? [] : res.data;
}

async function getSingleRecord({
  endpoint,
  id,
  params = {},
}: {
  endpoint: string;
  id: string | number;
  params?: any;
}): Promise<any> {
  const res: any = await apiDispatch.get({
    endpoint: `${endpoint}${id}/`,
    params,
  });

  return res.err ? null : res.data;
}

async function createRecord({
  endpoint,
  body,
  headers,
}: {
  endpoint: string;
  body: any;
  headers?: any;
}): Promise<any> {
  const res: any = await apiDispatch.post({
    endpoint,
    body,
    headers,
  });

  return res.err ? null : res.data;
}

async function editRecord({
  endpoint,
  id,
  body,
  headers,
}: {
  endpoint: string;
  id: string | number;
  body: any;
  headers?: any;
}): Promise<any> {
  const res: any = await apiDispatch.patch({
    endpoint: `${endpoint}${id}/`,
    body,
    headers,
  });

  return res.err ? null : res.data;
}

async function deleteRecord({
  endpoint,
  id,
  headers,
}: {
  endpoint: string;
  id: string | number;
  headers?: any;
}): Promise<any> {
  const res: any = await apiDispatch.del({
    endpoint,
    id: String(id),
    headers,
  });

  return res.err ? false : true;
}

async function createGroupRecords({
  endpoint,
  body,
  headers,
}: {
  endpoint: string;
  body: any[];
  headers?: any;
}): Promise<any> {
  const res: any = await apiDispatch.post({
    endpoint,
    body,
    headers,
  });

  return res.err ? [] : res.data;
}

export const moduleApiCall = {
  getRecords,
  getSingleRecord,
  createRecord,
  editRecord,
  deleteRecord,
  createGroupRecords,
};
