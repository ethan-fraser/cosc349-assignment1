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

-- test data
insert into flats values ("a4be9ffe", "349 Cloud St");
insert into users values ("manager@gmail.com", "Manager", "Cloud", "$2b$09$n4RT4.6/bXdlPNKHf8O5XujRLZhfbCnmOKATHSWdh8vzYyAcslOoS", 1, "a4be9ffe");
insert into users values ("member@gmail.com", "Member", "Cloud", "$2b$09$n4RT4.6/bXdlPNKHf8O5XujRLZhfbCnmOKATHSWdh8vzYyAcslOoS", 0, "a4be9ffe");
insert into bills values (null, "Rent", "2021-10-13", 400.00, "a4be9ffe");
insert into bills values (null, "Power", "2021-10-21", 50.00, "a4be9ffe");
insert into bills values (null, "WiFi", "2021-10-11", 65.00, "a4be9ffe");
insert into bill_status values (null, 1, "member@gmail.com", "pending");
insert into bill_status values (null, 1, "manager@gmail.com", "paid");
insert into bill_status values (null, 2, "member@gmail.com", "due");
insert into bill_status values (null, 2, "manager@gmail.com", "due");
insert into bill_status values (null, 3, "member@gmail.com", "due");
insert into bill_status values (null, 3, "manager@gmail.com", "due");