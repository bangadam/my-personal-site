---
author: Muhammad Adam
pubDatetime: 2023-01-02T05:00:00Z
title: How To Build Rest API Using Lumen 8
postSlug: how-to-build-rest-api-using-lumen-8
featured: false
draft: false
tags:
  - api
  - backend
  - lumen
  - php
  - laravel
description: JWT is a standard for creating JSON-based access tokens that can be used to authenticate users and applications in a microservices architecture.
---

## How to Build REST API using Lumen 8

![](https://cdn-images-1.medium.com/max/2000/0*Gx3fX8bRkjUaYkNe.png)

REST API is a mandatory skill that must be mastered by backend developers today, several well-known frameworks that help you develop it are Lumen. Lumen is a derivative project from Laravel that focuses on developing micro-frameworks, you could say this framework is smaller and faster. Therefore in this session, I will write for you how to create a REST API using the Lumen Framework.

## Installation Lumen

Before making a REST API of course we will first install lumen on local using composer, here is the command to install Lumen :

```bash
    composer create-project --prefer-dist laravel/lumen rest-api-lumen
```

after the installation process is complete, it will automatically create a new folder called **rest-api-lumen,** open the folder using your favorite text editor and then we will start configuring the project.

## Step 1 : Configuration

Open the .env file, find the following key and adjust it as below:

```env
    DB_CONNECTION=sqlite

    DB_HOST=

    DB_PORT=

    DB_DATABASE=storage/database.sqlite

    DB_USERNAME=

    DB_PASSWORD=

    CACHE_DRIVER=array

    QUEUE_DRIVER=database

    QUEUE_CONNECTION=sync
```

At this time we will use an **SQLite** database as a place to store data.

## Step 2: Database and Migrations

After the configuration process is complete, we will first create the table using migration, run the command below to create a new migration file:

```bash
    php artisan make:migration create_products_table
```

After that the new migration file is in the **database/migrations **folder, this time the example table that we will create is the product table which contains several attributes, namely name, price and description. follow the code below:

![](https://cdn-images-1.medium.com/max/2528/1*SFCB5fXvljC2Fxv6Hhu46Q.png)

Then follow the command below to run the process of creating the product table:

```bash
    php artisan migrate
```

## Step 3: Create Model

The next step we will create a model for the product table by creating a new file called **Product.php** in the **app/Models** folder and then following the code below:

![](https://cdn-images-1.medium.com/max/2000/1*fIhl1TEd4Kw5__RZlV5Czw.png)

Unlike laravel, our lumen framework must first configure when using Eloquent and Facades by opening the **bootstrap/app.php** file, then uncommenting the following code:

![](https://cdn-images-1.medium.com/max/2000/1*MXN1qsOmIyH4WUuoJzD2lw.png)

## Step 4: Create Controller

The next step we will create a new controller file called **ProductController.php**, put the file into the **app/Http/Controller** folder, then follow the code below:

![](https://cdn-images-1.medium.com/max/4624/1*VB-rlRxF1o6kcLKCZsjdEg.png)

## Step 5: Setup Routes

The next step we will customize the routes file, open the **web.php** file in the **routes** folder and follow the code below :

![](https://cdn-images-1.medium.com/max/3144/1*YF4Fkh2B26-gAbAYZKHwIg.png)

In the picture above we create a route url prefix with the name **api/v1** then we create another prefix group for our api **products**, after everything is done, it’s time for us to start testing the API to make sure it runs smoothly.

## Step 6: Testing API

Pada langkah terakhir ini kita akan mencoba api yang sudah kita buat sebelumnya, untuk test apinya aku memakai extensinon Thunder Client pada Visual Studi Code atau bisa memakai Postman, Sebelum test API kita jalankan terlebih dahulu lumen menggunakan perintah dibawah ini :

```bash
    php -S 0.0.0.0:8000 -t public/
```

kemudian bisa dilanjutkan untuk test APInya, berikut adalah hasil dari test API :

**GET All Products**

![](https://cdn-images-1.medium.com/max/2560/1*4VOMPc4weD3_1forF5C4Dg.png)

**Get Product By ID**

![](https://cdn-images-1.medium.com/max/2560/1*i7P8KuMHr8QCZMKSa5D_eQ.png)

**Create Product**

![](https://cdn-images-1.medium.com/max/2560/1*01LUO595N8EsvhkLOxZTwQ.png)

**Update Product**

![](https://cdn-images-1.medium.com/max/2560/1*itxi3qWP135ZPI1Wbe4f9g.png)

**Delete Product**

![](https://cdn-images-1.medium.com/max/2560/1*Y7QO6COD_VDHhgIHxKLYWw.png)

## Conclusion

We have been able to create a REST API for a product using the Lumen framework, of course, this is not enough because basically making a REST API requires other components such as Authorization, Rate Limiting, etc. You can see the source code of this article on my github [\*\*account](http://github.com/bangadam/rest-api-lumen),\*\* don’t forget to give a star and share this article if it is useful for you.

## Thanks For Reading!

Available for a new project! Let’s have a talk :
email : [bangadam.dev@gmail.com](mailto:bangadam.dev@gmail.com)
LinkedIn : [https://www.linkedin.com/in/bangadam](https://www.linkedin.com/in/bangadam/)
