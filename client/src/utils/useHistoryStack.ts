import { useEffect, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function useHistoryStack() {
  const [stack, setStack] = useState<string[]>([]);
  const [canGoForward, setCanGoForward] = useState(false);
  const { pathname } = useLocation();
  const type = useNavigationType();
  // TODO: fix can go forward
  console.log(stack, canGoForward)

  useEffect(() => {
    if (type === "POP") {
      setStack(prev => prev.slice(0, prev.length - 1));
      setCanGoForward(true);
    } else if (type === "PUSH") {
      setStack(prev => [...prev, pathname]);
      setCanGoForward(false);
    } else {
      setStack(prev => [...prev.slice(0, prev.length - 1), pathname]);
      setCanGoForward(false);
    }
  }, [pathname, type]);

  return { stack, canGoForward, setStack };
}