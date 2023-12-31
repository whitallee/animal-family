# animal-family
#### Video Demo:  https://youtu.be/I6vz3OwNaw8
#### Description:

This website is live, you can visit it at:

https://animal-family-vercel.app

## How to use:
Once you've opened the link in your favorite browser, almost no functionality is available to you without being signed in. Go ahead and click sign in in the top left corner. Only Google OAuth sign-in is available right now.

### Navigation
The top left shows the email account that you are logged in with and a button to log out or log in.

The top right shows the 2 available pages for routing. My Animal Family is the home page that will show all the animals in your family with a delete button to the right of each animal if you are logged in and have added animals to your account. Add Animal allows you to add an animal to your account, which requires the name of your animal and the species. You do have an option to cancel adding the animal which will take you back to the home screen.

#### This project is a web app that runs on Next.js and is deployed on Vercel.
Lot's of the folder's you'll see in this directory were created by 'create-next-app'. I'll be going through all the files and design decisions that were my own.

## Next.js
Next.js is a React framework that handles a lot of built in features you may need in order to build your own website, such as API creation, routing, templating, data-fetching, and much more. I chose this framework to build in because it is one of the most popular and high-functioning tools that web developers and teams use to build websites today.

## Prisma
Prisma is an ORM that I used to make all of the database interactions a little bit easier.

In util/prisma-client.ts, I used a basic singleton pattern to ensure I dont create multiple instances of prisma while working in the develpment environment or once deployed.

Railway is a database hosting service that I used alongside Prisma to build out my API for adding animals to user account and deleting them. Editing the existing animals is a feature I intend to add soon.

## Next-Auth
Authentication is something that every website these days must have but it's one of the hardest things to implement safely and securely. It's recomended to use a trusted OAuth provider to handle all your credentials, so Next-Auth is a tool that works alongside Next.js and the Prisma ORM with an adapter to add users to my database with full session support. This made working with the API much easier as I needed to add data pertaining to one user at a time, and no one uses any shared data.

## App Router Pages and Components
The app router is one of the lates features in Next.js (13) which allows routing that is based on your file structure. Every folder in the app/ directory corresponds to a URL path name.

### app/layout.tsx
I followed a pretty standard layout with a couple of exceptions. I added a SessionProvider component to the body so the children of it can recieve the Server Session and perform functions accordingly. I also added the NavMenu component, which essentially just has the login and logout features as well as navigation to the available pages.

### app/page.tsx
This is the home page the renders inside the layout when you open the website. If you are logged out, it tells you that you need to be logged in. If you are logged in, it checks if you have no animals added, and tells you to add animals if you don't. if you are logged in and have animals it calls through prisma to fetch all the Animal objects connected to the user that is logged in and maps over each animal to create a list of all the animals with an option to delete the animal with the 'deleteAnimal' function.

### app/add-animal/page.tsx
This is the add animal page. It's a simple form that asks for the animal name and species. When submitted, it uses the new 'Server Action' from Next.js to create the animal on the user in the database. It redirects you to the homepage once it is added.

### app/api/auth.../route.ts
This is the typical route handler for Next Auth so that logging in is handled for you. I did add the prisma adapter as well, but most of the logic is abstraacted away.