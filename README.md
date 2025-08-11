<pre>
███████╗  ██████╗ ██████╗ ███╗   ███╗███╗   ███╗███████╗██████╗  ██████╗███████╗
██╔════╝ ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██╔════╝██╔══██╗██╔════╝██╔════╝
█████╗██╗██║     ██║   ██║██╔████╔██║██╔████╔██║█████╗  ██████╔╝██║     █████╗
██╔══╝╚═╝██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██╔══╝  ██╔══██╗██║     ██╔══╝
███████╗ ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║███████╗██║  ██║╚██████╗███████╗
╚══════╝  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝
           ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗
           ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
           ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║
           ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║
           ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║
           ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝
</pre>
<h1 align="center"># E-commerceProject<br>3140 ACTIVE WEAR</h1>
Click the link to start:  
<a href="https://cunymeganlubin.github.io/E-commerceProject" target="_blank">https://cunymeganlubin.github.io/E-commerceProject</a>  

<b>Project Team Members:</b>  
<b>Usman Naveed</b> (<a href="https://github.com/Usman072003" target="_blank">Github</a>) - Project Architect - <a href="https://cunymeganlubin.github.io/E-commerceProject/Introductions/Usman/index.html" target="_blank">Introduction</a>  
<b>Megan Lubin</b> (<a href="https://github.com/CunyMeganLubin" target="_blank">Github</a>) - Developer - <a href="https://cunymeganlubin.github.io/E-commerceProject/Introductions/Megan/Megan_Lubin_Introduction.html" target="_blank">Introduction</a>  
<b>Suen Ming Kung</b> (<a href="https://github.com/nykenkung" target="_blank">Github</a>) - Designer/Researcher - <a href="https://cunymeganlubin.github.io/E-commerceProject/Introductions/Suen/Suen_Ming_Kung_Introduction.html" target="_blank">Introduction</a>  

This project is an e-commerce web application that features:

- A functional shopping cart system
- Secure user login and account management
- Member-exclusive discounts upon login
- A financing option similar to Affirm for eligible users

The goal is to create a seamless and user-friendly online shopping experience with features that reflect modern e-commerce platforms.  
We will upload a figma for a layout once we know the direction we want to go. 

<h3 align="center">Flow Chart:</h3>

<p align="center"><img width="353" height="615" src="https://github.com/user-attachments/assets/2144906d-2fcb-4e9c-af6e-df1dcfb51458" /></p>

<h3 align="center">Template:</h3>
<p align="center"><img width="2560" height="1404" src="https://github.com/user-attachments/assets/72858d94-aeaf-4882-8ba9-2f88431cdbfe" /></p>

<p align="center"><img width="800" height="445" src="https://github.com/user-attachments/assets/997d60a8-7358-40c4-9846-d606dfca9974" /></p>

<h3 align="center">Repository Structure:</h3>
<pre>
/E-commerceProject
│                            # Static HTML and configuration files
├── index.html               # Landing front page
├── shop.html                # Product detail page
├── donate.html              # Donate clothing page
├── contact.html             # Contact page
├── login.html               # Login/register/password recovery page
├── cart.html                # Shopping cart page
├── checkout.html            # Checkout page
│
├── README.md                # Readme file
├── .env                     # Important envirnment variables for backend including MongoDB server URL
├── package.json             # Node.js package configuration file for installation and start
├── eslint.config.mjs        # ESLint code analysis tool configuration file
│
├────── / Icons              # Logo designs folder
├────── / clothing           # Product images folder
│           
├──────┬── /CSS              # CSS Folder
│      └────── styles.css    # Global CSS
│           
├──────┬── /JS               # JS Folder
│      ├────── app.js        # Frontend JavaScript
│      ├────── script.js     # Products data
│      └────── server.js     # Entry point of Node.js backend server
│          
├──────┬── /server           # Live Chat folder
│      └────── server.js     # Live Chat JavaScript
│
└──────┬── /Introductions                            # Member introduction pages
       ├───┬── /Usman                                # Usman Folder
       │   └────── index.html                        # Usman Introduction
       ├───┬── /Megan                                # Megan Folder
       │   └────── Megan_Lubin_Introduction.html     # Megan Introduction
       └───┬── /Suen                                 # Suen Folder
           └────── Suen_Ming_Kung_Introduction.html  # Suen Introduction
</pre>
