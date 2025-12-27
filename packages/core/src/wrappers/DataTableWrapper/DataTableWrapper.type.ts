export type PropDataTablePaginationResponse = {
  pages: number;
  totalItems?: number;
  next?: String;
  previous?: string;
};

export type PropDataTableWrapper = {
  testMode?: boolean;
  //
  children: React.ReactNode;
  queryKey?: string;
  // aou
  queryGetFn: (queryProps: any) => Promise<any>;
  enableServerQuery?: boolean;
} & ( // If enableServerQuery is true, dataKey & paginationDataKey are required
  | {
      enableServerQuery: true;
      dataKey: string;
      paginationDataKey?: string;
      paginationResponseFn?: (paginationResponse: any) => void;
    }
  // Otherwise, they remain optional
  | {
      enableServerQuery?: false;
      dataKey?: string;
      paginationDataKey?: string;
      paginationResponseFn?: (response: any) => PropDataTablePaginationResponse;
    }
);
