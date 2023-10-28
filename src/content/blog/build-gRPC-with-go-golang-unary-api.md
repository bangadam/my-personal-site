---
author: Muhammad Adam
pubDatetime: 2023-02-02T05:00:00Z
title: Build gRPC with Go (golang) Unary API
postSlug: build-grpc-with-go-golang-unary-api
featured: false
draft: false
tags:
  - api
  - backend
  - golang
  - grpc
  - microservices
  - protobuf
description: gRPC is a modern open-source high-performance Remote Procedure Call (RPC) framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking, and authentication.
---

## Build gRPC with Go (golang): Unary API

![](https://cdn-images-1.medium.com/max/2000/0*nxhxPI_8WMH1vi3C.png)

## What is gRPC?

gRPC is a modern open-source high-performance Remote Procedure Call (RPC) framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking, and authentication. It is also applicable in the last mile of distributed computing to connect devices, mobile applications, and browsers to backend services.

There are 4 types of gRPC: unary, client-streaming, server-streaming, and bidirectional streaming. In this lecture, we will learn how to implement the simplest one: unary RPC.

## What’s a Unary API?

![](https://cdn-images-1.medium.com/max/2000/1*zqfM1wQUh5z_TlIosmZ0yQ.png)

* Unary RPC calls are the basic Request / Response that everyone is familiar with

* The client will send a message to the server and will receive one response from the server

* Unary RPC calls will be the most common for your APIs.

* Unary calls are very well suited when your data is small

* Start with Unary when writing APIs and use streaming API if performance is an issue

* in gRPC Unary Calls are defined using Protocol Buffers

* For each RPC call, we have to define a **Request **message and a **Response **message

## Step 1: Setup Project

the first step is to install the protoc gen go library as a library that will help you create gRPC, run the command below:
```bash
    $ go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.26
    $ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1
```
After that update the PATH on your computer by running the command below:
```bash
    $ export PATH="$PATH:**$(**go env GOPATH**)**/bin"
```
## Step 2: Create Proto File

In the second step, of course, we will create the proto file, then we first define the contents of the request and response, then don’t forget to add the name of the service. You can see in the code below:

 ```proto
syntax = "proto3"; 

package greet;
option go_package = "greet/greetpb";

// model
message Greeting {
    string first_name = 1;
    string last_name = 2;
}

// request
message GreetRequest {
    Greeting greeting = 1;
}

// response
message GreetResponse {
    string result = 1;
}

service GreetService{
    // unary
    rpc Greet(GreetRequest) returns (GreetResponse) {}
}
view rawgreet.proto hosted with ❤ by GitHub
 ```

After creating the proton file, we will generate the file into a gRPC file using the command below:
```bash
    $ protoc greet/greetpb/greet.proto — go_out=plugins=grpc:.
```
when we run the command, the gRPC file will automatically be created as shown below:

![](https://cdn-images-1.medium.com/max/2000/1*cHhcwFTFyABeFN932RqZ_Q.png)

## Step 3: Create Server File

Setelah kita membuat file protonya langkah berikutnya adalah membuat file server yang aku taruh di dalam folder **greet_server/server.go ,** berikut adalah code untuk servernya :
```go
package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"github.com/bangadam/grpc-go/greet/greetpb"
	"google.golang.org/grpc"
)

type server struct{}

func (*server) Greet(ctx context.Context, req *greetpb.GreetRequest) (*greetpb.GreetResponse, error) {
	fmt.Printf("Greet function was invoked with %v\n", req)
	firstName := req.GetGreeting().GetFirstName()
	result := "Hello " + firstName

	res := &greetpb.GreetResponse{
		Result: result,
	}

	return res, nil
}

func main() {
	listener, err := net.Listen("tcp", "0.0.0.0:50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	fmt.Print("Server started")
	s := grpc.NewServer()
	greetpb.RegisterGreetServiceServer(s, &server{})

	if err := s.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
```

As we saw above there is a main func that serves as the **main** function to run the gRPC server, in addition, there is a **Greet** func that we define based on the name of the service in the prototype file.

## Step 4: Create Client File

After we have created the file server, the next step is that we will create a client file that functions as the client, we will create the file in the **greet_client/client.go** folder, here are the contents of the code:

 ```go
package main

import (
	"context"
	"fmt"
	"log"

	"github.com/bangadam/grpc-go/greet/greetpb"
	"google.golang.org/grpc"
)

func main() {
	cc, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("could not connect: %v", err)
	}
	defer cc.Close()

	c := greetpb.NewGreetServiceClient(cc)

	doUnary(c)
}

func doUnary(c greetpb.GreetServiceClient) {
	fmt.Println("Starting to do a Unary RPC...")
	req := &greetpb.GreetRequest{
		Greeting: &greetpb.Greeting{
			FirstName: "Bangadam",
			LastName:  "Som",
		},
	}

	res, err := c.Greet(context.Background(), req)
	if err != nil {
		log.Fatalf("error while calling Greet RPC: %v", err)
	}

	fmt.Printf("Response from Greet: %v", res.Result)
}
 ```

Just like the file server, in this client, we also create a func **main** which is useful for running as the client-side while func **doUnary** is useful for calling func **Greet** from the server.

## Step 5: Run Server and Client

The last step we will try to run the two files, namely the server and client, the results will be like the image below:

![](https://cdn-images-1.medium.com/max/2000/1*9DWkEP1Jo8J5qr_zt27dBg.gif)

## Conclusion

We have made one type of API using the gRPC concept, of course, there are many types of API that we haven’t implemented with the gRPC concept, you can see the complete code for this article on my [**GitHub account](https://github.com/bangadam/grpc-go)**, that’s all from me, don’t forget to claps and share this article if it’s useful for you.

## Thanks For Reading!

Available for a new project! Let’s have a talk :
Upwork Profile: [https://www.upwork.com/freelancers/~013b91ad78555b9402](https://www.upwork.com/freelancers/~013b91ad78555b9402)
Linkedin: [https://www.linkedin.com/in/bangadam](https://www.linkedin.com/in/bangadam/)
