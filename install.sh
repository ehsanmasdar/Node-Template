#!/bin/bash
 
echo -n "Enter the MySQL root password: "
read -s rootpw
echo -n "Enter database name: "
read dbname
echo -n "Enter database username: "
read dbuser
echo -n "Enter database user password: "
read dbpw
 
db="create database $dbname;GRANT ALL PRIVILEGES ON $dbname.* TO $dbuser@localhost IDENTIFIED BY '$dbpw';FLUSH PRIVILEGES;CREATE TABLE users(username TEXT, realname TEXT, email TEXT, password TEXT, updates INT, id TEXT, emailtoken TEXT, verified INT);"
mysql -u root -p$rootpw -e "$db"
 
if [ $? != "0" ]; then
 echo "[Error]: Database creation failed"
 exit 1
else
 echo "-----------------------------------------------------"
 echo " Database and Table have been created successfully "
 echo "-----------------------------------------------------"
 echo " DB Info: "
 echo ""
 echo " DB Name: $dbname"
 echo " DB User: $dbuser"
 echo " DB Pass: $dbpw"
 echo " Table Name: users"
 echo ""
 echo "-----------------------------------------------------"
fi