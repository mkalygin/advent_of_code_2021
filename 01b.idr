-- Correct answer: 1311

module Main

import System.File
import Data.List
import Data.String

main : IO ()
main = do
  file <- readFile "inputs/01.txt"
  case file of
    Right input => printLn (findAnswer (parseInput input))
    Left error => printLn error
where
  parseInput : String -> List Int
  parseInput input = mapMaybe parseInteger (lines input)

  findAnswer : List Int -> Int
  findAnswer [] = 0
  findAnswer ([_]) = 0
  findAnswer ([_, _]) = 0
  findAnswer ([_, _, _]) = 0
  findAnswer (d1 :: d2 :: d3 :: d4 :: ds) = do
    ifThenElse (d4 > d1) (1 + findAnswer(d2 :: d3 :: d4 :: ds)) (findAnswer(d2 :: d3 :: d4 :: ds))
