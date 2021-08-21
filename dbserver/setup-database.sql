drop table if exists users;

create table users (
    email   varchar(128) not null,
    fname   varchar(64),
    lname   varchar(64),
    passwd  varchar(60),
    primary key(email)
);

insert into users values ("ejpfraser@gmail.com", "Ethan", "Fraser", "$2b$09$JUdvy5Jl2vqX8f/cNKMVgOX0o0dRvk9DEGRGhiTUpXgOZgF9sAboO");
insert into users values ("magdeline0512@gmail.com", "Magdeline", "Huang", "$2b$09$pEP/BapTPw48cElxAkH4eeIHSAJOc3vC7kuQHOt.fBWXOgs2vTiOq");