# Machine Code Node Js
## API

### Create New User
http://localhost:8080/user/create   ( POST )
{
    "fullName": "Rahul Verma",
    "email": "rahul.verma@gmail.com",
    "password": "Rahul123",
    "address": "Sector 21",
    "latitude": 3.5678,
    "longitude": 17.1,
    "status": "inactive",
    "registration_day": 2
  }

### Login User
http://localhost:8080/user/login  ( POST )
{
  "email":"kavita.sharma@gmail.com",
  "password":"Kavita123"
}

### Logout User 
http://localhost:8080/user/logout   ( GET )

### Get User Distance
http://localhost:8080/user/get-distance?latitude=10.0&longitude=24.700   ( GET )
Pass the query

### Change User Status
http://localhost:8080/user/change-status     ( PUT )

### Change User Listing  
http://localhost:8080/user/listing?week=0     ( GET )
