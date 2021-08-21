drop table if exists users;

create table users (
    email   varchar(128) not null,
    fname   varchar(64),
    lname   varchar(64),
    passwd  varchar(60),
    primary key(email)
);