package combination_service

import (
	"math"
	"testing"
)

// the series from the bug report: 0.325 appears once in the input, but the old
// search happily used it twice to reach the target
var reportedInput = []float64{
	0.109, 0.026, 0.0115, 0.065, 0.4995, 0.333, 0.065, 0.065, 0.13, 0.065, 0.13,
	0.205, 0.065, 0.065, 0.333, 0.333, 0.0975, 0.195, 0.065, 0.13, 0.325, 0.1125,
}

func TestGetCombinationResult(t *testing.T) {
	tests := []struct {
		name      string
		search    float64
		input     []float64
		wantFound bool
	}{
		{
			name:      "reported series",
			search:    1.425,
			input:     reportedInput,
			wantFound: true,
		},
		{
			name:      "reported series without a solution",
			search:    1.4251,
			input:     reportedInput,
			wantFound: false,
		},
		{
			name:      "example from the form",
			search:    100,
			input:     []float64{50, 50, 40, 20, 10, 5, 5, 45.5, 54.5, 20.33, 79.67, 22.11, 33.33, 44.56},
			wantFound: true,
		},
		{
			name:      "target only reachable by using a number twice",
			search:    6,
			input:     []float64{3, 10},
			wantFound: false,
		},
		{
			name:      "duplicate is available as often as it appears",
			search:    6,
			input:     []float64{3, 3, 10},
			wantFound: true,
		},
		{
			name:      "no combination adds up",
			search:    7,
			input:     []float64{2, 4, 8},
			wantFound: false,
		},
		{
			name:      "every number overshoots on its own",
			search:    1,
			input:     []float64{5, 5, 5},
			wantFound: false,
		},
		{
			name:      "single number",
			search:    5,
			input:     []float64{5},
			wantFound: false,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			result := GetCombinationResult(test.search, test.input)

			if found := len(result) > 0; found != test.wantFound {
				t.Fatalf("got %d series, want found=%v: %v", len(result), test.wantFound, result)
			}

			assertSeries(t, test.search, test.input, result)
		})
	}
}

// the search must never return the same series twice, no matter which number it
// started from
func TestGetCombinationResultHasNoDuplicate(t *testing.T) {
	result := GetCombinationResult(15, []float64{5, 5, 10, 20, 3, 7, 1})

	seen := map[string]bool{}
	for _, series := range result {
		key := getSeriesKey(series)
		if seen[key] {
			t.Errorf("series %v returned more than once", series)
		}
		seen[key] = true
	}
}

// cross check against an exhaustive subset enumeration, so a search that reports
// nothing really has nothing to report
func TestGetCombinationResultMatchesBruteForce(t *testing.T) {
	input := []float64{5, 5, 10, 20, 20, 3, 7, 1, 12, 8, 4, 6, 9, 11}

	for _, search := range []float64{1, 4, 13, 21, 25, 33, 47, 100, 121, 122} {
		result := GetCombinationResult(search, input)

		if found := len(result) > 0; found != bruteForceExists(input, search) {
			t.Errorf("search %v: got %d series, brute force says found=%v", search, len(result), !found)
		}

		assertSeries(t, search, input, result)
	}
}

// assertSeries checks every series adds up to search and takes no number more
// often than the input holds it
func assertSeries(t *testing.T, search float64, input []float64, result [][]float64) {
	t.Helper()

	for _, series := range result {
		available := map[float64]int{}
		for _, v := range input {
			available[v]++
		}

		sum := 0.0
		for _, v := range series {
			sum += v

			available[v]--
			if available[v] < 0 {
				t.Errorf("series %v uses %v more often than the input holds it", series, v)
				break
			}
		}

		if math.Abs(sum-search) > epsilon {
			t.Errorf("series %v adds up to %v, want %v", series, sum, search)
		}
	}
}

func bruteForceExists(input []float64, search float64) bool {
	for mask := 1; mask < 1<<len(input); mask++ {
		sum := 0.0
		count := 0

		for i := range input {
			if mask&(1<<i) != 0 {
				sum += input[i]
				count++
			}
		}

		// the search always builds on a starting number, so a lone match does not count
		if count >= 2 && math.Abs(sum-search) <= epsilon {
			return true
		}
	}

	return false
}
