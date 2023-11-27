package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"GO-BACKEND/AllFiles/database"
	"GO-BACKEND/AllFiles/routes"
)

func main() {
	database.Connect()
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))
	routes.Routess(app)

	app.Listen(":8080")
}
