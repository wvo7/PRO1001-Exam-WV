# Fram - HTML/CSS/JavaScript Project

This is my exam project for showcasing what I've learnt in HTML, CSS, and JavaScript.

### Description

This project is my final exam submission, designed to showcase my skills in **HTML5**, **CSS3**, and **modern JavaScript (ES6+)**. It brings to life 'Fram', a fictional circular service focused on sustainable produce delivery, through a replication of a provided Figma design.

The website features a responsive, multi-page interface built with a mobile-first approach, ensuring optimal viewing across devices. Key pages include:

* A captivating landing page introducing the service.
* A products page where users can browse and order produce.
* An interactive chatbot powered by the OpenAI API, ready to answer user queries.

For enhanced functionality, the project integrates external APIs:

* Google Maps API for location-based features.
* OpenAI API for the intelligent chatbot.

For security and development convenience, API keys are managed via placeholders in the code. The codebase is organised with both original and minified (optimised for production performance) CSS and JavaScript files.

_Note: While referenced in the menu, the 'checkout' page is not currently functional._

This project is primarily intended for my teachers' assessment, but if anyone else stumbles over this project, feel free to have a look at it :)

### Screenshots

#### Landing Page - Mobile
![Landing Page - Mobile](/Exam-Project/assets/images/Screenshots/Landing-page-mobile.png)

#### Landing Page - Desktop
![Landing Page - Desktop](/Exam-Project/assets/images/Screenshots/Landing-page-desktop.png)

#### Product Page - Mobile
![Product Page - Mobile](/Exam-Project/assets/images/Screenshots/Product-page-mobile.png)

#### Product Page - Desktop
![Product Page - Desktop](/Exam-Project/assets/images/Screenshots/Product-page-desktop.png)

#### Chatbot Page - Mobile
![Chatbot Page - Mobile](/Exam-Project/assets/images/Screenshots/Chatbot-page-mobile.png)

#### Chatbot Page - Desktop
![Chatbot Page - Desktop](/Exam-Project/assets/images/Screenshots/Chatbot-page-desktop.png)

### Installation

Steps to run locally:

1.  **Option 1: Clone the repository (recommended for developers)**
    * Clone the repository: `git clone https://github.com/wvo7/PRO1001-Exam-WV.git`
    * Navigate to the project directory: `cd PRO1001-Exam-WV`

2.  **Option 2: Download as a ZIP file**
    * Go to the repository page on GitHub.
    * Click the green 'Code' button.
    * Select 'Download ZIP.'
    * Extract the contents of the ZIP file to your desired location.

3.  **Open in browser:**
    * Navigate to the project directory (e.g., `PRO1001-Exam-WV/` if you cloned, or the extracted folder if you downloaded the ZIP).
    * Open `index.html` in your web browser (or, if you're using VS Code, you could run the LiveServer extension).

### Instructions

This project utilises both a Google Maps API and an OpenAI API. For security reasons, I have included placeholders for API Keys, which you will need to replace with your own.

**To get started:**
1.  Obtain your own API Keys for Google Maps and OpenAI. (Refer to the **Resources** section for guidance).
2.  Open `js/script.js`.
3.  Locate the placeholder comments (search for **PLACEHOLDER** in the script file).
4.  Replace these placeholders with your actual API Keys.

### File structure
```
Exam-Project
├── assets/
│   └── images/
│       └── Landing-Page/        # Images for the Landing Page
│       └── Product-Page/        # Images for the Product Page
├── css/
│   └── styles.css               # Original CSS (for development)
│   └── styles.min.css           # Minified CSS (for production)
├── js/
│   └── script.js                # Original JS (for development)
│   └── script.min.js            # Minified JS (for production)
├── chatbot.html                 # Chatbot Page
├── index.html                   # Main Landing Page
├── products.html                # Products Page
└── README.md
```

### Technologies used

* HTML5
* CSS3
* JavaScript (ES6+)

### Resources

#### Google Maps API
* Google's own [API guide](https://developers.google.com/maps/documentation/javascript/get-api-key) is really helpful.
* A good tutorial by [Steve Builds Websites](https://www.youtube.com/watch?v=hsNlz7-abd0).

#### OpenAI API
* Check out [OpenAI's developer quickstart](https://platform.openai.com/docs/quickstart/create-and-export-an-api-key?api-mode=responses).
* Short tutorial by [Anders Jensen](https://www.youtube.com/watch?v=OB99E7Y1cMA).

#### Google Lighthouse
* [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) is a tool to improve the quality for your web page. It has audits for perfomrance, accessibility, progressive web apps, and SEO. 

### Acknowledgement 
* This tutorial by [Treehouse](https://www.youtube.com/watch?v=aNDqzlAKmZc) for making the hamburger menu functional.
* An explanation of markdown by [Visual Studio Code](https://www.youtube.com/watch?v=4z0l5Kl2Q6E&list=LL&index=2).
* My school's course, which if you're a random onlooker, you won't have access to :/

### Optimisation & Minification

This project includes both unminified and minified versions of the CSS and JavaScript files.

* `css/style.css`: The original CSS stylesheet.
* `css/style.min.css`: The minified version of `styles.css` for production use.
* `js/script.js`: The original JavaScript file.
* `js/script.min.js`: The minified version of `script.js` for production use.

**Manual Minification:**
Currently, minification is performed manually. I used '[Toptal](https://www.toptal.com/utilities-tools)' to generate the `.min` files.

**For Development:**
When working on the project locally, link to the unminified files in `index.html` for easier debugging:
```html
<link rel="stylesheet" href="css/style.css">
<script src="js/script.js"></script>
```

**For Production Deployment:**
When deploying to a live server, ensure `index.html` (and other relevant HTML files) links to the minified files for better performance:
```html
<link rel="stylesheet" href="css/styles.min.css">
<script src="js/script.min.js"></script>
```

### Future Enhancements

I'd like to implement a build tool to automate tasks like minification, and will in that case sort the files in a dedicated `dist/`(distribution) folder for production-ready assets.
I might also make the checkout/add-to-cart functional.

### Known issues

During local development, you might observe the following warning in the browser console or Lighthouse audits:

#### Page prevented back/forward cache restoration
* **Cause:** This warning is due to an active WebSocket connection, specifically from the Live Server VS Code extension's auto-reload feature.
* **Impact:** This is _normal for local development_, and does not affect the functionality or performance of the website when it is deployed live. The Live Server script is not included in the production build.

#### Uses deprecated APIs - H1UserAgentFontSizeInSelection
* **Cause:** This warning is an internal deprecation within the Chromium browser engine itself (not related to the code).
* **Impact:** It does not affect website functionality, performance, or appearance, and is expected to resolve with future browser updates.

#### 'The resource ... was preloaded using link preload but not used within a few seconds from the window's load event.'

* **Cause:** This typically occurs on page reloads or back/forward navigation. It's a timing sensitivity where the preloaded background image is eventually used and displayed, but not quite fast enough for the browser's strict preload timeline, likely due to the styles.css file being render-blocking.
* **Impact:** The image still loads and displays correctly. This is a minor performance optimisation detail during development and does not indicate a critical issue for the live site. I deem this acceptable for a prototype, but with further development I'd either:

  1. _Inline the CSS rule_ directly into a `<styles>` tag in the `<head>`, which would make the image 'used' immediately, or:
  2. _Make styles.css non-render-blocking_. Maybe by using `media="print"` and then `onload="this.media='all'"`, combined with `rel="preload"` for the stylesheet itself. It's more complex, though.