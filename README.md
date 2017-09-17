# What is Invarient?
Invarient is a system designed to help you brainstorm, plan, and communicate the structure of complex events or tasks.  Oftentimes it is difficult to connect large visions to the nitty gritty tasks that make them possible.  Either we get lost in abstraction, or we lack direction and end up being “busy” but not focusing our efforts effectively towards our goal.  Even when we do work towards goals, we often forget or lose sight of exactly what we want to see from completing those goals, and why we care to achieve them at all.

The system’s premise is simple.  We allow you to separate what you want from a goal from how you’ll achieve it, and we do it recursively. It turns out that you can visualize the structure of goals and tasks as a tree with the highest node being your ultimate goal, and the lowest nodes being the most actionable items, if you maintain the right invariants (rules about how the tree is formed). The type of connection between a node and the node above it determines whether it answers the question what, or how for the node above it.  

The essence of the system is that it allows us to connect the abstract to the tangible, reaching from the answer to the question why, to the answer to the question how, giving us the motivation, direction, and course of action to achieve even our biggest ideas.  

You can read more about the system here.
https://docs.google.com/document/d/1usStftdgOjQC3B79kf9zoBoXBhy6_Mf6qUp9FTjRlqc/edit#

# Usage
Go to [invarient.io/sandbox](invarient.io/sandbox) to try out the prototype.

Or, if you want to help us develop the app,

1. Clone or fork the repository
2. Create your own mongo style database and put its credentials in `.env`
2. `cd Invarient`
3. run `sudo node app.js`

If you get any errors, there may be an issue in how you formatted your database or how it linked up to the code running in `app.js`.  To troubleshoot, start at line 50.

# Credit
This project was made possible because of generous funding from the [Barger Leadership Institute](https://lsa.umich.edu/bli), [Ishaan Parikh](iparikh.co)'s course on [full stack node.js development](https://github.com/UMD-CS-STICs/389Kspring17) and [Sahat's Hackathon Starter](https://github.com/sahat/hackathon-starter).   [Kenneth Steele](kennethvsteele.com) designed the webapp interface and [Rex Sae Lim](https://www.linkedin.com/in/khanin-rex-sae-lim-546247109) designed the rest of the website.  [Matthew Baptist](https://github.com/mbaptist34) coded the webapp and [Alex Wilf](http://www-personal.umich.edu/~abwilf/) coded the server.  [Keenan Tullis](github.com/keenanjt33) implemented the designs of the webapp. 