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
**Using MongoDB Atlas as database and Render to run on Node.js + Express backend server**  
MongoDB Atlas: https://cloud.mongodb.com  
Render: https://dashboard.render.com

### Project Team Members
**Usman Naveed** (<a href="https://github.com/Usman072003" target="_blank">Github</a>) - Project Architect - <a href="https://cunymeganlubin.github.io/E-commerceProject/Introductions/Usman/index.html" target="_blank">Introduction</a>  
**Megan Lubin** (<a href="https://github.com/CunyMeganLubin" target="_blank">Github</a>) - Developer - <a href="https://cunymeganlubin.github.io/E-commerceProject/Introductions/Megan/Megan_Lubin_Introduction.html" target="_blank">Introduction</a>  
**Suen Ming Kung** (<a href="https://github.com/nykenkung" target="_blank">Github</a>) - Designer/Researcher - <a href="https://cunymeganlubin.github.io/E-commerceProject/Introductions/Suen/Suen_Ming_Kung_Introduction.html" target="_blank">Introduction</a>  

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
/E-commerceProject
│                            # Static HTML and configuration files
├── index.html               # Landing front page
├── shop.html                # Product detail page
├── donate.html              # Donate clothing page
├── contact.html             # Contact us page
├── about.html               # About us page
├── login.html               # Login/register/password recovery page
├── cart.html                # Shopping cart page
├── checkout.html            # Checkout page
├── products.json            # All products data in JSON format
├── README.md                # This readme file
│
├── .env                     # Important envirnment variables, MongoDB server URL (defaul:t mongodb://127.0.0.1:27017/E-commerceProject)
├── package.json             # Node.js package configuration file ready for deploy and start (e.g Render.com, usgae: npm install, npm start)
├── eslint.config.mjs        # ESLint code analysis tool configuration file (Usage: npm run lint)
│
├────── / Icons              # Logo designs folder
├────── / clothing           # Product images folder
│
├──────┬── /CSS              # CSS Folder
│      └────── styles.css    # Global CSS
│
├──────┬── /JS               # JS Folder
│      ├────── app.js        # Frontend JavaScript, stored backend apiBaseUrl (default: apiBaseUrl: "https://127.0.0.1:4000")
│      ├────── cart-core.js	 # Load on every page for header preview shopping cart and core for cookie, contains functions setCookie, getCookie, saveCartToCookie, loadCartFromCookie, recalculateTotalItems, updateCartCoun, updateCartPreview and initial DOMContentLoaded event that fetches products.json
│      ├────── cart.js       # Contains functions changeQty, renderFullCart to render cart table
│      ├────── checkout.js	 # Contains functions renderOrderSummary, placeOrder, setupCheckoutPageListeners for checkout process
│      ├────── order.js		 # Contains functions renderOrderHistory, orderHistoryCookie, to render order history table
│      ├────── shop.js       # Contains functions addToCart, changeQty, renderProducts, updateProductViews, setupShopPageListeners for search and filtering
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

