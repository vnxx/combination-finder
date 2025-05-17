package combination_service

import (
	"sort"
	"sync"

	"bykevin.work/tool/combination-finder/app/util"
)

func GetCombinationResult(search float64, input []float64) [][]float64 {
	sortedInput := make([]float64, len(input))
	copy(sortedInput, input)
	sort.Float64s(sortedInput)

	uniqueInput := util.GetSliceUnique(sortedInput)

	wg := sync.WaitGroup{}
	mu := sync.Mutex{}

	foundNumberSeries := [][]float64{}

	for indexToSkip, v := range uniqueInput {
		wg.Add(1)
		go func(v float64, indexToSkip int) {
			defer wg.Done()

			sum := v
			xDeret := []float64{v}
			found := false

			for pointer := range len(sortedInput) {
				if pointer == indexToSkip {
					continue
				}

				pointerValue := sortedInput[pointer]
				sumWithPointerValue := sum + pointerValue
				tempDeret := []float64{v, pointerValue}

				if sumWithPointerValue > search {
					continue
				} else if sumWithPointerValue == search {
					found = true
					xDeret = tempDeret
					break
				}

				wg2 := sync.WaitGroup{}

				for pointer2 := range len(sortedInput) {
					if pointer2 == pointer {
						continue
					}

					pointer2Value := sortedInput[pointer2]
					sumWithPointer2Value := sumWithPointerValue + pointer2Value
					tempDeret2 := []float64{v, pointerValue, pointer2Value}

					if sumWithPointer2Value > search {
						continue
					} else if sumWithPointer2Value == search {
						found = true
						xDeret = tempDeret2
						break
					}

					expandedTempDeret2 := tempDeret2
					expandedSumWithPointer2Value := sumWithPointer2Value

					wg2.Add(1)

					go func(pointer2 int, expandedTempDeret2 []float64, expandedSumWithPointer2Value float64) {
						defer wg2.Done()

						for pointer3 := range len(sortedInput) {
							if pointer3 == pointer2 {
								continue
							}

							pointer3Value := sortedInput[pointer3]

							expandedTempDeret2 = append(expandedTempDeret2, pointer3Value)
							expandedSumWithPointer2Value += pointer3Value

							if expandedSumWithPointer2Value > search {
								expandedTempDeret2 = tempDeret2
								expandedSumWithPointer2Value = sumWithPointer2Value
								continue
							} else if expandedSumWithPointer2Value == search {
								found = true
								xDeret = expandedTempDeret2
								break
							}
						}
					}(pointer2, expandedTempDeret2, expandedSumWithPointer2Value)
				}

				wg2.Wait()
			}

			if found {
				mu.Lock()
				foundNumberSeries = append(foundNumberSeries, xDeret)
				mu.Unlock()
			}
		}(v, indexToSkip)
	}

	wg.Wait()

	return foundNumberSeries
}
