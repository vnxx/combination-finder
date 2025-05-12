package api

import (
	"time"

	"bykevin.work/tool/combination-finder/app/service/combination_service"
	"github.com/gofiber/fiber/v2"
	support "github.com/refiber/framework/support"
)

func (api *apiController) Combination() *combinationController {
	return &combinationController{*api}
}

type combinationController struct{ apiController }

// TODO: better error handling and response

func (ctr *combinationController) Create(s support.Refiber, c *fiber.Ctx) error {
	type Input struct {
		Target  float64   `validate:"required,numeric" json:"target"`
		Numbers []float64 `validate:"required,min=1,dive,numeric" json:"numbers"`
	}
	input := new(Input)

	c.BodyParser(input)
	validation := s.Validation(c)
	if err := validation.Validate(input); err != nil {
		errorResult, err := validation.GetErrorResult()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Internal server error",
				"error":   err.Error(),
			})
		}

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Validation failed",
			"error":   errorResult,
		})
	}

	startTime := time.Now()
	result := combination_service.GetCombinationResult(input.Target, input.Numbers)
	executionTime := time.Since(startTime).Milliseconds()

	return c.JSON(fiber.Map{
		"message": "success",
		"data": fiber.Map{
			"executionTime": executionTime,
			"result":        result,
		},
	})
}
