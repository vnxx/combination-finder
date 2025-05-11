package web

import (
	"github.com/refiber/framework/inertia"

	"bykevin.work/tool/combination-finder/app"
)

func Setup(app *app.App) *webController {
	inertia := inertia.New(inertia.Config{
		App: app,
	})
	return &webController{inertia: inertia}
}

type webController struct {
	inertia inertia.InertiaInterface
}
