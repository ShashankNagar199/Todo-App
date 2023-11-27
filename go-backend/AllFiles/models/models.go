package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"password"`
}

type Note struct {
	Id          primitive.ObjectID `json:"id"`
	Task        string             `json:"task"`
	Description string             `json:"description"`
	Date        string              `json:"date"`  
	Status      bool               `json:"status"`
	UserEmail   string             `json:"useremail"`
}
