drop table if exists bill_status;
drop table if exists users;
drop table if exists bills;
drop table if exists flats;


create table flats (
    flatID      varchar(10) primary key,
    name        varchar(256)
);

create table users (
    email       varchar(128) primary key,
    fname       varchar(64),
    lname       varchar(64),
    password    varchar(60),
    is_manager  boolean default 0,
    flatID      varchar(10) not null,
    constraint fk_users_flatID
    foreign key (flatID)
        references flats(flatID)
);

create table bills (
    billID      int auto_increment primary key,
    name        varchar(256),
    due         date,
    amount      decimal(13,2) default 0.00,
    flatID      varchar(10) not null,
    constraint  fk_bills_flatID
    foreign key (flatID)
        references flats(flatID)
);

create table bill_status (
    statusID    int auto_increment primary key,
    billID      int not null,
    userEmail   varchar(128) not null,
    status      varchar(7),
    constraint  check_billingCycle
        check (status in ("due", "pending", "paid", "overdue")),
    constraint  fk_billstatus_billID
    foreign key (billID)
        references bills(billID),
    constraint  fk_billstatus_userEmail
    foreign key (userEmail)
        references users(email)
);

insert into flats values ("sldjfl", "123 Fake St");
insert into users values ("ejpfraser@gmail.com", "Ethan", "Fraser", "$2b$09$n4RT4.6/bXdlPNKHf8O5XujRLZhfbCnmOKATHSWdh8vzYyAcslOoS", 0, "sldjfl");
insert into users values ("magdeline0512@gmail.com", "Magdeline", "Huang", "$2b$09$n4RT4.6/bXdlPNKHf8O5XujRLZhfbCnmOKATHSWdh8vzYyAcslOoS", 1, "sldjfl");
insert into bills values (null, "Rent", "2021-08-31", 400.00, "sldjfl");
insert into bills values (null, "Power", "2021-09-30", 69.00, "sldjfl");
insert into bill_status values (null, 1, "ejpfraser@gmail.com", "pending");
insert into bill_status values (null, 1, "magdeline0512@gmail.com", "paid");
insert into bill_status values (null, 2, "ejpfraser@gmail.com", "due");
insert into bill_status values (null, 2, "magdeline0512@gmail.com", "paid");