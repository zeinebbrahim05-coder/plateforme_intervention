drop table if exists interventions;
drop table if exists tickets;
drop table if exists techniciens;
drop table if exists users;

create database if not exists plateforme_intervention;
use plateforme_intervention;

create table users( id int primary key auto_increment,
nom varchar(100) not null, email varchar(100) unique not null,
password varchar(300) not null, role varchar(30) default 'client' check(role in('client','technicien','planificateur')),
telephone varchar(25), adresse text,
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp);

create table techniciens( id int primary key auto_increment,
user_id int unique not null, competences text,
disponible boolean default true,
latitude decimal(10,8),
longitude decimal(11,8),
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp,
foreign key(user_id) references users(id));

create table tickets( id int primary key auto_increment,
client_id int not null,
description text, date_creation datetime default now(),
foreign key(client_id) references users(id),
statut varchar(30) check(statut in('en attente','en cours','termine')),
priorite varchar(30) default 'standard' check(priorite in('standard','urgent')), 
adresse varchar(200),
created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp
);

create table interventions(id int primary key auto_increment,
technicien_id int ,
ticket_id int not null,
description text not null,
adresse varchar(100) not null,
statut varchar(30) check(statut in('en attente','affecté','en cours','termine')),
priorite varchar(30) default 'standard' check(priorite in('standard','urgent')),
date_creation datetime default now(),
foreign key(technicien_id) references users(id),
foreign key(ticket_id) references tickets(id));

insert into users(nom, email, password, role, telephone, adresse)
values('admin principal', 'admin@plateforme.com', 'admin123','planificateur','1565284',
'tunis');
insert into users(nom, email, password, role, telephone, adresse) values('ahmed','ahmed@test.com','client123','client','5165489','tunisie');
insert into users(nom, email, password, role, telephone, adresse) values('karim', 'karim@test.com','tech123','technicien','1546556','tunis');

insert into tickets(client_id,description,statut,priorite,adresse) values(2,'fuite deau','en attente', 'urgent','ariana');
insert into tickets (client_id, description, adresse, priorite) values (2, 'Fuite deau dans la cuisine', 'Ariana', 'urgent');
insert into techniciens(user_id, competences,disponible, latitude,longitude) values(3, 'plomberie, electricité', true, 36.806495, 10.181532);
insert into interventions(ticket_id, technicien_id,description,adresse,statut,priorite) values(1,3, 'fuite deau ','ariana','en cours','urgent');
INSERT INTO interventions (ticket_id, technicien_id, description, adresse, statut, priorite)
VALUES (1, 6, 'Test pour Karim Tech', 'Ariana', 'en cours', 'urgent');
UPDATE users 
SET password = '$2b$10$75PqKc01r9fumq8vucH/l.DNgQxZ.gm25fwm62CP1m19ibSIhcFyK' 
WHERE id = 3;
UPDATE users 
SET password = '$2b$10$ABUcY97gRO/xo.ZGPRZWg.WHszU9Sg1KjqjU4mcvo6IeOtC7Xn1kq' 
WHERE id = 2;
update users set password='$2b$10$.QnfZ9hxleVryaXpIC4qwObpeu.Nuz/ONjgXrzK7ihzYKZIDoHtKK'
where id=1;
alter table interventions add column rapport text null;
alter table interventions add column note int null check(note between 1 and 5);
alter table interventions add column commentaire text null;
show tables;
describe users;
describe techniciens;
describe interventions;
 select * from users;
 select * from techniciens;
 select * from interventions;
 select password from users where id=3;
 SELECT id, nom, email, password FROM users WHERE email = 'karim@test.com';
 
