
## TaskTracker

Glitch: https://a3-manasmehta18.glitch.me

TaskTracker is an online tool developed specifically for you to keep a list of things. Organize, track and check of items from lists, whether it's a shopping list or a task list for your chores, and manage all of these lists in a personalized dashboard. Each user can have multiple boards and can sign in to them using their username and the name for the board anytime. Each board can have multiple lists (functionality not added - only a demo exists) Each list can have multiple tasks. You can edit the list name, add new tasks, delete tasks and edit the tasks. The tasks are shown as a list. It's useful to have all of your lists stored at the same place, and a possible tracking option (not implemented) can notify you when a task is due. It's also useful to divide up your lists into different boards to categorize and organize them.

## Challenges

Had a lot of issues setting up passport primarily due to lack of documentation
Same goes for express and some other middlewares that I decided not to include because o the lack of documentation
I could not implemnet O Auth since i am not storing usernames and passwords, instead i am storing usernames and board names so a user with one username cane have multiple boards and needs to authneticate to access each. This
is because of the way, my nested JSON object is set up on firebase. 

## Authentication
I used passport-local for authentication because of the reason I explained above where I couldnt use o auth because 
i am storing usernames and board names for a user, so a user with one username cane have multiple boards and needs to authneticate to access each. This
is because of the way, my nested JSON object is set up on firebase. 

## Database
I used firebase for the database because of the user friendly UI it has and the ease with which I can view the contents of the database without having to have a 
text file like lowdb and can delete contents right on the firebase. Also its a realtime database so I can see it update in real time. Also since it is cloud
based, it has a lot of storage and can be accessed by anyone who has been granted access to it. 

## CSS Framework

I used materialize because of its wide range of css and javascript components and the ease with which it can be included in the html files. It also looks
aesthetically very good.
  
 ## Express Middleware
 
 1. serve-static
 2. body-parser
 3. timeout
 4. passport
 5. helmet
 6. serve-favicon

## Technical Achievements
- **Tech Achievement 1**: Added toasts for every action that includes a button doing an action
- **Tech Achievement 2**: I used 6 middleware (one additional)
- **Tech Achievement 3**: added a panda favicon to each html page
- **Tech Achievement 4**: user authentication for each user and each board - extra encapsulation
- **Tech Achievement 5**: Data updates in real time when tasks are edited
- **Tech Achievement 6**: redirect to task.html doesnt work if user authentication fails 

### Design/Evaluation Achievements
- **Design Achievement 1**: Applied materialize to all of my previous css stylesheets
- **Design Achievement 2**: Edited elements to which I applied material design framework to better fit my hard coded template
- **Design Achievement 3**: Included icons using material icons
- **Design Achievement 3**: Button color changes on hover
