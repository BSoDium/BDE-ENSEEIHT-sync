# BDE-ENSEEIHT-sync
A simple Google Apps script that synchronizes ENSEEIHT's BDE events with Google calendar, so you don't miss out any more afterwork parties because you forgot to check the website on time. The script will also notify you by sending an email when a new event is published.

## Installation
- Open the [Google Apps Script](https://script.google.com/d/1bh3OuTim7n_OiK82J_7WL4XKahliSL1DXA2DduQK7zfBJHIvFitgQQg6/edit?usp=sharing) project
- Go to the `overview` tab
- Fork the project (click the `Make a copy` button, in the top right corner)
- Tweak the settings in the file `Settings.gs` (change the userEmail and the userName)
- Open `Code.gs`, select the function `install` in the top bar, and click on `▶️ Run`
- Click on `Review permissions` in the `Authorization required` popup
- Select your google account in the list that appears
- You should get a "Google hasn't verified this app" warning, just ignore it by clicking on `Advanced`
- Click on `Go to {Your copy's name} (unsafe)`
- Click on Allow
- You should be good to go !
