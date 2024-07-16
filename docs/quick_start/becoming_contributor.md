# Becoming a Contributor
Open source projects live and die on the contributions of users like you! If you are interested in being a part of the development here are a few ways to get involved. 

### Contact Us!  
You can email Michael Pham at mlpham@cpp.edu. 

## How to use GitHub
!!! Tip "First Time Using GitHub?"
    If this is your first time using GitHub, we highly recommend checking out the [GitHub Skills Page](https://skills.github.com)

GitHub is our preferred method of version control. Once you've been added to (or have forked) one of our repositories the procedure for making contributions is pretty straightforward! 

1. **Step 1:** Check into your new branch. 
2. **Step 2:** Edit the files on your branch with whatever new contributions you would like to make! 
3. **Step 3:** Use commits like a manual "save" button. Whenever you are making a change that you think needs a quicksave point make a new commit! 
4. **Step 4:** When you're done making new contributions make a pull request back to the main branch of the repository! One of the responsible engineers for that repo will then review the request to make sure everything looks good, and if it is ready to rock and roll they will merge it. 

### Fork a Repo and Make Pull Requests
!!! Tip 
    More instructions coming soon! 

## Versioning System 
Whenever a change is made and shipped to our hardware or software we should change the version number so people can quickly differentiate what version they are using. 

### Software Versioning 
TBD! 

### Hardware Versioning 
For major changes in hardware we denote each unique version a full version number iteration. As an example, going from ```V1``` to ```V2``` to ```V3```. A full version iteration *must be reviewed* before it is considered official on the main branch. 

These are examples of changes that might be considered a major change:

- Adding an entirely new component (i.e. addition of an I2C multiplexer)
- Eliminating an entire component (i.e. removing an I2C multiplexer)
- Redoing the layout of more than 50% of a board 
- A fundemental change of the functionality of a board requiring a software rewrite

For minor changes in hardware we denote each unique version by appending a letter to each unique version. As an example, going from ```V3``` to ```V3a``` to ```V3c```. These changes can be committed without review as long as it does not override existing versions of the same number. 

These are examples of changes that might be considered a minor change: 

- Moving a component from one side of a board to another 
- Adding or removing interfaces (connectors, breakouts, etc.)
- Changing part numbers of passive components (resistors, capacitors, etc.)
- Adding or removing passive components as long as intended functionality and performance stays approximately the same. 

#### Hotfixes 
We're not really sure how to handle hot fixes yet. An example of a hotfix would be something minor that is done to correct an issue on a board, but is not big enough to warrent pushing a whole new version. 

### Development Hardware Recommendations


