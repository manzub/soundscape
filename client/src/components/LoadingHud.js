import LoadingOverlay from "react-loading-overlay";
import { BounceLoader } from "react-spinners";

export default function LoadingHud({ active, children }) {
  return (
    <LoadingOverlay
      active={active}
      spinner={<BounceLoader />}
      text='Loading...'>
      {children}
    </LoadingOverlay>
  )
}