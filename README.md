# RentItOut
<div>
<p align="center">
  <img src="images/logoBackground.png" alt="RentItOut Logo"  height="350" width="350"/>
</p>
<h3 align="center">RentItOut</h3>

  <p align="center">
Your go-to platform for easy, secure, and flexible rentals.
    <br />
    <a href=""><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="">View Demo</a>
    ·
    <a href="">Report Bug</a>
  </p>
</div>

**RentItOut** is a modular rental platform that enables users to list, browse, and rent a wide range of items, materials, equipment, and more. Designed for customers and renters, this application simplifies the rental process by providing an intuitive interface and a comprehensive management system for all types of rentable items. Additionally, it provides admins with full control over platform management, ensuring smooth and efficient operations.

## GitHub Repository Information :small_blue_diamond:

<p>
  :file_folder: <a href="https://github.com/joodhamdallah/RentItOut"><img src="https://img.shields.io/github/repo-size/joodhamdallah/RentItOut" alt="Size"></a> &nbsp;
  :open_file_folder: <a href="https://github.com/joodhamdallah/RentItOut"><img src="https://img.shields.io/github/directory-file-count/joodhamdallah/RentItOut" alt="Files"></a> &nbsp;
  :date: <a href="https://github.com/joodhamdallah/RentItOut"><img src="https://img.shields.io/github/last-commit/joodhamdallah/RentItOut/main" alt="Last Commit"></a> &nbsp;
  :busts_in_silhouette: <a href="https://github.com/joodhamdallah/RentItOut"><img src="https://img.shields.io/github/contributors/joodhamdallah/RentItOut" alt="Contributors"></a> &nbsp;
</p>

# Table of Contents ℹ️

