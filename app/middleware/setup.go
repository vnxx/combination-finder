package middleware

import "bykevin.work/tool/combination-finder/app"

func Setup(app *app.App) *middleware {
	return &middleware{app: *app}
}

type middleware struct {
	app app.App
}
