import { Box, styled } from "@mui/material";
import { InfinitySpin } from "react-loader-spinner";

const MyCenteredBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

const Loader = () => {
  return (
    <MyCenteredBox>
      <InfinitySpin
        // visible={1}
        width="200"
        color="#070707"
        // ariaLabel="infinity-spin-loading"
      />
    </MyCenteredBox>
  );
};

export default Loader;
