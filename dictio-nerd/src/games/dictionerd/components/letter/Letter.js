import React from "react";
import { Button } from "@mui/material";

export default function Letter(props) {
  return (
    <Button onClick={props.handleLetterPress} value={props.letter}>
      {props.letter}
    </Button>
  );
}
