import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const SuccessScreen = styled(Box)({
  textAlign: "center",
});

const SuccessMessage = styled(Typography)({
  marginTop: "50px",
  fontSize: "18px",
  color: "#007a00",
});

const Success = () => {
  return (
    <SuccessScreen>
      <SuccessMessage>
        Your face has been successfully registered!
      </SuccessMessage>
    </SuccessScreen>
  );
};

export default Success;
