Redish caching 
redish =100x faster than database 

## Why do we use caching ?
1. Speed
2. Reduced Db cost 
3. Prevent duplicate heavy operation 
4. Avoid computing 
5. Perevent Server load 

When not to use Caching?
- for rapidly 

## Types of chaching in Backend 
1. Route-Lvel Cahe :Chahe the whole response of the route 
2. Databse Qery Cache 
3. COmutation/Heavy Task Cache 
4. Session caching 

TODO:give a picture of redish working here 
How redish work explain a diagram here 

*** Installing redish (linux) ***
- sudo apt install redish-server
- sudo systemctl enable redish
- sudo systemctl start redis 

*** Install redish client for nodejs ***
- npm install redish