- [RentItOut](#rentitout)
- [Core Features](#core-features)
- [Extra Features](#extra-features) 
- [Technologies Used](#technologies-used)
- [External APIs Used](#external_apis_used)
- [External Libraries and Packages](#external-libraries-and-packages)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
  

## Core Features⭐
1. Item Listings for Rent:
   - Administrator has the authority to create categories that include a set of items.
   - Customer can view these categories and all items within them, along with item details.
   - Vendor can add, delete, or modify items within their listings, allowing customers to browse and rent the items they offer.

2. Rental Management and Pricing:
   - The platform allows customers to rent items for specific durations, with pricing set according to the platform’s rates.
   - Customers can select multiple items for rental, with options to specify quantities and rental periods for each item.
     
3. Trust, Safety, and Verification:
   - We have a dedicated insurance team assesses items after they are returned by renters to ensure they remain in good working condition.
   - Renters are required to pay a security deposit before renting, which helps ensure items are returned in the agreed-upon condition.

4. Logistics: Delivery and Pickup:
   - On-site Pickup: Renters can pick up items from a location specified by the platform or the vendor.
   - Delivery Option: Alternatively, items can be delivered directly to the renter’s address, with delivery fees added to the bill based on the location.
     
5. Revenue Model 
   - Profit management is structured between platform admins (the owners) and vendors, allowing for profit-sharing based on agreed-upon percentages
      
5. User Experience and Recommendations:
   - The platform allows users to freely share their feedback by rating rented items, providing valuable information for other users and insights for item owners.


## Extra Features⭐⭐
1. Roles: Our platform supports multiple roles, each essential to its operation.🙌
   
   - Admins: As platform owners, admins have control over important areas of the platform to keep it running smoothly and securely.
   - Vendors: Vendors are users who offer their items for rent, generating revenue from rental fees. They can freely add, modify, and manage their items, as well as track the rental process of their items.
   - Insurance Team: This team assesses the condition of rented items upon return to determine if any portion of the security deposit should be retained for damages, overtime fees, or other necessary charges.
   - Customer: Customers (renters) are our top priority and the core of the platform. It’s designed to meet all their needs, providing them with the best possible experience.

     
 2. Discount: We offer exclusive discounts to tenants on our platform.👌
     - Percentage Amount Discount : Get <b>10%</b> off any rental above $100
     - Long-Term Rental Discount: Get <b>12%</b> off for rentals longer than 7 days.
     - Loyalty Discount: Enjoy <b>5%</b> off after 5 rentals.
     - First Purchase Discount: Get <b>15%</b> off your first rental

 3. Bills Management:💸   
     - When a user completes a rental, they receive an email with a printable bill that includes all rental details, such as logistic type, payment method, item list, individual prices, any applied discounts, shipping cost based on location, bill date, and total amount due.
     - Customers can also access and retrieve their bills directly from their account for easy reference.
     - Admins have full access to view all platform bills, including detailed transaction information across rentals.
      
 4. User Privacy and Data Security:🪪 
    - Our platform prioritizes user privacy and secures all personal information, including passwords, with encrypted storage.
    - To ensure secure access, we use tokens for authorization during login, limiting each role’s access level—admins, vendors,and customers can only perform specific actions based on their permissions.
    - Users must be logged in to rent items, adding an extra layer of security.
    - For added protection, password changes require verification through an email sent by the platform.
     
    
 5. ReturningItems Management:📌 
    - Managed by insurance team who check and decide the status of item and based on it the returned amount of deopsit is determined and payed back to customer.
    - Handle the overtime charge by comparing the return date and actual return date.
    - The platform automatically sends an email reminder to customers one day before the scheduled return date to ensure timely item returns. This reminder can also be manually triggered by admins if needed.
 


## Technologies Used⚙

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

## External APIs Used📌
- OpenRouteService API: The platform utilizes the OpenRouteService API to calculate accurate delivery costs for rented items. When a customer selects the delivery option, the API calculates the driving distance between the pickup location (specified by the platform or vendor) and the customer’s address. This distance-based calculation determines the shipping cost, which is added to the customer’s bill.
- OpenStreetMap Nominatim API: This API is used for geocoding addresses, converting the customer's inputted address and the platform’s pickup location into geographic coordinates. These coordinates allow the platform to determine the distance between locations, essential for calculating logistics costs accurately.

## External Libraries and Packages 📦

- mysql2: Connects to the MySQL database and manages data transactions within the platform.

- @faker-js/faker: Generates fake data for testing, such as usernames, emails, and addresses, to help with seeding the database.

- bcrypt: Encrypts user passwords by hashing them, ensuring they are stored securely.

- crypto: Generates secure, hashed tokens, particularly for password reset functions. For example, tokens are hashed when generating password reset links.

- jsonwebtoken (jwt): Creates JSON Web Tokens for secure user authentication and role-based access control.

- express: The core framework for building the server and handling routes, middleware, and HTTP requests.

- cookie-parser: Parses cookies in HTTP requests. In this project, it handles token management, especially for cookies storing authentication tokens.

- express-session: Manages user sessions, particularly for features like the cart, by storing session data on the server.

- node-cron: Schedules automated tasks. In this project, it’s used to schedule daily email reminders for users, ensuring timely return of rented items.

- axios: Facilitates HTTP requests to external APIs, such as the OpenRouteService and Nominatim APIs, used for calculating delivery distances and geocoding addresses.

- moment: Formats dates and times, useful for billing dates, rental return dates, and other time-sensitive data.

- geolib: Calculates geographic distances between locations, helping with shipping cost calculations for deliveries.

- puppeteer: Generates PDFs, such as invoices for rentals, using custom HTML and CSS for formatting.

- nodemailer: Sends emails, including password reset links and rental invoices, to keep users informed.

## Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/username/project-name.git]
   ```
2. Navigate to the project directory:
   ```bash
   cd RentitOut
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. To set up the database:
- Our platform manages data efficiently by using separate scripts for creating, seeding, and deleting database tables. These scripts are located in the config directory and make setting up the database straightforward.
  1. Navigate to the config directory:
   ```bash
   cd config
   ```
  2. Create the tables and the relations between them
   ```bash
    node migrate.js
   ```
  3. Insert fake data into tables:
   ```bash
     node seed.js
   ```
  4. If you want to delete the tables:
   ```bash
    node dropTables.js 
   ```
   5. If you want to delete the records of tables but keep the tables:
   ```bash
    node clearRecords.js 
   ```

5. Set up .env: Duplicate the `.env.example` file and rename it to `.env` using the following command:
   ```bash
  cp .env.example .env
  ```
  - DB_HOST=localhost         
  - DB_USER=root               
  - DB_PASSWORD=      
  - DB_NAME=project       
  - DB_PORT=3306
  - NODE_ENV=development
  - JWT_SECRET=RentItOut-SaLeJo/26/12
  - JWT_EXPIRES_IN=10m
  - EMAIL_USERNAME="gameboxjsd2023@gmail.com"
  - EMAIL_PASSWORD="pidj svlq nxel nohb"
  - EMAIL_FROM="RentItOut Support <your-email@gmail.com>"
  - SESSION_SECRET=JoodSession_22Secret

6. Run the application:
```bash
    node api.js 
   ```
  