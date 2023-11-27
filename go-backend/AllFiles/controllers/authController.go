package controllers

import (
	"context"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"time"
	"GO-BACKEND/AllFiles/database"
	"GO-BACKEND/AllFiles/models"
)

var userCollection *mongo.Collection = database.GetCollection(database.DB, "users")
var notesCollection *mongo.Collection = database.GetCollection(database.DB, "tasks")
var SecretKey = "Shashanknagar"

func Register(c *fiber.Ctx) error {
	fmt.Println("hello")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var user models.User
	defer cancel()

	
	
	newUser := models.User{

		Name:     user.Name,
		Email:    user.Email,
		Password: user.Password,
	}

	res, err := userCollection.InsertOne(ctx, newUser)
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not Register",
		})
	}
	
	//
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Success 😉",
	})
	//return c.JSON(newUser)
}

func Login(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var user models.User
	var foundUser models.User
	defer cancel()
	if err := c.BodyParser(&user); err != nil {
		return err
	}

	userCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&foundUser)
	defer cancel()
    fmt.Println(user) 

	if user.Email == "" || user.Email != foundUser.Email {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "user not found",
		})
	}
	if user.Password != foundUser.Password {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "incorrect password",
		})
	}

	defer cancel()
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    foundUser.Email,
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), //1 day
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(foundUser)
}

func User(c *fiber.Ctx) error {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var user models.User
	defer cancel()
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	userCollection.FindOne(ctx, bson.M{"email": claims.Issuer}).Decode(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func CreateTask(c *fiber.Ctx) error {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var note models.Note

	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)
	var userEmail = claims.Issuer

	if err := c.BodyParser(&note); err != nil {
		return err
	}
	notes := models.Note{
		Id:          primitive.NewObjectID(),
		Task:        note.Task,
		Description: note.Description,
		Date       : note.Date,
		UserEmail:   userEmail,
	}
	res, err := notesCollection.InsertOne(ctx, notes)
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not added",
		})
	}
	fmt.Println(res)
	return c.JSON(notes)
}

func DisplayTask(c *fiber.Ctx) error {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)
	var userEmail = claims.Issuer
	var note []models.Note
	cursor, err := notesCollection.Find(ctx, bson.M{"useremail": userEmail})
	if err = cursor.All(context.Background(), &note); err != nil {
		log.Fatal(err)
	}
	return c.JSON(note)
}

func GetByID(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	id := c.Params("id")
	objId, _ := primitive.ObjectIDFromHex(id)
	var note models.Note
	notesCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&note)
	return c.JSON(note)
}

func DeleteTask(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	id := c.Params("id")
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(id)

	result, err := notesCollection.DeleteOne(ctx, bson.M{"id": objId})
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Not Deleted",
		})
	}
	if result.DeletedCount < 1 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "Note not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Note deleted",
	})

}

func UpdateTask(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	id := c.Params("id")
	var note models.Note
	defer cancel()

	objId, _ := primitive.ObjectIDFromHex(id)

	//validate the request body
	if err := c.BodyParser(&note); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Note deleted",
		})
	}

	update := bson.M{"task": note.Task, "description": note.Description}

	result, err := notesCollection.UpdateOne(ctx, bson.M{"id": objId}, bson.M{"$set": update})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Note deleted",
		})
	}
	//get updated user details
	var updatedNote models.Note
	if result.MatchedCount == 1 {
		err := notesCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&updatedNote)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Note deleted",
			})
		}
	}

	return c.JSON(updatedNote)

}

func DoneTask(c *fiber.Ctx) error {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	id := c.Params("id")
	defer cancel()
	objId, _ := primitive.ObjectIDFromHex(id)

	update := bson.M{"status": true}

	result, err := notesCollection.UpdateOne(ctx, bson.M{"id": objId}, bson.M{"$set": update})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Note deleted",
		})
	}

	var updatedNote models.Note
	if result.MatchedCount == 1 {
		err := notesCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&updatedNote)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Note deleted",
			})
		}
	}

	return c.JSON(updatedNote)
}

func UndoTask(c *fiber.Ctx) error {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	id := c.Params("id")
	defer cancel()
	objId, _ := primitive.ObjectIDFromHex(id)

	update := bson.M{"status": false}

	result, err := notesCollection.UpdateOne(ctx, bson.M{"id": objId}, bson.M{"$set": update})

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Note deleted",
		})
	}

	var updatedNote models.Note
	if result.MatchedCount == 1 {
		err := notesCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&updatedNote)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Note deleted",
			})
		}
	}

	return c.JSON(updatedNote)
}
