package combination_service

import (
	"math"
	"sort"
	"strconv"
	"strings"
	"sync"

	"bykevin.work/tool/combination-finder/app/util"
)

// tolerance for the rounding error that piles up while summing float64, so a
// series like 0.325 + 0.333 + 0.109 + 0.325 + 0.333 still matches a 1.425 target
const epsilon = 1e-9

func GetCombinationResult(search float64, input []float64) [][]float64 {
	sortedInput := make([]float64, len(input))
	copy(sortedInput, input)
	sort.Float64s(sortedInput)

	uniqueInput := util.GetSliceUnique(sortedInput)

	wg := sync.WaitGroup{}
	mu := sync.Mutex{}

	foundNumberSeries := [][]float64{}
	seen := map[string]bool{}

	for _, v := range uniqueInput {
		wg.Add(1)
		go func(v float64) {
			defer wg.Done()

			// a number can only be used as many times as it appears in the input,
			// so the index this series starts from is off limits for the rest of it
			pinnedIndex := sort.SearchFloat64s(sortedInput, v)

			deret := []float64{v}
			if !findSeries(search, v, 0, pinnedIndex, sortedInput, &deret) {
				return
			}

			key := getSeriesKey(deret)

			mu.Lock()
			defer mu.Unlock()

			// two starting numbers can walk into the very same series
			if seen[key] {
				return
			}

			seen[key] = true
			foundNumberSeries = append(foundNumberSeries, deret)
		}(v)
	}

	wg.Wait()

	return foundNumberSeries
}

// findSeries appends numbers of sortedInput[start:] to deret until it sums up to
// search, and stops on the first series that matches. Indexes are only ever taken
// in ascending order, so every combination is walked once and none is reused.
func findSeries(search, sum float64, start, pinnedIndex int, sortedInput []float64, deret *[]float64) bool {
	previousValue := math.NaN()

	for pointer := start; pointer < len(sortedInput); pointer++ {
		if pointer == pinnedIndex {
			continue
		}

		pointerValue := sortedInput[pointer]

		// duplicates of a value picked earlier on this step lead to the same series
		if pointerValue == previousValue {
			continue
		}
		previousValue = pointerValue

		nextSum := sum + pointerValue

		// sortedInput is ascending, so every number after this one overshoots too
		if nextSum > search+epsilon {
			break
		}

		*deret = append(*deret, pointerValue)

		if math.Abs(nextSum-search) <= epsilon {
			return true
		}

		if findSeries(search, nextSum, pointer+1, pinnedIndex, sortedInput, deret) {
			return true
		}

		*deret = (*deret)[:len(*deret)-1]
	}

	return false
}

func getSeriesKey(series []float64) string {
	sorted := make([]float64, len(series))
	copy(sorted, series)
	sort.Float64s(sorted)

	parts := make([]string, len(sorted))
	for i, v := range sorted {
		parts[i] = strconv.FormatFloat(v, 'f', -1, 64)
	}

	return strings.Join(parts, ",")
}
