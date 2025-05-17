package util

func GetSliceUnique[T comparable](slice []T) []T {
	seen := make(map[T]bool)

	list := []T{}
	for _, entry := range slice {
		if _, value := seen[entry]; !value {
			seen[entry] = true
			list = append(list, entry)
		}
	}

	return list
}
