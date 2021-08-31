drop table if exists payments;
drop table if exists users;
drop table if exists services;
drop table if exists flats;


create table flats (
    flatID      varchar(10) primary key,
    name        varchar(256)
);

create table users (
    email       varchar(128) primary key,
    fname       varchar(64),
    lname       varchar(64),
    passwd      varchar(60),
    is_manager  boolean default 0,
    flatID      varchar(10) not null,
    constraint fk_users_flatID
    foreign key (flatID)
        references flats(flatID)
);

create table services (
    name        varchar(256) primary key,
    period      varchar(11),
    day         varchar(9),
    due         date,
    is_static   boolean default 0,
    amount      decimal(13,2) default 0.00,
    flatID      varchar(10) not null,
    constraint  check_billingCycle
    check (period in ('daily', 'weekly', 'fortnightly')
        and day in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    constraint  fk_services_flatID
    foreign key (flatID)
        references flats(flatID)
);

create table payments (
    paymentID   int primary key auto_increment,
    amount      decimal(13,2) default 0.00,
    verified    boolean default 0,
    user_from   varchar(128) not null,
    service_for varchar(256) not null,
    constraint fk_userFrom
    foreign key (user_from)
        references users(email),
    constraint fk_serviceFor
    foreign key (service_for)
        references services(name)
);

insert into flats values ("sldjfl", "123 Fake St");
insert into users values ("ejpfraser@gmail.com", "Ethan", "Fraser", "$2b$09$n4RT4.6/bXdlPNKHf8O5XujRLZhfbCnmOKATHSWdh8vzYyAcslOoS", 0, "sldjfl");