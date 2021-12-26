# Correct answer: 190897246590017

defmodule Main do
  @max_score 21
  @min_pos 1
  @max_pos 10

  # 3 dice rolls, 3³ = 27 total outcomes.
  # 7 outcomes for a sum of these rolls: 3, 4, 5, 6, 7, 8, 9.
  @outcomes %{
    3 => 1,
    4 => 3,
    5 => 6,
    6 => 7,
    7 => 6,
    8 => 3,
    9 => 1
  }

  def parse_line(line) do
    Regex.replace(~r/.*:\s*/, line, "")
    |> Integer.parse
    |> elem(0)
  end

  def init([pos1, pos2]) do
    %{key: :p1, p1: {pos1, 0}, p2: {pos2, 0}}
  end

  def add({x1, y1}, {x2, y2}), do: {x1 + x2, y1 + y2}
  def prod({x, y}, n), do: {x * n, y * n}

  def next_position({pos, score}, move) do
    pos = @min_pos + rem(pos + move - 1, @max_pos)
    {pos, score + pos}
  end

  def play_universe(%{key: :p1, p1: p1, p2: p2}, {move, outcomes}) do
    play(%{key: :p2, p1: next_position(p1, move), p2: p2}) |> prod(outcomes)
  end
  def play_universe(%{key: :p2, p1: p1, p2: p2}, {move, outcomes}) do
    play(%{key: :p1, p1: p1, p2: next_position(p2, move)}) |> prod(outcomes)
  end

  def play(%{p1: {_, score1}}) when score1 >= @max_score, do: {1, 0}
  def play(%{p2: {_, score2}}) when score2 >= @max_score, do: {0, 1}
  def play(state) do
    @outcomes
    |> Enum.map(&Main.play_universe(state, &1))
    |> Enum.reduce({0, 0}, &Main.add/2)
  end

  def winner_score({wins1, wins2}) when wins1 > wins2, do: wins1
  def winner_score({wins1, wins2}) when wins2 > wins1, do: wins2

  def exec do
    File.read("./inputs/21.txt")
    |> elem(1)
    |> String.split("\n", trim: true)
    |> Enum.map(&Main.parse_line/1)
    |> init()
    |> play()
    |> winner_score()
    |> IO.inspect
  end
end

Main.exec
