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

### Click the link to start: <a href="https://cunymeganlubin.github.io/E-commerceProject" target="_blank">https://cunymeganlubin.github.io/E-commerceProject</a>
**Using MongoDB Atlas as database and deploy on Render.com to run on Node.js + Express back-end server**  
**MongoDB Atlas**: https://cloud.mongodb.com  
**Render.com**: https://dashboard.render.com

### Project Team Members
**Usman Naveed** (<a href="https://github.com/Usman072003" target="_blank">Github</a>) - Project Architect - <a href="https://cunymeganlubin.github.io/E-commerceProject/Introductions/Usman/index.html" target="_blank">Introduction</a>  
**Megan Lubin** (<a href="https://github.com/CunyMeganLubin" target="_blank">Github</a>) - Developer - <a href="https://cunymeganlubin.github.io/E-commerceProject/Introductions/Megan/Megan_Lubin_Introduction.html" target="_blank">Introduction</a>  
**Suen Ming Kung** (<a href="https://github.com/nykenkung" target="_blank">Github</a>) - Full-Stack Developer - <a href="https://cunymeganlubin.github.io/E-commerceProject/Introductions/Suen/Suen_Ming_Kung_Introduction.html" target="_blank">Introduction</a>  

This project is an e-commerce web application that features:

- A functional shopping cart system
- Secure user login and account management
- Member-exclusive discounts upon login
- A financing option similar to Affirm for eligible users

The goal is to create a seamless and user-friendly online shopping experience with features that reflect modern e-commerce platforms.  
We will upload a figma for a layout once we know the direction we want to go. 

### Flow Chart

<p align="center"><img width="353" height="615" src="https://github.com/user-attachments/assets/2144906d-2fcb-4e9c-af6e-df1dcfb51458" /></p>

<h3 align="center">Template:</h3>
<p align="center"><img width="2560" height="1404" src="https://github.com/user-attachments/assets/72858d94-aeaf-4882-8ba9-2f88431cdbfe" /></p>

<p align="center"><img width="800" height="445" src="https://github.com/user-attachments/assets/997d60a8-7358-40c4-9846-d606dfca9974" /></p>

<h3 align="center">Repository Structure:</h3>
<pre>
/E-commerceProject           # Static HTML and configuration files
│
├── index.html               # Landing front page
├── shop.html                # Product detail page
├── donate.html              # Donate clothing page
├── contact.html             # Contact us page
├── about.html               # About us page
├── login.html               # Login/register/password recovery page
├── cart.html                # Shopping cart page
├── checkout.html            # Checkout page
├── order.html				 # Order history page	
├── products.json            # All products data in JSON format
├── favicon.ico				 # Graphic icon associated with website to avoid 404 error messaage
├── README.md                # This readme file
│
├── .env                     # Important envirnment variables, you shall keep your own and do not commit 
├── .env.example			 # Shall change to ".env" to store your own envirnment variables like MongoDB server URL (Default MONGO_URI="mongodb://127.0.0.1:27017/E-commerceProject")
├── package.json             # Node.js package configuration file ready for deploy and start (Usage: npm install & npm start)
├── eslint.config.mjs        # ESLint code analysis tool configuration file (Usage: npx eslint --init & npx eslint)
├── .gitignore				 # Avoid to commit sensitive configuration, unnecessary files and folders you would not commit
│
├────── / Icons              # Logo designs folder
├────── / clothing           # Product images folder
│
├──────┬── /CSS              # CSS Folder
│      │
│      └────── style.css     # Global CSS
│
├──────┬── /JS               # JavaScript folder
│      │
│      ├────── api-config.js # Configuration file for Paypal, Google Pay, Apple Pay payment merchant setting, back-end API URL (Default apiBaseUrl: "https://127.0.0.1:3000/api")
│      ├────── app.js        # Front-end JavaScript on load of every pages
│      ├────── cart-core.js	 # Load on every page for header preview shopping cart and initial DOMContentLoaded event for fetching product lists in "products.json"
│      ├────── index.js		 # Loaded by index.html. Contains functions for slide show
│      ├────── login.js      # Loaded by login.html. Contains functions for register and login
│      ├────── donate.js	 # Loaded by donate.html. Contains functions for donation submission
│      ├────── shop.js       # Loaded by shop.html. Contains functions for fetching products list
│      ├────── cart.js       # Loaded by cart.html. Contains functions for fetching user shopping carts
│      ├────── checkout.js	 # Loaded by checkout.html. Contains functions for payment merchant validation and checkout process 
│      └────── order.js		 # Contains functions for fetching order history
│
├──────┬── /server           # Node.js back-end server folder
│      │
│      └────── server.js     # Entry point of Node.js back-end server
│
└──────┬── /Introductions                              # Members introduction folders
	   │
       ├───┬── /Usman                                  # Usman's files folder
       │   └────── index.html                          # Usman's introduction page
       ├───┬── /Megan                                  # Megan's files folder
       │   └────── Megan_Lubin_Introduction.html       # Megan's introduction page
       └───┬── /Suen                                   # Suen Ming's files folder
           └────── Suen_Ming_Kung_Introduction.html    # Suen Ming's introduction page
