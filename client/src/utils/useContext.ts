import React from "react";

export const UtilsContext = React.createContext({
  handleAsync: (state: boolean) => {},
  handleToastList: (props: any) => {},
  handleSearchQuery: (query: string) => {}
});