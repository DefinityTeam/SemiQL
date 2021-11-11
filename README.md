# SemiQL
The Solution to Database-related APIs.

## About
SemiQL allows you to create simple and fast JSON APIs connected with your database with only a few lines of YAML configuration per endpoint.
```yml
v1:
  user:
    request: get
    type: select
    from: users
    values: everything
    match: username
    
   item:
    request: get
    type: select
    from: items
    values: [itemName, itemDescription, itemId]
    match: itemName
```

## Current Support
### Databases
In relation to the branch `master`
| Name | Status |
| --- | ----------- |
| MySQL/MariaDB | Supported |
| MongoDB | Unsupported (Developing on /mongodb) |
| PostgreSQL | Unsupported |

### MySQL Statements
Currently, only `SELECT` is supported. Others will be added at some point.

## Getting set up
You will need NodeJS to run SemiQL.

Download the repo and install the packages required using `npm i`. <br>
Configure `db.yml` to your liking. It will look something like this.
```yml
# db login
db:
  host: sql.example.com # domain / localhost
  username: thisismyusername # database username
  password: thisismypassword # database password, false if no password
  database: awesomedb # database name
  type: mysql # type of database (currently only mysql)

# general config
dashboard: true # enable statistics dashboard
```


<br>

`requests.yml` is the next to configure. <br>
Your endpoints will be at `localhost:5000/sub/endpoint/param`. <br>
If there is no `match` in the endpoint it will just be `localhost:5000/sub/endpoint`. <br>
This is an example.
```yml
v1: 
  user: # /v1/user/Parameter
    request: get # the type of request is GET
    type: select # selecting something from the database
    from: users # from the users table
    values: everything # all columns
    match: username # add WHERE username = 'Parameter'

  users: # /v1/users
    request: get 
    type: select
    from: users
    values: [username, id, lastOnline]
    # there is no match, so all rows from the table are returned but only the username, id and lastOnline columns

v2: 
  getuser: # /v2/getuser
    request: get  
    type: select
    from: users
    values: everything
    match: username
```
