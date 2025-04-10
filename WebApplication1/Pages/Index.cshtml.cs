using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Linq;

public class IndexModel : PageModel
{
	public List<PuzzleDto> PuzzleDtos { get; set; }

	public void OnGet()
	{
		var puzzles = new List<Puzzle>
		{
            // Câu đố 4x4
            new Puzzle
			{
				Grid = new char[,] {
					{ 'L', 'I', 'O', 'N' },
					{ 'F', 'I', 'S', 'H' },
					{ 'W', 'O', 'L', 'F' },
					{ 'B', 'E', 'A', 'R' }
				},
				Words = new List<string> { "LION", "FISH", "WOLF", "BEAR" },
				Hints = new Dictionary<string, string>
				{
					{ "LION", "King of the jungle" },
					{ "FISH", "Live underwater" },
					{ "WOLF", "Howls at the moon" },
					{ "BEAR", "Loves honey" }
				}
			},
            // Câu đố 4x4
            new Puzzle
			{
				Grid = new char[,] {
					{ 'F', 'R', 'O', 'G' },
					{ 'D', 'E', 'E', 'R' },
					{ 'B', 'I', 'R', 'D' },
					{ 'W', 'O', 'L', 'F' }
				},
				Words = new List<string> { "FROG", "DEER", "BIRD", "WOLF" },
				Hints = new Dictionary<string, string>
				{
					{ "FROG", "Small and have rough skin" },
					{ "DEER", "Has antlers" },
					{ "BIRD", "Flies in the sky" },
					{ "WOLF", "Howls at the moon" }
				}
			},
            // Câu đố 3x3
            new Puzzle
			{
				Grid = new char[,] {
					{ 'C', 'A', 'T' },
					{ 'D', 'O', 'G' },
					{ 'F', 'O', 'X' }
				},
				Words = new List<string> { "CAT", "DOG", "FOX" },
				Hints = new Dictionary<string, string>
				{
					{ "CAT", "Meows and purrs" },
					{ "DOG", "Man's best friend" },
					{ "FOX", "Sly forest animal" }
				}
			},
            // Câu đố 3x3
            new Puzzle
			{
				Grid = new char[,] {
					{ 'B', 'I', 'G' },
					{ 'P', 'I', 'G' },
					{ 'R', 'A', 'T' }
				},
				Words = new List<string> { "BIG", "PIG", "RAT" },
				Hints = new Dictionary<string, string>
				{
					{ "BIG", "Opposite of small" },
					{ "PIG", "Loves to roll in mud" },
					{ "RAT", "Small rodent" }
				}
			}
		};

		// Đảo lộn các hàng trong ô chữ
		var random = new Random();
		foreach (var puzzle in puzzles)
		{
			int rows = puzzle.Grid.GetLength(0);
			int cols = puzzle.Grid.GetLength(1);
			var rowsList = new List<string>();

			// Lấy từng hàng dưới dạng chuỗi
			for (int i = 0; i < rows; i++)
			{
				var row = new char[cols];
				for (int j = 0; j < cols; j++)
				{
					row[j] = puzzle.Grid[i, j];
				}
				rowsList.Add(new string(row));
			}

			// Đảo lộn các hàng
			rowsList = rowsList.OrderBy(x => random.Next()).ToList();

			// Đặt lại ô chữ
			for (int i = 0; i < rows; i++)
			{
				for (int j = 0; j < cols; j++)
				{
					puzzle.Grid[i, j] = rowsList[i][j];
				}
			}
		}

		PuzzleDtos = puzzles.Select(p => new PuzzleDto
		{
			Grid = ConvertCharArrayToStringArray(p.Grid),
			Words = p.Words,
			Hints = p.Hints
		}).ToList();
	}

	private string[][] ConvertCharArrayToStringArray(char[,] charArray)
	{
		int rows = charArray.GetLength(0);
		int cols = charArray.GetLength(1);
		var stringArray = new string[rows][];

		for (int i = 0; i < rows; i++)
		{
			stringArray[i] = new string[cols];
			for (int j = 0; j < cols; j++)
			{
				stringArray[i][j] = charArray[i, j].ToString();
			}
		}

		return stringArray;
	}
}

public class Puzzle
{
	public char[,] Grid { get; set; }
	public List<string> Words { get; set; }
	public Dictionary<string, string> Hints { get; set; }
}

public class PuzzleDto
{
	public string[][] Grid { get; set; }
	public List<string> Words { get; set; }
	public Dictionary<string, string> Hints { get; set; }
}