package routes

import (
	"bykevin.work/tool/combination-finder/app"
	"bykevin.work/tool/combination-finder/app/controllers/api"
	"github.com/refiber/framework/router"
)

func RegisterAPI(r router.RouterInterface, app *app.App) {
	controller := api.Setup(app)

	v1 := r.Group("/api/v1")

	combination := controller.Combination()

	v1.Post("/combination", combination.Create)
}
