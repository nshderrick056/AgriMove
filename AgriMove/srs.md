AgriMove 




Description of the concept of their Mission; 
My mission is to contribute to job creation and economic growth in Africa through agriculture and technology. Agriculture is one of the largest sectors in Africa and employs millions of people, especially youth and small-scale farmers. However, many farmers face difficulties transporting their products to markets due to poor logistics systems, lack of transport coordination, and post-harvest losses. 

This mission is relevant because improving agricultural logistics can help farmers access markets faster, reduce food waste, increase profits, and create employment opportunities for drivers, suppliers, and agricultural workers. By introducing digital solutions into agricultural transportation, African farmers can become more connected, productive, and competitive in modern markets. 

Problem statement: 

In many parts of East Africa, small-scale farmers struggle to transport agricultural products from farms to markets efficiently. Farmers often experience delays, high transportation costs, poor coordination with drivers, and product spoilage during delivery. These problems mostly affect rural farmers who rely on traditional transportation methods and informal communication channels.
The problem occurs especially during harvesting seasons when there is high demand for transportation services. In countries such as Rwanda, Uganda, and Kenya, poor agricultural logistics contribute to post-harvest losses and reduced farmer profits.
Existing transportation systems are often not specialized for agricultural needs, lack real-time tracking, and provide limited communication between farmers, transporters, and buyers. As a result, farmers lose income opportunities, buyers receive delayed deliveries, and transportation resources are poorly managed.
This project aims to solve this challenge by developing a digital agricultural logistics management system that connects farmers, transporters, and buyers through delivery scheduling, tracking, and communication features     
Proposed solution
The proposed solution is a web and mobile-based agricultural logistics management system called AgriMove. The platform will allow farmers to request transportation services, transporters to accept delivery requests, and buyers to track deliveries in real time.
The system will include:
Delivery request management
Driver assignment
GPS/location tracking
Notifications and communication
Delivery scheduling
Delivery status updates
Admin management dashboard
Unlike many existing logistics systems, this solution specifically focuses on agricultural transportation and addresses the unique challenges faced by farmers in East Africa, such as rural accessibility, delivery coordination, and post-harvest losses.

Software development model 
The Agile software development model will be used for this project because the system requirements may change as users provide feedback during development. Agricultural logistics involves multiple stakeholders such as farmers, transporters, and buyers, making continuous improvement important throughout the development process.
Agile is relevant to this project because it allows the system to be developed in small phases called iterations. Each iteration will deliver a working feature that can be tested and improved based on user feedback. This approach reduces development risks and ensures the final system meets user needs effectively.
The Agile steps that will be followed include:
Requirement Gathering
 Collect information from farmers, buyers, and transporters about logistics challenges.
Planning
 Define system features, timelines, and development priorities.
System Design
 Create system architecture, database structure, and user interface designs.
Development
 Build the system incrementally, starting with core features such as user registration and delivery requests.
Testing
 Test each module to identify and fix errors before deployment.
Deployment
 Launch the system for users to access and use.
Maintenance and Feedback
 Monitor the system performance and continuously improve features based on user feedback.

The hypothesis of their solution
If farmers, transporters, and buyers are provided with a centralized agricultural logistics management platform, transportation coordination, delivery efficiency, and market accessibility will improve, while reducing post-harvest losses and transportation delays across East Africa's agricultural supply chains. 

References 
Postharvest technologies for small-scale farmers in low- and middle-income countries: A call to action - ScienceDirect


Rwanda Transport Sector Review and Action Plan


Ag-Platforms in East Africa: National and Regional Policy Gaps 
 
 



  Software Requirements Specification (SRS) Template

AgriMove
Prepared by GATETE Derrick
ALU
5/27/2026

Table of Contents
1.  Introduction	6
1.1  Purpose	6
1.2  Document Conventions	7
1.3  Intended Audience and Reading Suggestions	7
1.4  Product Scope	7
2.  Overall Description	8
2.1  Product Perspective	8
2.2  Product Functions	8
2.3  User Classes and Characteristics	8
2.4  Operating Environment	9
2.5  Design and Implementation Constraints	9
2.6  User Documentation	10
2.7  Assumptions and Dependencies	10
3.  External Interface Requirements	10
3.1  User Interfaces	10
3.2  Hardware Interfaces	13
3.3  Software Interfaces	14
3.4  Communications Interfaces	15
4.  Requirement Specification	17
5.  Other Nonfunctional Requirements	19
5.1 Example of Non-Functional Requirements (EDIT THIS PART)	19
6.  Appendix	21
Appendix A: Glossary	21

 

 

