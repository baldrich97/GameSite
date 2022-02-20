import { Container } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { Components } from "./components";
import { Row, Col } from "reactstrap";

export default function DictioNerd(props) {
  const [letters, shuffleLetters] = useState(generateLetters(10));
  const [word, updateWord] = useState("");
  const [words, saveWord] = useState([]);

  const validateWord = useCallback(async function (word) {
    const validPartsOfSpeech = [
      "adjective",
      "noun",
      "verb",
      "adverb",
      "pronoun",
    ];

    let returnable = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.title === "No Definitions Found") {
          return false;
        }
        let valid = false;
        json.forEach((item) => {
          item.meanings.forEach((meaning) => {
            if (validPartsOfSpeech.includes(meaning.partOfSpeech)) {
              valid = true;
            }
          });
        });
        return valid;
      });
    return returnable;
  }, []);

  const handleUserKeyPress = useCallback(
    async (event) => {
      const { keyCode } = event;
      let foundLetter = letters.find((letter) => letter.keyCode === keyCode);
      if (foundLetter) {
        updateWord((word) => word + foundLetter.letter);
      } else if (keyCode === 8) {
        if (event.ctrlKey) {
          updateWord("");
        } else {
          updateWord((word) => word.slice(0, word.length - 1));
        }
      } else if (keyCode === 13 && word !== "") {
        let valid = await validateWord(word);
        if (words.find((_word) => _word === word)) {
          //Error that word already exists.
        } else if (valid) {
          saveWord((words) => [...words, word]);
        }
        updateWord("");
      } else if (keyCode === 32) {
        shuffleLetters((letters) => [...shuffle(letters)]);
      }
    },
    [letters, validateWord, word, words]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  function generateLetters(length) {
    let chosenLetters = [];
    let consonants = [
      { letter: "B", keyCode: 66 },
      { letter: "C", keyCode: 67 },
      { letter: "D", keyCode: 68 },
      { letter: "F", keyCode: 70 },
      { letter: "G", keyCode: 71 },
      { letter: "H", keyCode: 72 },
      { letter: "J", keyCode: 74 },
      { letter: "K", keyCode: 75 },
      { letter: "L", keyCode: 76 },
      { letter: "M", keyCode: 77 },
      { letter: "N", keyCode: 78 },
      { letter: "P", keyCode: 80 },
      { letter: "Q", keyCode: 81 },
      { letter: "R", keyCode: 82 },
      { letter: "S", keyCode: 83 },
      { letter: "T", keyCode: 84 },
      { letter: "V", keyCode: 86 },
      { letter: "W", keyCode: 87 },
      { letter: "X", keyCode: 88 },
      { letter: "Z", keyCode: 90 },
    ];

    let vowels = [
      { letter: "A", keyCode: 65 },
      { letter: "E", keyCode: 69 },
      { letter: "I", keyCode: 73 },
      { letter: "O", keyCode: 79 },
      { letter: "U", keyCode: 85 },
      { letter: "Y", keyCode: 89 },
    ];

    //grab vowels, at least 2
    let vowelsLength = vowels.length;
    for (
      let index = 0;
      index < Math.floor(Math.random() * (vowelsLength - 3 + 1) + 3);
      index++
    ) {
      let randomInt = Math.floor(Math.random() * vowelsLength);
      let selectedLetter = vowels[randomInt];
      chosenLetters.push(selectedLetter);
      vowels.splice(randomInt, 1);
      vowelsLength--;
    }

    //populate rest with consonants
    let consonantsLength = consonants.length;
    let currentLength = chosenLetters.length;
    for (let index = 0; index < length - currentLength; index++) {
      let randomInt = Math.floor(Math.random() * consonantsLength);
      let selectedLetter = consonants[randomInt];
      chosenLetters.push(selectedLetter);
      consonants.splice(randomInt, 1);
      consonantsLength--;
    }

    return shuffle(chosenLetters);
  }

  function handleLetterPress(value) {
    updateWord(word + value);
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  return (
    <Container>
      <Row>
        <Col>
          <p>{word}</p>
          <Components.Keyboard
            letters={letters.map((item) => {
              return item.letter;
            })}
            handleLetterPress={handleLetterPress}
            key={letters}
          />
        </Col>
        <Col>
          {words.map((_word) => {
            return <p key={"Word_" + _word}>{_word}</p>;
          })}
        </Col>
      </Row>
    </Container>
  );
}