### To run on local machine, first make sure that your computer has installed below software:
- **Git** (https://github.com/git-for-windows/git/releases/latest)
- **OpenSSL** (https://slproweb.com/products/Win32OpenSSL.html)
- **Node.js** (https://nodejs.org/en/download)
- MongoDB** database server (https://github.com/mongodb/mongo)
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
### 3)  Generate the SSL certificate key files for local HTTPS (Make sure ***openssl.exe*** installed directory set to PATH variable)
```
openssl req -x509 -newkey rsa:4096 -nodes -keyout server.key -out server.cert
```
### 4) If there is no ***package.json*** existed, create by Node.js
```
npm init -y
```
### 5) Open the ***package.json*** file and add below lines for installing development dependencies
```
{
	"name": "E-commerceProject",
	"scripts": {
		"start": "node JS/server.js",
		"dev": "nodemon JS/server.js",
		"lint": "npx eslint JS"
	}
}
```
### 6) Install development and all required dependencies
- **concurrently**: Runs multiple commands **simultaneously** (Usage: ```concurrently "JS/server.js" "server/server.js"```)
- **eslint**: JavaScript static code analysis tool (Usage: ```nodemon JS/server.js```)
- **nodemon**: Restart automatically when files change (Usage: ```npx eslint .```)
- **express**: Express web server framework for Node.js
- **dotenv**: Loads environment variables from ***.env*** file
- **jsonwebtoken**: Create and verify **JSON Web Tokens** for **web authentication**
- **cors**: **Middleware** to handle cross-origin requests
- **cookie-parser**: Middleware to read cookies in requests
- **bcryptjs**: Hash and **encrypt** passwords
- **mongoose**: Connect to **MongoDB** server and model MongoDB object
```
npm install
(Or manually) npm install --save-dev concurrently eslint nodemon & npm install express mongoose bcryptjs cookie-parser jsonwebtoken cors dotenv
```
### 7) To use the powerful static code analysis tool ***ESLint*** installed by Node.js
```
npx eslint --init
```
### 8) To use ESLint properly, modify the configuration file ***eslint.config.mjs*** to add support of "required" and "env" in code
```
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([ { plugins: { js }, languageOptions: { globals: { ...globals.browser, ...globals.node } } }, ]);
```
### 9) Run MongoDB database server in new Windows PowerShell in JSON formatting output
```
start powershell -Command "<MongoDB installation directory>\bin\mongod.exe --dbpath=<MongoDB data directory>\db | ForEach-Object { try { ($_ | ConvertFrom-Json) | ConvertTo-Json } catch { $_ } }"
```
### 10) Connect to database by MongoDB Shell (mongosh)
```
mongosh mongodb://127.0.0.1:27017/E-commerceProject
```
### 11) To launch backend server by Node.js, ***Nodemon*** for monitoring change or ***ESLint*** analysis tool
```npm start``` is equivalent to ```node JS/server.js```  
```npm run dev``` is equivalent to ```nodemon JS/server.js```  
```npm run lint``` is equivalent to ```npx eslint JS```
### 12) Now you can open local page ***index.html***, but some features like to access file through local browser (e.g. Shop page and Cart page read products list from ***products.json***) is prohibited. To solve this, you can create a mini HTTPS server in Python by below command
```
python -c "import http.server,ssl,webbrowser; httpd=http.server.HTTPServer(('',4000),http.server.SimpleHTTPRequestHandler); ctx=ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER); ctx.load_cert_chain('JS\server.cert','JS\server.key'); httpd.socket=ctx.wrap_socket(httpd.socket,server_side=True); print('HTTPS Server https://127.0.0.1:4000'); webbrowser.open('https://127.0.0.1:4000'); httpd.serve_forever()"
```
Then it will automatically open the browser and start with ```https://127.0.0.1:4000```
### 13) After open the web page by Chrome, push F12 to open Developer Tools and click Network=>Console to monitor server responses, there are various of result
```
HTTP Status 200 (OK)
HTTP Status 201 (Created, register or new order)
HTTP Status 401 (Unauthorized, using wrong password)
HTTP Status 409 (Conflict, register with existed username)
```
### 14) In Chrome Developer Tools, click Application=>Storage=>Cookies for checking storing cookies and login session

### 15) If you want to run this repository online, firstly, using the  web hosting site supporting both ***Node.js*** and ***Express*** features is required (e.g. ***Render.com***)

### 16) Secondly, the ***MongoDB Atlas*** online account is also requested, a free account can run one cluster at anytime. You will get your MongoDB cloud URL at ***MongoDB Atlas*** account, select Overview=>Database=>Clusters, click Connect=>Driver to see the example of source code included "***MONGO_URI***", put the URL into ***.env*** file
```
MONGO_URI="mongodb://127.0.0.1:27017/E-commerceProject"
```
Change to new MongoDB address
```
MONGO_URI="mongodb+srv://<db_user>:<db_password>@cluster0.xxxxx.mongodb.net/E-commerceProject"
```
### 17) Thirdly, to set up who can access to your MongoDB cluster, go to your ***MongoDB Atlas*** account and select Overview=>Secuity=>Network Access to add IP Address you can copy from your ***Render.com*** deashboard, in order to allow backend server access to MongoDB database
```
Add new IP Address: xxx.xxx.xxx.xxx/xxx
```
### 18) After register on ***Render.com***, deploy and clone publicly from this Github repository, first time install by ```npm install```, run everytime by ```npm start```. And manually input customized envirnmont variables in ***.env*** option
```
MONGO_URI="mongodb+srv://<db_user>:<db_password>@cluster0.xxxxx.mongodb.net/E-commerceProject"
```
### 19) After Render.com finished deploying, copy the backend server URL. Modify the local file ***JS\app.js*** to tell where is ***Render.com*** backend URL
```
apiBaseUrl: "https://127.0.0.1:3000"
```
Change to new backend address
```
apiBaseUrl: "https://e-commerceproject-xxx.onrender.com"
```
### 20) To view the MongoDB database collections created by web application, go to ***MongoDB Atlas*** account, select Overview=>Browse collections and select your cluster

### 21) Remember, never share your ***.env*** file on public, admin password to others, or upload your non-encrypted password online to Github repository
