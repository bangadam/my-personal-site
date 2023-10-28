---
author: Muhammad Adam
pubDatetime: 2023-04-02T05:00:00Z
title: Build gRPC with Go (golang) Server Streaming API
postSlug: build-grpc-with-go-golang-server-streaming-api
featured: false
draft: false
tags:
  - api
  - backend
  - golang
  - grpc
  - microservices
  - protobuf
  - streaming api
description: Previously, we discussed the gRPC Unary API, you can check it at this link. In this article, I’ll cover a gRPC call using Server Streaming response implementing client and server Go applications.
---

## Build gRPC with Go (golang): Server Streaming API

![](https://cdn-images-1.medium.com/max/2000/0*_zn-bCGBcyzb1J1s.png)

Previously, we discussed the gRPC Unary API, you can check it at this [link](https://bangadam-dev.medium.com/build-grpc-with-go-golang-unary-api-df6c6a38c30a?source=user_profile---------1-------------------------------). In this article, I’ll cover a gRPC call using Server Streaming response implementing client and server Go applications.

## What’s a Server Streaming API?

![](https://cdn-images-1.medium.com/max/2880/0*zTedrqEAZxUGh-Jr.png)

* Server Streaming RPC API is a new kind of API enabled thanks to [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2).

* The client will send one message to the server and will receive many responses from the server, possibly an infinite number.

* Streaming servers are well suited for :

* When the server needs to send a lot of data (big data)

* When the server needs to **PUSH **data to the client without having the client request for more (think live feed, chat, etc).

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
```go
syntax = "proto3"; 

package greet;
option go_package = "greet/greetpb";

// model
message Greeting {
    string first_name = 1;
    string last_name = 2;
}

// request
message GreetManyTimesRequest {
    Greeting greeting = 1;
}

// response
message GreetManyTimesResponse {
    string result = 1;
}

service GreetService{
    // server streaming
    rpc GreetManyTimes(GreetManyTimesRequest) returns (stream GreetManyTimesResponse) {}
}
view rawgreet.proto hosted with ❤ by GitHub
```

After creating the proton file, we will generate the file into a gRPC file using the command below:
```bash
    $ protoc greet/greetpb/greet.proto — go_out=plugins=grpc:.
```
when we run the command, the gRPC file will automatically be created as shown below:

![](https://cdn-images-1.medium.com/max/2000/0*SBiJ7ZAp5jEZn9Lq.png)

## Step 3: Create Server File

After we create the proton file, the next step is to create a server file which I put in the **greet_server/server.go** folder, here is the code for the server:
```go

package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"strconv"
	"time"

	"github.com/bangadam/grpc-go/greet/greetpb"
	"google.golang.org/grpc"
)

type server struct{}

func (*server) GreetManyTimes(req *greetpb.GreetManyTimesRequest, stream greetpb.GreetService_GreetManyTimesServer) error {
	fmt.Printf("GreetManyTimes function was invoked with %v\n", req)
	firstName := req.GetGreeting().GetFirstName()
	for i := 0; i < 10; i++ {
		result := "Hello " + firstName + " number " + strconv.Itoa(i)
		res := &greetpb.GreetManyTimesResponse{
			Result: result,
		}
		stream.Send(res)
		log.Printf("Sent: %v", res)

		time.Sleep(1000 * time.Millisecond)
	}

	return nil
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

As we saw above there is a main func that serves as the **main** function to run the gRPC server, in addition, there is a **GreetManyTimes** func that we define based on the name of the service in the prototype file.

## Step 4: Create Client File

After we have created the file server, the next step is that we will create a client file that functions as the client, we will create the file in the **greet_client/client.go** folder, here are the contents of the code:

```go

package main

import (
	"context"
	"fmt"
	"io"
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

	doServerStreaming(c)
}

func doServerStreaming(c greetpb.GreetServiceClient) {
	fmt.Println("Starting to do a Server Streaming RPC...")

	req := &greetpb.GreetManyTimesRequest{
		Greeting: &greetpb.Greeting{
			FirstName: "bangadam",
			LastName:  "s",
		},
	}

	resStream, err := c.GreetManyTimes(context.Background(), req)
	if err != nil {
		log.Fatalf("error while calling GreetManyTimes RPC: %v", err)
	}

	for {
		msg, err := resStream.Recv()
		if err == io.EOF {
			// we've reached the end of the stream
			break
		}

		if err != nil {
			log.Fatalf("error while reading stream: %v", err)
		}

		fmt.Printf("Response from GreetManyTimes: %v\n", msg.GetResult())
	}
}
```

Just like the file server, in this client, we also create a func **main** which is useful for running as the client-side while func **doServerStreaming** is useful for calling func **GreetManyTimes** from the server.

## Step 5: Run Server and Client

In the last step, we will try to run the two files, namely the server and client, the results will be like the image below:

![](https://cdn-images-1.medium.com/max/2244/1*TD8KhOeO_ikotgUuxyXl5w.gif)

## Conclusion

We have made one type of API using the gRPC concept, of course, there are many types of API that we haven’t implemented with the gRPC concept, you can see the complete code for this article on my [**GitHub account](https://github.com/bangadam/grpc-go)**, that’s all from me, don’t forget to claps and share this article if it’s useful for you.

## Thanks For Reading!

Available for a new project! Let’s have a talk :
Email: [bangadam.dev@gmail.com](mailto:bangadam.dev@gmail.com)
Linkedin: [https://www.linkedin.com/in/bangadam](https://www.linkedin.com/in/bangadam/)