1. 	Introduction
1.1 	Purpose
The purpose of this Software Requirements Specification (SRS) document is to define the requirements for AgriMove, an agricultural logistics management system designed to improve transportation coordination between farmers, transporters, and buyers in East Africa. The system aims to reduce delivery delays, improve communication, and minimize post-harvest losses through digital logistics management. 
1.2 	Document Conventions
This document follows standard SRS formatting conventions. Functional requirements are identified using the prefix “FR,” while non-functional requirements use the prefix “NFR.” Headings and numbering are used to organize sections clearly for easy reference. 
1.3 	Intended Audience and Reading Suggestions
This document is intended for:
Software developers
System testers
Project supervisors
Project stakeholders
Future users of the system
Readers are advised to begin with the introduction and overall description sections before reviewing the functional and non-functional requirements.
1.4 	Product Scope
AgriMove is a digital agricultural logistics platform designed to improve transportation management within the agricultural supply chain. The system enables farmers to request deliveries, transporters to manage transportation tasks, and buyers to track product deliveries efficiently.
The main objectives include:
Improving delivery coordination
Reducing transportation delays
Enhancing communication
Reducing post-harvest losses
Supporting agricultural business growth
2. 	Overall Description
2.1 	Product Perspective
AgriMove is a new, standalone web and mobile-based system developed specifically for agricultural logistics management. The system integrates delivery management, user communication, and transport coordination into one platform.
The system will interact with:
GPS/location services
Mobile notification services
Databases
Internet services

2.2 	Product Functions
The system will:
Allow users to register and log in
Allow farmers to create delivery requests
Allow transporters to accept delivery tasks
Provide delivery tracking
Send notifications to users
Manage delivery schedules
Generate delivery reports
Allow admins to manage users and system activities
2.3 	User Classes and Characteristics
Farmers
Request transportation services
Track deliveries
Basic smartphone knowledge
Transporters/Drivers
Accept delivery requests
Update delivery status
Use GPS/location services
Buyers
Track product deliveries
Receive delivery notifications
System Administrators
Manage users
Monitor system operations
Generate reports
2.4 	Operating Environment
The system will operate on:
Android smartphones
Desktop computers
Modern web browsers
Cloud-based server environment
Supported browsers:
Google Chrome
Microsoft Edge
Firefox
2.5 	Design and Implementation Constraints
Limited internet connectivity in rural areas
Mobile device compatibility requirements
GPS dependency for tracking features
Budget limitations during development
Security and privacy requirements
2.6 	User Documentation
The system documentation will include:
User manual
Installation guide
System help documentation
Admin guide
2.7 	Assumptions and Dependencies
Users have internet access
Users possess smartphones or computers
GPS services are available
The server environment remains operational
Next, we can continue with:
Section 3 (External Interface Requirements)
Complete Functional Requirements tables
Complete Non-Functional Requirements tables
Appendix
Diagrams (Use Case, ERD, DFD)

3. 	External Interface Requirements
3.1 	User Interfaces
The AgriMove system will provide user-friendly interfaces for farmers, transporters, buyers, and administrators through both web and mobile platforms. The interface design will prioritize simplicity, accessibility, and ease of navigation for users with different technical skill levels.
The system interfaces will include:
Login Interface
Users will enter their email/phone number and password.
The login page will include:
Login button
Forgot password option
Sign-up option
Farmer Dashboard
Farmers will:
Create delivery requests
View transport status
Track deliveries
Receive notifications


Transporter Dashboard
Transporters will:
View available delivery requests
Accept or reject requests
Update delivery progress
View route details
Buyer Dashboard
Buyers will:
Track incoming deliveries
Receive delivery updates
Confirm product delivery
Admin Dashboard
Administrators will:
Manage users
Monitor delivery activities
Generate reports
Handle complaints and support
Interface Standards
Responsive design for desktop and mobile devices
Consistent navigation menus
Standard buttons such as:
Save
Submit
Cancel
Edit
Delete
Logout
Error messages displayed clearly in English
Notifications displayed in real time
User Interface Components
The following software components will require user interfaces:
Authentication module
Delivery management module
Tracking module
Notification module
Reporting dashboard

3.2 	Hardware Interfaces
The AgriMove system will interact with various hardware devices used by farmers, transporters, buyers, and administrators.
Supported Hardware Devices
Smartphones
Tablets
Desktop computers
GPS-enabled mobile devices
Cloud servers
Hardware Interactions
Mobile devices will provide GPS location data for delivery tracking.
Cameras on smartphones may be used to upload delivery proof images.
Servers will process and store system data.
Internet-enabled devices will communicate with the system through secure web connections.
Communication Protocols
HTTPS protocol for secure web communication
GPS integration for location tracking
Mobile network and Wi-Fi support



3.3 	Software Interfaces
The AgriMove system will integrate with several software components and services to support system operations.
Database Interfaces
PostgreSQL or MySQL database for storing:
User information
Delivery records
Tracking information
Notifications
Reports
Operating System Interfaces
The system will support:
Windows
Linux
Android
External Software Services
Google Maps API for GPS and route tracking
SMS/notification services for alerts
Email services for communication
Backend Frameworks
Django or FastAPI backend framework
RESTful API services for frontend-backend communication
Frontend Technologies
HTML
CSS
JavaScript
React.js
Data Exchange
The system will exchange:
User authentication data
Delivery status information
GPS location coordinates
Notifications and alerts
Communication Method
REST APIs using JSON data format
Secure HTTPS communication

