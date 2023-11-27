package routes

import (
	"github.com/gofiber/fiber/v2"
	"GO-BACKEND/AllFiles/controllers"
)

func Routess(app *fiber.App) {
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Get("/api/user", controllers.User)
	app.Get("/api/logout", controllers.Logout)
	app.Post("/api/notes", controllers.CreateTask)
	app.Get("/api/notes", controllers.DisplayTask)
	app.Get("/api/note/:id", controllers.GetByID)
	app.Get("/api/delete/:id", controllers.DeleteTask)
	app.Put("/api/notes/:id", controllers.UpdateTask)
	app.Put("/api/done/:id", controllers.DoneTask)
	app.Put("/api/undo/:id", controllers.UndoTask)
}
