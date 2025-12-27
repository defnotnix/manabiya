import { ReactNode } from "react";

export type PropListHandler = {
  getRecords: (apiProps: any) => Promise<any>;
  getParams?: any;
  dataKey?: string;
  //module
  endpoint?: string;
  moduleKey?: string[];
  //search
  transformOnGet?: (data: any) => any;
  enableServerSearch?: boolean;
  enableServerPagination?: boolean;
  //(children
  children: ReactNode;
};
