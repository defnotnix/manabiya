import React from "react";

export interface PropQueryWrapper {
  //axios
  apiProvider: string;
  withCredentials?: boolean;
  timeout?: number;
  //react-query
  queryProps?: any;
  //
  children: React.ReactNode;
}