</pre>

### To run on local machine, first make sure that your computer has installed below softwares:
- **Git** (https://github.com/git-for-windows/git/releases/latest)
- **OpenSSL** (https://slproweb.com/products/Win32OpenSSL.html)
- **Node.js** (https://nodejs.org/en/download)
- **MongoDB** database server (https://github.com/mongodb/mongo)
- **MongoDB Shell/mongosh** (https://www.mongodb.com/try/download/shell)
- **Python+pip** (https://www.python.org/downloads/windows)

### 1) Git Clone project repository to local directory
```
git clone https://github.com/CunyMeganLubin/E-commerceProject.git
```
### 2) Locate to the workplace directory
```
cd /d C:\GitHub\E-commerceProject
```
### 3)  Generate the SSL certificate key files for local HTTPS (Make sure ***openssl.exe*** installed directory set to ***PATH*** variable)
```
openssl req -x509 -newkey rsa:4096 -nodes -keyout server.key -out server.cert
```
### 4) If there is no "***package.json***" existed, create by Node.js
```
npm init -y
```
### 5) Open the "***package.json***" file and add below lines for installing development dependencies
```
{
	"name": "E-commerceProject",
	"scripts": {
		"start": "node server/server.js",
		"dev": "nodemon server/server.js",
		"lint": "npx eslint"
	}
}
```
### 6) Install development and all required dependencies in directory of "***package.json***" located
Development dependencies installed with ```npm install --save-dev```
- **concurrently**: Runs multiple commands **simultaneously** (Usage: ```concurrently "server/server.js" "server/chat.js"```)
- **nodemon**: Restart automatically when files changed (Usage: ```nodemon server/server.js```)
- **eslint**: JavaScript static code analysis tool (Install: ```npx eslint --init``, usage: ```npx eslint```)
  
Required dependencies installed with 
- **express**: Express web server framework for Node.js
- **mongoose**: Connect to MongoDB server and model MongoDB object
- **bcryptjs**: **Hash and encrypt** passwords
- **cors**: **Middleware** to handle cross-origin requests
- **jsonwebtoken**: Create and verify **JSON Web Tokens** for **web authentication**
- **axios**: Promise-based HTTP client that simplifies making HTTP requests
- **dotenv**: Loads environment variables from ***.env*** file
- ~~**cookie-parser**: Middleware to parse cookies attached by client requests~~ (Switched from Cookies method to JSON Web Token for only token credential is used for web authentication.)
```
npm install
(Optional)
npm install --save-dev concurrently eslint nodemon
npx eslint --init
npm install express mongoose bcryptjs cors jsonwebtoken axios dotenv
```
### 7) To start the powerful static code analysis tool ***ESLint*** to check all JavaScript files on all folders and subfolders
```
npx eslint
```
### 8) To use ESLint properly, modify a line of configuration file "***eslint.config.mjs***" to add supporting of "required" and "env" in code
```
languageOptions: { globals: {...globals.browser, ...globals.node} } },
```
### 9) Run MongoDB database server in new Windows PowerShell in pretty JSON formatting output
```
start powershell -Command "<MongoDB installation directory>\bin\mongod.exe --dbpath=<MongoDB data directory>\db | ForEach-Object { try { ($_ | ConvertFrom-Json) | ConvertTo-Json } catch { $_ } }"
```
Or just string output by starting MongoDB service in Windows:
```
net start MongoDB
```
### 10) Connect to database by MongoDB Shell (mongosh)
```
mongosh mongodb://127.0.0.1:27017/E-commerceProject
```
### 11) To launch back-end server by Node.js, ***Nodemon*** for monitoring change or ***ESLint*** analysis tool
```npm start``` is equivalent to ```node server/server.js```  
```npm run dev``` is equivalent to ```nodemon server/server.js```  
```npm run lint``` is equivalent to ```npx eslint```
### 12) Now you can open local webpage ***index.html***, but some features like to access file through local browser (e.g. Shop page and Cart page read products list from ***products.json***) are prohibited. To solve this, you can create a mini HTTPS server in Python by below command
```
python -c "import http.server,ssl,webbrowser; httpd=http.server.HTTPServer(('',4000),http.server.SimpleHTTPRequestHandler); ctx=ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER); ctx.load_cert_chain('JS\server.cert','JS\server.key'); httpd.socket=ctx.wrap_socket(httpd.socket,server_side=True); print('HTTPS Server https://127.0.0.1:4000'); webbrowser.open('https://127.0.0.1:4000'); httpd.serve_forever()"
```
Then it will automatically open the browser and start with ```https://127.0.0.1:4000``` (front-end)
### 13) Once your Node.js back-end server and MongoDB server are connnected, you may test on these API requests on back-end server (e.g. using Chrome extension ***<a href="https://chromewebstore.google.com/detail/talend-api-tester-free-ed/aejoelaoggembcahagimdiliamlcdmfm">Talend API Tester</a>***) 
- GET /api/check-auth

Used by client side ****JS/app.js***. Verify user login status by checking for the presence of JSON Web Token stored in **Local Storage**, must attach a valid login token to reach API
```
https://127.0.0.1:3000/api/check-auth
```
For example, the login token from front-end can be used for back-end API, go to Login page to login in, then push F12 to open Chrome Developer Tool=>Console (shortcut key: Ctrl + Shift + J), paste below script to execute:
```
fetch('https://127.0.0.1:3000/api/check-auth', { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`}})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
- GET /api/profile

Get current login user name.
```
https://127.0.0.1:3000/api/users
```
- POST /api/register

Used by client side ****JS/app.js***. Seach anc create MongoDB database schema ***"users", "orders", and "products"***.  
Handle new user registration by validate input, check email availability, hash password and save new user to MongoDB database.
```
https://127.0.0.1:3000/api/register
```
For example, use the Talend API Tester, type in "Content-Type" and "application/json", select POST https://127.0.0.1:3000/api/register and paste below JSON data:
```
{ "firstName": "First-name", "lastName": "Last-name", "email": "user@email.com", "password": "1234" }
```
Example 2: Use CURL command to post JSON to the server
```
curl -k -X POST -H "Content-Type: application/json" https://127.0.0.1:3000/register -d "{\"firstName\": \"First-name\", \"lastName\": \"Last-name\", \"email\": \"user@email.com\", \"password\": \"1234\"}"
```
- POST /api/login

Used by client side ***JS/app.js***. Manage user login by search user email, compare password with stored hash upon successful authentication.
```
https://127.0.0.1:3000/api/login
```
For example, use the Talend API Tester, type in "Content-Type" and "application/json", select POST https://127.0.0.1:3000/api/login and paste below JSON data:
```
{ "email": "user@email.com", "password": "1234" }
```
- GET /api/logout

Log out and clear the stored login JSON Web Token.
```
https://127.0.0.1:3000/api/logout
```
- GET /api/product

Used by client side ***JS/cart-preview.js***. Fetch the product list from back-end server and MongoDB schema "***products***".
```
https://127.0.0.1:3000/api/product
```
- GET /api/product/:id

Used by client side ***JS/cart-preview.js***. Fetch the product list by item identity from back-end server and MongoDB schema "***products***".
```
https://127.0.0.1:3000/api/product/:id
```
- GET /api/cart

Used by client side ***JS/cart-preview.js***. Fetch the shopping cart from current user.
```
https://127.0.0.1:3000/api/cart
```
- POST /api/cart

Used by client side ***JS/app.js*** and ***JS/cart-preview.js***. Update user shopping cart on database.
```
https://127.0.0.1:3000/api/cart
```
- GET /apt/order

Used by client side ***JS/order.js***. Fetch the order history from current user.
```
https://127.0.0.1:3000/api/order
```
- POST /api/order

Used by client side ***JS/checkout.js***. Update your shipping cart on database.
```
https://127.0.0.1:3000/api/order
```
- POST /api/apple-merchant

Used by client side ***JS/checkout.js***. Apple Pay merchant validation with Apple server.
```
https://127.0.0.1:3000/api/apple-merchant
```
- POST /api/apple-payment

Wildly used for server side Apple Pay merchant payment process.
```
https://127.0.0.1:3000/api/apple-payment
```
- GET /api/admin-dbs

**For Administrator login and development only**: Fetch all users and order with hashed password from MongoDB database
```
https://127.0.0.1:3000/api/admin-dbs
```
- GET /api/admin-reset

**For Administrator login and development only**: Drop all MongoDB database and create an admin account with ***email: a@a, password: aaaa***
```
https://127.0.0.1:3000/admin-reset
```
### 14) Open Chrome and push F12 to open Developer Tools, click Network=>Console to monitor server responses for various of results
- HTTP Status 200 (OK)
- HTTP Status 201 (Created, register or new order)
- HTTP Status 401 (Unauthorized, using wrong password)
- HTTP Status 409 (Conflict, register with existed username)

### 15) In Chrome Developer Tools, click Application=>Storage=>Local storage for checking storing JSON Web Tokens of login session

### 16) If you want to run this repository online, using any web hosting site supports with both ***Node.js*** and ***Express*** features (e.g. ***Render.com***)

### 17) Secondly, the ***MongoDB Atlas*** online account is also requested, a free account can run one cluster at anytime. You will get your MongoDB cloud URL at ***MongoDB Atlas*** account, select Overview=>Database=>Clusters, click Connect=>Driver to see the example of source code included "***MONGO_URI***", put the URL into "***.env***" file
Default locacl MongoDB address:
```
MONGO_URI="mongodb://127.0.0.1:27017/E-commerceProject"
```
Change to new MongoDB address:
```
MONGO_URI="mongodb+srv://<db_user>:<db_password>@cluster0.xxxxx.mongodb.net/E-commerceProject"
```
### 18) Thirdly, to set up who can access to your MongoDB cluster, go to your ***MongoDB Atlas*** account and select Overview=>Secuity=>Network Access to add IP Address you can copy from your ***Render.com*** dashboard in order to allow back-end server access to MongoDB database
```
Add new IP Address: xxx.xxx.xxx.xxx/xxx
```
### 19) After register on ***Render.com***, go to Manage=>Environment to configure Environment Variables to set up JSON Web Token private key keep by own 
```
ORIGIN_URL="https://cunymeganlubin.github.io/E-commerceProject"
JWT_SECRET=12345678901234567890
MONGO_URI="mongodb+srv://<db_user>:<db_password>@cluster0.xxxxx.mongodb.net/E-commerceProject"
```
For using Apple Pay (use your Apple Developer account and merchant ID, follow instruction at <a href="https://applepaydemo.apple.com/apple-pay-js-api">https://applepaydemo.apple.com/apple-pay-js-api</a>
```
APPLE_MERCHANT_ID="merchant.com.example.applepaydemo"
APPLE_MERCHANT_NAME="3140 Active Wear"
APPLE_CRT_PATH="./CERT/apple-crt.pem"
APPLE_KEY_PATH="./CERT/apple-key.pem"
```
### 20) To deploy on ***Render.com***, login and go to Setting, input ```npm install``` for Build Command, ```npm start``` for Start Command. Click Monitor=>Logs to monitor to back-end logs

### 21) After ***Render.com*** finished deploying, copy the back-end server URL. Modify the local JavaScript file "***JS\config.js***" to tell where is ***Render.com*** back-end server URL
Default locacl back-end address:
```
apiBaseUrl: "https://127.0.0.1:3000"
```
Change to new back-end address:
```
apiBaseUrl: "https://e-commerceproject-xxx.onrender.com"
```
### 22) To view the MongoDB database collections created by web application, go to ***MongoDB Atlas*** account, select Overview=>Browse collections and select your cluster

### 23) Remember, never share your "***.env***" file on public, share admin password to others, or upload your non-encrypted password online to Github repository
