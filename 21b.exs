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

  # We accumulate number of wins as turn increases for each player.
  # We store only non-winning variants of their positions, scores, and universes number.
  # The game continues while variant set is non-empty.
  def init([pos1, pos2]) do
    %{key: :p1, wins: %{p1: 0, p2: 0}, vars: [%{p1: {pos1, 0}, p2: {pos2, 0}, num: 1}]}
  end

  def next_position({pos, score}, move) do
    pos = @min_pos + rem(pos + move - 1, @max_pos)
    {pos, score + pos}
  end

  def next_variant(:p1, %{p1: p1, p2: p2, num: num}, {move, outcomes}) do
    %{p1: next_position(p1, move), p2: p2, num: num * outcomes}
  end
  def next_variant(:p2, %{p1: p1, p2: p2, num: num}, {move, outcomes}) do
    %{p2: next_position(p2, move), p1: p1, num: num * outcomes}
  end

  def simulate_universe(key, var) do
    @outcomes
    |> Enum.map(&Main.next_variant(key, var, &1))
  end

  def winning_universe?(:p1, %{p1: {_, score}}), do: score >= @max_score
  def winning_universe?(:p2, %{p2: {_, score}}), do: score >= @max_score

  def simulate_universes(key, vars) do
    vars
    |> Enum.map(&Main.simulate_universe(key, &1))
    |> List.flatten
    |> Enum.split_with(&Main.winning_universe?(key, &1))
  end

  def count_wins(:p1, %{p1: pwins} = wins, vars), do: %{wins | p1: count_wins(pwins, vars)}
  def count_wins(:p2, %{p2: pwins} = wins, vars), do: %{wins | p2: count_wins(pwins, vars)}
  def count_wins(wins, vars) do
    wins + (vars |> Enum.map(fn %{num: num} -> num end) |> Enum.sum)
  end

  def turn(key, wins, vars) do
    {winning_vars, vars} = simulate_universes(key, vars)
    {count_wins(key, wins, winning_vars), vars}
  end

  def play(%{wins: %{p1: wins1, p2: wins2}, vars: vars}) when length(vars) == 0, do: winner_score(wins1, wins2)
  def play(%{key: key, wins: wins, vars: vars}) do
    {wins, vars} = turn(key, wins, vars)
    play(%{key: next_player(key), wins: wins, vars: vars})
  end

  def next_player(:p1), do: :p2
  def next_player(:p2), do: :p1

  def winner_score(wins1, wins2) when wins1 > wins2, do: wins1
  def winner_score(wins1, wins2) when wins2 > wins1, do: wins2

  def exec do
    File.read("./inputs/21.txt")
    |> elem(1)
    |> String.split("\n", trim: true)
    |> Enum.map(&Main.parse_line/1)
    |> init()
    |> play()
    |> IO.inspect
  end
end

Main.exec
