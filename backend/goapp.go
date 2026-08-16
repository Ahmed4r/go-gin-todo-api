package main

import (
	"net/http"
	"strconv"
	"time"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()
	server.Use(cors.Default())
	server.POST("/addTodo", addToDo)
	server.DELETE("/deleteTodo/:id", deleteToDo)
	server.PATCH("/updateTodo/:id", updateToDo)
	server.GET("/getTodos", getTodos)

	server.Run()

}

type TodoModel struct {
	ID          int       `json:"ID"`
	Title       string    `json:"Title"`
	Description string    `json:"Description"`
	CreatedAt   time.Time `json:"CreatedAt"`
}
type TodoRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

var todoList = []TodoModel{}

func addToDo(c *gin.Context) {
	var req TodoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	newTodo := TodoModel{
		ID:          len(todoList) + 1,
		Title:       req.Title,
		Description: req.Description,
		CreatedAt:   time.Now(),
	}
	todoList = append(todoList, newTodo)
	c.JSON(http.StatusOK, gin.H{"message": "Todo added successfully", "todo": newTodo})
}
func deleteToDo(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid id",
		})
		return
	}

	for i, todo := range todoList {
		if id == todo.ID {

			todoList = append(todoList[:i], todoList[i+1:]...)

			c.JSON(http.StatusOK, gin.H{
				"message": "todo deleted successfully",
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{
		"error": "todo not found",
	})
}

func getTodos(c *gin.Context) {

	c.JSON(200, gin.H{
		"message": todoList,
	})

}
func updateToDo(c *gin.Context) {
    var req TodoRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }

    id, err := strconv.Atoi(c.Param("id"))

    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "invalid id",
        })
        return
    }

    for i, todo := range todoList {
        if id == todo.ID {

            if req.Title != "" {
                todoList[i].Title = req.Title
            }

            if req.Description != "" {
                todoList[i].Description = req.Description
            }

            c.JSON(http.StatusOK, gin.H{
                "message": "todo updated successfully",
                "todo":    todoList[i],
            })

            return
        }
    }

    c.JSON(http.StatusNotFound, gin.H{
        "error": "todo not found",
    })
}