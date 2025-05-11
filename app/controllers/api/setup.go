package api

import "bykevin.work/tool/combination-finder/app"

func Setup(app *app.App) *apiController {
	return &apiController{}
}

type apiController struct{}
