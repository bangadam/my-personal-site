---
author: Muhammad Adam
pubDatetime: 2023-06-02T05:00:00Z
title: Writing Unit Test in Golang Easily
postSlug: writing-unit-test-in-golang-easily
featured: false
draft: false
tags:
  - backend
  - golang
  - unit test
  - testing
description: Unit testing is the most important thing in developing an application, which aims to minimize the occurrence of errors, therefore software developers are obliged to master it. In this article, we will write unit tests in the Golang programming language using the unit testing package provided by Golang.
---

## writing unit test in golang easily

![](https://cdn-images-1.medium.com/max/2400/0*_WcCH-_9q9Jy92xy.jpeg)

Unit testing is the most important thing in developing an application, which aims to minimize the occurrence of errors, therefore software developers are obliged to master it. In this article, we will write unit tests in the Golang programming language using the unit testing package provided by Golang.

Let’s get started!

## What are Unit Tests?

> In [computer programming](https://en.wikipedia.org/wiki/Computer_programming), **unit testing **is a [software testing](https://en.wikipedia.org/wiki/Software_testing) method by which individual units of [source code](https://en.wikipedia.org/wiki/Source_code) — sets of one or more computer program [modules](https://en.wikipedia.org/wiki/Modular_programming) together with associated control data, usage [procedures](<https://en.wikipedia.org/wiki/Procedure_(computer_science)>), and operating procedures — are tested to determine whether they are fit for use

Developers use unit testing to validate individual functions, methods, modules, and packages. Unit testing aids in the discovery and elimination of issues early in the development cycle, as well as the prevention of regressions during refactoring. A decent unit test may also act as documentation for new developers on the project.

## Goals

In this article, it is hoped that readers will get an insight into how to do basic testing on the Golang programming language using the standard package, namely “**testing**”.

## Step 1: project structure

In a project belonging to someone else, surely you have encountered a file that has the prefix **\_test.go**, right? and always in the same directory as the main file to be tested. At this time we will first create the project structure as below:

```txt
    project/
     - main.go
     - main_test.go
```

don’t forget to run go mod init to initialize the project on Golang.

```bash
    $ go mod init
```

## Step 2: make simple func

We will create a simple function that we will test later, the name of the function is **Calculate()**. This **Calculate()** function has the aim of adding a number and adding 2, it’s quite easy isn’t it, let’s make the code as below:

```go

package main

import "fmt"

// calculate number + 2
func Calculate(x int) (result int) {
 result = x + 2
 return
}

func main() {
 fmt.Println("learn test in Golang")
}
```

## Step 3: Create a test file

after we create the **Calculate()** function, the next step is that we will create a test file for the function. Create a new file called **main_test.go** and put it in the same directory, follow the code below:

```go

package main

import (
   "testing"
)

func TestCalculate(t *testing.T) {
   if Calculate(2) != 4 {
       t.Error("Expected 2 + 2 to equal 4")
   }
}
```

## Step 4: Running Tests

After we have created the test file, it’s time for us to try to run the testing command by calling the go test command on the terminal or CMD, as below:

```bash
    $ go test
```

If the process is successful then the display of the test process will be as shown below:

![testing pass](https://cdn-images-1.medium.com/max/2000/1*DtjUV5cXq44-mIfutASvRA.png)

easy isn’t it? This is more or less how to make a test in the Golang programming language.

## Table Driven Testing

After we succeeded in creating a test file in the previous **Calculate()** function, there is actually another way to make the test code better and dynamic, namely by creating an array model. You can see an example of this code below:

```go

func TestTableCalculate(t *testing.T) {
    var tests = []struct {
        input    int
        expected int
    }{
        {2, 4},
        {-1, 1},
        {0, 2},
        {-5, -3},
        {99999, 100001},
    }

    for _, test := range tests {
        if output := Calculate(test.input); output != test.expected {
            t.Error("Test Failed: {} inputted, {} expected, recieved: {}", test.input, test.expected, output)
        }
    }
}
```

With the above code, we can declare the input and expected values ​​for each test case in the data array above. After you add it, try running the test one more time:

![testing pass](https://cdn-images-1.medium.com/max/2000/1*RJ6T5mChUOxo9UhWZ0dGBA.png)

## Conclusion

in this article, it can be concluded that writing unit tests is very important for the development process so that it can help carry out test code that has been made according to expectations or not, in the next stage maybe I will discuss code coverage on unit tests that we have made previously. If you need the source code above, just check my GitHub here [https://github.com/bangadam/go-test-introduction](https://github.com/bangadam/go-test-introduction)

## Thanks For Reading!

Available for a new project! Let’s have a talk :
Email: [bangadam.dev@gmail.com](mailto:bangadam.dev@gmail.com)
Linkedin: [https://www.linkedin.com/in/bangadam](https://www.linkedin.com/in/bangadam/)
