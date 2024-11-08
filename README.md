# RentItOut

<p align="center">
  <img src="images/logoBackground.png" alt="RentItOut Logo"  height="350" width="350"/>
</p>

**RentItOut** is a versatile rental platform that enables users to list, browse, and rent a wide range of items, materials, equipment, and more. Designed for owners customers and renters, this application simplifies the rental process by providing an intuitive interface and a comprehensive management system for all types of rentable items.

# Table of Contents ℹ️

- [RentItOut](#rentitout)
- [Core Features](#core-features)
- [Extra Features](#extra-features) 
- [Technologies Used](#technologies-used)
- [External APIs Used](#external_apis_used)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
  

## Core Features⭐
1. Item Listings for Rent:
   - Administrator has the authority to create categories that include a set of items
   - The customer can display these categories and all the items inside them
   - The vendor can add, delete, or modify items as he wants

2. Rental Management and Pricing:
   - The platform allows the customer to rent the items he needs for specific times as he decides on customized prices.
   - It enables him to rent more than one item and specify the quantity and time he wants in an easy way that also enables him to modify the order.
     
3. Trust, Safety, and Verification:
   - We have a dedicated insurance team to assess items after they are returned by the renter to ensure they are still in good working condition.
   - The tenant is required to pay a deposit before renting to ensure that the item is returned in good condition.
     
4. Logistics: Delivery and Pickup:
   - On-site delivery services The tenant can pick up the item from the delivery location according to the location he entered when logging in
   - Or it can be sent for delivery and the delivery price of this item will be added to his bill according to the location.
     
5. Revenue Model 
   - Profits management is between the admins (the platform owners) and the vendors, enabling them to share the profits among them within agreed percentages.
  
     
5. User Experience and Recommendations:
   - The platform allows the user the freedom to express his opinion by rating the items he rents to leave useful information for all users first and for the owners later.


## Extra Features⭐⭐
1. Roles: Our platform contains more than one function.🙌
   
   - Admins: the owners of the platform and they have the authority over most things related to the platform to ensure that it works properly and securely.
   - Vendors: are users of the platform who can offer their items for rent and make profits from these fees. They have the freedom to add their own items and modify them as they want and track the rental process of their items.
   - Insurance Team: A team specialized in evaluating products and ensuring their quality upon receipt and delivery, and deciding whether the user must pay the necessary compensation or not.
   - Customer: The tenant is the most important person to us. The platform is designed to meet all his needs in a way that allows him to have the best experience.
     
 2. Discount: We offer exclusive discounts to tenants on our platform.👌
     - Percentage Amount Discount : Get <b>10%</b> off any rental above $100
     - Long-Term Rental Discount: Get <b>12%</b> off for rentals longer than 7 days.
     - Loyalty Discount: Enjoy <b>5%</b> off after 5 rentals.
     - First Purchase Discount: Get <b>15%</b> off your first rental

 3. Bills Management:💸   <<<<<<< jooood talk about the details you put it in the bills like sending an email  and all this stuff >>>>>
     - ....
     - .....
     - .....

 4. User Privacy and Data Security:🪪 <<<<<<< jooood talk about this too >>>>>
    - ....
    - ....
    - .....

 5. ReturningItems Management:📌 <<<<<<< leema talk about the details of this >>>>>>>>
    - Managed by insurance team who check and decide the status of item and based on it the returned amount of deopsit is determined and payed back to customer.
    - handle the overtime charge by comparing the return date and actual return date.

  6. if theres any extra features pls dont be shy girls :) ❤️
     - .....
     - ....
       


## Technologies Used⚙

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

## External APIs Used📌
>>>> jood >>>>

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
- we handle data smoothly, and we provide packages that call for tables and the relationship between them.
  1. Create the tables and the relations between them
   ```bash
    node migrate.js
   ```
  2. Insert fake data into tables:
   ```bash
     node seed.js
   ```
  3. if you want to delete the tables:
   ```bash
    node dropTables.js 
   ```
5. Set up .env:
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
  - STRIPE_SECRET_KEY=sk_test_51QGpOFABTVjEZPaZZBDa2IsQiGjlDbL8A25jtbfPhJXLPG5b6JcVM3kNmH94ZVM8nkSSkS4qd5t4kYyiQZE51ksg00xl2QmUDR
  - STRIPE_PUBLISHABLE_KEY=pk_test_51QGpOFABTVjEZPaZvXOk2ZsqahVO3Vomjp61el04KKwxb7zLd63VizWUEC1D9O6voDLdcP1mC9whINdgFdyl549000anSuQV3y
  - PAYPAL_CLIENT_ID=your_paypal_client_id
  - PAYPAL_SECRET=your_paypal_secret

#JWT_COOKIE_EXPIRES_IN_DAYS=90
