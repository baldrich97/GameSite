import React from "react";
import Letter from "../letter/Letter";
import { ButtonGroup } from "@mui/material";

export default function Keyboard(props) {
  function handleLetterPress(event) {
    props.handleLetterPress(event.currentTarget.value);
  }

  return (
    <ButtonGroup>
      {props.letters.map((letter) => {
        return (
          <Letter
            letter={letter}
            key={"Letter_" + letter}
            handleLetterPress={handleLetterPress}
          />
        );
      })}
    </ButtonGroup>
  );
}
