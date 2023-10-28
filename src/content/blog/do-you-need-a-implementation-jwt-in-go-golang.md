---
author: Muhammad Adam
pubDatetime: 2022-12-02T05:11:19Z
title: Do You Need A Implementation Jwt In Go (Golang)?
postSlug: do-you-need-a-implementation-jwt-in-go-golang
featured: false
draft: false
tags:
  - api
  - backend
  - authentication
  - jwt
description: JWT is a standard for creating JSON-based access tokens that can be used to authenticate users and applications in a microservices architecture.
---


## Do You Need A Implementation Jwt In Go (Golang)?

![](https://cdn-images-1.medium.com/max/2000/0*i2V-3hISf9coeGGI.png)

Go is becoming very popular for backend development, and JWT’s are one of the most popular ways to handle authentication on API requests. In this article, we are going to go over the basics of JWT’s and how to implement a secure authentication strategy in Go! Let’s go

## What is a JWT?
>  **JSON Web Token** (**JWT**, pronounced [/dʒɒt/](https://en.wikipedia.org/wiki/Help:IPA/English), same as the word “jot”[[1]](https://en.wikipedia.org/wiki/JSON_Web_Token#cite_note-rfc7519-1)) is a [proposed Internet standard](https://en.wikipedia.org/wiki/Internet_Standard#Proposed_Standard) for creating data with optional [signature](https://en.wikipedia.org/wiki/Signature_(cryptography)) and/or optional [encryption](https://en.wikipedia.org/wiki/Encryption) whose [payload](https://en.wikipedia.org/wiki/Payload_(computing)) holds [JSON](https://en.wikipedia.org/wiki/JSON) that asserts some number of [claims](https://en.wikipedia.org/wiki/Claims-based_identity). The tokens are signed either using a private secret or a [public/private key](https://en.wikipedia.org/wiki/Public-key_cryptography).

JWTs have essentially encoded JSON objects that have been signed by the server, proving their authenticity.

For example, when a user login into a website secured via JWTs, the flow should look something like this:

 1. The user sends a username and password to the server

 2. The server verifies username and password are correct

 3. The server creates a JSON object that looks like this: 
{“username”: “adam”}

 4. The server encodes and signs the JSON object, creating a JWT:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

 5. The user’s web client saves the JWT for later use

 6. When the user makes a request to a protected endpoint, the JWT is passed along in an HTTP header

 7. The server checks the signature on the JWT to make sure the JWT was originally created by the same server

 8. The server reads the claims and gives permission to the request to operate as “adam”

## **Create a JWT**

Before we create a JWT, we are going to use a library for dealing with JSON Web Token in go using [golang-jwt](https://github.com/golang-jwt/jwt). Make sure you have the code cloned in your local by running the below command :
```bash
    go get github.com/golang-jwt/jwt/v4
```
This implies that we presume the server that generates the JWTs will also be the sole server that verifies them.

First, define a struct that will be used to represent claims or identity for users data :

![](https://cdn-images-1.medium.com/max/2000/1*FLbx_OSz6KTJ0DKt305zRg.png)

The *jwt.StandardClaims* struct contains useful fields like *expiry, issuer name, Subject and etc*. Now we will create some actual claims for the user that just logged in :

![](https://cdn-images-1.medium.com/max/2000/1*zdzPyQXcCHoauLjoR5YgAQ.png)

After that, Create an unsigned token from the claims :
```bash
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
```
Sign the token using a secure private key. Make sure you use a real private key, preferably at least 256 bits in length:
```bash
    signedToken, err := token.SignedString([]byte(“secureSecretText”))
```
Now the signed token can be sent back to the client.

## Validating a JWT

When a client requests a secured endpoint, we may use the following steps to validate the JWT.

Note: To use the Authorization HTTP header is idiomatic:
```txt
    Authorization: Bearer {jwt}
```
After obtaining the JWT, use the same private key to validate the claims and verify the signature.
```go
    token, err := jwt.ParseWithClaims(
        jwtFromHeader,
        &customClaims{},
        func(token *jwt.Token) (interface{}, error) {
            return []byte("secureSecretText"), nil 
        },
    )
```
The err variable will not be null if the claims have been tampered with. Parse the following claims from the token:
```go
    claims, ok := token.Claims.(*customClaims)
    if !ok {
        return errors.New("Couldn't parse claims")
    }
```
Check if the token is expired:
```go
    if claims.ExpiresAt < time.Now().UTC().Unix() {
        return errors.New("JWT is expired")
    }
```
You now know the username of the authenticated user!
```go
    username := claims.Username
```
For full examples take a look at this [example](https://pkg.go.dev/github.com/golang-jwt/jwt#example-Parse-Hmac).

## Thanks For Reading!

Available for a new project! Let’s have a talk [bangadam.dev@gmail.com](mailto:bangadam.dev@gmail.com)
