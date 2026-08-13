create database if not exists plateforme_intervention;
use plateforme_intervention;

drop table if exists interventions;
drop table if exists tickets;
drop table if exists techniciens;
drop table if exists users;

create table users( id int primary key auto_increment,
nom varchar(100) not null, email varchar(100) unique not null,
password varchar(300) not null, role varchar(30) default 'client' check(role in('client','technicien','planificateur')),
telephone varchar(25), adresse text,
latitude decimal(10,8) Null, longitude decimal(11,8) null,
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
statut varchar(30) default 'en attente' check(statut in('en attente','affecte','en cours','termine')),
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
rapport text null,
note int null check(note between 1 and 5),
commentaire text null,
latitude decimal(10,8) null,
longitude decimal(11,8) null,
date_prevue date null,
heure_debut time null,
heure_fin time null,
duree_estimee int null,
code_postal varchar(10) null,
foreign key(technicien_id) references users(id),
foreign key(ticket_id) references tickets(id));

insert into users(nom, email, password, role, telephone, adresse, latitude, longitude)
values('admin principal', 'admin@plateforme.com','$2b$10$.QnfZ9hxleVryaXpIC4qwObpeu.Nuz/ONjgXrzK7ihzYKZIDoHtKK',
'planificateur','1565284', 'Tunis', null, null),
('Ahmed', 'ahmed@test.com',
'$2b$10$ABUcY97gRO/xo.ZGPRZWg.WHszU9Sg1KjqjU4mcvo6IeOtC7Xn1kq',
'client', '5165489', 'Ariana', 36.81230000, 10.18150000),
('Karim', 'karim@test.com',
'$2b$10$75PqKc01r9fumq8vucH/l.DNgQxZ.gm25fwm62CP1m19ibSIhcFyK',
'technicien', '1546556', 'Tunis', 36.80649500, 10.18153200);
insert into techniciens(user_id, competences,disponible, latitude, longitude)
values(3,'plomberie, electricité',true,36.80649500,10.18153200);
insert into tickets(client_id, description, adresse, statut, priorite)
values(2,'fuite deau','Ariana','en attente', 'urgent'),
(2,'fuite deau dans la cuisine','Ariana','en attente','urgent');
INSERT INTO users (nom, email, password, role, telephone, adresse, latitude, longitude)
VALUES ('Amine', 'amine@test.com',
        '$2b$10$75PqKc01r9fumq8vucH/l.DNgQxZ.gm25fwm62CP1m19ibSIhcFyK',
        'technicien', '20123456', 'Sousse', 35.82563000, 10.63690000);
INSERT INTO techniciens (user_id, competences, disponible)
VALUES (LAST_INSERT_ID(), 'électricité', true);
INSERT INTO users (nom, email, password, role, telephone, adresse, latitude, longitude)
VALUES ('Sami', 'sami.client@test.com',
        '$2b$10$ABUcY97gRO/xo.ZGPRZWg.WHszU9Sg1KjqjU4mcvo6IeOtC7Xn1kq',
        'client', '20654321', 'Sousse', 35.82800000, 10.64000000);
INSERT INTO tickets (client_id, description, adresse, statut, priorite)
VALUES (LAST_INSERT_ID(), 'panne électrique', 'Sousse', 'en attente', 'urgent');
INSERT INTO interventions (technicien_id, ticket_id, description, adresse, statut, priorite)
VALUES
(3, 1, 'fuite deau', 'Ariana', 'affecté', 'urgent'),
(4, 3, 'panne électrique', 'Sousse', 'affecté', 'urgent');

UPDATE interventions
SET 
    date_prevue = '2026-08-12',
    heure_debut = '09:00:00',
    heure_fin = '10:00:00',
    code_postal = '1000'
WHERE id = 1;
UPDATE interventions
SET 
    date_prevue = '2026-08-13',
    heure_debut = '10:00:00',
    heure_fin = '11:00:00',
    code_postal = '2000'
WHERE id = 2;

show tables;
describe users;
describe techniciens;
describe interventions;
describe tickets;
SELECT id, nom, email, role, latitude, longitude
FROM users;
SELECT * FROM techniciens;
select * from tickets;
select *  from interventions;
SELECT id, client_id, description, statut FROM tickets ORDER BY client_id, description, id;
SELECT t.user_id, u.nom, t.disponible, u.latitude, u.longitude
FROM techniciens t
JOIN users u ON t.user_id = u.id;
SELECT ti.id AS ticket_id, ti.description, u.nom AS client_nom, u.latitude, u.longitude
FROM tickets ti
JOIN users u ON ti.client_id = u.id
WHERE ti.description = 'panne';
SELECT id, nom, role FROM users WHERE nom LIKE '%amine%';
SELECT i.id, i.ticket_id, i.technicien_id, u.nom AS technicien_nom, i.statut
FROM interventions i
JOIN users u ON i.technicien_id = u.id
JOIN tickets t ON i.ticket_id = t.id
WHERE t.description = 'panne électrique';
SELECT 
    i.id,
    i.description,
    i.technicien_id,
    u.nom AS technicien_nom,
    i.date_prevue,
    i.heure_debut,
    i.heure_fin,
    i.statut,
    i.priorite
FROM interventions i
LEFT JOIN users u ON i.technicien_id = u.id
ORDER BY i.date_prevue, i.heure_debut;
SELECT * FROM interventions;
SELECT 
    i.id,
    i.description,
    i.technicien_id,
    u.nom AS technicien_nom,
    i.date_prevue,
    i.heure_debut,
    i.heure_fin,
    i.statut,
    i.priorite
FROM interventions i
LEFT JOIN users u ON i.technicien_id = u.id
ORDER BY i.date_prevue, i.heure_debut;