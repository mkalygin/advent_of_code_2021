# Correct answer: 908091

defmodule Main do
  @max_score 1000
  @min_roll 1
  @max_roll 100
  @min_pos 1
  @max_pos 10
  @rolls_num 3

  def parse_line(line) do
    Regex.replace(~r/.*:\s*/, line, "")
    |> Integer.parse
    |> elem(0)
  end

  def init_game([pos1, pos2]) do
    %{it: 0, p1: {pos1, 0}, p2: {pos2, 0}, roll: @min_roll}
  end

  def turn(p, {_, score}, roll, it) when score >= @max_score, do: {p, roll, it}
  def turn({pos, score}, _, roll, it) do
    dice = Stream.iterate(roll, &(@min_roll + rem(&1, @max_roll)))
    [r1, r2, r3, roll] = dice |> Enum.take(@rolls_num + 1)
    pos = @min_pos + rem(pos + r1 + r2 + r3 - 1, @max_pos)

    {{pos, score + pos}, roll, it + @rolls_num}
  end

  def play(%{p1: {_, score1}, p2: {_, score2}, it: it}) when score1 >= @max_score, do: it * score2
  def play(%{p1: {_, score1}, p2: {_, score2}, it: it}) when score2 >= @max_score, do: it * score1
  def play(%{p1: p1, p2: p2, roll: roll, it: it}) do
    {p1, roll, it} = turn(p1, p2, roll, it)
    {p2, roll, it} = turn(p2, p1, roll, it)

    play(%{p1: p1, p2: p2, roll: roll, it: it})
  end

  def exec do
    File.read("./inputs/21.txt")
    |> elem(1)
    |> String.split("\n", trim: true)
    |> Enum.map(&Main.parse_line/1)
    |> init_game()
    |> play()
    |> IO.inspect
  end
end

Main.exec
