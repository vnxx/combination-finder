package routes

import (
	"github.com/refiber/framework/router"

	"bykevin.work/tool/combination-finder/app"
	"bykevin.work/tool/combination-finder/app/controllers/web"
	"bykevin.work/tool/combination-finder/app/middleware"
)

func RegisterWeb(r router.RouterInterface, app *app.App) {
	m := middleware.Setup(app)
	controller := web.Setup(app)

	route := r.Group("/", m.SharedWeb)

	route.Get("/", controller.Index)
}