3.4 	Communications Interfaces
The AgriMove system will support communication among users, servers, and external services via internet-based protocols.
Communication Functions
The system will support:
Real-time delivery updates
Email notifications
SMS alerts
GPS tracking communication
Web browser communication
Communication Standards
HTTP/HTTPS protocols
RESTful API communication
JSON message formatting
Security Requirements
Encrypted HTTPS connections
Secure user authentication
Protected user data transmission
Synchronization
Real-time synchronization of delivery status
Automatic updating of tracking information
Browser Communication
The system will support:
Google Chrome
Mozilla Firefox
Microsoft Edge
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         


4. 	Requirement Specification
Stakeholder Requirements Specification
Example of Functional Requirements

Req ID
Requirement
Description
FR 1
User Registration
The system shall allow users to create accounts.
FR 1.1
Register Farmers
Allow farmers to register and create profiles.
FR 1.2
Register Transporters
Allow transporters/drivers to register accounts.
FR 1.3
Register Buyers
Allow buyers to register accounts.
FR 2
User Authentication
The system shall authenticate users before accessing the platform.
FR 2.1
User Login
Allow users to log into the system using email or phone number and password.
FR 2.2
Password Recovery
Allow users to reset forgotten passwords.
FR 3
Delivery Management
The system shall manage transportation requests and deliveries.
FR 3.1
Create Delivery Request
Allow farmers to create transportation requests.
FR 3.2
View Delivery Requests
Allow transporters to view available delivery requests.
FR 3.3
Accept Delivery Request
Allow transporters to accept delivery requests.
FR 3.4
Cancel Delivery Request
Allow farmers or transporters to cancel requests when necessary.
FR 4
Delivery Tracking
The system shall provide delivery tracking functionality.
FR 4.1
GPS Tracking
Allow real-time tracking of deliveries using GPS.
FR 4.2
Update Delivery Status
Allow transporters to update delivery progress.
FR 4.3
Delivery Confirmation
Allow buyers to confirm completed deliveries.
FR 5
Notifications
The system shall send notifications to users.
FR 5.1
Send SMS Notifications
Notify users about delivery updates through SMS.
FR 5.2
Send Email Notifications
Notify users about delivery activities through email.
FR 6
Reporting
The system shall generate reports.
FR 6.1
Generate Delivery Reports
Allow administrators to generate logistics reports.
FR 6.2
View Delivery History
Allow users to view past delivery records.
FR 7
Administration
The system shall provide admin management features.
FR 7.1
Manage Users
Allow administrators to manage user accounts.
FR 7.2
Monitor System Activities
Allow administrators to monitor deliveries and system usage.


5. 	Other Nonfunctional Requirements
Example of Non-Functional Requirements

Requirement Type
Req ID
Description
Security
NFR 1
The system shall authenticate all users before granting access.
Security
NFR 2
User passwords shall be encrypted in the database.
Performance
NFR 3
The system shall load dashboard pages within 3 seconds under normal internet conditions.
Performance
NFR 4
The system shall support at least 100 simultaneous users.
Usability
NFR 5
The system interface shall be simple and user-friendly for users with basic technical skills.
Usability
NFR 6
The system shall use English as the primary communication language.
Reliability
NFR 7
The system shall be available 24 hours a day, 7 days a week.
Availability
NFR 8
The system shall automatically recover from minor server failures.
Compatibility
NFR 9
The system shall support Google Chrome, Mozilla Firefox, and Microsoft Edge browsers.
Technology
NFR 10
The system shall be accessible on Android smartphones, tablets, and desktop computers.
Scalability
NFR 11
The system shall allow future expansion for additional logistics features.
Maintainability
NFR 12
The system code shall be modular and easy to maintain.
Auditability
NFR 13
The system shall maintain logs of user activities and delivery transactions.
Privacy
NFR 14
The system shall protect user personal and delivery information from unauthorized access.


Guide to Non- Functional Requirements (Delete this Section while Editing)  
Performance Requirements
The system shall process delivery requests within 5 seconds.
GPS tracking updates shall refresh every 30 seconds.
The system shall support concurrent access by multiple users without performance degradation.
Safety Requirements
The system shall prevent unauthorized access to delivery information.
The system shall securely store user and logistics data.
The system shall prevent accidental deletion of important delivery records.
Security Requirements
All users shall log in using authenticated credentials.
Passwords shall be encrypted before storage.
HTTPS encryption shall be used for all communications.
Admin access shall be restricted to authorized personnel only.

Software Quality Attributes
Reliability
The system shall operate consistently without frequent failures.

Maintainability
The system shall allow easy updates and maintenance.
Scalability
The platform shall support future expansion and increased users.
Usability
The interface shall be easy to understand and navigate.
Portability
The system shall operate across multiple devices and browsers.

Business Rules
Only registered transporters can accept delivery requests.
Farmers can only create delivery requests after logging in.
Buyers must confirm deliveries before transactions are marked complete.
Administrators have full control over user management and reporting features.



6. 	Appendix
Appendix A: Glossary
Term
Meaning
GPS
Global Positioning System
API
Application Programming Interface
Admin
System Administrator
Farmer
A user who requests transportation services
Transporter
A driver responsible for deliveries
Buyer
A customer receiving agricultural products

