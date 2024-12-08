# BSc (Honours) in Computing in Software Development

## Trigram Language Model Project

## Akeem Jokosenumi - G00366442

## Project Overview
The goal of this project is to construct and analyse a trigram-based model of the English language and  create a client-side version of the ELIZA chatbot and deploying it to GitHub Pages.. It was finished in the notebook trigrams.ipynb. Python's built-in library is used for all jobs; no third-party libraries or APIs are used. The notebook adheres to Python coding standards for readability and efficiency and offers concise code explanations in Markdown cells.


## Tasks
## Task 1 - Third-Order Letter Approximation Model

I used Project Gutenberg to process five English texts in order to create a trigram-based model for this assignment. The actions consist of:

Data preparation involves formatting everything in uppercase and removing all characters except for capital letters, spaces, and full stops.

Trigram counting is the process of counting instances of each three-character sequence (trigram) and arranging the counts in a dictionary format for easy access and retrieval.

Documentation: Markdown cells offer a thorough description of the data preparation, model design, and justification for every code step.

## Task 2 - Text Generation Using the Model

I used the trigram model from Task 1 to create a 10,000-character string for this task. Each character after "TH" is selected according to the weighted frequency of trigrams. The actions consist of:

Random Selection: Using trigram counts as weights to probabilistically select each next character.

Output and Analysis: Demonstrating the model’s ability to produce English-like text through statistical language modeling.


## Task 3 - Model Analysis
By counting the proportion of proper English terms in the produced text, this assignment assesses the model.

Procedure: Verifying created words against words.txt, a reference collection of English terms.

Result: Giving information about the model's accuracy in reproducing English text, as indicated by the percentage of English terms that were identified.

## Task 4 - Exporting the Model as JSON
To make the trigram model easier to read and distribute, I saved it as a JSON file (trigrams.json) for this task. Among them were:

The trigram model dictionary is converted to JSON format for data export.

File storage: Preserving the JSON file for later usage or additional analysis in an organised, deciphered state.

## Eliza Chatbot
The project involes me making a client side version of the eliza chabot I could only use Html, CSS and Javascript for this project. The chatbot is meant to simulate human conversations and give a response it is then deployed on Github Pages using Github Actions

### Repository Contents
trigrams.ipynb - Jupyter Notebook containing the code and explanations for all tasks.

trigrams.json - JSON file exporting the trigram model.

words.txt - List of valid English words for analysis in Task 3.

.gitignore - Specifies files and folders to ignore in version control.

eliza.js - This is where we get the process for eliza to simulae communcation with the user

Index.html - This is the basic layout of the Eliza UI the main page

Style.css - Is the styling page we use to customise the page

### Software Requirements
To get started with Jupyter Notebooks, install Anaconda, which includes Python and popular data science libraries. You’ll also need:

Python (recommended to install via Anaconda)

Jupyter Notebook

For Eliza it must run without and external API or libraries and also include a UI with a textbox for user input and a sidebar for the conversation history abs

## Instructions for Running the Project

Clone the Repository:

Open a terminal and navigate to a preferred folder.

Run the following commands:

git clone <repository_url>

cd <repository_folder>

### Open Jupyter Notebook:
Launch Jupyter Notebook by typing jupyter notebook in your terminal.

Open trigrams.ipynb in the Jupyter interface.

### Run the Notebook:
Select "Kernel" -> "Restart & Run All" to execute all code cells.
Outputs will appear under each code cell, with explanations in Markdown cells for reference.

## Expected Output
Each code cell will show its output when the notebook is performed, and Markdown cells will explain each task in detail. The notebook will display the 10,000-character text that was produced, in addition to analysis and model export.

