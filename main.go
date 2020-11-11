package main

import (
	"github.com/gin-gonic/gin"
	gw "github.com/livoras/go-web-utilities"
	"log"
)

func main() {
	app := gin.New()
	app.GET("/", gw.Rest(func(c *gw.Context) {
		c.OK("OJBK")
	}))
	err := app.Run(":8080")
	if err != nil {
		log.Fatal(err)
	}
}
